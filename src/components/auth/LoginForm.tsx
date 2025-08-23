import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, Palette } from 'lucide-react'

interface LoginFormProps {
  onToggleMode: () => void
  onClose?: () => void
}

export const LoginForm = ({ onToggleMode, onClose }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  // Navigate to dashboard when user becomes authenticated
  useEffect(() => {
    if (user && !loading) {
      if (onClose) {
        onClose()
      }
      navigate('/dashboard')
    }
  }, [user, loading, navigate, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Welcome back to KalaVerse! 🎨",
          description: "Redirecting to your dashboard..."
        })
        // Close modal immediately and redirect
        if (onClose) {
          onClose()
        }
        // Navigate immediately after successful login
        navigate('/dashboard')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-warm bg-gradient-to-br from-card via-card to-muted/30">
      <CardHeader className="text-center pb-8 relative">
        {/* Cultural decorative element */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gradient-cultural rounded-full mb-2"></div>
          <div className="w-8 h-1 bg-gradient-cultural rounded-full mx-auto opacity-60"></div>
        </div>
        
        <div className="mt-8 mb-4">
          <Palette className="w-8 h-8 mx-auto mb-3 text-primary" />
        </div>
        
        <CardTitle className="text-3xl font-bold bg-gradient-cultural bg-clip-text text-transparent mb-2">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Continue your journey through India's rich artistic heritage
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="artist@kalaverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-cultural hover:shadow-warm transition-all duration-300 text-white font-medium text-base" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Signing In...' : 'Sign In to KalaVerse'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">New to KalaVerse?</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/10 font-medium transition-colors" 
            onClick={onToggleMode}
          >
            Create your artist account →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}