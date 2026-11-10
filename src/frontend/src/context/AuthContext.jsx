import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nyayasetu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nyayasetu_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('nyayasetu_token');
      if (storedToken) {
        try {
          const profile = await authApi.getProfile();
          if (profile && profile.data) {
            setUser(profile.data);
            localStorage.setItem('nyayasetu_user', JSON.stringify(profile.data));
          }
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('nyayasetu_token', newToken);
    localStorage.setItem('nyayasetu_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('nyayasetu_token');
    localStorage.removeItem('nyayasetu_user');
    setToken(null);
    setUser(null);
  };

  const isCitizen = user?.role === 'citizen';
  const isLawyer = user?.role === 'lawyer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        isCitizen,
        isLawyer,
        isAdmin,
      }}
    >
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

