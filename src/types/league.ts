// League-related types for the NFL Pick'em application

export interface League {
  id: string;
  name: string;
  description?: string;
  entry_fee: number;
  max_members: number;
  current_members: number;
  is_private: boolean;
  invite_code: string;
  has_password: boolean;
  season_year: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  rules?: {
    scoring_type?: 'standard' | 'confidence' | 'survivor';
    allow_ties?: boolean;
    late_picks_allowed?: boolean;
  };
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  joined_at: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'member' | 'admin' | 'owner';
  display_name?: string;
  email?: string;
}

export interface PublicLeague {
  id: string;
  name: string;
  description?: string;
  entry_fee: number;
  max_members: number;
  current_members: number;
  season_year: number;
  created_at: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  is_full: boolean;
  prize_pool: number;
}

export interface JoinLeagueRequest {
  inviteCode: string;
  password?: string;
}

export interface JoinLeagueResponse {
  success: boolean;
  message: string;
  league?: League;
  error?: string;
}

export interface GetPublicLeaguesParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetPublicLeaguesResponse {
  leagues: PublicLeague[];
  total_count: number;
  has_more: boolean;
}

// User League with membership details
export interface UserLeague extends League {
  userRole: 'member' | 'admin' | 'owner';
  joinedAt: string;
  position?: number;
  prizePools?: number;
  nextDeadline?: string;
  winRate?: number;
}

export interface GetUserLeaguesResponse {
  success: boolean;
  data?: UserLeague[];
  error?: string;
}

export interface UpdateLeagueRequest {
  name?: string;
  description?: string;
  entryFee?: number;
  maxMembers?: number;
  isPrivate?: boolean;
  password?: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
}

export interface UpdateLeagueResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string;
    entryFee: number;
    maxMembers: number;
    isPrivate: boolean;
    inviteCode: string;
    status: string;
    updatedAt: string;
  };
  error?: string;
}

export interface DeleteLeagueResponse {
  success: boolean;
  message: string;
  error?: string;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}