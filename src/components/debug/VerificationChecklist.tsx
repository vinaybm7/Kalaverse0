import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  status: 'pending' | 'checking' | 'pass' | 'fail'
  action?: () => Promise<boolean>
}

export const VerificationChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'env',
      title: 'Environment Variables',
      description: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set',
      status: 'pending',
      action: async () => {
        return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
      }
    },
    {
      id: 'connection',
      title: 'Supabase Connection',
      description: 'Can connect to Supabase database',
      status: 'pending',
      action: async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { error } = await supabase.from('profiles').select('count').limit(1)
          return !error || error.code === 'PGRST116'
        } catch {
          return false
        }
      }
    },
    {
      id: 'tables',
      title: 'Database Tables',
      description: 'Required tables (profiles, artworks) exist',
      status: 'pending',
      action: async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const tables = ['profiles', 'artworks']
          
          for (const table of tables) {
            const { error } = await supabase.from(table).select('count').limit(1)
            if (error && error.code !== 'PGRST116') {
              return false
            }
          }
          return true
        } catch {
          return false
        }
      }
    },
    {
      id: 'storage',
      title: 'Storage Buckets',
      description: 'artwork-images and avatars buckets exist',
      status: 'pending',
      action: async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { data: buckets, error } = await supabase.storage.listBuckets()
          
          if (error) return false
          
          const bucketNames = buckets?.map(b => b.name) || []
          return bucketNames.includes('artwork-images') && bucketNames.includes('avatars')
        } catch {
          return false
        }
      }
    },
    {
      id: 'auth',
      title: 'Authentication',
      description: 'User authentication is working',
      status: 'pending',
      action: async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { error } = await supabase.auth.getUser()
          return !error
        } catch {
          return false
        }
      }
    }
  ])

  const updateItemStatus = (id: string, status: ChecklistItem['status']) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ))
  }

  const runCheck = async (item: ChecklistItem) => {
    if (!item.action) return

    updateItemStatus(item.id, 'checking')
    
    try {
      const result = await item.action()
      updateItemStatus(item.id, result ? 'pass' : 'fail')
    } catch (error) {
      console.error(`Check failed for ${item.id}:`, error)
      updateItemStatus(item.id, 'fail')
    }
  }

  const runAllChecks = async () => {
    for (const item of items) {
      if (item.action) {
        await runCheck(item)
        // Small delay between checks
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800">Checking...</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const allPassed = items.every(item => item.status === 'pass')
  const anyFailed = items.some(item => item.status === 'fail')
  const isChecking = items.some(item => item.status === 'checking')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Verification Checklist</span>
          <Button 
            onClick={runAllChecks}
            disabled={isChecking}
            size="sm"
            className="bg-gradient-cultural hover:shadow-warm"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Run All Checks
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                {getStatusIcon(item.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => runCheck(item)}
                  disabled={item.status === 'checking' || !item.action}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Status:</span>
            <Badge 
              variant={allPassed ? "default" : anyFailed ? "destructive" : "secondary"}
              className={allPassed ? "bg-green-100 text-green-800" : ""}
            >
              {allPassed ? "All Systems Ready" : 
               anyFailed ? "Issues Detected" : 
               "Not Tested"}
            </Badge>
          </div>
          
          {allPassed && (
            <p className="text-sm text-green-600 mt-2">
              🎉 Great! Your Kalaverse application is properly configured and ready to use.
            </p>
          )}
          
          {anyFailed && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Some components need attention. Please check the failed items above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}