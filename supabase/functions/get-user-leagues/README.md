# Get User Leagues Function

This Supabase Edge Function retrieves all leagues that the authenticated user belongs to.

## Endpoint

`GET /functions/v1/get-user-leagues`

## Authentication

Requires valid Supabase authentication token in the `Authorization` header:
```
Authorization: Bearer <supabase_access_token>
```

## Request

- **Method**: `GET`
- **Body**: None (GET request)

## Response

### Success Response (200)

```typescript
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Fantasy League",
      "description": "A fun league with friends",
      "entryFee": 25.00,
      "maxMembers": 12,
      "currentMembers": 8,
      "isPrivate": true,
      "inviteCode": "ABC12345", // Only included if user is admin
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "userRole": "admin",
      "joinedAt": "2024-01-15T10:30:00Z"
    }
    // ... more leagues
  ]
}
```

### Error Responses

#### 401 Unauthorized
```typescript
{
  "success": false,
  "error": "Authorization header required",
  "code": "MISSING_AUTH_HEADER"
}
```

#### 405 Method Not Allowed
```typescript
{
  "success": false,
  "error": "Method POST not allowed",
  "code": "METHOD_NOT_ALLOWED"
}
```

#### 500 Internal Server Error
```typescript
{
  "success": false,
  "error": "Internal server error - please try again later",
  "code": "INTERNAL_ERROR"
}
```

## Security

- Only returns leagues where the user is a member
- Invite codes are only included in the response if the user is an admin of that league
- Uses Supabase Row Level Security (RLS) policies for data access control
- Password hashes are never exposed in responses

## Data Ordering

Leagues are returned sorted by the user's join date (most recently joined first).

## Usage Example

```typescript
const response = await fetch('/functions/v1/get-user-leagues', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();

if (result.success) {
  console.log('User leagues:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Database Tables Used

- `leagues` - Main league information
- `league_members` - User membership and roles
- Uses JOIN to efficiently fetch data in a single query
- Includes subquery to count current members for each league

## Performance Notes

- Uses indexed columns for optimal query performance
- Implements proper JOIN strategy to minimize database round trips
- Member count is fetched separately for accuracy (parallel processing)
- Response data is optimized for frontend consumption