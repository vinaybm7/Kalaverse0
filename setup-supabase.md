# Supabase Database Setup

This guide will help you set up the Supabase database for Kalaverse.

## Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```

## Setup Steps

### 1. Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Kalaverse
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users

### 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public key** (VITE_SUPABASE_ANON_KEY)
   - **service_role secret key** (SUPABASE_SERVICE_ROLE_KEY - for migrations)

### 3. Update Environment Variables

Update your `.env.local` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Run Database Migrations

You have two options to set up the database:

#### Option A: Manual Setup (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:

**Migration 1: Artworks Table**
```sql
-- Copy and paste the content from supabase/migrations/001_create_artworks_table.sql
```

**Migration 2: Profiles Table**
```sql
-- Copy and paste the content from supabase/migrations/002_create_profiles_table.sql
```

**Migration 3: Additional Tables**
```sql
-- Copy and paste the content from supabase/migrations/003_create_additional_tables.sql
```

#### Option B: Using Node Script

```bash
# Install dependencies first
npm install @supabase/supabase-js dotenv

# Run the migration script
node scripts/run-migrations.js
```

### 5. Set Up Storage Buckets

The migrations should create the storage buckets automatically, but if they don't:

1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - **avatars** (public)
   - **artwork-images** (public)

### 6. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers
3. Set up email templates if needed
4. Configure redirect URLs for your domain

### 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to:
   - Sign up for a new account
   - Upload an artwork (if you're an artist)
   - Update your profile

## Database Schema Overview

### Tables Created:

1. **profiles** - User profile information
2. **artworks** - Artwork listings
3. **favorites** - User favorites
4. **orders** - Purchase orders
5. **reviews** - Artwork/artist reviews
6. **notifications** - User notifications

### Storage Buckets:

1. **avatars** - User profile pictures
2. **artwork-images** - Artwork photos

### Functions Created:

- `toggle_favorite()` - Add/remove favorites
- `get_artist_statistics()` - Get artist stats
- `get_artist_profile_with_stats()` - Get artist profile with stats
- `increment_artwork_likes()` - Increment artwork likes
- `increment_artwork_views()` - Increment artwork views

## Troubleshooting

### Common Issues:

1. **Migration Errors**: Run migrations one at a time in the SQL editor
2. **Storage Issues**: Ensure buckets are created and policies are set
3. **Auth Issues**: Check redirect URLs and provider settings
4. **RLS Issues**: Ensure Row Level Security policies are properly configured

### Getting Help:

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Join the Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Check the project issues on GitHub

## Next Steps

After setting up the database:

1. Test user registration and authentication
2. Test artwork upload functionality
3. Test profile management
4. Set up any additional features you need

The application should now be fully functional with persistent data storage!