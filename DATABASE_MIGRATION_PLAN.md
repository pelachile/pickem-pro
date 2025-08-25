# Database Architecture Migration Plan

## Migration Overview

### Current vs Target Architecture

**Current Architecture:**
- All database operations routed through Supabase Edge Functions
- Business logic and validation handled in server-side functions
- Client makes API calls to edge functions
- Higher compute costs due to function invocations

**Target Architecture:**
- Direct client-side database access using Supabase client
- Row Level Security (RLS) policies for data access control
- Client-side validation with server-side RLS as security boundary
- Significant reduction in edge function usage (50-70% cost savings)
- ESPN API functions remain as edge functions for external data fetching

### Goals and Benefits

1. **Performance Optimization**: Reduce latency by eliminating intermediate function calls
2. **Cost Reduction**: 50-70% reduction in edge function compute costs
3. **Improved Developer Experience**: Direct database queries with full TypeScript support
4. **Enhanced Real-time Capabilities**: Native Supabase real-time subscriptions
5. **Maintainability**: Simplified architecture with fewer moving parts
6. **Security**: Maintain security through RLS policies instead of edge function validation

## Detailed Phase Breakdown

### Phase 1: Foundation & Analysis ✅ (Current Phase)
**Timeline**: 1-2 days
**Status**: In Progress

#### Tasks:
- [ ] Create migration reference document (this file)
- [ ] Generate TypeScript interfaces from Supabase schema
- [ ] Update Supabase client with proper typing
- [ ] Audit and document all edge functions
- [ ] Plan frontend architecture changes
- [ ] Document RLS policy requirements

#### Deliverables:
- [ ] Complete `DATABASE_MIGRATION_PLAN.md`
- [ ] Updated `src/lib/supabase.ts` with full typing
- [ ] Generated `src/types/database.ts` interfaces
- [ ] Edge function analysis documentation
- [ ] Frontend migration strategy

### Phase 2: RLS Policy Implementation
**Timeline**: 2-3 days
**Status**: Pending

#### Tasks:
- [ ] Design comprehensive RLS policies for all tables
- [ ] Implement league access policies (admin/member/public)
- [ ] Create user data access policies
- [ ] Set up pick submission policies
- [ ] Implement game data access policies
- [ ] Test RLS policies with various user scenarios

#### Deliverables:
- [ ] RLS policies for `leagues` table
- [ ] RLS policies for `league_members` table
- [ ] RLS policies for `picks` table
- [ ] RLS policies for `games` table
- [ ] RLS policy test suite
- [ ] Policy documentation

### Phase 3: Frontend Client Implementation
**Timeline**: 3-4 days
**Status**: Pending

#### Tasks:
- [ ] Replace edge function calls with direct Supabase queries
- [ ] Implement client-side validation
- [ ] Add proper error handling and loading states
- [ ] Set up real-time subscriptions
- [ ] Create data fetching hooks
- [ ] Implement optimistic updates

#### Deliverables:
- [ ] Updated league management components
- [ ] Direct database query implementations
- [ ] Real-time subscription setup
- [ ] Client-side validation layer
- [ ] Error handling improvements
- [ ] Loading state management

### Phase 4: Feature Flag Implementation & Testing
**Timeline**: 2-3 days
**Status**: Pending

#### Tasks:
- [ ] Implement feature flags for gradual rollout
- [ ] Set up A/B testing between old and new architecture
- [ ] Comprehensive testing of all league operations
- [ ] Performance benchmarking
- [ ] Security testing of RLS policies
- [ ] Error scenario testing

#### Deliverables:
- [ ] Feature flag system
- [ ] Comprehensive test suite
- [ ] Performance benchmark report
- [ ] Security audit results
- [ ] Migration readiness checklist

### Phase 5: Production Migration & Cleanup
**Timeline**: 1-2 days
**Status**: Pending

#### Tasks:
- [ ] Gradual feature flag rollout to users
- [ ] Monitor performance and error rates
- [ ] Complete migration to new architecture
- [ ] Deprecate unnecessary edge functions
- [ ] Update documentation
- [ ] Post-migration cleanup

