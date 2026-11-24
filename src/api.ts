import type {
  CreatePollPayload,
  LiveConnectionStatus,
  Poll,
  PollResultsUpdate,
  RecentPollSummary,
} from './types.ts';

export interface ApiError extends Error {
  status?: number;
  alreadyVoted?: boolean;
  poll?: Poll | null;
}

interface ApiResponseError {
  error?: string;
  alreadyVoted?: boolean;
  poll?: Poll | null;
}

export async function fetchRecentPolls(): Promise<RecentPollSummary[]> {
  const res = await fetch('/api/polls');
  const data = (await res.json()) as { polls: RecentPollSummary[] } & ApiResponseError;
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load recent polls.');
  }
  return data.polls;
}

export async function createPoll(payload: CreatePollPayload): Promise<Poll> {
  const res = await fetch('/api/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { poll: Poll } & ApiResponseError;
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create poll.');
  }
  return data.poll;
}

export async function fetchPoll(id: string): Promise<Poll> {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}`);
  const data = (await res.json()) as { poll: Poll } & ApiResponseError;
  if (!res.ok) {
    const err: ApiError = new Error(data.error || 'Failed to load poll.');
    err.status = res.status;
    throw err;
  }
  return data.poll;
}

export async function submitVote(id: string, optionIds: number[], name: string): Promise<Poll> {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIds, name }),
  });
  const data = (await res.json()) as { poll: Poll } & ApiResponseError;
  if (!res.ok) {
    const err: ApiError = new Error(data.error || 'Failed to submit vote.');
    err.status = res.status;
    err.alreadyVoted = Boolean(data.alreadyVoted);
    err.poll = data.poll || null;
    throw err;
  }
  return data.poll;
}

export async function updateVote(id: string, optionIds: number[]): Promise<Poll> {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}/vote`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIds }),
  });
  const data = (await res.json()) as { poll: Poll } & ApiResponseError;
  if (!res.ok) {
    const err: ApiError = new Error(data.error || 'Failed to update vote.');
    err.status = res.status;
    throw err;
  }
  return data.poll;
}

export function subscribeToPollResults(
  id: string,
  onUpdate: (update: PollResultsUpdate) => void,
  onStatusChange?: (status: LiveConnectionStatus) => void
): () => void {
  const source = new EventSource(`/api/polls/${encodeURIComponent(id)}/stream`);

  source.onopen = () => {
    onStatusChange?.('connected');
  };

  source.addEventListener('results', (event: MessageEvent<string>) => {
    try {
      const payload = JSON.parse(event.data) as PollResultsUpdate;
      onUpdate(payload);
    } catch {
      // Ignore malformed SSE payloads
    }
  });

  source.onerror = () => {
    onStatusChange?.('reconnecting');
  };

  return () => {
    source.close();
  };
}
