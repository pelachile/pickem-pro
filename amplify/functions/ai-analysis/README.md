# AI Analysis Lambda Function

This Lambda function integrates with AWS Bedrock to provide intelligent NFL team and fantasy player analysis for the Pick'em League application.

## Overview

The AI Analysis Lambda function leverages AWS Bedrock's Claude LLM to generate comprehensive insights for:
- NFL team analysis (season outlook, strengths, weaknesses, trends)
- Fantasy player analysis (matchup analysis, projections, recommendations)
- League-wide insights and trends
- Smart content caching to optimize costs

## Architecture

### Components
- **handler.ts**: Main Lambda handler with scheduled and manual execution capabilities
- **resource.ts**: Amplify function definition with configuration
- **AWS Bedrock Integration**: Claude 3.5 Sonnet model for AI analysis
- **Smart Caching**: TTL-based caching via `AIContentCache` model

### Data Flow
1. **Data Loading**: Loads static team data and player data from JSON files
2. **AI Analysis**: Generates insights using Bedrock Claude model
3. **Database Updates**: Updates `NFLTeam` and `Player` models with AI content
4. **Caching**: Stores results in `AIContentCache` with 7-day TTL
5. **Cleanup**: Automatically removes expired cache entries

## Features

### Team Analysis
- Season outlook and trajectory assessment
- Team strengths and weaknesses identification
- Key injury tracking and impact analysis
- Coaching changes and their effects
- Weekly highlights and game previews
- Fantasy-relevant news and developments
- Playoff odds assessment

### Player Analysis
- Enhanced fantasy projections (floor/ceiling)
- Matchup analysis and recommendations
- Injury impact assessment
- Start/sit recommendations
- Trending factors affecting value
- News analysis and updates
- Position-specific insights

### League-Wide Insights
- Weekly overview and key storylines
- Trending teams (up/down movements)
- Injury watch list
- Key matchups to monitor
- Fantasy trends and pickups
- Playoff picture analysis
- Weekly predictions

### Smart Caching
- 7-day TTL to balance freshness and cost efficiency
- Hit count tracking for usage analytics
- Automatic cleanup of expired entries
- Cache-first approach with AI fallback

## Configuration

### Environment Variables
- `AMPLIFY_DATA_GRAPHQL_ENDPOINT`: GraphQL API endpoint
- `AWS_REGION`: AWS region for Bedrock and other services

### Model Configuration
- **Model**: `anthropic.claude-3-5-sonnet-20241022-v2:0`
- **Max Tokens**: 4000
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Timeout**: 15 minutes
- **Memory**: 1024 MB

### Rate Limiting
- 2-second delay between API calls
- Exponential backoff on retries
- Maximum 3 retry attempts per request

## Usage

### Scheduled Execution
The function runs automatically on a weekly schedule:
```javascript
// In resource.ts (commented out for development)
schedule: 'cron(0 11 ? * SUN *)' // Sundays at 6:00 AM EST
```

### Manual Execution
The function supports manual HTTP triggers for testing and on-demand analysis:

```bash
# Full analysis for current week
GET /ai-analysis

# Specific week analysis
GET /ai-analysis?week=5

# Specific analysis type
GET /ai-analysis?type=teams
GET /ai-analysis?type=players  
GET /ai-analysis?type=insights

# Combined parameters
GET /ai-analysis?week=5&type=teams
```

### Analysis Types
- `full` (default): Complete analysis (teams, players, insights)
- `teams`: Team analysis only
- `players`: Player analysis only
- `insights`: League insights only

## Database Models

### NFLTeam Model Updates
```typescript
{
  abbreviation: string,      // Primary key
  season_year: number,       // Sort key
  season_outlook: string,    // AI-generated season assessment
  strengths: string[],       // Array of team strengths
  weaknesses: string[],      // Array of team weaknesses
  key_injuries: object[],    // Injury reports with impact
  weekly_highlights: string, // Weekly storylines
  game_preview: string,      // Upcoming game analysis
  ai_last_updated: datetime  // Last AI update timestamp
}
```

