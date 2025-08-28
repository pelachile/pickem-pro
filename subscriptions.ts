/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAIContentCache = /* GraphQL */ `subscription OnCreateAIContentCache(
  $filter: ModelSubscriptionAIContentCacheFilterInput
) {
  onCreateAIContentCache(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAIContentCacheSubscriptionVariables,
  APITypes.OnCreateAIContentCacheSubscription
>;
export const onCreateGameEvent = /* GraphQL */ `subscription OnCreateGameEvent($filter: ModelSubscriptionGameEventFilterInput) {
  onCreateGameEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGameEventSubscriptionVariables,
  APITypes.OnCreateGameEventSubscription
>;
export const onCreateGameStatus = /* GraphQL */ `subscription OnCreateGameStatus(
  $filter: ModelSubscriptionGameStatusFilterInput
) {
  onCreateGameStatus(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGameStatusSubscriptionVariables,
  APITypes.OnCreateGameStatusSubscription
>;
export const onCreateLeague = /* GraphQL */ `subscription OnCreateLeague(
  $filter: ModelSubscriptionLeagueFilterInput
  $owner: String
) {
  onCreateLeague(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLeagueSubscriptionVariables,
  APITypes.OnCreateLeagueSubscription
>;
export const onCreateLeagueInvite = /* GraphQL */ `subscription OnCreateLeagueInvite(
  $filter: ModelSubscriptionLeagueInviteFilterInput
  $owner: String
) {
  onCreateLeagueInvite(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLeagueInviteSubscriptionVariables,
  APITypes.OnCreateLeagueInviteSubscription
>;
export const onCreateLeagueMember = /* GraphQL */ `subscription OnCreateLeagueMember(
  $filter: ModelSubscriptionLeagueMemberFilterInput
  $owner: String
) {
  onCreateLeagueMember(filter: $filter, owner: $owner) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLeagueMemberSubscriptionVariables,
  APITypes.OnCreateLeagueMemberSubscription
>;
export const onCreateNFLTeam = /* GraphQL */ `subscription OnCreateNFLTeam($filter: ModelSubscriptionNFLTeamFilterInput) {
  onCreateNFLTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNFLTeamSubscriptionVariables,
  APITypes.OnCreateNFLTeamSubscription
>;
export const onCreatePlayer = /* GraphQL */ `subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onCreatePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePlayerSubscriptionVariables,
  APITypes.OnCreatePlayerSubscription
>;
export const onCreateTeamRecord = /* GraphQL */ `subscription OnCreateTeamRecord(
  $filter: ModelSubscriptionTeamRecordFilterInput
) {
  onCreateTeamRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTeamRecordSubscriptionVariables,
  APITypes.OnCreateTeamRecordSubscription
>;
export const onCreateTodo = /* GraphQL */ `subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onCreateTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTodoSubscriptionVariables,
  APITypes.OnCreateTodoSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onCreateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteAIContentCache = /* GraphQL */ `subscription OnDeleteAIContentCache(
  $filter: ModelSubscriptionAIContentCacheFilterInput
) {
  onDeleteAIContentCache(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAIContentCacheSubscriptionVariables,
  APITypes.OnDeleteAIContentCacheSubscription
>;
export const onDeleteGameEvent = /* GraphQL */ `subscription OnDeleteGameEvent($filter: ModelSubscriptionGameEventFilterInput) {
  onDeleteGameEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameEventSubscriptionVariables,
  APITypes.OnDeleteGameEventSubscription
>;
export const onDeleteGameStatus = /* GraphQL */ `subscription OnDeleteGameStatus(
  $filter: ModelSubscriptionGameStatusFilterInput
) {
  onDeleteGameStatus(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGameStatusSubscriptionVariables,
  APITypes.OnDeleteGameStatusSubscription
>;
export const onDeleteLeague = /* GraphQL */ `subscription OnDeleteLeague(
  $filter: ModelSubscriptionLeagueFilterInput
  $owner: String
) {
  onDeleteLeague(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLeagueSubscriptionVariables,
  APITypes.OnDeleteLeagueSubscription
>;
export const onDeleteLeagueInvite = /* GraphQL */ `subscription OnDeleteLeagueInvite(
  $filter: ModelSubscriptionLeagueInviteFilterInput
  $owner: String
) {
  onDeleteLeagueInvite(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLeagueInviteSubscriptionVariables,
  APITypes.OnDeleteLeagueInviteSubscription
>;
export const onDeleteLeagueMember = /* GraphQL */ `subscription OnDeleteLeagueMember(
  $filter: ModelSubscriptionLeagueMemberFilterInput
  $owner: String
) {
  onDeleteLeagueMember(filter: $filter, owner: $owner) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLeagueMemberSubscriptionVariables,
  APITypes.OnDeleteLeagueMemberSubscription
>;
export const onDeleteNFLTeam = /* GraphQL */ `subscription OnDeleteNFLTeam($filter: ModelSubscriptionNFLTeamFilterInput) {
  onDeleteNFLTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNFLTeamSubscriptionVariables,
  APITypes.OnDeleteNFLTeamSubscription
>;
export const onDeletePlayer = /* GraphQL */ `subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onDeletePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePlayerSubscriptionVariables,
  APITypes.OnDeletePlayerSubscription
>;
export const onDeleteTeamRecord = /* GraphQL */ `subscription OnDeleteTeamRecord(
  $filter: ModelSubscriptionTeamRecordFilterInput
) {
  onDeleteTeamRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTeamRecordSubscriptionVariables,
  APITypes.OnDeleteTeamRecordSubscription
>;
export const onDeleteTodo = /* GraphQL */ `subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
  onDeleteTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTodoSubscriptionVariables,
  APITypes.OnDeleteTodoSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onDeleteUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateAIContentCache = /* GraphQL */ `subscription OnUpdateAIContentCache(
  $filter: ModelSubscriptionAIContentCacheFilterInput
) {
  onUpdateAIContentCache(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAIContentCacheSubscriptionVariables,
  APITypes.OnUpdateAIContentCacheSubscription
>;
export const onUpdateGameEvent = /* GraphQL */ `subscription OnUpdateGameEvent($filter: ModelSubscriptionGameEventFilterInput) {
  onUpdateGameEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameEventSubscriptionVariables,
  APITypes.OnUpdateGameEventSubscription
>;
export const onUpdateGameStatus = /* GraphQL */ `subscription OnUpdateGameStatus(
  $filter: ModelSubscriptionGameStatusFilterInput
) {
  onUpdateGameStatus(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGameStatusSubscriptionVariables,
  APITypes.OnUpdateGameStatusSubscription
>;
export const onUpdateLeague = /* GraphQL */ `subscription OnUpdateLeague(
  $filter: ModelSubscriptionLeagueFilterInput
  $owner: String
) {
  onUpdateLeague(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLeagueSubscriptionVariables,
  APITypes.OnUpdateLeagueSubscription
>;
export const onUpdateLeagueInvite = /* GraphQL */ `subscription OnUpdateLeagueInvite(
  $filter: ModelSubscriptionLeagueInviteFilterInput
  $owner: String
) {
  onUpdateLeagueInvite(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLeagueInviteSubscriptionVariables,
  APITypes.OnUpdateLeagueInviteSubscription
>;
export const onUpdateLeagueMember = /* GraphQL */ `subscription OnUpdateLeagueMember(
  $filter: ModelSubscriptionLeagueMemberFilterInput
  $owner: String
) {
  onUpdateLeagueMember(filter: $filter, owner: $owner) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLeagueMemberSubscriptionVariables,
  APITypes.OnUpdateLeagueMemberSubscription
>;
export const onUpdateNFLTeam = /* GraphQL */ `subscription OnUpdateNFLTeam($filter: ModelSubscriptionNFLTeamFilterInput) {
  onUpdateNFLTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNFLTeamSubscriptionVariables,
  APITypes.OnUpdateNFLTeamSubscription
>;
export const onUpdatePlayer = /* GraphQL */ `subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onUpdatePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePlayerSubscriptionVariables,
  APITypes.OnUpdatePlayerSubscription
>;
export const onUpdateTeamRecord = /* GraphQL */ `subscription OnUpdateTeamRecord(
  $filter: ModelSubscriptionTeamRecordFilterInput
) {
  onUpdateTeamRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTeamRecordSubscriptionVariables,
  APITypes.OnUpdateTeamRecordSubscription
>;
export const onUpdateTodo = /* GraphQL */ `subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onUpdateTodo(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTodoSubscriptionVariables,
  APITypes.OnUpdateTodoSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onUpdateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
