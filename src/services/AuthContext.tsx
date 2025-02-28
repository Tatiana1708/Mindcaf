import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from './authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; service: string; role: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  hasPermission: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; service: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Token expiration time in milliseconds (24 hours)
  const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

  useEffect(() => {
    // Check for existing auth token and its expiration in localStorage
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    const tokenExpiration = localStorage.getItem('token_expiration');

    if (token && storedUser && tokenExpiration) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiration)) {
        try {
          authService.verifyToken(token);
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } catch (err) {
          logout();
        }
      } else {
        // Token has expired, clean up
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string, service?: string) => {
    try {
      setError(null);
      if (username === 'public' && password === 'public') {
        const token = 'dummy_token_public';
        const userData = { username, service: 'Public Access', role: 'public' };
        const expirationTime = new Date().getTime() + TOKEN_EXPIRATION;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token_expiration', expirationTime.toString());
        
        setIsAuthenticated(true);
        setUser(userData);
      } else if (username === 'admin' && password === 'admin') {
        const token = 'dummy_token_admin';
        const userData = { username, service: 'Admin Access', role: 'admin' };
        const expirationTime = new Date().getTime() + TOKEN_EXPIRATION;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token_expiration', expirationTime.toString());
        
        setIsAuthenticated(true);
        setUser(userData);
      } 
      // else {
      //   const response = await authService.login(username, password);
      //   const { token, user: userData } = response;
      //   const expirationTime = new Date().getTime() + TOKEN_EXPIRATION;
        
      //   localStorage.setItem('auth_token', token);
      //   localStorage.setItem('user', JSON.stringify(userData));
      //   localStorage.setItem('token_expiration', expirationTime.toString());
        
      //   setIsAuthenticated(true);
      //   setUser(userData);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiration');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const hasPermission = (requiredRole: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, error, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};