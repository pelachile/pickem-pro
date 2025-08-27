/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

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
