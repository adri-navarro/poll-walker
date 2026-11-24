import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import {
  createPoll,
  getPoll,
  hashIp,
  listRecentPolls,
  recordVote,
  updateVote,
  type PollOptionInput,
} from './db.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const VOTER_COOKIE = 'pw_voter_id';
const ENFORCE_IP_DEDUP = process.env.ENFORCE_IP_DEDUP !== 'false';

app.set('trust proxy', true);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// In-memory map of pollId -> Set<Response> for live SSE updates
const sseClients = new Map<string, Set<Response>>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function getVoterCookie(req: Request): string | null {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const raw = cookies?.[VOTER_COOKIE];
  return typeof raw === 'string' ? raw : null;
}

function getOrCreateVoterToken(req: Request, res: Response): string {
  let token = getVoterCookie(req);
  if (!token || token.length < 16) {
    token = crypto.randomUUID();
    res.cookie(VOTER_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  return token;
}

function broadcastPollUpdate(pollId: string): void {
  const clients = sseClients.get(pollId);
  if (!clients || clients.size === 0) return;

  const publicPoll = getPoll(pollId);
  if (!publicPoll) return;

  const payload = JSON.stringify({
    totalVoters: publicPoll.totalVoters,
    totalVotes: publicPoll.totalVotes,
    options: publicPoll.options,
  });

  for (const res of clients) {
    res.write(`event: results\ndata: ${payload}\n\n`);
  }
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/polls', (_req: Request, res: Response) => {
  try {
    const polls = listRecentPolls(12);
    res.json({ polls });
  } catch (err) {
    console.error('Failed to list polls:', err);
    res.status(500).json({ error: 'Failed to load recent polls.' });
  }
});

type NormalizeUrlResult = { url: string; error?: undefined } | { url?: undefined; error: string };

function normalizeOptionUrl(rawUrl: unknown): NormalizeUrlResult {
  if (typeof rawUrl !== 'string') return { url: '' };
  const trimmed = rawUrl.trim();
  if (!trimmed) return { url: '' };
  if (trimmed.length > 500) {
    return { error: 'Option links must be 500 characters or fewer.' };
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { error: 'Option links must use http:// or https://.' };
    }
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return { error: `Invalid link URL: "${trimmed}".` };
    }
    return { url: parsed.toString() };
  } catch {
    return { error: `Invalid link URL: "${trimmed}".` };
  }
}

app.post('/api/polls', (req: Request, res: Response) => {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const rawQuestion = typeof body.question === 'string' ? body.question.trim() : '';
    const rawDescription = typeof body.description === 'string' ? body.description.trim() : '';
    const allowMultiple = Boolean(body.allowMultiple);
    const rawOptions: unknown[] = Array.isArray(body.options) ? body.options : [];

    if (!rawQuestion) {
      return res.status(400).json({ error: 'Please enter a poll question.' });
    }
    if (rawQuestion.length > 280) {
      return res.status(400).json({ error: 'Question must be 280 characters or fewer.' });
    }
    if (rawDescription.length > 500) {
      return res.status(400).json({ error: 'Description must be 500 characters or fewer.' });
    }

    const cleanedOptions: PollOptionInput[] = [];
    for (const opt of rawOptions) {
      const optObj = typeof opt === 'object' && opt !== null ? (opt as Record<string, unknown>) : null;
      const label =
        typeof opt === 'string'
          ? opt.trim()
          : typeof optObj?.label === 'string'
            ? optObj.label.trim()
            : '';
      if (!label) continue;

      if (label.length > 160) {
        return res.status(400).json({ error: 'Each option must be 160 characters or fewer.' });
      }

      const details = typeof optObj?.details === 'string' ? optObj.details.trim() : '';
      if (details.length > 240) {
        return res.status(400).json({ error: 'Option details must be 240 characters or fewer.' });
      }

      const rawUrl = typeof optObj?.url === 'string' ? optObj.url : '';
      const normalized = normalizeOptionUrl(rawUrl);
      if (normalized.error) {
        return res.status(400).json({ error: normalized.error });
      }

      cleanedOptions.push({ label, details, url: normalized.url });
    }

    if (cleanedOptions.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 poll options.' });
    }
    if (cleanedOptions.length > 12) {
      return res.status(400).json({ error: 'A poll can have at most 12 options.' });
    }

    const poll = createPoll({
      question: rawQuestion,
      description: rawDescription,
      options: cleanedOptions,
      allowMultiple,
    });

    res.status(201).json({ poll });
  } catch (err) {
    console.error('Failed to create poll:', err);
    res.status(500).json({ error: 'Failed to create poll.' });
  }
});

