# Join League Edge Function

This Supabase Edge Function allows authenticated users to join existing leagues using invite codes. It handles both public and private leagues with proper validation and security checks.

## Endpoint

```
POST /functions/v1/join-league
```

## Authentication

Requires a valid Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

## Request Format

```typescript
interface JoinLeagueRequest {
  inviteCode: string;      // Required: 4-20 alphanumeric characters
  password?: string;       // Required only for private leagues
}
```

### Example Request

```json
{
  "inviteCode": "ABC123XY",
  "password": "mypassword"
}
```

## Response Format

### Success Response (201)

```typescript
interface JoinLeagueResponse {
  success: boolean;
  data: {
    leagueId: string;
    leagueName: string;
    role: 'member';
    joinedAt: string;        // ISO timestamp
    currentMembers: number;  // Total members after joining
    maxMembers: number;      // League capacity
  };
}
```

### Error Response (400-500)

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  validationErrors?: ValidationError[]; // Only for validation errors
}
```

## Validation Rules

- **inviteCode**: Must be 4-20 alphanumeric characters
- **password**: Required for private leagues, cannot be empty if provided

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `MISSING_AUTH_HEADER` | 401 | No authorization header provided |
| `INVALID_TOKEN` | 401 | Invalid or expired JWT token |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method other than POST used |
| `INVALID_JSON` | 400 | Malformed JSON in request body |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_INVITE_CODE` | 404 | Invite code not found or league inactive |
| `ALREADY_MEMBER` | 409 | User is already a member of this league |
| `LEAGUE_FULL` | 409 | League has reached maximum capacity |
| `PASSWORD_REQUIRED` | 400 | Private league requires password |
| `INVALID_PASSWORD` | 401 | Incorrect password for private league |
| `COUNT_MEMBERS_FAILED` | 500 | Database error counting members |
| `JOIN_LEAGUE_FAILED` | 500 | Database error adding member |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Functionality

1. **Authentication**: Validates user JWT token
2. **Input Validation**: Checks request format and invite code format
3. **League Lookup**: Finds active league by invite code (case-insensitive)
4. **Membership Check**: Prevents duplicate memberships
5. **Capacity Check**: Ensures league isn't full
6. **Password Verification**: For private leagues, validates password
7. **Member Addition**: Adds user as 'member' role to league
8. **Response**: Returns league details and updated member count

## Security Features

- Row Level Security (RLS) policies enforce data access
- Password hashing with salt for private leagues
- Input sanitization and validation
- Case-insensitive invite code matching
- Race condition protection with database constraints
- Comprehensive error handling without data leakage

## Database Tables Used

- `leagues`: For league lookup and validation
- `league_members`: For membership management and counting
- Uses existing RLS policies for data access control

## Usage Example

```javascript
const response = await fetch('/functions/v1/join-league', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inviteCode: 'ABC123XY',
    password: 'secretpassword' // Only if private league
  })
});

const result = await response.json();
if (result.success) {
  console.log(`Joined ${result.data.leagueName}!`);
  console.log(`Member ${result.data.currentMembers} of ${result.data.maxMembers}`);
} else {
  console.error(`Join failed: ${result.error}`);
}
```