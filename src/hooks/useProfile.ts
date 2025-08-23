import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { Profile } from '@/types/database';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userProfile = await ProfileService.getCurrentProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const refreshProfile = () => {
    loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile
  };
};