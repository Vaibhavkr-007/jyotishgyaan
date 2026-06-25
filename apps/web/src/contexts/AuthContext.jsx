
import React, { createContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] =
      useState(null);
  const [isAuthenticated, setIsAuthenticated] =
      useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

      const verifySession = async () => {

          const token =
              localStorage.getItem(
                  'customerToken'
              );

          if (!token) {

              setIsLoading(false);

              return;
          }

          try {

              const response =
                  await fetch(
                      'http://localhost:3001/auth/verify',
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

                  setCurrentUser(
                      data.user
                  );

                  setIsAuthenticated(
                      true
                  );

              }

          } catch (err) {

              console.error(err);

          }

          setIsLoading(false);

      };

      verifySession();

  }, []);

  const login = async (email, password) => {

    console.log("LOGIN START");

    try {

      const response = await fetch(
        'http://localhost:3001/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("DATA:", data);

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          'Login failed'
        );

      }

      localStorage.setItem(
          'customerToken',
          data.token
      );

      localStorage.setItem(
          'customerUser',
          JSON.stringify(data.user)
      );

      setCurrentUser(
          data.user
      );

      setIsAuthenticated(
          true
      );

      console.log("LOGIN SUCCESS");

      return data;

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      throw err;
    }
  };

  const signup = async (name, email, password, passwordConfirm) => {
    setError(null);
    try {
      const record = await pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm,
      }, {
        $autoCancel: false
      });

      try {
        await pb.collection('users').requestVerification(email);

        console.log(
          'Verification email sent to:',
          email
        );
      } catch (err) {
        console.error(
          'Verification email failed:',
          err
        );
      }

      return record;
    } catch (err) {
      setError(err.message || 'Signup failed.');
      throw err;
    }
  };

  const logout = () => {

    localStorage.removeItem(
        'customerToken'
    );

    localStorage.removeItem(
        'customerUser'
    );

    pb.authStore.clear();

    setCurrentUser(null);

    setIsAuthenticated(false);

};

  const updateProfile = async (id, data) => {
    setError(null);
    try {
      const record = await pb.collection('users').update(id, data, { $autoCancel: false });
      setCurrentUser(record);
      return record;
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  const value = {
    user: currentUser,
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
