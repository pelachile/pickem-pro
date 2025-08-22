export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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

export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getLeague = /* GraphQL */ `
  query GetLeague($id: ID!) {
    getLeague(id: $id) {
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

export const listLeagues = /* GraphQL */ `
  query ListLeagues(
    $filter: ModelLeagueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeagues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
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

export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getPick = /* GraphQL */ `
  query GetPick($id: ID!) {
    getPick(id: $id) {
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

export const listPicks = /* GraphQL */ `
  query ListPicks(
    $filter: ModelPickFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPicks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;