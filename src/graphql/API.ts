/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

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

export type ModelGameEventEvent_typeInput = {
  eq?: GameEventEvent_type | null,
  ne?: GameEventEvent_type | null,
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

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


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

export type ModelIntKeyConditionInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
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

export type DeleteTeamRecordInput = {
  espn_id: string,
  season_year: number,
};

export type DeleteTodoInput = {
  id: string,
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

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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