#### Deliverables:
- [ ] Successful production migration
- [ ] Deprecated edge functions cleanup
- [ ] Updated API documentation
- [ ] Performance improvement metrics
- [ ] Cost reduction analysis

## Progress Tracking

### Phase 1 Progress (Current)
- [x] Create migration reference document
- [x] Generate TypeScript interfaces from Supabase schema
- [x] Update Supabase client configuration with full typing
- [x] Complete edge function analysis
- [x] Plan frontend architecture changes
- [x] Document RLS policy requirements in detail

### Overall Migration Progress
- Phase 1: 100% Complete 🔴
- Phase 2: 0% Complete ⚪
- Phase 3: 0% Complete ⚪
- Phase 4: 0% Complete ⚪
- Phase 5: 0% Complete ⚪

**Total Migration Progress: 20% Complete**

## Agent Assignments

### Primary Responsibility Matrix

| Phase | Primary Agent | Supporting Agents | Key Responsibilities |
|-------|---------------|-------------------|---------------------|
| Phase 1 | Frontend Developer | Database Optimizer | Schema analysis, type generation, architecture planning |
| Phase 2 | Database Expert | Security Specialist | RLS policy design and implementation |
| Phase 3 | Frontend Developer | Backend Developer | Client implementation, query optimization |
| Phase 4 | QA Expert | Performance Engineer | Testing, benchmarking, validation |
| Phase 5 | DevOps Engineer | Full Team | Deployment, monitoring, cleanup |

### Collaboration Points
- **Daily standups** during active migration phases
- **Code reviews** for all RLS policies and client implementations
- **Security reviews** before each phase completion
- **Performance reviews** after Phase 3 and Phase 4

## Technical Specifications

### Edge Function Inventory

#### Database-Related Functions (To Be Migrated)

##### 1. `create-league` - League Creation Function
**Current Implementation Analysis:**
- **Business Logic**: Creates league record and automatically adds creator as admin member
- **Validation**: Name length (min 1 char), max members (2-50), entry fee (>=0), private league password requirement
- **Security**: Validates JWT token, ensures created_by matches authenticated user
- **Database Operations**: 
  - INSERT into leagues table with password hashing (SHA-256)
  - INSERT into league_members table with admin role
  - Transactional cleanup if member addition fails
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **Migration Priority**: HIGH - Core functionality needed for Phase 3

**Direct Query Migration Plan:**
- Move password hashing to client-side (or use RLS policy validation)
- Use database transaction for league + membership creation
- Implement client-side validation with server-side RLS enforcement
- Replace with: `supabase.from('leagues').insert()` + `supabase.from('league_members').insert()`

##### 2. `join-league` - League Joining Function
**Current Implementation Analysis:**
- **Business Logic**: Finds league by invite code, validates password for private leagues, adds user as member
- **Validation**: Invite code format, password for private leagues, league capacity checks, duplicate membership prevention
- **Security**: JWT validation, case-insensitive invite code handling
- **Database Operations**:
  - SELECT league by invite_code and status
  - SELECT existing membership to prevent duplicates
  - COUNT current members for capacity validation
  - SHA-256 password verification for private leagues
  - INSERT new league membership
- **Error Handling**: Specific error messages for different failure scenarios
- **Migration Priority**: HIGH - Core user onboarding functionality

**Direct Query Migration Plan:**
- Replace with combined query using Supabase client joins
- Move password verification to client-side or RLS policy
- Use RLS policies to enforce membership rules and capacity limits
- Implement optimistic UI updates with error rollback

