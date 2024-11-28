"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  // const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = "https://aermint.onrender.com/api/v1";

  const getAuthenticatedUser = localStorage.getItem("isAuthenticated");

  // Use JSON parsing instead of Base64 decoding
  const decodedData = getAuthenticatedUser
    ? JSON.parse(getAuthenticatedUser)
    : false;

  const user = localStorage.getItem("currentUser");

  const decodedCurrentUser = user ? JSON.parse(user) : null;

  const [auth, setIsAuthenticated] = useState(decodedData);
  const [currentUser, setCurrentUser] = useState(decodedCurrentUser);

  // Function to set auth state and current user
  const setAuth = (authState, user = null) => {
    setIsAuthenticated(authState);
    setCurrentUser(user);
  };

  const getCurrentUser = () => currentUser;
  const getAuth = () => auth;

  useEffect(() => {
    // Directly use JSON for localStorage without Base64 encoding
    const authData = auth ? JSON.stringify(auth) : false;
    const currentUserData = currentUser ? JSON.stringify(currentUser) : null;

    localStorage.setItem("isAuthenticated", authData);
    localStorage.setItem("currentUser", currentUserData);
  }, [auth, currentUser]);

  // Handle sign-in logic
  const signIn = async (userType, credentials) => {
    setIsLoading(true);
    setError(null);
    console.log("login creds", credentials);
    console.log("userType", userType);

    // Define the API endpoint based on the user type
    let url = "";
    if (userType && userType === "regularUser") {
      url = "user";
    } else if (userType && userType === "vendorUser") {
      url = "vendor";
    } else {
      throw new Error("Invalid user type selected.");
    }

    try {
      const response = await fetch(`${baseUrl}/${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.data.token);
      setAuth(true, data.data);
      console.log(data.data);
      router.push("/"); // Redirect to home page
      console.log("login successful");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, signIn, setAuth, getCurrentUser, getAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
