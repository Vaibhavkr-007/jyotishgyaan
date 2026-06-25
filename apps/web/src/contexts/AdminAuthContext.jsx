
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiServerClient from '@/lib/apiServerClient';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const verifySession = async () => {

      console.log(
          '[AdminAuthContext] Verifying session...'
      );

      const token =
          localStorage.getItem(
              'adminToken'
          );

      if (!token) {

          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);

          return;
      }

      try {

          const response =
              await apiServerClient.fetch(
                  '/admin/auth/verify-session',
                  {
                      headers: {
                          Authorization:
                              `Bearer ${token}`
                      }
                  }
              );

          const data =
              await response.json();

          if (response.ok) {

              setIsAuthenticated(true);
              setUser(data.user);

          } else {

              localStorage.removeItem(
                  'adminToken'
              );

              localStorage.removeItem(
                  'adminUser'
              );

              setIsAuthenticated(false);
              setUser(null);

          }

      } catch (error) {

          console.error(error);

          setIsAuthenticated(false);
          setUser(null);

      } finally {

          setIsLoading(false);

      }

  };

  useEffect(() => {
    verifySession();
  }, []);

  const login = (token, userData) => {

      localStorage.setItem(
          'adminToken',
          token
      );

      localStorage.setItem(
          'adminUser',
          JSON.stringify(userData)
      );

      setIsAuthenticated(true);
      setUser(userData);

  };

  const logout = () => {

      localStorage.removeItem(
          'adminToken'
      );

      localStorage.removeItem(
          'adminUser'
      );

      setIsAuthenticated(false);
      setUser(null);

  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, verifySession }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
