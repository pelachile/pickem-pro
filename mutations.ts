/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

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
