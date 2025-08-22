# NFL Data Lambda Functions

This directory contains AWS Lambda functions for fetching and managing NFL data from the ESPN API for the Pick'em app.

## Functions Overview

### 1. `getGameSchedule`
Fetches NFL schedule data for specific weeks from the ESPN API.

**Features:**
- Fetches games for any week/season
- Automatically determines current NFL week
- Stores data in S3 with intelligent caching
- Data diffing to avoid unnecessary updates
- Supports preseason, regular season, and postseason

**Usage:**
```typescript
// Get current week's schedule
GET /getGameSchedule

// Get specific week
GET /getGameSchedule?week=3&seasonType=preseason&year=2025

// Force refresh data
POST /getGameSchedule
{
  "forceRefresh": true,
  "week": 3,
  "seasonType": "preseason",
  "year": 2025
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": {
      "week": 3,
      "season_type": "preseason",
      "year": 2025,
      "total_games": 15,
      "last_updated": "2025-08-20T...",
      "current_week_info": { ... }
    },
    "games": [
      {
        "id": "...",
        "espn_id": "401547439",
        "week": 3,
        "season": 2025,
        "season_type": "preseason",
        "date": "2025-08-24T...",
        "status": "Scheduled",
        "home_team": { ... },
        "away_team": { ... },
        ...
      }
    ]
  }
}
```

### 2. `getTeamInfo`
Fetches NFL team metadata including logos, colors, records, and venue information.

**Features:**
- Complete team roster with all 32 NFL teams
- Team logos, colors, and branding
- Conference/division organization
- Current season records
- Venue information
- Organized by conference and division

**Usage:**
```typescript
// Get all teams
GET /getTeamInfo

// Get specific team details
GET /getTeamInfo?teamId=17

// Force refresh
POST /getTeamInfo
{
  "forceRefresh": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": {
      "total_teams": 32,
      "last_updated": "2025-08-20T...",
      "by_conference": {
        "AFC": 16,
        "NFC": 16
      }
    },
    "teams": {
      "all": [...],
      "by_conference": {
        "AFC": [...],
        "NFC": [...]
      }
    }
  }
}
```

### 3. `getLiveScores`
Fetches real-time NFL game scores and status updates.

**Features:**
- Live game scores and clock information
- Quarter-by-quarter line scores
- Game status (scheduled, in-progress, final)
- Player statistics and leaders
- Individual game updates
- Filter for active games only

**Usage:**
```typescript
// Get all scores for current week
GET /getLiveScores

// Get active games only
GET /getLiveScores?activeOnly=true

// Get specific games
POST /getLiveScores
{
  "gameIds": ["401547439", "401547440"]
}

// Get specific week scores
GET /getLiveScores?week=3&seasonType=preseason&year=2025
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": {
      "week": 3,
      "season_type": "preseason", 
      "year": 2025,
      "total_games": 15,
      "active_games": 2,
      "completed_games": 8,
      "last_updated": "2025-08-20T...",
      "active_only": false
    },
    "scores": [
      {
        "id": "...",
        "espn_id": "401547439",
        "status": {
          "type": "Final",
          "state": "post",
          "completed": true,
          "detail": "Final",
          "short_detail": "Final"
        },
        "clock": {
          "display_clock": "0:00",
          "period": 4,
          "time_remaining": 0
        },
        "home_team": {
          "id": "9",
          "abbreviation": "CAR",
          "display_name": "Carolina Panthers",
          "score": 21,
          "winner": true,
          "line_scores": [7, 7, 0, 7]
        },
        "away_team": {
          "id": "23",
          "abbreviation": "PIT", 
          "display_name": "Pittsburgh Steelers",
          "score": 17,
          "winner": false,
          "line_scores": [3, 7, 7, 0]
        },
        "game_stats": {
          "leaders": [...]
        },
        "last_updated": "2025-08-20T..."
      }
    ]
  }
}
```

### 4. `scheduleDataUpdate`
Scheduled function that automatically updates all NFL data every Tuesday.

**Features:**
- Runs every Tuesday at 2:00 PM UTC (9:00 AM EST)
- Updates team information, schedules, and live scores
- Coordinates calls to other Lambda functions
- Comprehensive error handling and logging
- Automatic current/next week detection

**Schedule:** `cron(0 14 * * TUE *)` - Every Tuesday at 2:00 PM UTC

**Process:**
1. Update team information (foundation data)
2. Update current week's schedule
3. Update next week's schedule (if Monday or later)
4. Update live scores for current week

## Data Storage

All functions store their results in S3 for efficient frontend consumption:

```
S3 Bucket: pickem-app-schedule-data/
├── teams/
│   └── teams.json                    # All team data
├── schedule/
│   └── {year}/
│       └── {seasonType}/
│           └── week-{week}.json      # Schedule data
├── live-scores/
│   ├── {year}/
│   │   └── {seasonType}/
│   │       └── week-{week}.json      # Weekly live scores
│   └── games/
│       └── {gameId}.json             # Individual game scores
```

## Environment Variables

All functions use these environment variables:

- `ESPN_API_BASE_URL`: ESPN API base URL (default: https://site.api.espn.com/apis/site/v2/sports/football/nfl)
- `S3_BUCKET_NAME`: S3 bucket for data storage (default: pickem-app-schedule-data)
- `LOG_LEVEL`: Logging level (default: info)
- `AWS_REGION`: AWS region (default: us-west-2)

## Error Handling

All functions implement comprehensive error handling:

- **Network errors**: Retry logic with exponential backoff
- **API rate limits**: Respectful request timing
- **Data validation**: Input and output validation
- **Fallback mechanisms**: Graceful degradation when data is unavailable
- **Structured logging**: CloudWatch-friendly log formatting

## Caching Strategy

- **Teams**: 24-hour cache (infrequent changes)
- **Schedule**: 5-minute cache (moderate changes)
- **Live Scores**: 30-second cache (frequent updates during games)
- **Individual Games**: 15-second cache (real-time updates)

## Development

### Local Testing

```bash
# Test individual functions
cd amplify/functions/getGameSchedule
npm test

# Test with specific parameters
node -e "
const { handler } = require('./handler.js');
handler({
  queryStringParameters: { week: '3', seasonType: 'preseason' },
  body: null
}, { awsRequestId: 'test-123' }).then(console.log);
"
```

### Deployment

Functions are automatically deployed with Amplify Gen2:

```bash
npx ampx sandbox  # Development environment
npx ampx deploy   # Production deployment
```

## Integration with Frontend

The frontend can consume this data in several ways:

1. **Direct API calls** to Lambda functions via API Gateway
2. **S3 static hosting** of JSON files for cached data  
3. **GraphQL subscriptions** for real-time updates
4. **Scheduled updates** ensure data freshness

Example frontend integration:

```typescript
// Fetch current week's games
const response = await fetch('/api/getGameSchedule');
const data = await response.json();

// Fetch live scores for active games
const scores = await fetch('/api/getLiveScores?activeOnly=true');
const liveData = await scores.json();
```

## Monitoring

Monitor function performance via CloudWatch:

- **Invocation metrics**: Success/error rates
- **Duration metrics**: Function execution times  
- **Custom metrics**: Data freshness, API response times
- **Logs**: Structured logging for debugging

## Future Enhancements

Potential improvements:

- **WebSocket integration** for real-time score pushes
- **Machine learning** for game prediction insights
- **Advanced statistics** beyond basic scores
- **Historical data** analysis and trends
- **Push notifications** for game updates