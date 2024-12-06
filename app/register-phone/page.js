"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import Loading from "../loading";

export default function RegisterPhone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // Array for OTP inputs
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRefs = useRef([]); // Ref for input focus handling
  const baseUrl = "https://aermint.onrender.com/api/v1";
  const router = useRouter();

  // Register phone number
  const registerPhoneNumber = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/auth/register-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();
      console.log(data);
      setShowOtpInput(true);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpValue = otp.join(""); // Combine OTP digits
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/auth/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phoneNumber, otp: otpValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();
      console.log(data);
      router.push("/signup");
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move focus to the next input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace and arrow key navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      const updatedOtp = [...otp];
      updatedOtp[index] = ""; // Clear current input
      setOtp(updatedOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Prevent paste in OTP inputs
  const handlePaste = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {loading && <Loading />}
      <div className="verification section-padding">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Register number to signup</h4>
                </div>
                <div className="card-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      registerPhoneNumber();
                    }}
                  >
                    <div className="form-row">
                      <div className="mb-3 col-xl-12">
                        <label className="mr-sm-2">Phone number</label>
                        <input
                          type="text"
                          value={phoneNumber}
                          className="form-control"
                          placeholder="Enter phone number"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{
                            backgroundColor: "#007bff",
                            borderColor: "#007bff",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </form>

                  {showOtpInput && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        verifyOtp();
                      }}
                    >
                      <label className="mr-sm-2">Enter OTP</label>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ gap: "10px", margin: "20px 0" }}
                      >
                        {otp?.map((value, index) => (
                          <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleOtpChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="form-control text-center"
                            maxLength="1"
                            style={{
                              height: "50px",
                              fontSize: "18px",
                              fontWeight: "bold",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                            ref={(el) => (inputRefs.current[index] = el)}
                          />
                        ))}
                      </div>
                      <div className="col-12 mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{
                            backgroundColor: "#007bff",
                            borderColor: "#007bff",
                            padding: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <ToastDisplay
          title="Error"
          message={error}
          type="error"
          show={error}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
}
