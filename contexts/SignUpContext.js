"use client";

import React, { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const {setAuth} = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(null);

  const baseUrl = "https://aermint.onrender.com/api/v1";

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading state

    try {
      const {
        userType, // Corrected this typo to reference it from formData
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        country,
        nationalIdentificationNo,
        rcNumber,
      } = formData;

      console.log("Signup form data:", formData);

      // Define the API endpoint based on the user type
      let url = "";
      if (userType === "regularUser") {
        url = "user/auth/register";
      } else if (userType === "vendorUser") {
        url = "vendor/auth/register";
      } else {
        throw new Error("Invalid user type selected.");
      }

      // Define the payload based on the user type
      let payload;
      if (userType === "regularUser") {
        payload = {
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          country,
          nationalIdentificationNo,
        };
      } else if (userType === "vendorUser") {
        // if (!businessName || !businessAddress || !businessType) {
        //   throw new Error(
        //     "Please fill out all required fields for vendor registration."
        //   );
        // }
        payload = {
          password,
          phoneNumber,
          rcNumber,
        };
      }

      console.log("Signup payload:", payload);

      // Make the API request
      const response = await fetch(`${baseUrl}/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle response errors
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Signup failed. Please try again."
        );
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      console.log(data);
      localStorage.setItem("accessToken", data.data.token);
      setAuth(true, data.data);
      router.push("/wallets");

      // Navigate to OTP page
      router.push(`/wallets`);
      alert(`Signup successful: Welcome, ${data.firstName || "User"}!`);
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        formData,
        handleInputChange,
        handleSignUp,
        error,
        isLoading,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

// Custom hook for consuming the SignUpContext
export const useSignUp = () => useContext(SignUpContext);
