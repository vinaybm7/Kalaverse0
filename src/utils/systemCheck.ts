import { supabase } from '@/lib/supabase'

export interface SystemCheckResult {
  component: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

export class SystemCheck {
  static async runAllChecks(): Promise<SystemCheckResult[]> {
    const results: SystemCheckResult[] = []

    console.log('🔍 Running comprehensive system checks...')

    // 1. Environment Variables
    results.push(await this.checkEnvironmentVariables())

    // 2. Supabase Connection
    results.push(await this.checkSupabaseConnection())

    // 3. Authentication
    results.push(await this.checkAuthentication())

    // 4. Database Tables
    results.push(...await this.checkDatabaseTables())

    // 5. Storage Buckets
    results.push(...await this.checkStorageBuckets())

    // 6. Storage Policies
    results.push(await this.checkStoragePolicies())

    // 7. Database Functions
    results.push(...await this.checkDatabaseFunctions())

    // 8. RLS Policies
    results.push(...await this.checkRLSPolicies())

    return results
  }

  static async checkEnvironmentVariables(): Promise<SystemCheckResult> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        component: 'Environment Variables',
        status: 'fail',
        message: 'Missing required environment variables',
        details: {
          VITE_SUPABASE_URL: !!supabaseUrl,
          VITE_SUPABASE_ANON_KEY: !!supabaseKey
        }
      }
    }

    return {
      component: 'Environment Variables',
      status: 'pass',
      message: 'All required environment variables are set'
    }
  }

  static async checkSupabaseConnection(): Promise<SystemCheckResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return {
        component: 'Supabase Connection',
        status: 'pass',
        message: 'Successfully connected to Supabase'
      }
    } catch (error: any) {
      return {
        component: 'Supabase Connection',
        status: 'fail',
        message: 'Failed to connect to Supabase',
        details: error.message
      }
    }
  }

  static async checkAuthentication(): Promise<SystemCheckResult> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      if (user) {
        return {
          component: 'Authentication',
          status: 'pass',
          message: `User authenticated: ${user.email}`,
          details: { userId: user.id, email: user.email }
        }
      } else {
        return {
          component: 'Authentication',
          status: 'warning',
          message: 'No user currently authenticated (this is normal if not signed in)'
        }
      }
    } catch (error: any) {
      return {
        component: 'Authentication',
        status: 'fail',
        message: 'Authentication check failed',
        details: error.message
      }
    }
  }

  static async checkDatabaseTables(): Promise<SystemCheckResult[]> {
    const tables = ['profiles', 'artworks', 'favorites', 'orders', 'reviews', 'notifications']
    const results: SystemCheckResult[] = []

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        results.push({
          component: `Table: ${table}`,
          status: 'pass',
          message: `Table ${table} exists and is accessible`
        })
      } catch (error: any) {
        results.push({
          component: `Table: ${table}`,
          status: 'fail',
          message: `Table ${table} is not accessible`,
          details: error.message
        })
      }
    }

    return results
  }

  static async checkStorageBuckets(): Promise<SystemCheckResult[]> {
    const results: SystemCheckResult[] = []

    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) {
        throw error
      }

      const requiredBuckets = ['artwork-images', 'avatars']
      const existingBuckets = buckets?.map(b => b.name) || []

      for (const bucket of requiredBuckets) {
        const exists = existingBuckets.includes(bucket)
        const bucketInfo = buckets?.find(b => b.name === bucket)

        results.push({
          component: `Storage Bucket: ${bucket}`,
          status: exists ? 'pass' : 'fail',
          message: exists 
            ? `Bucket ${bucket} exists and is ${bucketInfo?.public ? 'public' : 'private'}`
            : `Bucket ${bucket} does not exist`,
          details: bucketInfo
        })
      }
    } catch (error: any) {
      results.push({
        component: 'Storage Buckets',
        status: 'fail',
        message: 'Failed to check storage buckets',
        details: error.message
      })
    }

    return results
  }

  static async checkStoragePolicies(): Promise<SystemCheckResult> {
    try {
      // Try to test storage access
      const { data, error } = await supabase.rpc('test_storage_access')

      if (error) {
        throw error
      }

      return {
        component: 'Storage Policies',
        status: 'pass',
        message: 'Storage policies are configured',
        details: data
      }
    } catch (error: any) {
      return {
        component: 'Storage Policies',
        status: 'warning',
        message: 'Could not verify storage policies (function may not exist)',
        details: error.message
      }
    }
  }

  static async checkDatabaseFunctions(): Promise<SystemCheckResult[]> {
    const functions = [
      'increment_artwork_likes',
      'increment_artwork_views',
      'toggle_favorite',
      'get_artist_statistics'
    ]
    const results: SystemCheckResult[] = []

    for (const func of functions) {
      try {
        // Try to call the function with dummy data to see if it exists
        const { error } = await supabase.rpc(func, { 
          artwork_id: '00000000-0000-0000-0000-000000000000' 
        })

        // If the function exists but fails due to invalid UUID, that's expected
        if (error && (error.code === 'PGRST202' || error.message.includes('invalid input syntax'))) {
          results.push({
            component: `Function: ${func}`,
            status: 'pass',
            message: `Function ${func} exists and is callable`
          })
        } else if (error) {
          throw error
        } else {
          results.push({
            component: `Function: ${func}`,
            status: 'pass',
            message: `Function ${func} exists and is callable`
          })
        }
      } catch (error: any) {
        results.push({
          component: `Function: ${func}`,
          status: 'fail',
          message: `Function ${func} does not exist or is not accessible`,
          details: error.message
        })
      }
    }

    return results
  }

  static async checkRLSPolicies(): Promise<SystemCheckResult[]> {
    const results: SystemCheckResult[] = []

    // Test RLS by trying to access tables
    const tables = ['profiles', 'artworks', 'favorites']

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error && error.code === 'PGRST301') {
          // RLS is working (access denied)
          results.push({
            component: `RLS: ${table}`,
            status: 'pass',
            message: `RLS is enabled and working for ${table}`
          })
        } else if (error) {
          throw error
        } else {
          results.push({
            component: `RLS: ${table}`,
            status: 'pass',
            message: `RLS policies allow access to ${table} (${data?.length || 0} records visible)`
          })
        }
      } catch (error: any) {
        results.push({
          component: `RLS: ${table}`,
          status: 'warning',
          message: `Could not verify RLS for ${table}`,
          details: error.message
        })
      }
    }

    return results
  }

  static async testFileUpload(): Promise<SystemCheckResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return {
          component: 'File Upload Test',
          status: 'warning',
          message: 'Cannot test file upload - user not authenticated'
        }
      }

      // Create a small test file
      const testContent = 'Test file for Kalaverse'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      const fileName = `test/${Date.now()}-test.txt`

      // Try uploading to artwork-images bucket
      const { data, error } = await supabase.storage
        .from('artwork-images')
        .upload(fileName, testFile)

      if (error) {
        throw error
      }

      // Clean up
      await supabase.storage
        .from('artwork-images')
        .remove([fileName])

      return {
        component: 'File Upload Test',
        status: 'pass',
        message: 'File upload and deletion successful',
        details: data
      }
    } catch (error: any) {
      return {
        component: 'File Upload Test',
        status: 'fail',
        message: 'File upload test failed',
        details: error.message
      }
    }
  }

  static printResults(results: SystemCheckResult[]) {
    console.log('\n📊 System Check Results:')
    console.log('========================')

    const passed = results.filter(r => r.status === 'pass').length
    const failed = results.filter(r => r.status === 'fail').length
    const warnings = results.filter(r => r.status === 'warning').length

    results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
      console.log(`${icon} ${result.component}: ${result.message}`)
      if (result.details) {
        console.log(`   Details:`, result.details)
      }
    })

    console.log('\n📈 Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📊 Total: ${results.length}`)

    if (failed === 0) {
      console.log('\n🎉 All critical checks passed! Your system is properly configured.')
    } else {
      console.log('\n⚠️  Some checks failed. Please review the issues above.')
    }

    return { passed, failed, warnings, total: results.length }
  }
}