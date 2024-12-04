"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/contexts/SignUpContext";
import { useSearchParams } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";


export default function OtpCode() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);
  const baseUrl = "https://aermint.onrender.com/api/v1"
  const router = useRouter();
  // const { formData,  handleSignUp, error, isLoading } =
  // useSignUp();

  const param = useSearchParams();
  const user = param.get('userType');

  const handleInputChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setVerificationCode(value);
  }

  useEffect(() => {
    // console.log('formData:', formData)
   })

  const handleValidateOtp = async (e) => {
    e.preventDefault();
    let url = user === 'regularUser' ? 'user' : 'vendor';
    try {
      const response = await fetch(
        `${baseUrl}/${url}/auth/validate-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: verificationCode,
            triggerEvent: "account-creation",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("accessToken", data.data.token);
        setAuth(true, data.data);
        router.push("/wallets");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Invalid OTP. Please try again.");
      }

    
    //   setAuth(true, data.data);
    //   alert(`Signup successful: Welcome, ${data.firstName}!`);
    } catch (err) {
      console.error("Signup error:", err.message);
    } finally {
      // setIsLoading(false);
      console.log('otp successful')
    }
  };

  return (
    <>
      <div className="authincation">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              <div className="mini-logo text-center my-5">
                <Link href="/index">
                  <img src="./images/logo.png" alt="" />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <Link className="page-back text-muted" href="/otp-phone">
                    <span>
                      <i className="fi fi-ss-angle-small-left" />
                    </span>{" "}
                    Back
                  </Link>
                  <h3 className="text-center">OTP Verification</h3>
                  <p className="text-center mb-5">
                    We will send one time code on ending in +xxx xxxxxxxx60.
                  </p>
                  <form onSubmit={handleValidateOtp}>
                    <div className="mb-3  mb-3">
                      <label className="mb-3">Your OTP Code</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fi fi-sr-phone-call" />
                          </span>
                        </div>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-success w-100">
                        Verify
                      </button>
                    </div>
                  </form>
                  <div className="info mt-3">
                    <p className="text-muted">
                      You dont recommended to save password to browsers!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
