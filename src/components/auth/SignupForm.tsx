import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, Sparkles, Brush, Heart } from 'lucide-react'

interface SignupFormProps {
  onToggleMode: () => void
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'buyer' // buyer or artist
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        user_type: formData.userType
      })
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Welcome to KalaVerse! 🎨",
          description: "Account created successfully! Please sign in to continue your artistic journey."
        })
        // Redirect to login after successful signup
        setTimeout(() => {
          onToggleMode()
        }, 1500)
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
      <CardHeader className="text-center pb-4 relative">
        {/* Cultural decorative elements */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gradient-cultural rounded-full mb-1"></div>
          <div className="w-8 h-1 bg-gradient-cultural rounded-full mx-auto opacity-60"></div>
        </div>
        
        <div className="mt-6 mb-2">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent mb-1">
          Join KalaVerse
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Begin your artistic journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="h-10 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="artist@kalaverse.com"
              value={formData.email}
              onChange={handleInputChange}
              className="h-10 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType" className="text-sm font-medium text-foreground">
              I am a
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'buyer'})}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  formData.userType === 'buyer' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border/50 hover:border-primary/30 bg-background/50'
                }`}
              >
                <Heart className="w-4 h-4 mb-1" />
                <div className="text-xs font-medium">Art Enthusiast</div>
                <div className="text-xs text-muted-foreground">Discover & collect</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'artist'})}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  formData.userType === 'artist' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border/50 hover:border-primary/30 bg-background/50'
                }`}
              >
                <Brush className="w-4 h-4 mb-1" />
                <div className="text-xs font-medium">Traditional Artist</div>
                <div className="text-xs text-muted-foreground">Create & sell</div>
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleInputChange}
                className="h-10 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="h-10 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm transition-all duration-200"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-10 bg-gradient-cultural hover:shadow-warm transition-all duration-300 text-white font-medium text-sm mt-4" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {loading ? 'Creating Account...' : 'Join KalaVerse'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Already part of KalaVerse?</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/10 font-medium transition-colors" 
            onClick={onToggleMode}
          >
            Sign in to your account →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}