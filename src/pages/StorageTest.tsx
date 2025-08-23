import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { StorageDebug } from "@/components/debug/StorageDebug"
import { VerificationChecklist } from "@/components/debug/VerificationChecklist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoIcon } from "lucide-react"

const StorageTest = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-cultural bg-clip-text text-transparent mb-4">
            Storage Testing & Debug
          </h1>
          <p className="text-gray-600">
            Use this page to test and debug Supabase storage functionality.
          </p>
        </div>

        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            This page is for development and testing purposes. Make sure you're signed in to test file uploads.
            Check the browser console for detailed logs and error messages.
          </AlertDescription>
        </Alert>

        <StorageDebug />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common Storage Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">1. Buckets Not Found</h4>
              <p className="text-sm text-gray-600">
                Run the database migrations to create storage buckets. Check the Supabase dashboard under Storage.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">2. Upload Permission Denied</h4>
              <p className="text-sm text-gray-600">
                Ensure you're authenticated and the storage policies are correctly set up. Check RLS policies in Supabase.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">3. File Size Limits</h4>
              <p className="text-sm text-gray-600">
                Artwork images: 10MB max, Avatars: 5MB max. Check file size before uploading.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">4. CORS Issues</h4>
              <p className="text-sm text-gray-600">
                Make sure your domain is added to the allowed origins in Supabase settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}

export default StorageTest