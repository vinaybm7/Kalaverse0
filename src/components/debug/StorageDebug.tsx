import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StorageTest } from '@/utils/storageTest'
import { SystemCheck, SystemCheckResult } from '@/utils/systemCheck'
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
  const [isRunningSystemCheck, setIsRunningSystemCheck] = useState(false)
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
  const [systemCheckResults, setSystemCheckResults] = useState<SystemCheckResult[]>([])
  const [showSystemCheck, setShowSystemCheck] = useState(false)

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

  const runSystemCheck = async () => {
    setIsRunningSystemCheck(true)
    setSystemCheckResults([])

    try {
      const results = await SystemCheck.runAllChecks()
      setSystemCheckResults(results)
      setShowSystemCheck(true)

      const summary = SystemCheck.printResults(results)
      
      toast({
        title: "System Check Complete",
        description: `${summary.passed} passed, ${summary.failed} failed, ${summary.warnings} warnings`,
        variant: summary.failed > 0 ? "destructive" : "default"
      })
    } catch (error) {
      console.error('System check failed:', error)
      toast({
        title: "System Check Failed",
        description: "Check the console for error details",
        variant: "destructive"
      })
    } finally {
      setIsRunningSystemCheck(false)
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={runStorageTests} 
              disabled={isTestingStorage}
              variant="outline"
            >
              {isTestingStorage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Quick Storage Test
            </Button>

            <Button 
              onClick={runSystemCheck} 
              disabled={isRunningSystemCheck}
              className="bg-gradient-cultural hover:shadow-warm"
            >
              {isRunningSystemCheck ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Full System Check
            </Button>
          </div>

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

      {showSystemCheck && systemCheckResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>System Check Results</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSystemCheck(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {systemCheckResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.status === 'pass' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : result.status === 'fail' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{result.component}</h4>
                      {getStatusBadge(
                        result.status === 'pass' ? true : 
                        result.status === 'fail' ? false : null
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {typeof result.details === 'string' 
                            ? result.details 
                            : JSON.stringify(result.details, null, 2)
                          }
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {systemCheckResults.filter(r => r.status === 'pass').length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {systemCheckResults.filter(r => r.status === 'fail').length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {systemCheckResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
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