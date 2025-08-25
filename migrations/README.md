# Database Migrations

## Venue Name Migration

The production database is missing the `venue_name` column in the `games` table, which is causing venue information to not display in the GameCard components.

### Issue
The code expects a `venue_name` field in the games table, but production database schema doesn't include this column.

### Solution
Apply the following migrations in order:

1. **Add the column**: Run `add_venue_name_to_games.sql`
2. **Populate the data**: Run `populate_venue_names.sql`

### Migration Files

- `add_venue_name_to_games.sql` - Adds the venue_name column to the games table
- `populate_venue_names.sql` - Populates venue names based on home team venues

### Temporary Fix Applied
The code has been updated to handle missing venue_name gracefully by:
- Removing venue_name from the SELECT query if the column doesn't exist
- Using 'TBD' as fallback when venue_name is null/undefined

### To Apply Migrations

#### Using Supabase CLI:
```bash
supabase db push
```

#### Using direct SQL:
1. Connect to your production database
2. Run the migration files in order:
   - `add_venue_name_to_games.sql`
   - `populate_venue_names.sql`

### Verification
After applying migrations, verify with:
```sql
SELECT COUNT(*) as total_games, COUNT(venue_name) as games_with_venue 
FROM games 
WHERE season_year >= 2024;
```

All games should have venue names populated.