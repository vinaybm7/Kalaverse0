import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StorageTest } from '@/utils/storageTest'
import { ArtworkService } from '@/services/artworkService'
import { ProfileService } from '@/services/profileService'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { 
  Upload, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Image,
  User
} from 'lucide-react'

export const StorageDebug = () => {
  const { user } = useAuth()
  const [isTestingStorage, setIsTestingStorage] = useState(false)
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [testResults, setTestResults] = useState<{
    auth: boolean | null
    buckets: boolean | null
    upload: boolean | null
  }>({
    auth: null,
    buckets: null,
    upload: null
  })

  const runStorageTests = async () => {
    setIsTestingStorage(true)
    setTestResults({ auth: null, buckets: null, upload: null })

    try {
      // Test authentication
      const authResult = await StorageTest.testAuth()
      setTestResults(prev => ({ ...prev, auth: authResult }))

      // Test storage buckets
      const bucketsResult = await StorageTest.testStorageBuckets()
      setTestResults(prev => ({ ...prev, buckets: bucketsResult }))

      // Test file upload (only if authenticated)
      if (authResult) {
        const uploadResult = await StorageTest.testFileUpload()
        setTestResults(prev => ({ ...prev, upload: uploadResult }))
      }

      toast({
        title: "Storage Tests Complete",
        description: "Check the console for detailed results"
      })
    } catch (error) {
      console.error('Storage tests failed:', error)
      toast({
        title: "Storage Tests Failed",
        description: "Check the console for error details",
        variant: "destructive"
      })
    } finally {
      setIsTestingStorage(false)
    }
  }

  const testArtworkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploadingArtwork(true)

    try {
      const imageUrl = await ArtworkService.uploadArtworkImage(file, user.id)
      
      if (imageUrl) {
        toast({
          title: "Artwork Upload Success",
          description: `Image uploaded successfully: ${imageUrl}`
        })
        console.log('Artwork image URL:', imageUrl)
      } else {
        throw new Error('Failed to get image URL')
      }
    } catch (error) {
      console.error('Artwork upload failed:', error)
      toast({
        title: "Artwork Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsUploadingArtwork(false)
    }
  }

  const testAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploadingAvatar(true)

    try {
      const avatarUrl = await ProfileService.uploadAvatar(file, user.id)
      
      if (avatarUrl) {
        toast({
          title: "Avatar Upload Success",
          description: `Avatar uploaded successfully: ${avatarUrl}`
        })
        console.log('Avatar URL:', avatarUrl)
      } else {
        throw new Error('Failed to get avatar URL')
      }
    } catch (error) {
      console.error('Avatar upload failed:', error)
      toast({
        title: "Avatar Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4" />
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Pending</Badge>
    return status ? (
      <Badge className="bg-green-100 text-green-800">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Storage Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>User Status:</span>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? `Authenticated (${user.email})` : "Not Authenticated"}
            </Badge>
          </div>

          <Button 
            onClick={runStorageTests} 
            disabled={isTestingStorage}
            className="w-full"
          >
            {isTestingStorage ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Run Storage Tests
          </Button>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.auth)}
                <span>Authentication</span>
              </div>
              {getStatusBadge(testResults.auth)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.buckets)}
                <span>Storage Buckets</span>
              </div>
              {getStatusBadge(testResults.buckets)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.upload)}
                <span>File Upload</span>
              </div>
              {getStatusBadge(testResults.upload)}
            </div>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Test File Uploads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="artwork-test">Test Artwork Image Upload</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="artwork-test"
                  type="file"
                  accept="image/*"
                  onChange={testArtworkUpload}
                  disabled={isUploadingArtwork}
                />
                {isUploadingArtwork && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="avatar-test">Test Avatar Upload</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="avatar-test"
                  type="file"
                  accept="image/*"
                  onChange={testAvatarUpload}
                  disabled={isUploadingAvatar}
                />
                {isUploadingAvatar && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Storage Configuration Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              <Badge variant={import.meta.env.VITE_SUPABASE_URL ? "default" : "destructive"}>
                {import.meta.env.VITE_SUPABASE_URL ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Supabase Anon Key:</span>
              <Badge variant={import.meta.env.VITE_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Missing"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}