### Player Model Updates
```typescript
{
  id: string,                    // Player unique identifier
  name: string,                  // Player name
  team: string,                  // Team abbreviation
  position: string,              // Position (QB, RB, WR, TE)
  news_analysis: string,         // AI-generated news analysis
  injury_update: string,         // Injury status and impact
  trending_factors: string[],    // Factors affecting value
  sentiment_score: number,       // -1.0 to 1.0 sentiment
  weekly_floor: number,          // Updated weekly floor projection
  weekly_ceiling: number,        // Updated weekly ceiling projection
  ai_last_updated: datetime      // Last AI update timestamp
}
```

### AIContentCache Model
```typescript
{
  content_type: string,    // "team_analysis", "player_analysis", "league_insights"
  content_key: string,     // Unique identifier for content
  content: object,         // Cached AI-generated content
  expires_at: datetime,    // TTL for cache invalidation (7 days)
  hit_count: number,       // Usage tracking
  last_accessed: datetime  // Last access timestamp
}
```

## Error Handling

### Bedrock API Errors
- Automatic retry with exponential backoff
- Graceful degradation with fallback content
- Detailed error logging for debugging

### Data Loading Errors
- Continues processing with available data
- Logs errors for individual file/record failures
- Maintains partial functionality

### Database Errors
- Separate error handling for each model
- Continues processing other records on individual failures
- Comprehensive error logging

## Cost Optimization

### Caching Strategy
- 7-day TTL balances freshness and cost
- Hit count tracking for usage optimization
- Automatic cleanup of expired entries

### Rate Limiting
- 2-second delays prevent API throttling
- Batch processing reduces total execution time
- Smart retry logic minimizes failed requests

### Selective Processing
- Manual trigger supports partial analysis
- Skip unchanged data when possible
- Process only active teams/players

## Monitoring and Logging

### CloudWatch Logs
- Detailed execution logging
- Performance metrics (execution time, processed items)
- Error tracking with stack traces
- Cache hit/miss statistics

### Metrics to Monitor
- Execution duration
- Bedrock API call counts
- Cache hit rates
- Error rates
- Database update success rates

## Development and Testing

### Local Development
```bash
# Install dependencies
npm install @aws-sdk/client-bedrock-runtime

# The function is automatically deployed when running:
npx ampx sandbox
```

### Manual Testing
```bash
# Test with curl (replace URL with your deployed endpoint)
curl "https://your-api-gateway-url/ai-analysis?week=5&type=teams"
```

### Sample Response
```json
{
  "message": "AI Analysis completed successfully",
  "results": {
    "week": 5,
    "season": 2025,
    "analysis_type": "teams",
    "teams_processed": 32,
    "players_processed": 0,
    "execution_time": 45000
  },
  "timestamp": "2025-08-28T05:00:00.000Z"
}
```

## IAM Permissions Required

The Lambda function requires the following permissions:
- Bedrock model invocation (`bedrock:InvokeModel`)
- DynamoDB read/write for all data models
- CloudWatch Logs write access
- VPC access (if applicable)

## Production Deployment

### Environment Setup
1. Ensure Bedrock model access in target region
2. Configure appropriate IAM roles and policies  
3. Set up CloudWatch alarms for monitoring
4. Enable scheduled execution in resource.ts

### Performance Tuning
- Adjust memory allocation based on usage patterns
- Fine-tune rate limiting delays for cost/speed balance
- Monitor and adjust cache TTL based on usage analytics

## Future Enhancements

### Data Sources
- Direct S3 integration for player data files
- Real-time ESPN API integration
- Historical performance tracking

### Analysis Improvements  
- Multi-model ensemble for improved accuracy
- Personalized analysis based on user preferences
- Predictive modeling for injury risk

### Performance Optimizations
- Parallel processing for independent analyses
- Incremental updates for unchanged data
- Advanced caching strategies

## Troubleshooting

### Common Issues
1. **Bedrock Access Denied**: Verify IAM permissions and model availability in region
2. **Timeout Errors**: Check memory allocation and processing efficiency
3. **Database Errors**: Verify schema compatibility and connection settings
4. **Cache Issues**: Monitor TTL settings and cleanup processes

### Debug Commands
```bash
# View recent logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/ai-analysis"

# Test manual trigger
aws lambda invoke --function-name ai-analysis --payload '{}' response.json
```