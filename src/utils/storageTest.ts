import { supabase } from '@/lib/supabase'

export class StorageTest {
  // Test storage bucket accessibility
  static async testStorageBuckets() {
    console.log('🧪 Testing Supabase Storage...')
    
    try {
      // Test listing buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('❌ Error listing buckets:', bucketsError)
        return false
      }
      
      console.log('✅ Available buckets:', buckets?.map(b => b.name))
      
      // Check if required buckets exist
      const requiredBuckets = ['artwork-images', 'avatars']
      const existingBuckets = buckets?.map(b => b.name) || []
      
      for (const bucket of requiredBuckets) {
        if (!existingBuckets.includes(bucket)) {
          console.warn(`⚠️  Missing bucket: ${bucket}`)
        } else {
          console.log(`✅ Bucket exists: ${bucket}`)
        }
      }
      
      return true
    } catch (error) {
      console.error('❌ Storage test failed:', error)
      return false
    }
  }

  // Test file upload
  static async testFileUpload() {
    console.log('🧪 Testing file upload...')
    
    try {
      // Create a test file
      const testContent = 'This is a test file for Kalaverse storage'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      
      const fileName = `test/${Date.now()}-test.txt`
      
      // Try uploading to artwork-images bucket
      const { data, error } = await supabase.storage
        .from('artwork-images')
        .upload(fileName, testFile)
      
      if (error) {
        console.error('❌ Upload failed:', error)
        return false
      }
      
      console.log('✅ Upload successful:', data)
      
      // Test getting public URL
      const { data: urlData } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(fileName)
      
      console.log('✅ Public URL:', urlData.publicUrl)
      
      // Clean up test file
      await supabase.storage
        .from('artwork-images')
        .remove([fileName])
      
      console.log('✅ Test file cleaned up')
      
      return true
    } catch (error) {
      console.error('❌ File upload test failed:', error)
      return false
    }
  }

  // Test authentication status
  static async testAuth() {
    console.log('🧪 Testing authentication...')
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ Auth error:', error)
        return false
      }
      
      if (user) {
        console.log('✅ User authenticated:', user.email)
        return true
      } else {
        console.log('ℹ️  No user authenticated')
        return false
      }
    } catch (error) {
      console.error('❌ Auth test failed:', error)
      return false
    }
  }

  // Run all tests
  static async runAllTests() {
    console.log('🚀 Running Supabase Storage Tests...\n')
    
    const authResult = await this.testAuth()
    const storageResult = await this.testStorageBuckets()
    const uploadResult = authResult ? await this.testFileUpload() : false
    
    console.log('\n📊 Test Results:')
    console.log(`Authentication: ${authResult ? '✅' : '❌'}`)
    console.log(`Storage Buckets: ${storageResult ? '✅' : '❌'}`)
    console.log(`File Upload: ${uploadResult ? '✅' : '❌'}`)
    
    if (authResult && storageResult && uploadResult) {
      console.log('\n🎉 All tests passed! Storage is working properly.')
      return true
    } else {
      console.log('\n⚠️  Some tests failed. Check the issues above.')
      return false
    }
  }
}