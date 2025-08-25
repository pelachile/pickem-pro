# Create League Edge Function

A robust Supabase Edge Function for creating NFL Pick'em leagues with comprehensive validation, security, and error handling.

## Overview

This function handles the complete lifecycle of league creation including:

- **Authentication**: Validates user JWT tokens
- **Input Validation**: Comprehensive type and content validation
- **Security**: Secure password hashing with salt for private leagues
- **Database Operations**: Atomic league and membership creation with cleanup
- **Error Handling**: Detailed error responses with appropriate HTTP status codes
- **CORS Support**: Proper cross-origin request handling

## API Specification

### Endpoint
```
POST /functions/v1/create-league
```

### Authentication
**Required**: Bearer token in `Authorization` header

### Request Body
```typescript
{
  name: string;           // Required, 1-100 characters
  description?: string;   // Optional, max 500 characters  
  entryFee: number;      // Required, >= 0, max 2 decimal places
  maxMembers: number;    // Required, integer 2-50
  isPrivate: boolean;    // Required
  password?: string;     // Required if isPrivate=true, min 4 chars
}
```

### Response Format
```typescript
{
  success: boolean;
  data?: {
    id: string;          // UUID of created league
    name: string;        // League name
    description?: string; // League description (if provided)
    entryFee: number;    // Entry fee amount
    maxMembers: number;  // Maximum allowed members
    isPrivate: boolean;  // Whether league is private
    inviteCode: string;  // 8-character invite code (auto-generated)
    status: string;      // League status (always 'active' on creation)
    createdAt: string;   // ISO timestamp of creation
  };
  error?: string;        // Error message if success=false
  validationErrors?: {   // Detailed validation errors (if applicable)
    field: string;
    message: string;
    code: string;
  }[];
}
```

## Usage Examples

### Create Public League
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/create-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Friends Weekly Picks",
    "description": "Weekly NFL picks with college friends",
    "entryFee": 10.00,
    "maxMembers": 12,
    "isPrivate": false
  }'
```

### Create Private League
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/create-league" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Family League",
    "description": "Annual family competition",
    "entryFee": 25.00,
    "maxMembers": 8,
    "isPrivate": true,
    "password": "family2025"
  }'
```

### JavaScript/TypeScript Usage
```typescript
const createLeague = async (leagueData: CreateLeagueRequest) => {
  const response = await fetch('/functions/v1/create-league', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leagueData),
  });

  const result: CreateLeagueResponse = await response.json();
  
  if (!result.success) {
    if (result.validationErrors) {
      // Handle validation errors
      result.validationErrors.forEach(error => {
        console.error(`${error.field}: ${error.message}`);
      });
    } else {
      console.error('Error:', result.error);
    }
    return null;
  }

  return result.data;
};
```

## Error Handling

### HTTP Status Codes
- **200**: Success (league created)
- **400**: Bad request (validation errors, malformed JSON)
- **401**: Unauthorized (missing/invalid auth token)
- **405**: Method not allowed (non-POST request)
- **409**: Conflict (league name already exists)
- **500**: Internal server error

### Common Error Scenarios

#### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "validationErrors": [
    {
      "field": "name",
      "message": "League name is required",
      "code": "REQUIRED"
    },
    {
      "field": "maxMembers",
      "message": "Max members must be between 2 and 50",
      "code": "OUT_OF_RANGE"
    }
  ]
}
```

#### Authentication Error
```json
{
  "success": false,
  "error": "Authorization header required"
}
```

#### Duplicate League Name
```json
{
  "success": false,
  "error": "A league with this name already exists"
}
```

## Security Features

### Password Security
- Uses crypto.subtle.digest with SHA-256
- Random 16-byte salt per password
- Salt and hash stored in format: `salt:hash`
- Constant-time verification to prevent timing attacks

### Input Sanitization
- Trims whitespace from string inputs
- Enforces maximum field lengths
- Validates numeric precision and ranges
- Type checking for all inputs

### Database Security
- Row Level Security (RLS) policies enforced
- Atomic operations with cleanup on failure
- SQL injection prevention through parameterized queries

## Database Schema

The function interacts with these tables:

### leagues
```sql
CREATE TABLE leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id),
  entry_fee decimal DEFAULT 0,
  max_members integer DEFAULT 10,
  is_private boolean DEFAULT false,
  password_hash text,
  invite_code text UNIQUE,  -- Auto-generated by trigger
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### league_members
```sql
CREATE TABLE league_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id uuid REFERENCES leagues(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE(league_id, user_id)
);
```

## Testing

### Local Testing with Supabase CLI
```bash
# Test successful creation
supabase functions invoke create-league --method POST \
  --headers='{"Authorization":"Bearer YOUR_USER_JWT"}' \
  --body='{
    "name": "Test League",
    "entryFee": 5.00,
    "maxMembers": 10,
    "isPrivate": false
  }'

# Test validation errors
supabase functions invoke create-league --method POST \
  --headers='{"Authorization":"Bearer YOUR_USER_JWT"}' \
  --body='{
    "name": "",
    "maxMembers": 100,
    "isPrivate": true
  }'
```

### Integration Testing
```typescript
describe('Create League Function', () => {
  test('creates public league successfully', async () => {
    const response = await createLeague({
      name: 'Test League',
      entryFee: 0,
      maxMembers: 10,
      isPrivate: false,
    });

    expect(response).toBeTruthy();
    expect(response.inviteCode).toHaveLength(8);
  });

  test('validates required fields', async () => {
    const response = await fetch('/functions/v1/create-league', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ isPrivate: false }),
    });

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.validationErrors).toBeDefined();
  });
});
```

## Deployment

### Prerequisites
- Supabase project with auth enabled
- Database migrations applied
- Environment variables configured

### Deploy Function
```bash
# Deploy to production
supabase functions deploy create-league

# Deploy with environment variables
supabase secrets set --env-file .env.production
supabase functions deploy create-league
```

### Monitor Function
- Check logs in Supabase Dashboard
- Monitor response times and error rates
- Set up alerts for function failures

## Troubleshooting

### Common Issues

**"Authorization header required"**
- Ensure Bearer token is included in request
- Verify token is valid and not expired

**"Validation failed"**
- Check request body against schema
- Ensure all required fields are provided
- Verify data types match specification

**"Failed to create league membership"**
- Check database constraints
- Verify RLS policies allow insertion
- Check for foreign key violations

**Function timeout**
- Verify database connectivity
- Check for slow queries
- Monitor function execution time

### Debug Mode
Enable detailed logging by checking function logs in Supabase Studio for:
- Request details
- Validation errors
- Database query errors
- Performance metrics