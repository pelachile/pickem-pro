/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAIContentCache = /* GraphQL */ `mutation CreateAIContentCache(
  $condition: ModelAIContentCacheConditionInput
  $input: CreateAIContentCacheInput!
) {
  createAIContentCache(condition: $condition, input: $input) {
    content
    content_key
    content_type
    createdAt
    created_at
    expires_at
    hit_count
    last_accessed
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAIContentCacheMutationVariables,
  APITypes.CreateAIContentCacheMutation
>;
export const createGameEvent = /* GraphQL */ `mutation CreateGameEvent(
  $condition: ModelGameEventConditionInput
  $input: CreateGameEventInput!
) {
  createGameEvent(condition: $condition, input: $input) {
    createdAt
    description
    event_id
    event_type
    game_espn_id
    id
    quarter
    score_change
    time_remaining
    timestamp
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGameEventMutationVariables,
  APITypes.CreateGameEventMutation
>;
export const createGameStatus = /* GraphQL */ `mutation CreateGameStatus(
  $condition: ModelGameStatusConditionInput
  $input: CreateGameStatusInput!
) {
  createGameStatus(condition: $condition, input: $input) {
    away_score
    createdAt
    espn_id
    game_status_detail
    has_finished
    has_started
    home_score
    last_updated
    quarter
    season_year
    status
    time_remaining
    updatedAt
    week
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGameStatusMutationVariables,
  APITypes.CreateGameStatusMutation
>;
export const createLeague = /* GraphQL */ `mutation CreateLeague(
  $condition: ModelLeagueConditionInput
  $input: CreateLeagueInput!
) {
  createLeague(condition: $condition, input: $input) {
    createdAt
    description
    entry_fee
    id
    invite_code
    is_private
    max_members
    name
    owner
    password_hash
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLeagueMutationVariables,
  APITypes.CreateLeagueMutation
>;
export const createLeagueInvite = /* GraphQL */ `mutation CreateLeagueInvite(
  $condition: ModelLeagueInviteConditionInput
  $input: CreateLeagueInviteInput!
) {
  createLeagueInvite(condition: $condition, input: $input) {
    createdAt
    expires_at
    id
    invite_code
    league_id
    max_uses
    owner
    updatedAt
    uses_count
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLeagueInviteMutationVariables,
  APITypes.CreateLeagueInviteMutation
>;
export const createLeagueMember = /* GraphQL */ `mutation CreateLeagueMember(
  $condition: ModelLeagueMemberConditionInput
  $input: CreateLeagueMemberInput!
) {
  createLeagueMember(condition: $condition, input: $input) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLeagueMemberMutationVariables,
  APITypes.CreateLeagueMemberMutation
>;
export const createNFLTeam = /* GraphQL */ `mutation CreateNFLTeam(
  $condition: ModelNFLTeamConditionInput
  $input: CreateNFLTeamInput!
) {
  createNFLTeam(condition: $condition, input: $input) {
    abbreviation
    ai_last_updated
    city
    coaching_changes
    conference
    createdAt
    division
    fantasy_relevant_news
    game_preview
    injury_report
    key_injuries
    name
    season_outlook
    season_year
    strengths
    updatedAt
    weaknesses
    week
    weekly_highlights
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNFLTeamMutationVariables,
  APITypes.CreateNFLTeamMutation
>;
export const createPlayer = /* GraphQL */ `mutation CreatePlayer(
  $condition: ModelPlayerConditionInput
  $input: CreatePlayerInput!
) {
  createPlayer(condition: $condition, input: $input) {
    ai_last_updated
    concerns
    createdAt
    fantasy_points
    fantasy_rank
    floor
    games_played
    id
    injury_history
    injury_update
    key_factors
    name
    news_analysis
    position
    position_stats
    season_year
    sentiment_score
    strengths
    summary
    team
    tier
    top5_likelihood
    trending_factors
    updatedAt
    upside
    week
    weekly_ceiling
    weekly_floor
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePlayerMutationVariables,
  APITypes.CreatePlayerMutation
>;
export const createTeamRecord = /* GraphQL */ `mutation CreateTeamRecord(
  $condition: ModelTeamRecordConditionInput
  $input: CreateTeamRecordInput!
) {
  createTeamRecord(condition: $condition, input: $input) {
    createdAt
    espn_id
    last_updated
    losses
    point_differential
    points_against
    points_for
    season_year
    streak
    ties
    updatedAt
    win_percentage
    wins
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTeamRecordMutationVariables,
  APITypes.CreateTeamRecordMutation
>;
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $condition: ModelTodoConditionInput
  $input: CreateTodoInput!
) {
  createTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
    avatar_color
    avatar_icon
    avatar_url
    bio
    createdAt
    full_name
    id
    is_public
    owner
    updatedAt
    username
    website
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteAIContentCache = /* GraphQL */ `mutation DeleteAIContentCache(
  $condition: ModelAIContentCacheConditionInput
  $input: DeleteAIContentCacheInput!
) {
  deleteAIContentCache(condition: $condition, input: $input) {
    content
    content_key
    content_type
    createdAt
    created_at
    expires_at
    hit_count
    last_accessed
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAIContentCacheMutationVariables,
  APITypes.DeleteAIContentCacheMutation
>;
export const deleteGameEvent = /* GraphQL */ `mutation DeleteGameEvent(
  $condition: ModelGameEventConditionInput
  $input: DeleteGameEventInput!
) {
  deleteGameEvent(condition: $condition, input: $input) {
    createdAt
    description
    event_id
    event_type
    game_espn_id
    id
    quarter
    score_change
    time_remaining
    timestamp
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGameEventMutationVariables,
  APITypes.DeleteGameEventMutation
>;
export const deleteGameStatus = /* GraphQL */ `mutation DeleteGameStatus(
  $condition: ModelGameStatusConditionInput
  $input: DeleteGameStatusInput!
) {
  deleteGameStatus(condition: $condition, input: $input) {
    away_score
    createdAt
    espn_id
    game_status_detail
    has_finished
    has_started
    home_score
    last_updated
    quarter
    season_year
    status
    time_remaining
    updatedAt
    week
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGameStatusMutationVariables,
  APITypes.DeleteGameStatusMutation
>;
export const deleteLeague = /* GraphQL */ `mutation DeleteLeague(
  $condition: ModelLeagueConditionInput
  $input: DeleteLeagueInput!
) {
  deleteLeague(condition: $condition, input: $input) {
    createdAt
    description
    entry_fee
    id
    invite_code
    is_private
    max_members
    name
    owner
    password_hash
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLeagueMutationVariables,
  APITypes.DeleteLeagueMutation
>;
export const deleteLeagueInvite = /* GraphQL */ `mutation DeleteLeagueInvite(
  $condition: ModelLeagueInviteConditionInput
  $input: DeleteLeagueInviteInput!
) {
  deleteLeagueInvite(condition: $condition, input: $input) {
    createdAt
    expires_at
    id
    invite_code
    league_id
    max_uses
    owner
    updatedAt
    uses_count
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLeagueInviteMutationVariables,
  APITypes.DeleteLeagueInviteMutation
>;
export const deleteLeagueMember = /* GraphQL */ `mutation DeleteLeagueMember(
  $condition: ModelLeagueMemberConditionInput
  $input: DeleteLeagueMemberInput!
) {
  deleteLeagueMember(condition: $condition, input: $input) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLeagueMemberMutationVariables,
  APITypes.DeleteLeagueMemberMutation
>;
export const deleteNFLTeam = /* GraphQL */ `mutation DeleteNFLTeam(
  $condition: ModelNFLTeamConditionInput
  $input: DeleteNFLTeamInput!
) {
  deleteNFLTeam(condition: $condition, input: $input) {
    abbreviation
    ai_last_updated
    city
    coaching_changes
    conference
    createdAt
    division
    fantasy_relevant_news
    game_preview
    injury_report
    key_injuries
    name
    season_outlook
    season_year
    strengths
    updatedAt
    weaknesses
    week
    weekly_highlights
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNFLTeamMutationVariables,
  APITypes.DeleteNFLTeamMutation
>;
export const deletePlayer = /* GraphQL */ `mutation DeletePlayer(
  $condition: ModelPlayerConditionInput
  $input: DeletePlayerInput!
) {
  deletePlayer(condition: $condition, input: $input) {
    ai_last_updated
    concerns
    createdAt
    fantasy_points
    fantasy_rank
    floor
    games_played
    id
    injury_history
    injury_update
    key_factors
    name
    news_analysis
    position
    position_stats
    season_year
    sentiment_score
    strengths
    summary
    team
    tier
    top5_likelihood
    trending_factors
    updatedAt
    upside
    week
    weekly_ceiling
    weekly_floor
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePlayerMutationVariables,
  APITypes.DeletePlayerMutation
>;
export const deleteTeamRecord = /* GraphQL */ `mutation DeleteTeamRecord(
  $condition: ModelTeamRecordConditionInput
  $input: DeleteTeamRecordInput!
) {
  deleteTeamRecord(condition: $condition, input: $input) {
    createdAt
    espn_id
    last_updated
    losses
    point_differential
    points_against
    points_for
    season_year
    streak
    ties
    updatedAt
    win_percentage
    wins
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTeamRecordMutationVariables,
  APITypes.DeleteTeamRecordMutation
>;
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $condition: ModelTodoConditionInput
  $input: DeleteTodoInput!
) {
  deleteTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
    avatar_color
    avatar_icon
    avatar_url
    bio
    createdAt
    full_name
    id
    is_public
    owner
    updatedAt
    username
    website
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateAIContentCache = /* GraphQL */ `mutation UpdateAIContentCache(
  $condition: ModelAIContentCacheConditionInput
  $input: UpdateAIContentCacheInput!
) {
  updateAIContentCache(condition: $condition, input: $input) {
    content
    content_key
    content_type
    createdAt
    created_at
    expires_at
    hit_count
    last_accessed
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAIContentCacheMutationVariables,
  APITypes.UpdateAIContentCacheMutation
>;
export const updateGameEvent = /* GraphQL */ `mutation UpdateGameEvent(
  $condition: ModelGameEventConditionInput
  $input: UpdateGameEventInput!
) {
  updateGameEvent(condition: $condition, input: $input) {
    createdAt
    description
    event_id
    event_type
    game_espn_id
    id
    quarter
    score_change
    time_remaining
    timestamp
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGameEventMutationVariables,
  APITypes.UpdateGameEventMutation
>;
export const updateGameStatus = /* GraphQL */ `mutation UpdateGameStatus(
  $condition: ModelGameStatusConditionInput
  $input: UpdateGameStatusInput!
) {
  updateGameStatus(condition: $condition, input: $input) {
    away_score
    createdAt
    espn_id
    game_status_detail
    has_finished
    has_started
    home_score
    last_updated
    quarter
    season_year
    status
    time_remaining
    updatedAt
    week
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGameStatusMutationVariables,
  APITypes.UpdateGameStatusMutation
>;
export const updateLeague = /* GraphQL */ `mutation UpdateLeague(
  $condition: ModelLeagueConditionInput
  $input: UpdateLeagueInput!
) {
  updateLeague(condition: $condition, input: $input) {
    createdAt
    description
    entry_fee
    id
    invite_code
    is_private
    max_members
    name
    owner
    password_hash
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLeagueMutationVariables,
  APITypes.UpdateLeagueMutation
>;
export const updateLeagueInvite = /* GraphQL */ `mutation UpdateLeagueInvite(
  $condition: ModelLeagueInviteConditionInput
  $input: UpdateLeagueInviteInput!
) {
  updateLeagueInvite(condition: $condition, input: $input) {
    createdAt
    expires_at
    id
    invite_code
    league_id
    max_uses
    owner
    updatedAt
    uses_count
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLeagueInviteMutationVariables,
  APITypes.UpdateLeagueInviteMutation
>;
export const updateLeagueMember = /* GraphQL */ `mutation UpdateLeagueMember(
  $condition: ModelLeagueMemberConditionInput
  $input: UpdateLeagueMemberInput!
) {
  updateLeagueMember(condition: $condition, input: $input) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLeagueMemberMutationVariables,
  APITypes.UpdateLeagueMemberMutation
>;
export const updateNFLTeam = /* GraphQL */ `mutation UpdateNFLTeam(
  $condition: ModelNFLTeamConditionInput
  $input: UpdateNFLTeamInput!
) {
  updateNFLTeam(condition: $condition, input: $input) {
    abbreviation
    ai_last_updated
    city
    coaching_changes
    conference
    createdAt
    division
    fantasy_relevant_news
    game_preview
    injury_report
    key_injuries
    name
    season_outlook
    season_year
    strengths
    updatedAt
    weaknesses
    week
    weekly_highlights
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNFLTeamMutationVariables,
  APITypes.UpdateNFLTeamMutation
>;
export const updatePlayer = /* GraphQL */ `mutation UpdatePlayer(
  $condition: ModelPlayerConditionInput
  $input: UpdatePlayerInput!
) {
  updatePlayer(condition: $condition, input: $input) {
    ai_last_updated
    concerns
    createdAt
    fantasy_points
    fantasy_rank
    floor
    games_played
    id
    injury_history
    injury_update
    key_factors
    name
    news_analysis
    position
    position_stats
    season_year
    sentiment_score
    strengths
    summary
    team
    tier
    top5_likelihood
    trending_factors
    updatedAt
    upside
    week
    weekly_ceiling
    weekly_floor
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePlayerMutationVariables,
  APITypes.UpdatePlayerMutation
>;
export const updateTeamRecord = /* GraphQL */ `mutation UpdateTeamRecord(
  $condition: ModelTeamRecordConditionInput
  $input: UpdateTeamRecordInput!
) {
  updateTeamRecord(condition: $condition, input: $input) {
    createdAt
    espn_id
    last_updated
    losses
    point_differential
    points_against
    points_for
    season_year
    streak
    ties
    updatedAt
    win_percentage
    wins
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTeamRecordMutationVariables,
  APITypes.UpdateTeamRecordMutation
>;
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $condition: ModelTodoConditionInput
  $input: UpdateTodoInput!
) {
  updateTodo(condition: $condition, input: $input) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
    avatar_color
    avatar_icon
    avatar_url
    bio
    createdAt
    full_name
    id
    is_public
    owner
    updatedAt
    username
    website
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
