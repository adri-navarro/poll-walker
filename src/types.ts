export interface PollOption {
  id: number;
  label: string;
  details: string;
  url: string;
  votes: number;
  percentage: number;
}

export interface PollVoter {
  // Empty for votes cast before names were required
  name: string;
  optionIds: number[];
  isYou: boolean;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  allowMultiple: boolean;
  createdAt: string;
  totalVoters: number;
  totalVotes: number;
  hasVoted: boolean;
  votedOptionIds: number[];
  voters: PollVoter[];
  options: PollOption[];
}

export interface RecentPollSummary {
  id: string;
  question: string;
  allowMultiple: boolean;
  createdAt: string;
  optionCount: number;
  totalVoters: number;
}

export interface CreatePollOptionInput {
  label: string;
  url?: string;
  details?: string;
}

export interface CreatePollPayload {
  question: string;
  description: string;
  options: CreatePollOptionInput[];
  allowMultiple: boolean;
}

export interface PollResultsUpdate {
  totalVoters: number;
  totalVotes: number;
  voters: PollVoter[];
  options: PollOption[];
}

export type LiveConnectionStatus = 'connecting' | 'connected' | 'reconnecting';
