import { useState, useEffect } from 'react';
import { isTokenValid, hasAdminAccess, removeAuthToken } from '../utils/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isTokenValid();
      setIsAuthenticated(authenticated);
      setIsAdmin(authenticated && hasAdminAccess());
      setIsLoading(false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return { isAuthenticated, isAdmin, isLoading, logout };
}