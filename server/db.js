import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'data', 'polls.db');
const dbPath = process.env.DB_PATH || DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    allow_multiple INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS voter_records (
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    voter_token TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (poll_id, voter_token)
  );

  CREATE INDEX IF NOT EXISTS idx_voter_records_poll_ip
    ON voter_records (poll_id, ip_hash);

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
    voter_token TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_votes_poll_option
    ON votes (poll_id, option_id);
`);

// Migrate existing databases that were created before option details/url existed
const optionColumns = new Set(
  db.prepare('PRAGMA table_info(options)').all().map((col) => col.name)
);
if (!optionColumns.has('details')) {
  db.exec("ALTER TABLE options ADD COLUMN details TEXT NOT NULL DEFAULT ''");
}
if (!optionColumns.has('url')) {
  db.exec("ALTER TABLE options ADD COLUMN url TEXT NOT NULL DEFAULT ''");
}

function generatePollId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(8);
  let id = '';
  for (let i = 0; i < bytes.length; i += 1) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

export function hashIp(ip, pollId) {
  return crypto
    .createHash('sha256')
    .update(`${pollId}:${ip || 'unknown'}`)
    .digest('hex');
}

export function createPoll({ question, description = '', options, allowMultiple = false }) {
  const now = new Date().toISOString();
  let id = generatePollId();

  const checkStmt = db.prepare('SELECT 1 FROM polls WHERE id = ?');
  while (checkStmt.get(id)) {
    id = generatePollId();
  }

  const insertPoll = db.prepare(
    'INSERT INTO polls (id, question, description, allow_multiple, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertOption = db.prepare(
    'INSERT INTO options (poll_id, label, details, url, position) VALUES (?, ?, ?, ?, ?)'
  );

  db.exec('BEGIN');
  try {
    insertPoll.run(id, question, description, allowMultiple ? 1 : 0, now);
    options.forEach((option, index) => {
      const label = typeof option === 'string' ? option : option.label;
      const details = typeof option === 'string' ? '' : option.details || '';
      const url = typeof option === 'string' ? '' : option.url || '';
      insertOption.run(id, label, details, url, index);
    });
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return getPoll(id);
}

export function getPoll(id, voterContext = null) {
  const poll = db
    .prepare('SELECT id, question, description, allow_multiple, created_at FROM polls WHERE id = ?')
    .get(id);

  if (!poll) return null;

  const optionRows = db
    .prepare(`
      SELECT
        o.id,
        o.label,
        o.details,
        o.url,
        o.position,
        COUNT(v.id) AS votes
      FROM options o
      LEFT JOIN votes v ON v.option_id = o.id
      WHERE o.poll_id = ?
      GROUP BY o.id
      ORDER BY o.position ASC
    `)
    .all(id);

  const voterCountRow = db
    .prepare('SELECT COUNT(*) AS count FROM voter_records WHERE poll_id = ?')
    .get(id);

  const totalVoters = Number(voterCountRow?.count ?? 0);
  const totalVotes = optionRows.reduce((sum, row) => sum + Number(row.votes), 0);

  let hasVoted = false;
  let votedOptionIds = [];

  if (voterContext) {
    const { voterToken, ipHash, enforceIp = true } = voterContext;
    let matchedToken = null;

    if (voterToken) {
      const byToken = db
        .prepare('SELECT voter_token FROM voter_records WHERE poll_id = ? AND voter_token = ?')
        .get(id, voterToken);
      if (byToken) {
        hasVoted = true;
        matchedToken = byToken.voter_token;
      }
    }

    if (!hasVoted && enforceIp && ipHash) {
      const byIp = db
        .prepare('SELECT voter_token FROM voter_records WHERE poll_id = ? AND ip_hash = ?')
        .get(id, ipHash);
      if (byIp) {
        hasVoted = true;
        matchedToken = byIp.voter_token;
      }
    }

    if (matchedToken) {
      const votedRows = db
        .prepare('SELECT option_id FROM votes WHERE poll_id = ? AND voter_token = ?')
        .all(id, matchedToken);
      votedOptionIds = votedRows.map((r) => Number(r.option_id));
    }
  }

  const denominator = poll.allow_multiple ? totalVoters : totalVotes;

  return {
    id: poll.id,
    question: poll.question,
    description: poll.description,
    allowMultiple: Boolean(poll.allow_multiple),
    createdAt: poll.created_at,
    totalVoters,
    totalVotes,
    hasVoted,
    votedOptionIds,
    options: optionRows.map((row) => {
      const count = Number(row.votes);
      const percentage = denominator > 0 ? Math.round((count / denominator) * 1000) / 10 : 0;
      return {
        id: Number(row.id),
        label: row.label,
        details: row.details || '',
        url: row.url || '',
        votes: count,
        percentage,
      };
    }),
  };
}

export function listRecentPolls(limit = 12) {
  const rows = db
    .prepare(`
      SELECT
        p.id,
        p.question,
        p.allow_multiple,
        p.created_at,
        (SELECT COUNT(*) FROM options o WHERE o.poll_id = p.id) AS option_count,
        (SELECT COUNT(*) FROM voter_records vr WHERE vr.poll_id = p.id) AS total_voters
      FROM polls p
      ORDER BY p.created_at DESC
      LIMIT ?
    `)
    .all(limit);

  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    allowMultiple: Boolean(row.allow_multiple),
    createdAt: row.created_at,
    optionCount: Number(row.option_count),
    totalVoters: Number(row.total_voters),
  }));
}

function validateVoteOptions(poll, optionIds) {
  const uniqueOptionIds = [...new Set(optionIds.map(Number).filter(Number.isInteger))];
  if (uniqueOptionIds.length === 0) {
    return { valid: false, message: 'Select at least one option.' };
  }
  if (!poll.allow_multiple && uniqueOptionIds.length > 1) {
    return { valid: false, message: 'This poll only allows selecting one option.' };
  }

  const validOptions = db
    .prepare('SELECT id FROM options WHERE poll_id = ?')
    .all(poll.id)
    .map((r) => Number(r.id));
  const validSet = new Set(validOptions);

  if (!uniqueOptionIds.every((optId) => validSet.has(optId))) {
    return { valid: false, message: 'One or more selected options are invalid.' };
  }

  return { valid: true, uniqueOptionIds };
}

export function recordVote({ pollId, optionIds, voterToken, ipHash, enforceIp = true }) {
  const poll = db
    .prepare('SELECT id, allow_multiple FROM polls WHERE id = ?')
    .get(pollId);

  if (!poll) {
    return { status: 'not_found' };
  }

  const validation = validateVoteOptions(poll, optionIds);
  if (!validation.valid) {
    return { status: 'invalid', message: validation.message };
  }
  const { uniqueOptionIds } = validation;

  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE');
  try {
    const existingByToken = db
      .prepare('SELECT 1 FROM voter_records WHERE poll_id = ? AND voter_token = ?')
      .get(pollId, voterToken);

    const existingByIp = enforceIp
      ? db
          .prepare('SELECT 1 FROM voter_records WHERE poll_id = ? AND ip_hash = ?')
          .get(pollId, ipHash)
      : null;

    if (existingByToken || existingByIp) {
      db.exec('ROLLBACK');
      return {
        status: 'duplicate',
        poll: getPoll(pollId, { voterToken, ipHash, enforceIp }),
      };
    }

    db.prepare(
      'INSERT INTO voter_records (poll_id, voter_token, ip_hash, created_at) VALUES (?, ?, ?, ?)'
    ).run(pollId, voterToken, ipHash, now);

    const insertVote = db.prepare(
      'INSERT INTO votes (poll_id, option_id, voter_token, created_at) VALUES (?, ?, ?, ?)'
    );
    for (const optId of uniqueOptionIds) {
      insertVote.run(pollId, optId, voterToken, now);
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return {
    status: 'ok',
    poll: getPoll(pollId, { voterToken, ipHash, enforceIp }),
  };
}

export function updateVote({ pollId, optionIds, voterToken, ipHash, enforceIp = true }) {
  const poll = db
    .prepare('SELECT id, allow_multiple FROM polls WHERE id = ?')
    .get(pollId);

  if (!poll) {
    return { status: 'not_found' };
  }

  const validation = validateVoteOptions(poll, optionIds);
  if (!validation.valid) {
    return { status: 'invalid', message: validation.message };
  }
  const { uniqueOptionIds } = validation;

  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE');
  try {
    let matchedToken = null;

    if (voterToken) {
      const existingByToken = db
        .prepare('SELECT voter_token FROM voter_records WHERE poll_id = ? AND voter_token = ?')
        .get(pollId, voterToken);
      if (existingByToken) {
        matchedToken = existingByToken.voter_token;
      }
    }

    if (!matchedToken && enforceIp && ipHash) {
      const existingByIp = db
        .prepare('SELECT voter_token FROM voter_records WHERE poll_id = ? AND ip_hash = ?')
        .get(pollId, ipHash);
      if (existingByIp) {
        matchedToken = existingByIp.voter_token;
      }
    }

    if (!matchedToken) {
      db.exec('ROLLBACK');
      return { status: 'not_voted', message: 'You have not voted on this poll yet.' };
    }

    db.prepare('DELETE FROM votes WHERE poll_id = ? AND voter_token = ?').run(pollId, matchedToken);

    const insertVote = db.prepare(
      'INSERT INTO votes (poll_id, option_id, voter_token, created_at) VALUES (?, ?, ?, ?)'
    );
    for (const optId of uniqueOptionIds) {
      insertVote.run(pollId, optId, matchedToken, now);
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return {
    status: 'ok',
    poll: getPoll(pollId, { voterToken, ipHash, enforceIp }),
  };
}
