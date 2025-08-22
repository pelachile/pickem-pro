export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      firstName
      lastName
      preferences {
        theme
        notifications
        timezone
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      firstName
      lastName
      preferences {
        theme
        notifications
        timezone
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const createLeague = /* GraphQL */ `
  mutation CreateLeague(
    $input: CreateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    createLeague(input: $input, condition: $condition) {
      id
      name
      description
      commissioner
      isPublic
      maxMembers
      entryFee
      payouts
      season
      week
      createdAt
      updatedAt
    }
  }
`;

export const updateLeague = /* GraphQL */ `
  mutation UpdateLeague(
    $input: UpdateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    updateLeague(input: $input, condition: $condition) {
      id
      name
      description
      commissioner
      isPublic
      maxMembers
      entryFee
      payouts
      season
      week
      createdAt
      updatedAt
    }
  }
`;

export const deleteLeague = /* GraphQL */ `
  mutation DeleteLeague(
    $input: DeleteLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    deleteLeague(input: $input, condition: $condition) {
      id
      name
      description
      commissioner
      isPublic
      maxMembers
      entryFee
      payouts
      season
      week
      createdAt
      updatedAt
    }
  }
`;

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
      id
      leagueID
      espnGameId
      week
      season
      homeTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      awayTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      gameTime
      homeScore
      awayScore
      status
      createdAt
      updatedAt
    }
  }
`;

export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
      id
      leagueID
      espnGameId
      week
      season
      homeTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      awayTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      gameTime
      homeScore
      awayScore
      status
      createdAt
      updatedAt
    }
  }
`;

export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
      id
      leagueID
      espnGameId
      week
      season
      createdAt
      updatedAt
    }
  }
`;

export const createPick = /* GraphQL */ `
  mutation CreatePick(
    $input: CreatePickInput!
    $condition: ModelPickConditionInput
  ) {
    createPick(input: $input, condition: $condition) {
      id
      userID
      gameID
      selectedTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      confidence
      isCorrect
      points
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const updatePick = /* GraphQL */ `
  mutation UpdatePick(
    $input: UpdatePickInput!
    $condition: ModelPickConditionInput
  ) {
    updatePick(input: $input, condition: $condition) {
      id
      userID
      gameID
      selectedTeam {
        id
        name
        abbreviation
        logo
        city
        conference
        division
      }
      confidence
      isCorrect
      points
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const deletePick = /* GraphQL */ `
  mutation DeletePick(
    $input: DeletePickInput!
    $condition: ModelPickConditionInput
  ) {
    deletePick(input: $input, condition: $condition) {
      id
      userID
      gameID
      submittedAt
      createdAt
      updatedAt
    }
  }
`;