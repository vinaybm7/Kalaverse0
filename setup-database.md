# Database Setup Instructions

## Prerequisites
1. Make sure you have a Supabase project created
2. Have your Supabase URL and anon key ready
3. Set up your environment variables in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_artworks_table.sql`
4. Run the SQL script

### Option 2: Using Supabase CLI
If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## Storage Setup
The migration script will automatically:
- Create the `artwork-images` storage bucket
- Set up proper security policies
- Enable public access for viewing images

## Verification
After running the migration, you should see:
1. An `artworks` table in your database
2. An `artwork-images` bucket in Storage
3. Proper RLS policies enabled

## Testing
1. Sign up as an artist in your application
2. Try uploading an artwork
3. Check that the artwork appears in your dashboard
4. Verify the image is stored in Supabase Storage

## Troubleshooting
- If you get authentication errors, make sure your RLS policies are set up correctly
- If image uploads fail, check that the storage bucket exists and has proper policies
- Make sure your environment variables are correctly set