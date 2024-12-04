"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToastDisplay from "../components/elements/ToastDisplay";
import Loading from "../app/loading";

const AuthContext = createContext({
  auth: false,
  currentUser: null,
  setAuth: () => {},
  getCurrentUser: () => {},
  getAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = "https://aermint.onrender.com/api/v1";

  // States to manage authentication and user data
  const [auth, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Access localStorage on the client side
    if (typeof window !== "undefined") {
      const getAuthenticatedUser = localStorage.getItem("isAuthenticated");
      const user = localStorage.getItem("currentUser");

      const decodedAuth = getAuthenticatedUser
        ? JSON.parse(getAuthenticatedUser)
        : false;
      const decodedUser = user ? JSON.parse(user) : null;

      setIsAuthenticated(decodedAuth);
      setCurrentUser(decodedUser);
    }
  }, []);

  // Function to set auth state and current user
  const setAuth = (authState, user = null) => {
    setIsAuthenticated(authState);
    setCurrentUser(user);

    // Update localStorage on the client side
    if (typeof window !== "undefined") {
      const authData = authState ? JSON.stringify(authState) : false;
      const currentUserData = user ? JSON.stringify(user) : null;

      localStorage.setItem("isAuthenticated", authData);
      localStorage.setItem("currentUser", currentUserData);
    }
  };

  const getCurrentUser = () => currentUser;
  const getAuth = () => auth;

  // Handle sign-in logic
  const signIn = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Incorrect email or password.");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.data.token);
      setAuth(true, data.data);
      console.log(data.data);
      router.push("/wallets"); // Redirect to home page
      console.log("login successful");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
    }
    setAuth(false, null);
    console.log("logout successful");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        setAuth,
        getCurrentUser,
        getAuth,
        signOut,
      }}
    >
      {children}
      {isLoading && <Loading />}
      {error && (
        <ToastDisplay
          title="Error"
          message={error}
          type="error"
          show={error}
          onClose={() => setError(null)}
        />
      )}
    </AuthContext.Provider>
  );
};
