# Production Deployment Guide

## Environment Setup

1. Copy `.env.template` to `.env` and fill in your production values:
   ```bash
   cp .env.template .env
   ```

2. Update `.env` with your Supabase production credentials:
   - `VITE_SUPABASE_URL`: Your production Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your production anon key

## Supabase Setup

### 1. Storage Buckets
Create these public storage buckets in your Supabase dashboard:
- `cache` - For NFL game cache files
- `nfl-cache` - For additional cache storage

### 2. Edge Functions Deployment
Deploy the essential edge functions:
```bash
# Link to your project
supabase link --project-ref your-project-ref

# Deploy essential functions
supabase functions deploy generate-cache --project-ref your-project-ref
supabase functions deploy fetch-scores --project-ref your-project-ref
```

### 3. Database Schema
The database tables should already be created. If not, run:
```bash
supabase db push --db-url "your-db-connection-string"
```

## Build & Deploy

1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

## Verification

Test the cache generation:
```bash
curl -X POST "https://your-project-ref.supabase.co/functions/v1/generate-cache" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"method": "POST"}'
```

## Security Notes

- Never commit `.env` files to git
- Use environment variables for all sensitive data
- Service role keys should only be used for edge functions
- Anon keys are safe for client-side use