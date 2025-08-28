/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyConditionInput = {
  beginsWith?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
  between?: Array< ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null > | null,
  eq?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
  ge?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
  gt?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
  le?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
  lt?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput | null,
};

export type ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyInput = {
  abbreviation?: string | null,
  division?: string | null,
};

export type ModelNFLTeamFilterInput = {
  abbreviation?: ModelStringInput | null,
  ai_last_updated?: ModelStringInput | null,
  and?: Array< ModelNFLTeamFilterInput | null > | null,
  city?: ModelStringInput | null,
  coaching_changes?: ModelStringInput | null,
  conference?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  division?: ModelStringInput | null,
  fantasy_relevant_news?: ModelStringInput | null,
  game_preview?: ModelStringInput | null,
  id?: ModelIDInput | null,
  injury_report?: ModelStringInput | null,
  key_injuries?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelNFLTeamFilterInput | null,
  or?: Array< ModelNFLTeamFilterInput | null > | null,
  season_outlook?: ModelStringInput | null,
  season_year?: ModelIntInput | null,
  strengths?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weaknesses?: ModelStringInput | null,
  week?: ModelIntInput | null,
  weekly_highlights?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelNFLTeamConnection = {
  __typename: "ModelNFLTeamConnection",
  items:  Array<NFLTeam | null >,
  nextToken?: string | null,
};

export type NFLTeam = {
  __typename: "NFLTeam",
  abbreviation: string,
  ai_last_updated: string,
  city: string,
  coaching_changes?: string | null,
  conference: string,
  createdAt: string,
  division: string,
  fantasy_relevant_news?: string | null,
  game_preview?: string | null,
  injury_report?: string | null,
  key_injuries?: string | null,
  name: string,
  season_outlook?: string | null,
  season_year: number,
  strengths?: string | null,
  updatedAt: string,
  weaknesses?: string | null,
  week: number,
  weekly_highlights?: string | null,
};

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelAIContentCacheFilterInput = {
  and?: Array< ModelAIContentCacheFilterInput | null > | null,
  content?: ModelStringInput | null,
  content_key?: ModelStringInput | null,
  content_type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  hit_count?: ModelIntInput | null,
  id?: ModelIDInput | null,
  last_accessed?: ModelStringInput | null,
  not?: ModelAIContentCacheFilterInput | null,
  or?: Array< ModelAIContentCacheFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAIContentCacheConnection = {
  __typename: "ModelAIContentCacheConnection",
  items:  Array<AIContentCache | null >,
  nextToken?: string | null,
};

export type AIContentCache = {
  __typename: "AIContentCache",
  content: string,
  content_key: string,
  content_type: string,
  createdAt: string,
  created_at: string,
  expires_at: string,
  hit_count?: number | null,
  last_accessed?: string | null,
  updatedAt: string,
};

export type ModelIntKeyConditionInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
};

export type ModelPlayerFilterInput = {
  ai_last_updated?: ModelStringInput | null,
  and?: Array< ModelPlayerFilterInput | null > | null,
  concerns?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  fantasy_points?: ModelFloatInput | null,
  fantasy_rank?: ModelIntInput | null,
  floor?: ModelStringInput | null,
  games_played?: ModelIntInput | null,
  id?: ModelIDInput | null,
  injury_history?: ModelStringInput | null,
  injury_update?: ModelStringInput | null,
  key_factors?: ModelStringInput | null,
  name?: ModelStringInput | null,
  news_analysis?: ModelStringInput | null,
  not?: ModelPlayerFilterInput | null,
  or?: Array< ModelPlayerFilterInput | null > | null,
  position?: ModelStringInput | null,
  position_stats?: ModelStringInput | null,
  season_year?: ModelIntInput | null,
  sentiment_score?: ModelFloatInput | null,
  strengths?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  team?: ModelStringInput | null,
  tier?: ModelStringInput | null,
  top5_likelihood?: ModelFloatInput | null,
  trending_factors?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  upside?: ModelStringInput | null,
  week?: ModelIntInput | null,
  weekly_ceiling?: ModelFloatInput | null,
  weekly_floor?: ModelFloatInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelPlayerConnection = {
  __typename: "ModelPlayerConnection",
  items:  Array<Player | null >,
  nextToken?: string | null,
};

export type Player = {
  __typename: "Player",
  ai_last_updated: string,
  concerns?: string | null,
  createdAt: string,
  fantasy_points?: number | null,
  fantasy_rank?: number | null,
  floor?: string | null,
  games_played?: number | null,
  id: string,
  injury_history?: string | null,
  injury_update?: string | null,
  key_factors?: string | null,
  name: string,
  news_analysis?: string | null,
  position: string,
  position_stats?: string | null,
  season_year: number,
  sentiment_score?: number | null,
  strengths?: string | null,
  summary?: string | null,
  team: string,
  tier?: string | null,
  top5_likelihood?: number | null,
  trending_factors?: string | null,
  updatedAt: string,
  upside?: string | null,
  week: number,
  weekly_ceiling?: number | null,
  weekly_floor?: number | null,
};

export type ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyConditionInput = {
  beginsWith?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
  between?: Array< ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null > | null,
  eq?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
  ge?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
  gt?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
  le?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
  lt?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput | null,
};

export type ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyInput = {
  fantasy_rank?: number | null,
  week?: number | null,
};

export type ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyConditionInput = {
  beginsWith?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
  between?: Array< ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null > | null,
  eq?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
  ge?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
  gt?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
  le?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
  lt?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput | null,
};

export type ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyInput = {
  abbreviation?: string | null,
  week?: number | null,
};

export type ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyConditionInput = {
  beginsWith?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
  between?: Array< ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null > | null,
  eq?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
  ge?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
  gt?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
  le?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
  lt?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput | null,
};

export type ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyInput = {
  fantasy_rank?: number | null,
  position?: string | null,
};

export type GameEvent = {
  __typename: "GameEvent",
  createdAt: string,
  description: string,
  event_id: string,
  event_type?: GameEventEvent_type | null,
  game_espn_id: string,
  id: string,
  quarter?: string | null,
  score_change?: string | null,
  time_remaining?: string | null,
  timestamp: string,
  updatedAt: string,
};

export enum GameEventEvent_type {
  field_goal = "field_goal",
  game_end = "game_end",
  quarter_end = "quarter_end",
  safety = "safety",
  touchdown = "touchdown",
  two_point = "two_point",
}


export type GameStatus = {
  __typename: "GameStatus",
  away_score?: number | null,
  createdAt: string,
  espn_id: string,
  game_status_detail?: string | null,
  has_finished?: boolean | null,
  has_started?: boolean | null,
  home_score?: number | null,
  last_updated: string,
  quarter?: string | null,
  season_year: number,
  status?: GameStatusStatus | null,
  time_remaining?: string | null,
  updatedAt: string,
  week: number,
};

export enum GameStatusStatus {
  cancelled = "cancelled",
  final = "final",
  in_progress = "in_progress",
  postponed = "postponed",
  scheduled = "scheduled",
}


export type League = {
  __typename: "League",
  createdAt: string,
  description?: string | null,
  entry_fee?: number | null,
  id: string,
  invite_code: string,
  is_private?: boolean | null,
  max_members: number,
  name: string,
  owner: string,
  password_hash?: string | null,
  status?: LeagueStatus | null,
  updatedAt: string,
};

export enum LeagueStatus {
  active = "active",
  completed = "completed",
  inactive = "inactive",
}


export type LeagueInvite = {
  __typename: "LeagueInvite",
  createdAt: string,
  expires_at?: string | null,
  id: string,
  invite_code: string,
  league_id: string,
  max_uses?: number | null,
  owner: string,
  updatedAt: string,
  uses_count?: number | null,
};

export type LeagueMember = {
  __typename: "LeagueMember",
  createdAt: string,
  id: string,
  league_id: string,
  owner: string,
  role?: LeagueMemberRole | null,
  updatedAt: string,
};

export enum LeagueMemberRole {
  admin = "admin",
  member = "member",
}


export type TeamRecord = {
  __typename: "TeamRecord",
  createdAt: string,
  espn_id: string,
  last_updated: string,
  losses?: number | null,
  point_differential?: number | null,
  points_against?: number | null,
  points_for?: number | null,
  season_year: number,
  streak?: string | null,
  ties?: number | null,
  updatedAt: string,
  win_percentage?: number | null,
  wins?: number | null,
};

export type Todo = {
  __typename: "Todo",
  content?: string | null,
  createdAt: string,
  id: string,
  updatedAt: string,
};

export type UserProfile = {
  __typename: "UserProfile",
  avatar_color?: string | null,
  avatar_icon?: string | null,
  avatar_url?: string | null,
  bio?: string | null,
  createdAt: string,
  full_name?: string | null,
  id: string,
  is_public?: boolean | null,
  owner: string,
  updatedAt: string,
  username?: string | null,
  website?: string | null,
};

export type ModelGameEventFilterInput = {
  and?: Array< ModelGameEventFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  event_id?: ModelStringInput | null,
  event_type?: ModelGameEventEvent_typeInput | null,
  game_espn_id?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelGameEventFilterInput | null,
  or?: Array< ModelGameEventFilterInput | null > | null,
  quarter?: ModelStringInput | null,
  score_change?: ModelStringInput | null,
  time_remaining?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelGameEventEvent_typeInput = {
  eq?: GameEventEvent_type | null,
  ne?: GameEventEvent_type | null,
};

export type ModelGameEventConnection = {
  __typename: "ModelGameEventConnection",
  items:  Array<GameEvent | null >,
  nextToken?: string | null,
};

export type ModelGameStatusFilterInput = {
  and?: Array< ModelGameStatusFilterInput | null > | null,
  away_score?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  espn_id?: ModelStringInput | null,
  game_status_detail?: ModelStringInput | null,
  has_finished?: ModelBooleanInput | null,
  has_started?: ModelBooleanInput | null,
  home_score?: ModelIntInput | null,
  id?: ModelIDInput | null,
  last_updated?: ModelStringInput | null,
  not?: ModelGameStatusFilterInput | null,
  or?: Array< ModelGameStatusFilterInput | null > | null,
  quarter?: ModelStringInput | null,
  season_year?: ModelIntInput | null,
  status?: ModelGameStatusStatusInput | null,
  time_remaining?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  week?: ModelIntInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelGameStatusStatusInput = {
  eq?: GameStatusStatus | null,
  ne?: GameStatusStatus | null,
};

export type ModelGameStatusConnection = {
  __typename: "ModelGameStatusConnection",
  items:  Array<GameStatus | null >,
  nextToken?: string | null,
};

export type ModelLeagueInviteFilterInput = {
  and?: Array< ModelLeagueInviteFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  id?: ModelIDInput | null,
  invite_code?: ModelStringInput | null,
  league_id?: ModelStringInput | null,
  max_uses?: ModelIntInput | null,
  not?: ModelLeagueInviteFilterInput | null,
  or?: Array< ModelLeagueInviteFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  uses_count?: ModelIntInput | null,
};

export type ModelLeagueInviteConnection = {
  __typename: "ModelLeagueInviteConnection",
  items:  Array<LeagueInvite | null >,
  nextToken?: string | null,
};

export type ModelLeagueMemberFilterInput = {
  and?: Array< ModelLeagueMemberFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  league_id?: ModelStringInput | null,
  not?: ModelLeagueMemberFilterInput | null,
  or?: Array< ModelLeagueMemberFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelLeagueMemberRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLeagueMemberRoleInput = {
  eq?: LeagueMemberRole | null,
  ne?: LeagueMemberRole | null,
};

export type ModelLeagueMemberConnection = {
  __typename: "ModelLeagueMemberConnection",
  items:  Array<LeagueMember | null >,
  nextToken?: string | null,
};

export type ModelLeagueFilterInput = {
  and?: Array< ModelLeagueFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  entry_fee?: ModelIntInput | null,
  id?: ModelIDInput | null,
  invite_code?: ModelStringInput | null,
  is_private?: ModelBooleanInput | null,
  max_members?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelLeagueFilterInput | null,
  or?: Array< ModelLeagueFilterInput | null > | null,
  owner?: ModelStringInput | null,
  password_hash?: ModelStringInput | null,
  status?: ModelLeagueStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLeagueStatusInput = {
  eq?: LeagueStatus | null,
  ne?: LeagueStatus | null,
};

export type ModelLeagueConnection = {
  __typename: "ModelLeagueConnection",
  items:  Array<League | null >,
  nextToken?: string | null,
};

export type ModelTeamRecordFilterInput = {
  and?: Array< ModelTeamRecordFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  espn_id?: ModelStringInput | null,
  id?: ModelIDInput | null,
  last_updated?: ModelStringInput | null,
  losses?: ModelIntInput | null,
  not?: ModelTeamRecordFilterInput | null,
  or?: Array< ModelTeamRecordFilterInput | null > | null,
  point_differential?: ModelIntInput | null,
  points_against?: ModelIntInput | null,
  points_for?: ModelIntInput | null,
  season_year?: ModelIntInput | null,
  streak?: ModelStringInput | null,
  ties?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  win_percentage?: ModelFloatInput | null,
  wins?: ModelIntInput | null,
};

export type ModelTeamRecordConnection = {
  __typename: "ModelTeamRecordConnection",
  items:  Array<TeamRecord | null >,
  nextToken?: string | null,
};

export type ModelTodoFilterInput = {
  and?: Array< ModelTodoFilterInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTodoFilterInput | null,
  or?: Array< ModelTodoFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection",
  items:  Array<Todo | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  avatar_color?: ModelStringInput | null,
  avatar_icon?: ModelStringInput | null,
  avatar_url?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  full_name?: ModelStringInput | null,
  id?: ModelIDInput | null,
  is_public?: ModelBooleanInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelStringInput | null,
  website?: ModelStringInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelAIContentCacheConditionInput = {
  and?: Array< ModelAIContentCacheConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  hit_count?: ModelIntInput | null,
  last_accessed?: ModelStringInput | null,
  not?: ModelAIContentCacheConditionInput | null,
  or?: Array< ModelAIContentCacheConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAIContentCacheInput = {
  content: string,
  content_key: string,
  content_type: string,
  created_at: string,
  expires_at: string,
  hit_count?: number | null,
  last_accessed?: string | null,
};

export type ModelGameEventConditionInput = {
  and?: Array< ModelGameEventConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  event_id?: ModelStringInput | null,
  event_type?: ModelGameEventEvent_typeInput | null,
  game_espn_id?: ModelStringInput | null,
  not?: ModelGameEventConditionInput | null,
  or?: Array< ModelGameEventConditionInput | null > | null,
  quarter?: ModelStringInput | null,
  score_change?: ModelStringInput | null,
  time_remaining?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateGameEventInput = {
  description: string,
  event_id: string,
  event_type?: GameEventEvent_type | null,
  game_espn_id: string,
  id?: string | null,
  quarter?: string | null,
  score_change?: string | null,
  time_remaining?: string | null,
  timestamp: string,
};

export type ModelGameStatusConditionInput = {
  and?: Array< ModelGameStatusConditionInput | null > | null,
  away_score?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  game_status_detail?: ModelStringInput | null,
  has_finished?: ModelBooleanInput | null,
  has_started?: ModelBooleanInput | null,
  home_score?: ModelIntInput | null,
  last_updated?: ModelStringInput | null,
  not?: ModelGameStatusConditionInput | null,
  or?: Array< ModelGameStatusConditionInput | null > | null,
  quarter?: ModelStringInput | null,
  season_year?: ModelIntInput | null,
  status?: ModelGameStatusStatusInput | null,
  time_remaining?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  week?: ModelIntInput | null,
};

export type CreateGameStatusInput = {
  away_score?: number | null,
  espn_id: string,
  game_status_detail?: string | null,
  has_finished?: boolean | null,
  has_started?: boolean | null,
  home_score?: number | null,
  last_updated: string,
  quarter?: string | null,
  season_year: number,
  status?: GameStatusStatus | null,
  time_remaining?: string | null,
  week: number,
};

export type ModelLeagueConditionInput = {
  and?: Array< ModelLeagueConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  entry_fee?: ModelIntInput | null,
  invite_code?: ModelStringInput | null,
  is_private?: ModelBooleanInput | null,
  max_members?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelLeagueConditionInput | null,
  or?: Array< ModelLeagueConditionInput | null > | null,
  owner?: ModelStringInput | null,
  password_hash?: ModelStringInput | null,
  status?: ModelLeagueStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLeagueInput = {
  description?: string | null,
  entry_fee?: number | null,
  id?: string | null,
  invite_code: string,
  is_private?: boolean | null,
  max_members: number,
  name: string,
  owner: string,
  password_hash?: string | null,
  status?: LeagueStatus | null,
};

export type ModelLeagueInviteConditionInput = {
  and?: Array< ModelLeagueInviteConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  invite_code?: ModelStringInput | null,
  league_id?: ModelStringInput | null,
  max_uses?: ModelIntInput | null,
  not?: ModelLeagueInviteConditionInput | null,
  or?: Array< ModelLeagueInviteConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  uses_count?: ModelIntInput | null,
};

export type CreateLeagueInviteInput = {
  expires_at?: string | null,
  id?: string | null,
  invite_code: string,
  league_id: string,
  max_uses?: number | null,
  owner: string,
  uses_count?: number | null,
};

export type ModelLeagueMemberConditionInput = {
  and?: Array< ModelLeagueMemberConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  league_id?: ModelStringInput | null,
  not?: ModelLeagueMemberConditionInput | null,
  or?: Array< ModelLeagueMemberConditionInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelLeagueMemberRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLeagueMemberInput = {
  id?: string | null,
  league_id: string,
  owner: string,
  role?: LeagueMemberRole | null,
};

export type ModelNFLTeamConditionInput = {
  ai_last_updated?: ModelStringInput | null,
  and?: Array< ModelNFLTeamConditionInput | null > | null,
  city?: ModelStringInput | null,
  coaching_changes?: ModelStringInput | null,
  conference?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  division?: ModelStringInput | null,
  fantasy_relevant_news?: ModelStringInput | null,
  game_preview?: ModelStringInput | null,
  injury_report?: ModelStringInput | null,
  key_injuries?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelNFLTeamConditionInput | null,
  or?: Array< ModelNFLTeamConditionInput | null > | null,
  season_outlook?: ModelStringInput | null,
  strengths?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weaknesses?: ModelStringInput | null,
  week?: ModelIntInput | null,
  weekly_highlights?: ModelStringInput | null,
};

export type CreateNFLTeamInput = {
  abbreviation: string,
  ai_last_updated: string,
  city: string,
  coaching_changes?: string | null,
  conference: string,
  division: string,
  fantasy_relevant_news?: string | null,
  game_preview?: string | null,
  injury_report?: string | null,
  key_injuries?: string | null,
  name: string,
  season_outlook?: string | null,
  season_year: number,
  strengths?: string | null,
  weaknesses?: string | null,
  week: number,
  weekly_highlights?: string | null,
};

export type ModelPlayerConditionInput = {
  ai_last_updated?: ModelStringInput | null,
  and?: Array< ModelPlayerConditionInput | null > | null,
  concerns?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  fantasy_points?: ModelFloatInput | null,
  fantasy_rank?: ModelIntInput | null,
  floor?: ModelStringInput | null,
  games_played?: ModelIntInput | null,
  injury_history?: ModelStringInput | null,
  injury_update?: ModelStringInput | null,
  key_factors?: ModelStringInput | null,
  name?: ModelStringInput | null,
  news_analysis?: ModelStringInput | null,
  not?: ModelPlayerConditionInput | null,
  or?: Array< ModelPlayerConditionInput | null > | null,
  position?: ModelStringInput | null,
  position_stats?: ModelStringInput | null,
  season_year?: ModelIntInput | null,
  sentiment_score?: ModelFloatInput | null,
  strengths?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  team?: ModelStringInput | null,
  tier?: ModelStringInput | null,
  top5_likelihood?: ModelFloatInput | null,
  trending_factors?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  upside?: ModelStringInput | null,
  week?: ModelIntInput | null,
  weekly_ceiling?: ModelFloatInput | null,
  weekly_floor?: ModelFloatInput | null,
};

export type CreatePlayerInput = {
  ai_last_updated: string,
  concerns?: string | null,
  fantasy_points?: number | null,
  fantasy_rank?: number | null,
  floor?: string | null,
  games_played?: number | null,
  id?: string | null,
  injury_history?: string | null,
  injury_update?: string | null,
  key_factors?: string | null,
  name: string,
  news_analysis?: string | null,
  position: string,
  position_stats?: string | null,
  season_year: number,
  sentiment_score?: number | null,
  strengths?: string | null,
  summary?: string | null,
  team: string,
  tier?: string | null,
  top5_likelihood?: number | null,
  trending_factors?: string | null,
  upside?: string | null,
  week: number,
  weekly_ceiling?: number | null,
  weekly_floor?: number | null,
};

export type ModelTeamRecordConditionInput = {
  and?: Array< ModelTeamRecordConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  last_updated?: ModelStringInput | null,
  losses?: ModelIntInput | null,
  not?: ModelTeamRecordConditionInput | null,
  or?: Array< ModelTeamRecordConditionInput | null > | null,
  point_differential?: ModelIntInput | null,
  points_against?: ModelIntInput | null,
  points_for?: ModelIntInput | null,
  streak?: ModelStringInput | null,
  ties?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  win_percentage?: ModelFloatInput | null,
  wins?: ModelIntInput | null,
};

export type CreateTeamRecordInput = {
  espn_id: string,
  last_updated: string,
  losses?: number | null,
  point_differential?: number | null,
  points_against?: number | null,
  points_for?: number | null,
  season_year: number,
  streak?: string | null,
  ties?: number | null,
  win_percentage?: number | null,
  wins?: number | null,
};

export type ModelTodoConditionInput = {
  and?: Array< ModelTodoConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTodoConditionInput | null,
  or?: Array< ModelTodoConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTodoInput = {
  content?: string | null,
  id?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  avatar_color?: ModelStringInput | null,
  avatar_icon?: ModelStringInput | null,
  avatar_url?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  full_name?: ModelStringInput | null,
  is_public?: ModelBooleanInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelStringInput | null,
  website?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  avatar_color?: string | null,
  avatar_icon?: string | null,
  avatar_url?: string | null,
  bio?: string | null,
  full_name?: string | null,
  id?: string | null,
  is_public?: boolean | null,
  owner: string,
  username?: string | null,
  website?: string | null,
};

export type DeleteAIContentCacheInput = {
  content_key: string,
  content_type: string,
};

export type DeleteGameEventInput = {
  id: string,
};

export type DeleteGameStatusInput = {
  espn_id: string,
};

export type DeleteLeagueInput = {
  id: string,
};

export type DeleteLeagueInviteInput = {
  id: string,
};

export type DeleteLeagueMemberInput = {
  id: string,
};

export type DeleteNFLTeamInput = {
  abbreviation: string,
  season_year: number,
};

export type DeletePlayerInput = {
  id: string,
};

export type DeleteTeamRecordInput = {
  espn_id: string,
  season_year: number,
};

export type DeleteTodoInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateAIContentCacheInput = {
  content?: string | null,
  content_key: string,
  content_type: string,
  created_at?: string | null,
  expires_at?: string | null,
  hit_count?: number | null,
  last_accessed?: string | null,
};

export type UpdateGameEventInput = {
  description?: string | null,
  event_id?: string | null,
  event_type?: GameEventEvent_type | null,
  game_espn_id?: string | null,
  id: string,
  quarter?: string | null,
  score_change?: string | null,
  time_remaining?: string | null,
  timestamp?: string | null,
};

export type UpdateGameStatusInput = {
  away_score?: number | null,
  espn_id: string,
  game_status_detail?: string | null,
  has_finished?: boolean | null,
  has_started?: boolean | null,
  home_score?: number | null,
  last_updated?: string | null,
  quarter?: string | null,
  season_year?: number | null,
  status?: GameStatusStatus | null,
  time_remaining?: string | null,
  week?: number | null,
};

export type UpdateLeagueInput = {
  description?: string | null,
  entry_fee?: number | null,
  id: string,
  invite_code?: string | null,
  is_private?: boolean | null,
  max_members?: number | null,
  name?: string | null,
  owner?: string | null,
  password_hash?: string | null,
  status?: LeagueStatus | null,
};

export type UpdateLeagueInviteInput = {
  expires_at?: string | null,
  id: string,
  invite_code?: string | null,
  league_id?: string | null,
  max_uses?: number | null,
  owner?: string | null,
  uses_count?: number | null,
};

export type UpdateLeagueMemberInput = {
  id: string,
  league_id?: string | null,
  owner?: string | null,
  role?: LeagueMemberRole | null,
};

export type UpdateNFLTeamInput = {
  abbreviation: string,
  ai_last_updated?: string | null,
  city?: string | null,
  coaching_changes?: string | null,
  conference?: string | null,
  division?: string | null,
  fantasy_relevant_news?: string | null,
  game_preview?: string | null,
  injury_report?: string | null,
  key_injuries?: string | null,
  name?: string | null,
  season_outlook?: string | null,
  season_year: number,
  strengths?: string | null,
  weaknesses?: string | null,
  week?: number | null,
  weekly_highlights?: string | null,
};

export type UpdatePlayerInput = {
  ai_last_updated?: string | null,
  concerns?: string | null,
  fantasy_points?: number | null,
  fantasy_rank?: number | null,
  floor?: string | null,
  games_played?: number | null,
  id: string,
  injury_history?: string | null,
  injury_update?: string | null,
  key_factors?: string | null,
  name?: string | null,
  news_analysis?: string | null,
  position?: string | null,
  position_stats?: string | null,
  season_year?: number | null,
  sentiment_score?: number | null,
  strengths?: string | null,
  summary?: string | null,
  team?: string | null,
  tier?: string | null,
  top5_likelihood?: number | null,
  trending_factors?: string | null,
  upside?: string | null,
  week?: number | null,
  weekly_ceiling?: number | null,
  weekly_floor?: number | null,
};

export type UpdateTeamRecordInput = {
  espn_id: string,
  last_updated?: string | null,
  losses?: number | null,
  point_differential?: number | null,
  points_against?: number | null,
  points_for?: number | null,
  season_year: number,
  streak?: string | null,
  ties?: number | null,
  win_percentage?: number | null,
  wins?: number | null,
};

export type UpdateTodoInput = {
  content?: string | null,
  id: string,
};

export type UpdateUserProfileInput = {
  avatar_color?: string | null,
  avatar_icon?: string | null,
  avatar_url?: string | null,
  bio?: string | null,
  full_name?: string | null,
  id: string,
  is_public?: boolean | null,
  owner?: string | null,
  username?: string | null,
  website?: string | null,
};

export type ModelSubscriptionAIContentCacheFilterInput = {
  and?: Array< ModelSubscriptionAIContentCacheFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  content_key?: ModelSubscriptionStringInput | null,
  content_type?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  expires_at?: ModelSubscriptionStringInput | null,
  hit_count?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  last_accessed?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAIContentCacheFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionGameEventFilterInput = {
  and?: Array< ModelSubscriptionGameEventFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  event_id?: ModelSubscriptionStringInput | null,
  event_type?: ModelSubscriptionStringInput | null,
  game_espn_id?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionGameEventFilterInput | null > | null,
  quarter?: ModelSubscriptionStringInput | null,
  score_change?: ModelSubscriptionStringInput | null,
  time_remaining?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionGameStatusFilterInput = {
  and?: Array< ModelSubscriptionGameStatusFilterInput | null > | null,
  away_score?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  espn_id?: ModelSubscriptionStringInput | null,
  game_status_detail?: ModelSubscriptionStringInput | null,
  has_finished?: ModelSubscriptionBooleanInput | null,
  has_started?: ModelSubscriptionBooleanInput | null,
  home_score?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  last_updated?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionGameStatusFilterInput | null > | null,
  quarter?: ModelSubscriptionStringInput | null,
  season_year?: ModelSubscriptionIntInput | null,
  status?: ModelSubscriptionStringInput | null,
  time_remaining?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  week?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionLeagueFilterInput = {
  and?: Array< ModelSubscriptionLeagueFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  entry_fee?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  invite_code?: ModelSubscriptionStringInput | null,
  is_private?: ModelSubscriptionBooleanInput | null,
  max_members?: ModelSubscriptionIntInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLeagueFilterInput | null > | null,
  owner?: ModelStringInput | null,
  password_hash?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionLeagueInviteFilterInput = {
  and?: Array< ModelSubscriptionLeagueInviteFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  expires_at?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  invite_code?: ModelSubscriptionStringInput | null,
  league_id?: ModelSubscriptionStringInput | null,
  max_uses?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionLeagueInviteFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  uses_count?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionLeagueMemberFilterInput = {
  and?: Array< ModelSubscriptionLeagueMemberFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  league_id?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionLeagueMemberFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionNFLTeamFilterInput = {
  abbreviation?: ModelSubscriptionStringInput | null,
  ai_last_updated?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionNFLTeamFilterInput | null > | null,
  city?: ModelSubscriptionStringInput | null,
  coaching_changes?: ModelSubscriptionStringInput | null,
  conference?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  division?: ModelSubscriptionStringInput | null,
  fantasy_relevant_news?: ModelSubscriptionStringInput | null,
  game_preview?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  injury_report?: ModelSubscriptionStringInput | null,
  key_injuries?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionNFLTeamFilterInput | null > | null,
  season_outlook?: ModelSubscriptionStringInput | null,
  season_year?: ModelSubscriptionIntInput | null,
  strengths?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  weaknesses?: ModelSubscriptionStringInput | null,
  week?: ModelSubscriptionIntInput | null,
  weekly_highlights?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPlayerFilterInput = {
  ai_last_updated?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  concerns?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  fantasy_points?: ModelSubscriptionFloatInput | null,
  fantasy_rank?: ModelSubscriptionIntInput | null,
  floor?: ModelSubscriptionStringInput | null,
  games_played?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  injury_history?: ModelSubscriptionStringInput | null,
  injury_update?: ModelSubscriptionStringInput | null,
  key_factors?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  news_analysis?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  position?: ModelSubscriptionStringInput | null,
  position_stats?: ModelSubscriptionStringInput | null,
  season_year?: ModelSubscriptionIntInput | null,
  sentiment_score?: ModelSubscriptionFloatInput | null,
  strengths?: ModelSubscriptionStringInput | null,
  summary?: ModelSubscriptionStringInput | null,
  team?: ModelSubscriptionStringInput | null,
  tier?: ModelSubscriptionStringInput | null,
  top5_likelihood?: ModelSubscriptionFloatInput | null,
  trending_factors?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  upside?: ModelSubscriptionStringInput | null,
  week?: ModelSubscriptionIntInput | null,
  weekly_ceiling?: ModelSubscriptionFloatInput | null,
  weekly_floor?: ModelSubscriptionFloatInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTeamRecordFilterInput = {
  and?: Array< ModelSubscriptionTeamRecordFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  espn_id?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  last_updated?: ModelSubscriptionStringInput | null,
  losses?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionTeamRecordFilterInput | null > | null,
  point_differential?: ModelSubscriptionIntInput | null,
  points_against?: ModelSubscriptionIntInput | null,
  points_for?: ModelSubscriptionIntInput | null,
  season_year?: ModelSubscriptionIntInput | null,
  streak?: ModelSubscriptionStringInput | null,
  ties?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  win_percentage?: ModelSubscriptionFloatInput | null,
  wins?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  avatar_color?: ModelSubscriptionStringInput | null,
  avatar_icon?: ModelSubscriptionStringInput | null,
  avatar_url?: ModelSubscriptionStringInput | null,
  bio?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  full_name?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  is_public?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
};

export type ByConferenceQueryVariables = {
  conference: string,
  divisionAbbreviation?: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyConditionInput | null,
  filter?: ModelNFLTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ByConferenceQuery = {
  byConference?:  {
    __typename: "ModelNFLTeamConnection",
    items:  Array< {
      __typename: "NFLTeam",
      abbreviation: string,
      ai_last_updated: string,
      city: string,
      coaching_changes?: string | null,
      conference: string,
      createdAt: string,
      division: string,
      fantasy_relevant_news?: string | null,
      game_preview?: string | null,
      injury_report?: string | null,
      key_injuries?: string | null,
      name: string,
      season_outlook?: string | null,
      season_year: number,
      strengths?: string | null,
      updatedAt: string,
      weaknesses?: string | null,
      week: number,
      weekly_highlights?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ByDivisionQueryVariables = {
  abbreviation?: ModelStringKeyConditionInput | null,
  division: string,
  filter?: ModelNFLTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ByDivisionQuery = {
  byDivision?:  {
    __typename: "ModelNFLTeamConnection",
    items:  Array< {
      __typename: "NFLTeam",
      abbreviation: string,
      ai_last_updated: string,
      city: string,
      coaching_changes?: string | null,
      conference: string,
      createdAt: string,
      division: string,
      fantasy_relevant_news?: string | null,
      game_preview?: string | null,
      injury_report?: string | null,
      key_injuries?: string | null,
      name: string,
      season_outlook?: string | null,
      season_year: number,
      strengths?: string | null,
      updatedAt: string,
      weaknesses?: string | null,
      week: number,
      weekly_highlights?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ByExpirationQueryVariables = {
  expires_at: string,
  filter?: ModelAIContentCacheFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ByExpirationQuery = {
  byExpiration?:  {
    __typename: "ModelAIContentCacheConnection",
    items:  Array< {
      __typename: "AIContentCache",
      content: string,
      content_key: string,
      content_type: string,
      createdAt: string,
      created_at: string,
      expires_at: string,
      hit_count?: number | null,
      last_accessed?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ByPositionQueryVariables = {
  fantasy_rank?: ModelIntKeyConditionInput | null,
  filter?: ModelPlayerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  position: string,
  sortDirection?: ModelSortDirection | null,
};

export type ByPositionQuery = {
  byPosition?:  {
    __typename: "ModelPlayerConnection",
    items:  Array< {
      __typename: "Player",
      ai_last_updated: string,
      concerns?: string | null,
      createdAt: string,
      fantasy_points?: number | null,
      fantasy_rank?: number | null,
      floor?: string | null,
      games_played?: number | null,
      id: string,
      injury_history?: string | null,
      injury_update?: string | null,
      key_factors?: string | null,
      name: string,
      news_analysis?: string | null,
      position: string,
      position_stats?: string | null,
      season_year: number,
      sentiment_score?: number | null,
      strengths?: string | null,
      summary?: string | null,
      team: string,
      tier?: string | null,
      top5_likelihood?: number | null,
      trending_factors?: string | null,
      updatedAt: string,
      upside?: string | null,
      week: number,
      weekly_ceiling?: number | null,
      weekly_floor?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BySeasonQueryVariables = {
  filter?: ModelPlayerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  season_year: number,
  sortDirection?: ModelSortDirection | null,
  weekFantasy_rank?: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyConditionInput | null,
};

export type BySeasonQuery = {
  bySeason?:  {
    __typename: "ModelPlayerConnection",
    items:  Array< {
      __typename: "Player",
      ai_last_updated: string,
      concerns?: string | null,
      createdAt: string,
      fantasy_points?: number | null,
      fantasy_rank?: number | null,
      floor?: string | null,
      games_played?: number | null,
      id: string,
      injury_history?: string | null,
      injury_update?: string | null,
      key_factors?: string | null,
      name: string,
      news_analysis?: string | null,
      position: string,
      position_stats?: string | null,
      season_year: number,
      sentiment_score?: number | null,
      strengths?: string | null,
      summary?: string | null,
      team: string,
      tier?: string | null,
      top5_likelihood?: number | null,
      trending_factors?: string | null,
      updatedAt: string,
      upside?: string | null,
      week: number,
      weekly_ceiling?: number | null,
      weekly_floor?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BySeasonWeekQueryVariables = {
  filter?: ModelNFLTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  season_year: number,
  sortDirection?: ModelSortDirection | null,
  weekAbbreviation?: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyConditionInput | null,
};

export type BySeasonWeekQuery = {
  bySeasonWeek?:  {
    __typename: "ModelNFLTeamConnection",
    items:  Array< {
      __typename: "NFLTeam",
      abbreviation: string,
      ai_last_updated: string,
      city: string,
      coaching_changes?: string | null,
      conference: string,
      createdAt: string,
      division: string,
      fantasy_relevant_news?: string | null,
      game_preview?: string | null,
      injury_report?: string | null,
      key_injuries?: string | null,
      name: string,
      season_outlook?: string | null,
      season_year: number,
      strengths?: string | null,
      updatedAt: string,
      weaknesses?: string | null,
      week: number,
      weekly_highlights?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ByTeamQueryVariables = {
  filter?: ModelPlayerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  positionFantasy_rank?: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  team: string,
};

export type ByTeamQuery = {
  byTeam?:  {
    __typename: "ModelPlayerConnection",
    items:  Array< {
      __typename: "Player",
      ai_last_updated: string,
      concerns?: string | null,
      createdAt: string,
      fantasy_points?: number | null,
      fantasy_rank?: number | null,
      floor?: string | null,
      games_played?: number | null,
      id: string,
      injury_history?: string | null,
      injury_update?: string | null,
      key_factors?: string | null,
      name: string,
      news_analysis?: string | null,
      position: string,
      position_stats?: string | null,
      season_year: number,
      sentiment_score?: number | null,
      strengths?: string | null,
      summary?: string | null,
      team: string,
      tier?: string | null,
      top5_likelihood?: number | null,
      trending_factors?: string | null,
      updatedAt: string,
      upside?: string | null,
      week: number,
      weekly_ceiling?: number | null,
      weekly_floor?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAIContentCacheQueryVariables = {
  content_key: string,
  content_type: string,
};

export type GetAIContentCacheQuery = {
  getAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type GetGameEventQueryVariables = {
  id: string,
};

export type GetGameEventQuery = {
  getGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type GetGameStatusQueryVariables = {
  espn_id: string,
};

export type GetGameStatusQuery = {
  getGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type GetLeagueQueryVariables = {
  id: string,
};

export type GetLeagueQuery = {
  getLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type GetLeagueInviteQueryVariables = {
  id: string,
};

export type GetLeagueInviteQuery = {
  getLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type GetLeagueMemberQueryVariables = {
  id: string,
};

export type GetLeagueMemberQuery = {
  getLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type GetNFLTeamQueryVariables = {
  abbreviation: string,
  season_year: number,
};

export type GetNFLTeamQuery = {
  getNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type GetPlayerQueryVariables = {
  id: string,
};

export type GetPlayerQuery = {
  getPlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type GetTeamRecordQueryVariables = {
  espn_id: string,
  season_year: number,
};

export type GetTeamRecordQuery = {
  getTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type GetTodoQueryVariables = {
  id: string,
};

export type GetTodoQuery = {
  getTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type ListAIContentCachesQueryVariables = {
  content_key?: ModelStringKeyConditionInput | null,
  content_type?: string | null,
  filter?: ModelAIContentCacheFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAIContentCachesQuery = {
  listAIContentCaches?:  {
    __typename: "ModelAIContentCacheConnection",
    items:  Array< {
      __typename: "AIContentCache",
      content: string,
      content_key: string,
      content_type: string,
      createdAt: string,
      created_at: string,
      expires_at: string,
      hit_count?: number | null,
      last_accessed?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListGameEventsQueryVariables = {
  filter?: ModelGameEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGameEventsQuery = {
  listGameEvents?:  {
    __typename: "ModelGameEventConnection",
    items:  Array< {
      __typename: "GameEvent",
      createdAt: string,
      description: string,
      event_id: string,
      event_type?: GameEventEvent_type | null,
      game_espn_id: string,
      id: string,
      quarter?: string | null,
      score_change?: string | null,
      time_remaining?: string | null,
      timestamp: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListGameStatusesQueryVariables = {
  espn_id?: string | null,
  filter?: ModelGameStatusFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListGameStatusesQuery = {
  listGameStatuses?:  {
    __typename: "ModelGameStatusConnection",
    items:  Array< {
      __typename: "GameStatus",
      away_score?: number | null,
      createdAt: string,
      espn_id: string,
      game_status_detail?: string | null,
      has_finished?: boolean | null,
      has_started?: boolean | null,
      home_score?: number | null,
      last_updated: string,
      quarter?: string | null,
      season_year: number,
      status?: GameStatusStatus | null,
      time_remaining?: string | null,
      updatedAt: string,
      week: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLeagueInvitesQueryVariables = {
  filter?: ModelLeagueInviteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLeagueInvitesQuery = {
  listLeagueInvites?:  {
    __typename: "ModelLeagueInviteConnection",
    items:  Array< {
      __typename: "LeagueInvite",
      createdAt: string,
      expires_at?: string | null,
      id: string,
      invite_code: string,
      league_id: string,
      max_uses?: number | null,
      owner: string,
      updatedAt: string,
      uses_count?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLeagueMembersQueryVariables = {
  filter?: ModelLeagueMemberFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLeagueMembersQuery = {
  listLeagueMembers?:  {
    __typename: "ModelLeagueMemberConnection",
    items:  Array< {
      __typename: "LeagueMember",
      createdAt: string,
      id: string,
      league_id: string,
      owner: string,
      role?: LeagueMemberRole | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLeaguesQueryVariables = {
  filter?: ModelLeagueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLeaguesQuery = {
  listLeagues?:  {
    __typename: "ModelLeagueConnection",
    items:  Array< {
      __typename: "League",
      createdAt: string,
      description?: string | null,
      entry_fee?: number | null,
      id: string,
      invite_code: string,
      is_private?: boolean | null,
      max_members: number,
      name: string,
      owner: string,
      password_hash?: string | null,
      status?: LeagueStatus | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNFLTeamsQueryVariables = {
  abbreviation?: string | null,
  filter?: ModelNFLTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  season_year?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListNFLTeamsQuery = {
  listNFLTeams?:  {
    __typename: "ModelNFLTeamConnection",
    items:  Array< {
      __typename: "NFLTeam",
      abbreviation: string,
      ai_last_updated: string,
      city: string,
      coaching_changes?: string | null,
      conference: string,
      createdAt: string,
      division: string,
      fantasy_relevant_news?: string | null,
      game_preview?: string | null,
      injury_report?: string | null,
      key_injuries?: string | null,
      name: string,
      season_outlook?: string | null,
      season_year: number,
      strengths?: string | null,
      updatedAt: string,
      weaknesses?: string | null,
      week: number,
      weekly_highlights?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPlayersQueryVariables = {
  filter?: ModelPlayerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlayersQuery = {
  listPlayers?:  {
    __typename: "ModelPlayerConnection",
    items:  Array< {
      __typename: "Player",
      ai_last_updated: string,
      concerns?: string | null,
      createdAt: string,
      fantasy_points?: number | null,
      fantasy_rank?: number | null,
      floor?: string | null,
      games_played?: number | null,
      id: string,
      injury_history?: string | null,
      injury_update?: string | null,
      key_factors?: string | null,
      name: string,
      news_analysis?: string | null,
      position: string,
      position_stats?: string | null,
      season_year: number,
      sentiment_score?: number | null,
      strengths?: string | null,
      summary?: string | null,
      team: string,
      tier?: string | null,
      top5_likelihood?: number | null,
      trending_factors?: string | null,
      updatedAt: string,
      upside?: string | null,
      week: number,
      weekly_ceiling?: number | null,
      weekly_floor?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTeamRecordsQueryVariables = {
  espn_id?: string | null,
  filter?: ModelTeamRecordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  season_year?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListTeamRecordsQuery = {
  listTeamRecords?:  {
    __typename: "ModelTeamRecordConnection",
    items:  Array< {
      __typename: "TeamRecord",
      createdAt: string,
      espn_id: string,
      last_updated: string,
      losses?: number | null,
      point_differential?: number | null,
      points_against?: number | null,
      points_for?: number | null,
      season_year: number,
      streak?: string | null,
      ties?: number | null,
      updatedAt: string,
      win_percentage?: number | null,
      wins?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      content?: string | null,
      createdAt: string,
      id: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      avatar_color?: string | null,
      avatar_icon?: string | null,
      avatar_url?: string | null,
      bio?: string | null,
      createdAt: string,
      full_name?: string | null,
      id: string,
      is_public?: boolean | null,
      owner: string,
      updatedAt: string,
      username?: string | null,
      website?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAIContentCacheMutationVariables = {
  condition?: ModelAIContentCacheConditionInput | null,
  input: CreateAIContentCacheInput,
};

export type CreateAIContentCacheMutation = {
  createAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateGameEventMutationVariables = {
  condition?: ModelGameEventConditionInput | null,
  input: CreateGameEventInput,
};

export type CreateGameEventMutation = {
  createGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type CreateGameStatusMutationVariables = {
  condition?: ModelGameStatusConditionInput | null,
  input: CreateGameStatusInput,
};

export type CreateGameStatusMutation = {
  createGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type CreateLeagueMutationVariables = {
  condition?: ModelLeagueConditionInput | null,
  input: CreateLeagueInput,
};

export type CreateLeagueMutation = {
  createLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type CreateLeagueInviteMutationVariables = {
  condition?: ModelLeagueInviteConditionInput | null,
  input: CreateLeagueInviteInput,
};

export type CreateLeagueInviteMutation = {
  createLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type CreateLeagueMemberMutationVariables = {
  condition?: ModelLeagueMemberConditionInput | null,
  input: CreateLeagueMemberInput,
};

export type CreateLeagueMemberMutation = {
  createLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type CreateNFLTeamMutationVariables = {
  condition?: ModelNFLTeamConditionInput | null,
  input: CreateNFLTeamInput,
};

export type CreateNFLTeamMutation = {
  createNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type CreatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: CreatePlayerInput,
};

export type CreatePlayerMutation = {
  createPlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type CreateTeamRecordMutationVariables = {
  condition?: ModelTeamRecordConditionInput | null,
  input: CreateTeamRecordInput,
};

export type CreateTeamRecordMutation = {
  createTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type CreateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type DeleteAIContentCacheMutationVariables = {
  condition?: ModelAIContentCacheConditionInput | null,
  input: DeleteAIContentCacheInput,
};

export type DeleteAIContentCacheMutation = {
  deleteAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteGameEventMutationVariables = {
  condition?: ModelGameEventConditionInput | null,
  input: DeleteGameEventInput,
};

export type DeleteGameEventMutation = {
  deleteGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type DeleteGameStatusMutationVariables = {
  condition?: ModelGameStatusConditionInput | null,
  input: DeleteGameStatusInput,
};

export type DeleteGameStatusMutation = {
  deleteGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type DeleteLeagueMutationVariables = {
  condition?: ModelLeagueConditionInput | null,
  input: DeleteLeagueInput,
};

export type DeleteLeagueMutation = {
  deleteLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type DeleteLeagueInviteMutationVariables = {
  condition?: ModelLeagueInviteConditionInput | null,
  input: DeleteLeagueInviteInput,
};

export type DeleteLeagueInviteMutation = {
  deleteLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type DeleteLeagueMemberMutationVariables = {
  condition?: ModelLeagueMemberConditionInput | null,
  input: DeleteLeagueMemberInput,
};

export type DeleteLeagueMemberMutation = {
  deleteLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type DeleteNFLTeamMutationVariables = {
  condition?: ModelNFLTeamConditionInput | null,
  input: DeleteNFLTeamInput,
};

export type DeleteNFLTeamMutation = {
  deleteNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type DeletePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: DeletePlayerInput,
};

export type DeletePlayerMutation = {
  deletePlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type DeleteTeamRecordMutationVariables = {
  condition?: ModelTeamRecordConditionInput | null,
  input: DeleteTeamRecordInput,
};

export type DeleteTeamRecordMutation = {
  deleteTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type DeleteTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: DeleteTodoInput,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type UpdateAIContentCacheMutationVariables = {
  condition?: ModelAIContentCacheConditionInput | null,
  input: UpdateAIContentCacheInput,
};

export type UpdateAIContentCacheMutation = {
  updateAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateGameEventMutationVariables = {
  condition?: ModelGameEventConditionInput | null,
  input: UpdateGameEventInput,
};

export type UpdateGameEventMutation = {
  updateGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type UpdateGameStatusMutationVariables = {
  condition?: ModelGameStatusConditionInput | null,
  input: UpdateGameStatusInput,
};

export type UpdateGameStatusMutation = {
  updateGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type UpdateLeagueMutationVariables = {
  condition?: ModelLeagueConditionInput | null,
  input: UpdateLeagueInput,
};

export type UpdateLeagueMutation = {
  updateLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type UpdateLeagueInviteMutationVariables = {
  condition?: ModelLeagueInviteConditionInput | null,
  input: UpdateLeagueInviteInput,
};

export type UpdateLeagueInviteMutation = {
  updateLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type UpdateLeagueMemberMutationVariables = {
  condition?: ModelLeagueMemberConditionInput | null,
  input: UpdateLeagueMemberInput,
};

export type UpdateLeagueMemberMutation = {
  updateLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type UpdateNFLTeamMutationVariables = {
  condition?: ModelNFLTeamConditionInput | null,
  input: UpdateNFLTeamInput,
};

export type UpdateNFLTeamMutation = {
  updateNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type UpdatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: UpdatePlayerInput,
};

export type UpdatePlayerMutation = {
  updatePlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type UpdateTeamRecordMutationVariables = {
  condition?: ModelTeamRecordConditionInput | null,
  input: UpdateTeamRecordInput,
};

export type UpdateTeamRecordMutation = {
  updateTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type UpdateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: UpdateTodoInput,
};

export type UpdateTodoMutation = {
  updateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type OnCreateAIContentCacheSubscriptionVariables = {
  filter?: ModelSubscriptionAIContentCacheFilterInput | null,
};

export type OnCreateAIContentCacheSubscription = {
  onCreateAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateGameEventSubscriptionVariables = {
  filter?: ModelSubscriptionGameEventFilterInput | null,
};

export type OnCreateGameEventSubscription = {
  onCreateGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGameStatusSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatusFilterInput | null,
};

export type OnCreateGameStatusSubscription = {
  onCreateGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type OnCreateLeagueSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueFilterInput | null,
  owner?: string | null,
};

export type OnCreateLeagueSubscription = {
  onCreateLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type OnCreateLeagueInviteSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueInviteFilterInput | null,
  owner?: string | null,
};

export type OnCreateLeagueInviteSubscription = {
  onCreateLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type OnCreateLeagueMemberSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueMemberFilterInput | null,
  owner?: string | null,
};

export type OnCreateLeagueMemberSubscription = {
  onCreateLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type OnCreateNFLTeamSubscriptionVariables = {
  filter?: ModelSubscriptionNFLTeamFilterInput | null,
};

export type OnCreateNFLTeamSubscription = {
  onCreateNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type OnCreatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnCreatePlayerSubscription = {
  onCreatePlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type OnCreateTeamRecordSubscriptionVariables = {
  filter?: ModelSubscriptionTeamRecordFilterInput | null,
};

export type OnCreateTeamRecordSubscription = {
  onCreateTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnCreateTodoSubscription = {
  onCreateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type OnDeleteAIContentCacheSubscriptionVariables = {
  filter?: ModelSubscriptionAIContentCacheFilterInput | null,
};

export type OnDeleteAIContentCacheSubscription = {
  onDeleteAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameEventSubscriptionVariables = {
  filter?: ModelSubscriptionGameEventFilterInput | null,
};

export type OnDeleteGameEventSubscription = {
  onDeleteGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameStatusSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatusFilterInput | null,
};

export type OnDeleteGameStatusSubscription = {
  onDeleteGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type OnDeleteLeagueSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLeagueSubscription = {
  onDeleteLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteLeagueInviteSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueInviteFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLeagueInviteSubscription = {
  onDeleteLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type OnDeleteLeagueMemberSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueMemberFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLeagueMemberSubscription = {
  onDeleteLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteNFLTeamSubscriptionVariables = {
  filter?: ModelSubscriptionNFLTeamFilterInput | null,
};

export type OnDeleteNFLTeamSubscription = {
  onDeleteNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type OnDeletePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnDeletePlayerSubscription = {
  onDeletePlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type OnDeleteTeamRecordSubscriptionVariables = {
  filter?: ModelSubscriptionTeamRecordFilterInput | null,
};

export type OnDeleteTeamRecordSubscription = {
  onDeleteTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};

export type OnUpdateAIContentCacheSubscriptionVariables = {
  filter?: ModelSubscriptionAIContentCacheFilterInput | null,
};

export type OnUpdateAIContentCacheSubscription = {
  onUpdateAIContentCache?:  {
    __typename: "AIContentCache",
    content: string,
    content_key: string,
    content_type: string,
    createdAt: string,
    created_at: string,
    expires_at: string,
    hit_count?: number | null,
    last_accessed?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameEventSubscriptionVariables = {
  filter?: ModelSubscriptionGameEventFilterInput | null,
};

export type OnUpdateGameEventSubscription = {
  onUpdateGameEvent?:  {
    __typename: "GameEvent",
    createdAt: string,
    description: string,
    event_id: string,
    event_type?: GameEventEvent_type | null,
    game_espn_id: string,
    id: string,
    quarter?: string | null,
    score_change?: string | null,
    time_remaining?: string | null,
    timestamp: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameStatusSubscriptionVariables = {
  filter?: ModelSubscriptionGameStatusFilterInput | null,
};

export type OnUpdateGameStatusSubscription = {
  onUpdateGameStatus?:  {
    __typename: "GameStatus",
    away_score?: number | null,
    createdAt: string,
    espn_id: string,
    game_status_detail?: string | null,
    has_finished?: boolean | null,
    has_started?: boolean | null,
    home_score?: number | null,
    last_updated: string,
    quarter?: string | null,
    season_year: number,
    status?: GameStatusStatus | null,
    time_remaining?: string | null,
    updatedAt: string,
    week: number,
  } | null,
};

export type OnUpdateLeagueSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLeagueSubscription = {
  onUpdateLeague?:  {
    __typename: "League",
    createdAt: string,
    description?: string | null,
    entry_fee?: number | null,
    id: string,
    invite_code: string,
    is_private?: boolean | null,
    max_members: number,
    name: string,
    owner: string,
    password_hash?: string | null,
    status?: LeagueStatus | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateLeagueInviteSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueInviteFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLeagueInviteSubscription = {
  onUpdateLeagueInvite?:  {
    __typename: "LeagueInvite",
    createdAt: string,
    expires_at?: string | null,
    id: string,
    invite_code: string,
    league_id: string,
    max_uses?: number | null,
    owner: string,
    updatedAt: string,
    uses_count?: number | null,
  } | null,
};

export type OnUpdateLeagueMemberSubscriptionVariables = {
  filter?: ModelSubscriptionLeagueMemberFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLeagueMemberSubscription = {
  onUpdateLeagueMember?:  {
    __typename: "LeagueMember",
    createdAt: string,
    id: string,
    league_id: string,
    owner: string,
    role?: LeagueMemberRole | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateNFLTeamSubscriptionVariables = {
  filter?: ModelSubscriptionNFLTeamFilterInput | null,
};

export type OnUpdateNFLTeamSubscription = {
  onUpdateNFLTeam?:  {
    __typename: "NFLTeam",
    abbreviation: string,
    ai_last_updated: string,
    city: string,
    coaching_changes?: string | null,
    conference: string,
    createdAt: string,
    division: string,
    fantasy_relevant_news?: string | null,
    game_preview?: string | null,
    injury_report?: string | null,
    key_injuries?: string | null,
    name: string,
    season_outlook?: string | null,
    season_year: number,
    strengths?: string | null,
    updatedAt: string,
    weaknesses?: string | null,
    week: number,
    weekly_highlights?: string | null,
  } | null,
};

export type OnUpdatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnUpdatePlayerSubscription = {
  onUpdatePlayer?:  {
    __typename: "Player",
    ai_last_updated: string,
    concerns?: string | null,
    createdAt: string,
    fantasy_points?: number | null,
    fantasy_rank?: number | null,
    floor?: string | null,
    games_played?: number | null,
    id: string,
    injury_history?: string | null,
    injury_update?: string | null,
    key_factors?: string | null,
    name: string,
    news_analysis?: string | null,
    position: string,
    position_stats?: string | null,
    season_year: number,
    sentiment_score?: number | null,
    strengths?: string | null,
    summary?: string | null,
    team: string,
    tier?: string | null,
    top5_likelihood?: number | null,
    trending_factors?: string | null,
    updatedAt: string,
    upside?: string | null,
    week: number,
    weekly_ceiling?: number | null,
    weekly_floor?: number | null,
  } | null,
};

export type OnUpdateTeamRecordSubscriptionVariables = {
  filter?: ModelSubscriptionTeamRecordFilterInput | null,
};

export type OnUpdateTeamRecordSubscription = {
  onUpdateTeamRecord?:  {
    __typename: "TeamRecord",
    createdAt: string,
    espn_id: string,
    last_updated: string,
    losses?: number | null,
    point_differential?: number | null,
    points_against?: number | null,
    points_for?: number | null,
    season_year: number,
    streak?: string | null,
    ties?: number | null,
    updatedAt: string,
    win_percentage?: number | null,
    wins?: number | null,
  } | null,
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?:  {
    __typename: "Todo",
    content?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    avatar_color?: string | null,
    avatar_icon?: string | null,
    avatar_url?: string | null,
    bio?: string | null,
    createdAt: string,
    full_name?: string | null,
    id: string,
    is_public?: boolean | null,
    owner: string,
    updatedAt: string,
    username?: string | null,
    website?: string | null,
  } | null,
};
