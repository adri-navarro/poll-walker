import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createPoll, getPoll, hashIp, listRecentPolls, recordVote, updateVote } from './db.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const VOTER_COOKIE = 'pw_voter_id';
const ENFORCE_IP_DEDUP = process.env.ENFORCE_IP_DEDUP !== 'false';

app.set('trust proxy', true);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// In-memory map of pollId -> Set<express.Response> for live SSE updates
const sseClients = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function getOrCreateVoterToken(req, res) {
  let token = req.cookies?.[VOTER_COOKIE];
  if (!token || typeof token !== 'string' || token.length < 16) {
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

function broadcastPollUpdate(pollId) {
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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/polls', (_req, res) => {
  try {
    const polls = listRecentPolls(12);
    res.json({ polls });
  } catch (err) {
    console.error('Failed to list polls:', err);
    res.status(500).json({ error: 'Failed to load recent polls.' });
  }
});

function normalizeOptionUrl(rawUrl) {
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

app.post('/api/polls', (req, res) => {
  try {
    const rawQuestion = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
    const rawDescription =
      typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    const allowMultiple = Boolean(req.body?.allowMultiple);
    const rawOptions = Array.isArray(req.body?.options) ? req.body.options : [];

    if (!rawQuestion) {
      return res.status(400).json({ error: 'Please enter a poll question.' });
    }
    if (rawQuestion.length > 280) {
      return res.status(400).json({ error: 'Question must be 280 characters or fewer.' });
    }
    if (rawDescription.length > 500) {
      return res.status(400).json({ error: 'Description must be 500 characters or fewer.' });
    }

    const cleanedOptions = [];
    for (const opt of rawOptions) {
      const label =
        typeof opt === 'string'
          ? opt.trim()
          : typeof opt?.label === 'string'
            ? opt.label.trim()
            : '';
      if (!label) continue;

      if (label.length > 160) {
        return res.status(400).json({ error: 'Each option must be 160 characters or fewer.' });
      }

      const details =
        typeof opt === 'object' && opt !== null && typeof opt.details === 'string'
          ? opt.details.trim()
          : '';
      if (details.length > 240) {
        return res.status(400).json({ error: 'Option details must be 240 characters or fewer.' });
      }

      const rawUrl =
        typeof opt === 'object' && opt !== null && typeof opt.url === 'string' ? opt.url : '';
      const { url, error: urlError } = normalizeOptionUrl(rawUrl);
      if (urlError) {
        return res.status(400).json({ error: urlError });
      }

      cleanedOptions.push({ label, details, url });
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

app.get('/api/polls/:id', (req, res) => {
  try {
    const { id } = req.params;
    const voterToken = req.cookies?.[VOTER_COOKIE] || null;
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

app.post('/api/polls/:id/vote', (req, res) => {
  try {
    const { id } = req.params;
    const optionIds = Array.isArray(req.body?.optionIds) ? req.body.optionIds : [];
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

app.put('/api/polls/:id/vote', (req, res) => {
  try {
    const { id } = req.params;
    const optionIds = Array.isArray(req.body?.optionIds) ? req.body.optionIds : [];
    const voterToken = req.cookies?.[VOTER_COOKIE] || null;
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

app.get('/api/polls/:id/stream', (req, res) => {
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

  if (!sseClients.has(id)) {
    sseClients.set(id, new Set());
  }
  sseClients.get(id).add(res);

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
  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

function getLanAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
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
