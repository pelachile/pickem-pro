# NFL Pick'em Edge Functions

This directory contains Supabase Edge Functions for the NFL Pick'em application.

## Functions Overview

### 1. create-league
**Purpose**: Create new Pick'em leagues with authentication and validation
**Authentication**: Required - Bearer token
**Endpoint**: `/functions/v1/create-league`

**Request Format**:
```typescript
{
  name: string;           // Required, 1-100 characters
  description?: string;   // Optional, max 500 characters
  entryFee: number;      // Required, >= 0, max 2 decimal places
  maxMembers: number;    // Required, 2-50
  isPrivate: boolean;    // Required
  password?: string;     // Required if isPrivate=true, min 4 chars
}
```

**Response Format**:
```typescript
{
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string;
    entryFee: number;
    maxMembers: number;
    isPrivate: boolean;
    inviteCode: string;    // Auto-generated 8-char code
    status: string;
    createdAt: string;
  };
  error?: string;
}
```

**Usage**:
```bash
# Create public league
curl -X POST "http://127.0.0.1:54321/functions/v1/create-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Friends League",
    "description": "Weekly picks with friends",
    "entryFee": 10.00,
    "maxMembers": 12,
    "isPrivate": false
  }'

# Create private league
curl -X POST "http://127.0.0.1:54321/functions/v1/create-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Private League",
    "entryFee": 25.00,
    "maxMembers": 8,
    "isPrivate": true,
    "password": "secret123"
  }'
```

### 2. join-league
**Purpose**: Join an existing league using an invite code
**Authentication**: Required - Bearer token
**Endpoint**: `/functions/v1/join-league`

**Usage**:
```bash
# Join public league
curl -X POST "http://127.0.0.1:54321/functions/v1/join-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inviteCode": "ABC12345"}'

# Join private league
curl -X POST "http://127.0.0.1:54321/functions/v1/join-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inviteCode": "XYZ98765", "password": "secret123"}'
```

### 3. get-user-leagues
**Purpose**: Retrieve all leagues that the authenticated user belongs to
**Authentication**: Required - Bearer token
**Endpoint**: `/functions/v1/get-user-leagues`

**Usage**:
```bash
curl -X GET "http://127.0.0.1:54321/functions/v1/get-user-leagues" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response**: Returns array of leagues with member count, user role, and invite codes (for admins)

### 4. sync-nfl-data
**Purpose**: Sync NFL teams and game data from ESPN API to the database
**Schedule**: Every 6 hours during season, daily off-season
**Endpoint**: `/functions/v1/sync-nfl-data`

**Usage**:
```bash
# Sync all data
curl -X POST "http://127.0.0.1:54321/functions/v1/sync-nfl-data" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"syncType": "all"}'

# Sync only teams
curl -X POST "http://127.0.0.1:54321/functions/v1/sync-nfl-data" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"syncType": "teams"}'

# Sync specific week
curl -X POST "http://127.0.0.1:54321/functions/v1/sync-nfl-data" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"syncType": "games", "week": 1, "seasonYear": 2025}'
```

### 5. generate-cache
**Purpose**: Generate cached JSON files for frontend consumption
**Schedule**: Every 15 minutes during games, hourly otherwise
**Endpoint**: `/functions/v1/generate-cache`

**Usage**:
```bash
curl -X POST "http://127.0.0.1:54321/functions/v1/generate-cache" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"trigger": "manual"}'
```

### 6. process-game-results
**Purpose**: Process completed games and update pick results
**Trigger**: When games change status to 'final'
**Endpoint**: `/functions/v1/process-game-results`

**Usage**:
```bash
# Process all completed games
curl -X POST "http://127.0.0.1:54321/functions/v1/process-game-results" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"

# Process specific game
curl -X POST "http://127.0.0.1:54321/functions/v1/process-game-results" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"gameId": "game-uuid-here"}'
```

## Local Development

### Prerequisites
- Supabase CLI installed
- Docker running
- Local Supabase project initialized

### Setup
1. Start Supabase locally:
   ```bash
   supabase start
   ```

2. Create storage bucket for cache:
   ```bash
   # In Supabase Studio (http://127.0.0.1:54323)
   # Go to Storage > Create bucket named "cache"
   # Make it public for read access
   ```

3. Deploy functions locally:
   ```bash
   supabase functions deploy create-league
   supabase functions deploy join-league
   supabase functions deploy get-user-leagues
   supabase functions deploy sync-nfl-data
   supabase functions deploy generate-cache
   supabase functions deploy process-game-results
   ```

### Testing Functions

1. **Test create-league**:
   ```bash
   # Test with Supabase CLI (requires user JWT token)
   supabase functions invoke create-league --method POST \
     --headers='{"Authorization":"Bearer YOUR_USER_JWT"}' \
     --body='{
       "name": "Test League",
       "description": "Testing league creation",
       "entryFee": 5.00,
       "maxMembers": 10,
       "isPrivate": false
     }'
   ```

2. **Test join-league**:
   ```bash
   supabase functions invoke join-league --method POST \
     --headers='{"Authorization":"Bearer YOUR_USER_JWT"}' \
     --body='{"inviteCode": "ABC12345"}'
   ```

3. **Test get-user-leagues**:
   ```bash
   supabase functions invoke get-user-leagues --method GET \
     --headers='{"Authorization":"Bearer YOUR_USER_JWT"}'
   ```

4. **Test sync-nfl-data**:
   ```bash
   supabase functions invoke sync-nfl-data --method POST \
     --body '{"syncType": "teams"}'
   ```

5. **Test generate-cache**:
   ```bash
   supabase functions invoke generate-cache --method POST \
     --body '{"trigger": "test"}'
   ```

6. **Test process-game-results**:
   ```bash
   supabase functions invoke process-game-results --method POST
   ```

### Environment Variables
All functions use these environment variables (automatically available in local development):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Production Deployment

1. Link to your production project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

2. Deploy functions:
   ```bash
   supabase functions deploy
   ```

3. Set up cron jobs in your production environment for:
   - `sync-nfl-data`: Every 6 hours
   - `generate-cache`: Every 15-60 minutes
   - `process-game-results`: Triggered by game completions

## Monitoring

- Check function logs in Supabase Studio
- Monitor storage usage for cache files
- Set up alerts for function failures
- Track API rate limits from ESPN

## Troubleshooting

### Common Issues

1. **Storage bucket not found**:
   - Create "cache" bucket in Supabase Storage
   - Set appropriate permissions (public read)

2. **ESPN API rate limits**:
   - Functions include retry logic
   - Consider adding delays between requests

3. **Database connection issues**:
   - Check RLS policies are correct
   - Verify service role key has proper permissions

4. **Cache not updating**:
   - Check storage permissions
   - Verify generate-cache function is being triggered

### Debug Mode
Add `console.log` statements and check function logs in Supabase Studio for debugging.