app.get('/api/polls/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const voterToken = getVoterCookie(req);
    const ipHash = hashIp(getClientIp(req), id);

    const poll = getPoll(id, {
      voterToken,
      ipHash,
      enforceIp: ENFORCE_IP_DEDUP,
    });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    res.json({ poll });
  } catch (err) {
    console.error('Failed to fetch poll:', err);
    res.status(500).json({ error: 'Failed to load poll.' });
  }
});

app.post('/api/polls/:id/vote', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const body = (req.body ?? {}) as Record<string, unknown>;
    const optionIds: unknown[] = Array.isArray(body.optionIds) ? body.optionIds : [];
    const voterToken = getOrCreateVoterToken(req, res);
    const ipHash = hashIp(getClientIp(req), id);

    const result = recordVote({
      pollId: id,
      optionIds,
      voterToken,
      ipHash,
      enforceIp: ENFORCE_IP_DEDUP,
    });

    if (result.status === 'not_found') {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    if (result.status === 'invalid') {
      return res.status(400).json({ error: result.message });
    }
    if (result.status === 'duplicate') {
      return res.status(409).json({
        error: 'You have already voted on this poll.',
        alreadyVoted: true,
        poll: result.poll,
      });
    }

    broadcastPollUpdate(id);
    res.json({ poll: result.poll });
  } catch (err) {
    console.error('Failed to submit vote:', err);
    res.status(500).json({ error: 'Failed to save your vote.' });
  }
});

app.put('/api/polls/:id/vote', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const body = (req.body ?? {}) as Record<string, unknown>;
    const optionIds: unknown[] = Array.isArray(body.optionIds) ? body.optionIds : [];
    const voterToken = getVoterCookie(req);
    const ipHash = hashIp(getClientIp(req), id);

    const result = updateVote({
      pollId: id,
      optionIds,
      voterToken,
      ipHash,
      enforceIp: ENFORCE_IP_DEDUP,
    });

    if (result.status === 'not_found') {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    if (result.status === 'invalid') {
      return res.status(400).json({ error: result.message });
    }
    if (result.status === 'not_voted') {
      return res.status(404).json({ error: result.message });
    }

    broadcastPollUpdate(id);
    res.json({ poll: result.poll });
  } catch (err) {
    console.error('Failed to update vote:', err);
    res.status(500).json({ error: 'Failed to update your vote.' });
  }
});

app.get('/api/polls/:id/stream', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const poll = getPoll(id);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(': connected\n\n');

  let clients = sseClients.get(id);
  if (!clients) {
    clients = new Set<Response>();
    sseClients.set(id, clients);
  }
  clients.add(res);

  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    const set = sseClients.get(id);
    if (set) {
      set.delete(res);
      if (set.size === 0) {
        sseClients.delete(id);
      }
    }
  });
});

// Serve built frontend in production (or whenever dist exists)
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

function getLanAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.push(entry.address);
      }
    }
  }
  return addresses;
}

app.listen(PORT, HOST, () => {
  console.log(`Poll Walker server listening on:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  if (HOST === '0.0.0.0' || HOST === '::') {
    for (const ip of getLanAddresses()) {
      console.log(`  Network: http://${ip}:${PORT}`);
    }
  }
});
