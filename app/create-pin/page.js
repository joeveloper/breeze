"use client";

import React, { useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import Loading from "../loading";
import { useAuth } from "../../contexts/AuthContext";

export default function AddBank() {
  const [pinData, setPinData] = useState(Array(4).fill(""));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { getCurrentUser } = useAuth();

  const styles = {
    height: "50px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const handleInputChange = (value, index) => {
    if (value.length > 1) return; // Ensure only one character is entered

    const updatedPin = [...pinData];
    updatedPin[index] = value;
    setPinData(updatedPin);

    // Move focus to the next input
    if (value && index < pinData.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinData[index] && index > 0) {
      // Move focus to the previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Disable paste
  };

  const createTransactionPin = async () => {
    try {
      setLoading(true);
      const pinCode = pinData?.join("");

      const response = await fetch(`${baseUrl}/auth/create-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          pin: pinCode,
          routableNumber: getCurrentUser?.account?.routable?.routableNumber,
        }),
      });

      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();
      setVendor(data?.data);
      router.push(`/wallets`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createTransactionPin();

  };

  return (
    <>
      <Layout breadcrumbTitle="New Transaction">
        {loading && <Loading />}
        <div className="verification section-padding">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-xl-5 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Create 4-digit Pin</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ gap: "10px", margin: "20px 0" }}
                      >
                        {pinData.map((value, index) => (
                          <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleInputChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="form-control text-center"
                            maxLength="1"
                            style={styles}
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
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                          disabled={loading || !pinData.every((value) => value)}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                    <br />
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
      </Layout>
    </>
  );
}
