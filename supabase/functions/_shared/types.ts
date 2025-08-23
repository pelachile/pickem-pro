/**
 * Shared types for Supabase Edge Functions
 */

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination interface
export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

// League interfaces
export interface League {
  id: string;
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  currentMembers: number;
  inviteCode: string;
  createdAt: string;
  availableSpots: number;
  isPrivate: boolean;
  status: 'active' | 'inactive' | 'completed';
  createdBy: string;
}

export interface PublicLeague extends Omit<League, 'createdBy'> {
  availableSpots: number;
}

// Get public leagues response
export interface GetPublicLeaguesResponse extends ApiResponse {
  data?: {
    leagues: PublicLeague[];
    pagination: Pagination;
  };
}

// Query parameters for get public leagues
export interface GetPublicLeaguesParams {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'name' | 'members';
  sortOrder?: 'asc' | 'desc';
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  value?: any;
}