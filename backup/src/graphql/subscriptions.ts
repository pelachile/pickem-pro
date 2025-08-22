export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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

export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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

export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const onCreateLeague = /* GraphQL */ `
  subscription OnCreateLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onCreateLeague(filter: $filter) {
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

export const onUpdateLeague = /* GraphQL */ `
  subscription OnUpdateLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onUpdateLeague(filter: $filter) {
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

export const onDeleteLeague = /* GraphQL */ `
  subscription OnDeleteLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onDeleteLeague(filter: $filter) {
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

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame($filter: ModelSubscriptionGameFilterInput) {
    onCreateGame(filter: $filter) {
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

export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame($filter: ModelSubscriptionGameFilterInput) {
    onUpdateGame(filter: $filter) {
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

export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame($filter: ModelSubscriptionGameFilterInput) {
    onDeleteGame(filter: $filter) {
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

export const onCreatePick = /* GraphQL */ `
  subscription OnCreatePick($filter: ModelSubscriptionPickFilterInput) {
    onCreatePick(filter: $filter) {
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

export const onUpdatePick = /* GraphQL */ `
  subscription OnUpdatePick($filter: ModelSubscriptionPickFilterInput) {
    onUpdatePick(filter: $filter) {
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

export const onDeletePick = /* GraphQL */ `
  subscription OnDeletePick($filter: ModelSubscriptionPickFilterInput) {
    onDeletePick(filter: $filter) {
      id
      userID
      gameID
      submittedAt
      createdAt
      updatedAt
    }
  }
`;