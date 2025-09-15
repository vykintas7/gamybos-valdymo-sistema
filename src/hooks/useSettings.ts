import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
import { UserSettings, UserProfile } from '../types/notification';
import { useAuth } from '../contexts/AuthContext';

const defaultSettings: UserSettings = {
  theme: 'light',
  language: 'lt',
  dateFormat: 'yyyy-mm-dd',
  currency: 'EUR',
  timezone: 'Europe/Vilnius',
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    formulaUpdates: true,
    commentNotifications: true,
    systemUpdates: true,
    weeklyReports: false
  }
};

export const useSettings = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Update user profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUserProfile({
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        role: currentUser.role,
        phone: '+370 600 12345', // Default phone
        department: currentUser.department,
        joinedAt: currentUser.createdAt,
        lastLogin: currentUser.lastLogin || new Date().toISOString(),
        settings: defaultSettings
      });
    }
  }, [currentUser]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    if (!userProfile) return;
    setUserProfile(prev => ({
      ...prev!,
      settings: {
        ...prev!.settings,
        ...newSettings
      }
    }));
  };

  const updateNotificationSettings = (notificationSettings: Partial<UserSettings['notifications']>) => {
    if (!userProfile) return;
    setUserProfile(prev => ({
      ...prev!,
      settings: {
        ...prev!.settings,
        notifications: {
          ...prev!.settings.notifications,
          ...notificationSettings
        }
      }
    }));
  };

  const updateProfile = (profileData: Partial<Omit<UserProfile, 'id' | 'settings'>>) => {
    if (!userProfile) return;
    setUserProfile(prev => ({
      ...prev!,
      ...profileData
    }));
  };

  const resetSettings = () => {
    if (!userProfile) return;
    setUserProfile(prev => ({
      ...prev!,
      settings: defaultSettings
    }));
  };

  return {
    userProfile,
    settings: userProfile?.settings || defaultSettings,
    loading,
    updateSettings,
    updateNotificationSettings,
    updateProfile,
    resetSettings
  };
};