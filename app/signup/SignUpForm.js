"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import Link from "next/link";

const SignUpForm = () => {
  const { formData, handleInputChange, handleSignUp, error, isLoading } =
    useSignUp();

  const [vendor, setVendor] = useState(false);

  const handleChecked = (e) => {
    console.log("e:", e.target.value);
    handleInputChange(e);
    if (e.target.value === "vendorUser") {
      setVendor(true);
    } else {
      setVendor(false);
    }
    console.log("vendor:", vendor);
  };

  useEffect(() => {
    // handleChecked();
  }, [handleChecked]);

  return (
    <div className="auth-form">
      <h4>Sign Up</h4>
      <form onSubmit={handleSignUp}>
        <div className="col-12 mb-3">
          <label className="form-label">User Type</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="userType"
              id="regularUser"
              value="regularUser"
              checked={(e) => handleChecked(e)}
              onChange={(e) => handleChecked(e)}
            />
            <label className="form-check-label" htmlFor="regularUser">
              Regular User
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="userType"
              id="vendorUser"
              value="vendorUser"
              checked={(e) => handleChecked(e)}
              onChange={(e) => handleChecked(e)}
            />
            <label className="form-check-label" htmlFor="vendorUser">
              Vendor
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label">First Name</label>
            <input
              name="firstName"
              type="text"
              className="form-control"
              value={formData?.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Last Name</label>
            <input
              name="lastName"
              type="text"
              className="form-control"
              value={formData?.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              className="form-control"
              value={formData?.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Country</label>
            <input
              name="country"
              type="text"
              className="form-control"
              value={formData?.country}
              onChange={handleInputChange}
            />
          </div>
          {vendor === false && (
            <div className="col-12 mb-3">
              <label className="form-label">
                National Identification Number
              </label>
              <input
                name="nationalIdentificationNumber"
                type="text"
                className="form-control"
                value={formData?.nationalIdentificationNumber}
                onChange={handleInputChange}
              />
            </div>
          )}
          {vendor ? (
            <>
              <div className="col-12 mb-3">
                <label className="form-label">Business Name</label>
                <input
                  name="businessName"
                  type="text"
                  className="form-control"
                  value={formData?.businessName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Business Address</label>
                <input
                  name="businessAddress"
                  type="text"
                  className="form-control"
                  value={formData?.businessAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Business Type</label>
                <input
                  name="businessType"
                  type="text"
                  className="form-control"
                  value={formData?.businessType}
                  onChange={handleInputChange}
                />
              </div>
            </>
          ) : null}
          <div className="col-12 mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData?.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={formData?.password}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="col-12">
            <div className="form-check">
              <input
                name="acceptTerms"
                type="checkbox"
                className="form-check-input"
                id="acceptTerms"
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                I certify that I am 18 years of age or older, and agree to the{" "}
                <Link href="#" className="text-primary">
                  User Agreement
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
          </div> */}
        </div>
        {error && <p className="text-danger">{error}</p>}

        <div className="mt-3 d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p className="mt-3 mb-0 undefined">
        Already have an account?
        <Link className="text-primary" href="/signin">
          {" "}
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;