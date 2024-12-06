"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ToastDisplay from "../../components/elements/ToastDisplay";

const SignInForm = () => {
  const { signIn, isLoading, error } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecked = (e) => {
    e.preventDefault();
    handleInputChange(e);
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(credentials);
    } catch (error) {
      console.error("Sign in failed:", error);
      
    }
  };

  return (
    <div className="auth-form">
      <h4>Sign In</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={credentials?.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={credentials?.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-6">
            <div className="form-check">
              <input
                name="acceptTerms"
                id="acceptTerms"
                type="checkbox"
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                Remember me
              </label>
            </div>
          </div>
          <div className="col-6 text-end">
            <Link href="/reset">Forgot Password?</Link>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="mt-3 d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
      <p className="mt-3 mb-0 undefined">
        Don't have an account?
        <Link className="text-primary" href="/register-phone">
          {" "}
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
