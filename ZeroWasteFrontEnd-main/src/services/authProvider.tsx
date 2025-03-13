import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loginUser, logoutUser, getUserProfile, UserdeleteAccount,
  UpdateAllergies, UpdateNotificationDay, UpdatePreferences,
  ChangePassword, RefreshAccessToken,UpdatePreferredNotificationHour
} from './apiClient';
import { User } from '../entities/User';


interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  share_code: string;
  setShareCode: (share_code: string) => void;
  login: (email: string, password: string) => Promise<string | undefined>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string, confirm_password: string) => Promise<any>;
  updateAllergies: (allergies: string[]) => Promise<void>;
  updateNotificationDay: (notificationDay: number) => Promise<void>;
  updatePreferences: (preferences: string[]) => Promise<void>;
  
  refreshAccessToken: () => Promise<void>;
  updatePreferredNotificationHour: (preferredNotificationHour: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [share_code, setShareCode] = useState<string>('');
  

 const profile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
        if (!isAuthenticated)
        {
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setIsAuthenticated(false);
      sessionStorage.removeItem('accessToken');
    }
  };


  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if( ! user){
      if (token) {
        profile();
        setAccessToken(token);
        setIsAuthenticated(true);
        if (sessionStorage.getItem('share_code')) {
          setShareCode(sessionStorage.getItem('share_code')!);
        }
      }
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const accessToken = await loginUser(email, password);
      if (accessToken) {
          const profile = await getUserProfile();
          setUser(profile!);
          setIsAuthenticated(true);
          setAccessToken(accessToken);
          return accessToken;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();

      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      const response = await UserdeleteAccount(password);
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
      sessionStorage.clear();
      localStorage.clear();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string, confirm_password: string) => {
    try {
      const response = await ChangePassword(oldPassword, newPassword, confirm_password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateAllergies = async (allergies: string[]) => {
    try {
      await UpdateAllergies(allergies);
      profile();
    } catch (error) {
      console.error('Update allergies failed:', error);
    }
  };

  const updateNotificationDay = async (notificationDay: number) => {
    try {
      await UpdateNotificationDay(notificationDay);
      profile();
    } catch (error) {
      console.error('Update notification day failed:', error);
    }
  };

  const updatePreferences = async (preferences: string[]) => {
    try {
      await UpdatePreferences(preferences);
      profile();
    } catch (error) {
      console.error('Update preferences failed:', error);
    }
  };

  const updatePreferredNotificationHour = async (preferredNotificationHour: string) => {
    try {
      if (preferredNotificationHour == "") {
        preferredNotificationHour = "--:--";
      }else
        preferredNotificationHour = preferredNotificationHour.substring(0, 5);
      await UpdatePreferredNotificationHour(preferredNotificationHour);
      profile();
    } catch (error) {
      console.error('Update preferred notification hour failed:', error);
    }
  };



  const refreshAccessToken = async () => {
    try {
      const acces = await RefreshAccessToken();
      if (acces) {
        setAccessToken(acces);
        sessionStorage.setItem('accessToken', acces);
      }
    } catch (error : any) {
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, accessToken , login, logout, deleteAccount, changePassword, updateAllergies, updateNotificationDay, updatePreferences, refreshAccessToken, share_code, setShareCode, updatePreferredNotificationHour }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
