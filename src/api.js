export async function fetchRecentPolls() {
  const res = await fetch('/api/polls');
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load recent polls.');
  }
  return data.polls;
}

export async function createPoll(payload) {
  const res = await fetch('/api/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create poll.');
  }
  return data.poll;
}

export async function fetchPoll(id) {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}`);
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to load poll.');
    err.status = res.status;
    throw err;
  }
  return data.poll;
}

export async function submitVote(id, optionIds) {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIds }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to submit vote.');
    err.status = res.status;
    err.alreadyVoted = Boolean(data.alreadyVoted);
    err.poll = data.poll || null;
    throw err;
  }
  return data.poll;
}

export async function updateVote(id, optionIds) {
  const res = await fetch(`/api/polls/${encodeURIComponent(id)}/vote`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionIds }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to update vote.');
    err.status = res.status;
    throw err;
  }
  return data.poll;
}

export function subscribeToPollResults(id, onUpdate, onStatusChange) {
  const source = new EventSource(`/api/polls/${encodeURIComponent(id)}/stream`);

  source.onopen = () => {
    onStatusChange?.('connected');
  };

  source.addEventListener('results', (event) => {
    try {
      const payload = JSON.parse(event.data);
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