##### 3. `get-user-leagues` - User League Fetching
**Current Implementation Analysis:**
- **Business Logic**: Fetches all leagues where user is a member with role and membership details
- **Query Complexity**: JOIN between league_members and leagues tables with member count aggregation
- **Security**: RLS-style filtering (only user's own memberships)
- **Response Format**: Enriched league data with user role, joined date, current member counts
- **Performance**: Efficient query with proper indexing on user_id and league_id
- **Migration Priority**: HIGH - Essential for dashboard functionality

**Direct Query Migration Plan:**
- Direct replacement with: `supabase.from('league_members').select('*, leagues(*)')`
- Add real-time subscription for live updates
- Implement client-side data transformation and caching
- Use RLS policies to ensure users only see their own memberships

##### 4. `update-league` - League Update Function
**Current Implementation Analysis:**
- **Business Logic**: Updates league settings with admin permission validation
- **Validation**: Role-based access control (creator or admin), field validation, member count constraints
- **Security**: Multi-level permission checking (creator ID + admin role verification)
- **Complex Logic**: Password hashing for privacy changes, member count validation against current membership
- **Database Operations**: SELECT for permission check, UPDATE with validation, complex conditional logic
- **Migration Priority**: MEDIUM - Admin functionality, less frequently used

**Direct Query Migration Plan:**
- Replace with direct update query using RLS policies for permission enforcement
- Move complex validation logic to client-side with RLS backup
- Implement optimistic updates with proper error handling
- Consider breaking into smaller, more focused operations

##### 5. `delete-league` - League Deletion Function
**Current Implementation Analysis:**
- **Business Logic**: Safely deletes league with cascade cleanup and pick validation
- **Security**: Strict creator-only access control
- **Data Integrity**: Checks for existing picks before allowing deletion, cascading deletes for members
- **Complex Operations**: Multiple table cleanup (league_members, picks, leagues)
- **Error Handling**: Transactional cleanup with rollback on failure
- **Migration Priority**: LOW - Destructive operation, rarely used

**Direct Query Migration Plan:**
- Use database foreign key cascades for automatic cleanup
- Implement RLS policy for creator-only access
- Add client-side confirmation dialogs and soft delete options
- Consider moving to admin-only operation with additional safeguards

##### 6. `get-public-leagues` - Public League Discovery
**Current Implementation Analysis:**
- **Business Logic**: Paginated search of public leagues with member count and availability
- **Query Complexity**: Complex filtering, searching, sorting with member count aggregation
- **Performance Features**: Full-text search, pagination, efficient member counting
- **Security**: Excludes leagues where user is already a member
- **Response Format**: Enriched public league data with availability calculations
- **Migration Priority**: MEDIUM - Discovery feature, important for growth

**Direct Query Migration Plan:**
- Replace with direct query using Supabase's full-text search capabilities
- Implement client-side pagination and filtering
- Use RLS policies to automatically filter user's existing leagues
- Add real-time updates for live availability changes

#### External API Functions (To Remain)

##### 1. `sync-nfl-data` - ESPN API Integration
**Functionality**: Fetches team and schedule data from ESPN API
**Reason to Keep**: External API integration, requires server-side execution
**Migration Impact**: None - remains as edge function

##### 2. `process-game-results` - Game Result Processing
**Functionality**: Processes completed games, updates pick results, calculates standings
**Reason to Keep**: Complex business logic, batch processing, requires elevated permissions
**Migration Impact**: May need to trigger client-side cache invalidation

##### 3. `generate-cache` - Cache Management
**Functionality**: Pre-generates cached data for performance optimization
**Reason to Keep**: Background processing, performance optimization
**Migration Impact**: May be reduced in scope as client-side caching improves

#### Utility Functions (To Be Evaluated)

##### 1. `test-simple` - Development Utility
**Functionality**: Basic testing and development helper
**Migration Decision**: DELETE - Not needed in production
**Action**: Remove entirely during cleanup phase

### RLS Policy Requirements

#### Leagues Table Policies
- **Public Read**: Allow reading public leagues for discovery
- **Member Read**: Allow reading league details for members
- **Admin Write**: Allow updates by league admins/creators
- **Creator Delete**: Allow deletion by league creators only

#### League Members Table Policies
- **Self Read**: Users can read their own memberships
- **League Read**: League members can read other members in their leagues
- **Admin Write**: League admins can manage memberships
- **Self Join**: Users can join leagues (with validation)

#### Picks Table Policies
- **Self Write**: Users can create/update their own picks
- **League Read**: League members can read picks in their leagues
- **Time-based**: Enforce pick deadlines and game start times

#### Games Table Policies
- **Public Read**: Allow all users to read game information
- **Admin Write**: Restrict game updates to system/admin users

### Database Schema Considerations

#### Current Tables
- `leagues`: League information and settings
- `league_members`: User membership and roles
- `picks`: User game picks
- `games`: Game information and results
- `profiles`: User profile information

#### Required Indexes
- `leagues(status, is_private)` for public league queries
- `league_members(user_id, league_id)` for membership lookups
- `picks(user_id, league_id, game_id)` for pick queries
- `games(status, game_date)` for active game queries

## Risk Management

### Identified Risks

1. **Security Risk**: Improper RLS policies could expose sensitive data
   - **Mitigation**: Thorough security review and testing of all policies
   - **Rollback**: Feature flags allow immediate reversion to edge functions

2. **Performance Risk**: Direct client queries might be less optimized
   - **Mitigation**: Performance benchmarking and query optimization
   - **Rollback**: A/B testing to compare performance metrics

3. **Data Integrity Risk**: Client-side validation might be bypassed
   - **Mitigation**: RLS policies enforce data integrity at database level
   - **Rollback**: Database constraints and triggers as backup validation

4. **Migration Risk**: Incomplete migration could leave system in inconsistent state
   - **Mitigation**: Feature flags and gradual rollout strategy
   - **Rollback**: Complete rollback procedures documented

### Rollback Procedures

#### Emergency Rollback (Immediate)
1. Disable feature flags to revert to edge functions
2. Monitor system stability and error rates
3. Investigate and document issues
4. Plan remediation before re-attempting migration

#### Planned Rollback (Maintenance Window)
1. Schedule maintenance window
2. Disable new architecture via feature flags
3. Verify edge function functionality
4. Clean up any partial migration state
5. Document lessons learned

### Feature Flag Strategy

#### Flag Implementation
- **Global Migration Flag**: Enable/disable new architecture entirely
- **Feature Flags**: Individual flags for each major feature area
  - `use_direct_league_queries`
  - `use_direct_member_queries`
  - `use_direct_pick_queries`
- **User-based Flags**: Gradual rollout to user segments
- **Admin Override**: Admin users can force enable/disable for testing

#### Rollout Strategy
1. **Internal Testing**: 100% for development team
2. **Alpha Testing**: 10% of users, power users and volunteers
3. **Beta Testing**: 50% of users, random selection
4. **Full Rollout**: 100% of users after validation

## Success Metrics

### Performance Benchmarks

#### Response Time Targets
- **League Creation**: < 500ms (currently ~800ms)
- **League List Loading**: < 300ms (currently ~600ms)
- **League Joining**: < 400ms (currently ~700ms)
- **Pick Submission**: < 200ms (currently ~400ms)

#### Throughput Targets
- **Concurrent Users**: Support 10x current capacity
- **Database Queries**: 50% reduction in total query time
- **API Calls**: 70% reduction in edge function calls

### Cost Savings Targets

#### Edge Function Compute Savings
- **Target**: 50-70% reduction in compute costs
- **Measurement**: Monthly billing comparison
- **Baseline**: Current monthly edge function costs

#### Database Efficiency
- **Query Optimization**: 30% reduction in query execution time
- **Connection Pooling**: Better connection utilization
- **Caching**: Improved client-side caching strategies

### User Experience Improvements

#### Real-time Features
- **Live Updates**: League membership changes
- **Live Picks**: Real-time pick submissions and updates
- **Live Standings**: Real-time standings updates

#### Offline Capabilities
- **Optimistic Updates**: Immediate UI feedback
- **Offline Queueing**: Queue actions when offline
- **Conflict Resolution**: Handle offline/online sync conflicts

### Security and Reliability Metrics

#### Security Benchmarks
- **Zero Data Leaks**: No unauthorized data access
- **Policy Coverage**: 100% of database operations covered by RLS
- **Audit Trail**: Complete logging of all data access

#### Reliability Targets
- **Uptime**: 99.9% availability maintained
- **Error Rates**: < 0.1% error rate for database operations
- **Recovery Time**: < 5 minutes for emergency rollback

## Documentation Requirements

### Technical Documentation
- [ ] Updated API documentation
- [ ] Database schema documentation
- [ ] RLS policy reference
- [ ] Client implementation guide
- [ ] Performance optimization guide

### User Documentation
- [ ] Feature change notifications
- [ ] Performance improvement announcements
- [ ] Any user-facing changes documentation

### Developer Documentation
- [ ] Migration guide for other developers
- [ ] Architecture decision records (ADRs)
- [ ] Troubleshooting guide
- [ ] Best practices guide

---

**Last Updated**: 2025-01-23
**Migration Status**: Phase 1 Complete - Ready for Phase 2
**Next Milestone**: Begin RLS Policy Implementation (Phase 2)
**Estimated Completion**: 2025-01-30 (pending resource allocation)

## Frontend Architecture Migration Strategy

### Current Architecture Analysis

**Existing Components and Hooks:**
- `useLeague.ts`: TanStack Query hooks for all league operations
- `api.ts`: Edge function API calls using fetch with auth headers
- League routes: `/leagues`, `/create-league`, `/join-league`, `/league/{id}`
- Query key management for cache invalidation
- Error handling through try/catch and mutation callbacks

**Current Data Flow:**
1. Component calls hook (e.g., `usePublicLeagues()`)
2. Hook uses TanStack Query to call API function
3. API function makes HTTP request to edge function
4. Edge function validates auth and executes database operations
5. Response flows back through the chain
6. TanStack Query handles caching, loading states, and error states

### Migration Architecture Plan

#### Phase 2: Preparation Phase
**Objective**: Set up parallel infrastructure for direct database access

**New Files to Create:**
- `src/hooks/useDirectDatabase.ts`: New hooks using direct Supabase queries
- `src/lib/database.ts`: Database operation utilities and query builders
- `src/lib/rls-policies.ts`: Client-side RLS policy helpers
- `src/hooks/useFeatureFlags.ts`: Feature flag management

**Modifications to Existing Files:**
- `src/hooks/useLeague.ts`: Add feature flag logic to switch between edge functions and direct queries
- `src/lib/api.ts`: Add fallback mechanisms and migration tracking
- `src/lib/supabase.ts`: Already updated with typed client and helpers

#### Phase 3: Implementation Phase
**Objective**: Replace edge function calls with direct Supabase client queries

**League Operations Migration:**

1. **Public Leagues Query** (`get-public-leagues` → Direct Query)
   ```typescript
   // OLD: Edge function call
   const response = await fetch(`${FUNCTIONS_BASE_URL}/get-public-leagues?${searchParams}`);
   
   // NEW: Direct Supabase query
   const { data: leagues } = await supabase
     .from('leagues')
     .select(`
       *,
       league_members!inner(count)
     `)
     .eq('is_private', false)
     .eq('status', 'active')
     .not('id', 'in', userLeagueIds)
     .ilike('name', `%${search}%`)
     .range(offset, offset + limit - 1);
   ```

2. **User Leagues Query** (`get-user-leagues` → Direct Query)
   ```typescript
   // OLD: Edge function call
   const response = await fetch(`${FUNCTIONS_BASE_URL}/get-user-leagues`);
   
   // NEW: Direct Supabase query with real-time subscription
   const { data: userLeagues } = await supabase
     .from('league_members')
     .select(`
       role,
       joined_at,
       leagues (
         id, name, description, entry_fee, max_members,
         is_private, invite_code, status, created_at
       )
     `)
     .eq('user_id', user.id)
     .order('joined_at', { ascending: false });
   ```

3. **League Creation** (`create-league` → Direct Transaction)
   ```typescript
   // OLD: Single edge function call
   const response = await fetch(`${FUNCTIONS_BASE_URL}/create-league`, { ... });
   
   // NEW: Multi-step transaction with optimistic updates
   const { data: league } = await supabase
     .from('leagues')
     .insert(leagueData)
     .select()
     .single();
     
   const { data: membership } = await supabase
     .from('league_members')
     .insert({
       league_id: league.id,
       user_id: user.id,
       role: 'admin'
     });
   ```

**Real-time Subscriptions Implementation:**
```typescript
// League membership changes
const subscription = supabase
  .channel('league_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'league_members',
      filter: `user_id=eq.${user.id}`,
    },
    (payload) => {
      queryClient.invalidateQueries(['leagues', 'user']);
    }
  )
  .subscribe();
```

**Error Handling Strategy:**
- Graceful degradation: Fall back to edge functions if direct queries fail
- User-friendly error messages using `parseSupabaseError()` helper
- Loading state management with skeleton components
- Optimistic updates with rollback on failure

#### Phase 4: Testing and Optimization
**Objective**: Comprehensive testing and performance optimization

**Testing Strategy:**
- Component tests with MSW for API mocking
- Integration tests for database operations
- E2E tests for critical user flows
- Performance testing for query optimization
- A/B testing between edge functions and direct queries

**Performance Optimizations:**
- Query optimization using indexes and proper joins
- Client-side caching with TanStack Query
- Real-time subscription management (subscribe/unsubscribe)
- Bundle size optimization by tree-shaking unused edge function code

### Component Migration Plan

#### High Priority Components (Phase 3 Week 1)
1. **League List Page** (`/leagues`)
   - Replace `useUserLeagues()` hook
   - Add real-time updates for league changes
   - Implement optimistic join/leave operations

2. **Public Leagues Page** (`/join-league`)
   - Replace `usePublicLeagues()` and `useSearchPublicLeagues()`
   - Add real-time availability updates
   - Optimize search with debouncing and caching

#### Medium Priority Components (Phase 3 Week 2)
3. **League Creation Flow** (`/create-league`)
   - Replace single API call with transaction-based approach
   - Add client-side validation before database operations
   - Implement optimistic UI updates

4. **League Management Page** (`/league-manage/{id}`)
   - Replace `useUpdateLeague()` and `useDeleteLeague()`
   - Add real-time member list updates
   - Implement role-based UI visibility

#### Low Priority Components (Phase 3 Week 3)
5. **Individual League Pages** (`/league/{id}`)
   - Add real-time member activity feeds
   - Implement live league statistics
   - Add real-time pick submission updates (when picks are implemented)

### Hook Migration Strategy

**Parallel Hook Implementation:**
```typescript
// Feature flag-based hook selection
export function usePublicLeagues(params: GetPublicLeaguesParams = {}) {
  const useDirectQueries = isFeatureEnabled('use_direct_league_queries');
  
  if (useDirectQueries) {
    return useDirectPublicLeagues(params); // New implementation
  }
  
  return useLegacyPublicLeagues(params); // Current implementation
}
```

**Gradual Migration Timeline:**
- Week 1: Implement direct query hooks alongside existing ones
- Week 2: Enable feature flags for internal testing (10% of users)
- Week 3: Gradual rollout to 50% of users
- Week 4: Full rollout to 100% of users
- Week 5: Remove legacy edge function code

### Data Flow Transformation

**Before Migration:**
```
Component → Hook → API Function → Edge Function → Database
                                      ↓
Component ← Hook ← JSON Response ← HTTP Response ← Database
```

**After Migration:**
```
Component → Hook → Supabase Client → Database (with RLS)
                       ↓              ↓
Component ← Hook ← Typed Response ← Real-time Updates
```

**Benefits of New Architecture:**
- **Performance**: Reduced latency by eliminating intermediate function calls
- **Type Safety**: Full TypeScript support throughout the data flow
- **Real-time**: Native support for live updates
- **Caching**: Better client-side caching strategies
- **Offline**: Improved offline support with optimistic updates
- **Debugging**: Easier debugging with direct database operations

### Risk Mitigation Strategies

1. **Feature Flags**: Enable gradual rollout and instant rollback
2. **Parallel Implementation**: Keep both systems running during transition
3. **Comprehensive Testing**: Ensure feature parity before switching
4. **Performance Monitoring**: Track query performance and user experience
5. **Error Tracking**: Monitor error rates during migration
6. **User Communication**: Clear communication about any breaking changes

## RLS Policy Implementation Requirements

### Policy Design Principles

1. **Least Privilege**: Users can only access data they explicitly need
2. **Defense in Depth**: Multiple layers of security checks
3. **Performance Optimized**: Policies should use efficient queries with proper indexes
4. **Maintainable**: Clear, readable policies with good documentation
5. **Testable**: Policies can be thoroughly tested with different user scenarios

### Detailed RLS Policies by Table

#### Leagues Table Policies

##### Policy 1: Public League Discovery
```sql
CREATE POLICY "public_leagues_readable" ON leagues
  FOR SELECT USING (
    is_private = false 
    AND status = 'active'
  );
```
**Purpose**: Allow all authenticated users to discover public, active leagues
**Performance**: Uses existing index on (is_private, status)
**Test Cases**: Verify private/inactive leagues are not visible

##### Policy 2: Member League Access
```sql
CREATE POLICY "member_leagues_readable" ON leagues
  FOR SELECT USING (
    id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid()
    )
  );
```
**Purpose**: Allow users to view details of leagues they're members of
**Performance**: Uses index on league_members(user_id, league_id)
**Test Cases**: Verify access to own leagues, deny access to others

##### Policy 3: League Creation
```sql
CREATE POLICY "authenticated_users_can_create_leagues" ON leagues
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' 
    AND created_by = auth.uid()
  );
```
**Purpose**: Allow authenticated users to create leagues
**Security**: Ensures created_by field matches authenticated user
**Test Cases**: Verify only authenticated users can create, created_by is enforced

##### Policy 4: League Updates (Creator/Admin)
```sql
CREATE POLICY "league_admins_can_update" ON leagues
  FOR UPDATE USING (
    created_by = auth.uid() OR
    id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  ) WITH CHECK (
    created_by = auth.uid() OR
    id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```
**Purpose**: Allow league creators and admins to update league settings
**Performance**: Uses indexes on created_by and league_members lookups
**Test Cases**: Verify creator access, admin access, deny member access

##### Policy 5: League Deletion (Creator Only)
```sql
CREATE POLICY "league_creators_can_delete" ON leagues
  FOR DELETE USING (
    created_by = auth.uid()
  );
```
**Purpose**: Only league creators can delete leagues
**Security**: Strictest access control for destructive operations
**Test Cases**: Verify only creators can delete, deny admin/member access

#### League Members Table Policies

##### Policy 1: Membership Visibility
```sql
CREATE POLICY "league_members_visible_to_members" ON league_members
  FOR SELECT USING (
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid()
    ) OR
    league_id IN (
      SELECT id 
      FROM leagues 
      WHERE is_private = false AND status = 'active'
    )
  );
```
**Purpose**: Show memberships for user's leagues + public league memberships
**Performance**: Uses indexes on league_members and leagues tables
**Test Cases**: Verify visibility rules for different league types

##### Policy 2: Self-Membership Management
```sql
CREATE POLICY "users_can_manage_own_membership" ON league_members
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```
**Purpose**: Users can join/leave leagues (manage their own membership)
**Security**: Enforces user can only modify their own memberships
**Test Cases**: Verify self-join/leave, deny modifying others' memberships

##### Policy 3: Admin Membership Management
```sql
CREATE POLICY "league_admins_can_manage_members" ON league_members
  FOR ALL USING (
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ) OR
    league_id IN (
      SELECT id 
      FROM leagues 
      WHERE created_by = auth.uid()
    )
  );
```
**Purpose**: League admins and creators can manage all memberships
**Performance**: Uses admin role lookups with proper indexing
**Test Cases**: Verify admin powers, deny regular member management access

#### League Invites Table Policies

##### Policy 1: Invite Visibility
```sql
CREATE POLICY "league_invites_visible_to_admins" ON league_invites
  FOR SELECT USING (
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ) OR
    league_id IN (
      SELECT id 
      FROM leagues 
      WHERE created_by = auth.uid()
    )
  );
```
**Purpose**: Only admins and creators can see invite details
**Security**: Prevents invite code exposure to regular members
**Test Cases**: Verify admin access, deny member access

##### Policy 2: Invite Creation
```sql
CREATE POLICY "league_admins_can_create_invites" ON league_invites
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ) OR
    league_id IN (
      SELECT id 
      FROM leagues 
      WHERE created_by = auth.uid()
    ))
  );
```
**Purpose**: Only admins can create custom invites
**Security**: Enforces creator field and admin permissions
**Test Cases**: Verify admin creation rights, deny member creation

#### Teams and Games Tables Policies

##### Policy 1: Public Read Access
```sql
CREATE POLICY "teams_publicly_readable" ON teams
  FOR SELECT USING (true);
  
CREATE POLICY "games_publicly_readable" ON games
  FOR SELECT USING (true);
```
**Purpose**: Allow all users to read team and game information
**Justification**: NFL data is public information needed for picks
**Test Cases**: Verify universal read access

##### Policy 2: Service Role Write Access
```sql
CREATE POLICY "service_role_can_modify_teams" ON teams
  FOR ALL USING (auth.role() = 'service_role');
  
CREATE POLICY "service_role_can_modify_games" ON games
  FOR ALL USING (auth.role() = 'service_role');
```
**Purpose**: Only system processes can update NFL data
**Security**: Prevents user manipulation of game/team data
**Test Cases**: Verify service role access, deny user modifications

#### Picks Table Policies (Future Implementation)

##### Policy 1: Self Pick Management
```sql
CREATE POLICY "users_can_manage_own_picks" ON picks
  FOR ALL USING (
    user_id = auth.uid() AND
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid()
    )
  ) WITH CHECK (
    user_id = auth.uid() AND
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid()
    ) AND
    game_id IN (
      SELECT id 
      FROM games 
      WHERE game_date > NOW() -- Only future games
    )
  );
```
**Purpose**: Users can manage their own picks in their leagues
**Business Logic**: Only allow picks for future games
**Test Cases**: Verify self-access, time constraints, league membership

##### Policy 2: League Pick Visibility
```sql
CREATE POLICY "league_members_can_view_picks" ON picks
  FOR SELECT USING (
    league_id IN (
      SELECT league_id 
      FROM league_members 
      WHERE user_id = auth.uid()
    )
  );
```
**Purpose**: League members can see all picks in their leagues
**Privacy**: May need modification based on league settings
**Test Cases**: Verify member access, deny non-member access

### Policy Performance Optimization

#### Required Indexes for Policy Performance
```sql
-- League-related indexes
CREATE INDEX IF NOT EXISTS idx_leagues_private_status 
  ON leagues(is_private, status) 
  WHERE is_private = false AND status = 'active';
  
CREATE INDEX IF NOT EXISTS idx_leagues_created_by 
  ON leagues(created_by);

-- League members indexes
CREATE INDEX IF NOT EXISTS idx_league_members_user_league 
  ON league_members(user_id, league_id);
  
CREATE INDEX IF NOT EXISTS idx_league_members_league_user 
  ON league_members(league_id, user_id);
  
CREATE INDEX IF NOT EXISTS idx_league_members_role 
  ON league_members(league_id, user_id, role) 
  WHERE role = 'admin';

-- Invite-related indexes
CREATE INDEX IF NOT EXISTS idx_league_invites_code 
  ON league_invites(invite_code) 
  WHERE expires_at IS NULL OR expires_at > NOW();

-- Game-related indexes (for picks)
CREATE INDEX IF NOT EXISTS idx_games_future 
  ON games(game_date) 
  WHERE game_date > NOW();
```

### Policy Testing Strategy

#### Test User Scenarios
1. **Anonymous User**: Can only see public league listings
2. **Authenticated User**: Can create leagues, join public leagues
3. **League Member**: Can see league details, other members, leave league
4. **League Admin**: Can manage league settings, invite/remove members
5. **League Creator**: Full administrative access, can delete league
6. **Non-Member**: Cannot see private league details or members

#### Automated Policy Tests
```sql
-- Test script template
DO $$
DECLARE
    test_user_id UUID;
    test_league_id UUID;
BEGIN
    -- Set up test data
    SELECT auth.uid() INTO test_user_id;
    
    -- Test policy scenarios
    -- Assert expected results
    -- Clean up test data
END $$;
```

### Policy Migration Plan

#### Phase 2 Tasks
1. **Week 1**: Implement and test leagues table policies
2. **Week 2**: Implement and test league_members policies
3. **Week 3**: Implement and test remaining table policies
4. **Week 4**: Performance testing and optimization
5. **Week 5**: Security audit and policy refinement

#### Validation Process
1. **Unit Tests**: Test each policy in isolation
2. **Integration Tests**: Test policy interactions
3. **Performance Tests**: Verify query performance with policies
4. **Security Audit**: External review of policy logic
5. **User Acceptance Testing**: Verify expected user experience

**Policy Rollback Strategy**: Keep policies disabled initially, enable with feature flags, immediate disable capability for security issues.