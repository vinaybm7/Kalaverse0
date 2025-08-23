# Storage Troubleshooting Guide

This guide helps you diagnose and fix storage issues in Kalaverse.

## Quick Test

1. **Visit the Storage Test Page**: Go to `/storage-test` in your application
2. **Run Storage Tests**: Click "Run Storage Tests" to check all components
3. **Test File Uploads**: Try uploading test files to verify functionality

## Common Issues & Solutions

### 1. Storage Buckets Not Found

**Symptoms:**
- Error: "The resource was not found"
- Buckets test fails

**Solutions:**
1. **Run Database Migrations:**
   ```bash
   # Option 1: Manual (Recommended)
   # Go to Supabase Dashboard > SQL Editor
   # Run each migration file in order
   
   # Option 2: Using script
   node scripts/run-migrations.js
   ```

2. **Manual Bucket Creation:**
   - Go to Supabase Dashboard > Storage
   - Create buckets: `artwork-images` and `avatars`
   - Set both buckets to "Public"

### 2. Upload Permission Denied

**Symptoms:**
- Error: "new row violates row-level security policy"
- Upload test fails even when authenticated

**Solutions:**
1. **Check Authentication:**
   ```javascript
   // In browser console
   const { data: { user } } = await supabase.auth.getUser()
   console.log('User:', user)
   ```

2. **Update Storage Policies:**
   Run the latest storage policy migration:
   ```sql
   -- Run supabase/migrations/004_fix_storage_policies.sql
   ```

3. **Verify RLS Policies:**
   - Go to Supabase Dashboard > Authentication > Policies
   - Check that storage policies exist for both buckets

### 3. File Upload Fails

**Symptoms:**
- Upload starts but fails with error
- Files don't appear in storage

**Solutions:**
1. **Check File Constraints:**
   - Artwork images: Max 10MB, image types only
   - Avatars: Max 5MB, image types only

2. **Verify File Path Structure:**
   - Artwork images: `{userId}/{timestamp}.{ext}`
   - Avatars: `{userId}/avatar.{ext}`

3. **Check Network/CORS:**
   - Ensure your domain is in Supabase allowed origins
   - Check browser network tab for CORS errors

### 4. Public URLs Not Working

**Symptoms:**
- Upload succeeds but images don't display
- URLs return 404 or access denied

**Solutions:**
1. **Verify Bucket is Public:**
   ```sql
   SELECT * FROM storage.buckets WHERE name IN ('artwork-images', 'avatars');
   -- Ensure 'public' column is true
   ```

2. **Update Bucket Settings:**
   ```sql
   UPDATE storage.buckets 
   SET public = true 
   WHERE name IN ('artwork-images', 'avatars');
   ```

3. **Check URL Format:**
   - Correct: `https://your-project.supabase.co/storage/v1/object/public/bucket/path`
   - Verify the URL structure matches this pattern

### 5. Environment Variables

**Symptoms:**
- "Missing Supabase environment variables" error
- Storage tests show configuration issues

**Solutions:**
1. **Check .env.local file:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Restart Development Server:**
   ```bash
   npm run dev
   ```

## Debugging Steps

### Step 1: Basic Connectivity
```javascript
// Test basic Supabase connection
import { supabase } from '@/lib/supabase'

const testConnection = async () => {
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  console.log('Connection test:', { data, error })
}
```

### Step 2: Authentication Check
```javascript
// Check if user is authenticated
const checkAuth = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('Auth check:', { user: user?.email, error })
}
```

### Step 3: Storage Bucket Access
```javascript
// List available buckets
const checkBuckets = async () => {
  const { data, error } = await supabase.storage.listBuckets()
  console.log('Buckets:', { data, error })
}
```

### Step 4: Test File Upload
```javascript
// Test file upload
const testUpload = async (file) => {
  const { data, error } = await supabase.storage
    .from('artwork-images')
    .upload(`test/${Date.now()}.jpg`, file)
  console.log('Upload test:', { data, error })
}
```

## Advanced Debugging

### Enable Detailed Logging
Add this to your service files for more detailed logs:

```javascript
// In artworkService.ts or profileService.ts
console.log('Starting upload:', { fileName, fileSize: file.size, fileType: file.type })
console.log('Upload result:', { data, error })
console.log('Public URL:', publicUrl)
```

### Check Storage Policies
```sql
-- View all storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Test policy access
SELECT test_storage_access();
```

### Monitor Network Requests
1. Open browser DevTools > Network tab
2. Try uploading a file
3. Look for failed requests to Supabase
4. Check request/response details for errors

## Getting Help

If you're still having issues:

1. **Check the Console**: Look for detailed error messages
2. **Visit `/storage-test`**: Use the built-in debugging tools
3. **Supabase Dashboard**: Check logs and monitoring
4. **Community**: Ask on Supabase Discord or GitHub discussions

## Prevention

To avoid storage issues:

1. **Always run migrations** when setting up a new environment
2. **Test storage functionality** after any configuration changes
3. **Monitor file sizes** and implement proper validation
4. **Keep environment variables secure** and up to date
5. **Regular backups** of your storage buckets

## Quick Fixes Checklist

- [ ] Environment variables are set correctly
- [ ] Database migrations have been run
- [ ] Storage buckets exist and are public
- [ ] User is authenticated
- [ ] File meets size and type requirements
- [ ] Storage policies are correctly configured
- [ ] CORS settings allow your domain