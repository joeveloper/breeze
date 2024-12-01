"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useRouter } from "next/navigation";

export default function FinalizePayment() {
  // const [vendor, setVendor] = useState({});
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const baseUrl = "https://aermint.onrender.com/api/v1";
  const router = useRouter();

  const param = useSearchParams();

  const finalizeTransaction = async () => {
    try {
      // const {} = vendor;
      const response = await fetch(`${baseUrl}/transactions/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: param.get("amount") > 0 && parseInt(param.get("amount")),
          routableNumber: param.get("routableNumber"),
        }),
      });
      if (!response.ok) {
        throw new Error("An error occurred!");
      }
      const data = await response.json();
      setTransactionDetails(data);
      setTimeout(() => {
        router.push("/wallets");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    finalizeTransaction();
  };

  return (
    <>
      <Layout breadcrumbTitle="Complete Process">
        <div className="verification section-padding">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-xl-5 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Finalize Transaction</h2>
                    {/* <br/> */}
                  </div>

                  <div className="card-body">
                    <div>
                      <h6>
                        Amount: {param.get("currency")} {param.get("amount")}
                      </h6>
                      <h6>{param.get("info")}</h6>
                      <h6>Account Number: {param.get("routableNumber")}</h6>
                    </div>
                    <button
                      onClick={(e) => handlePay(e)}
                      className="btn btn-secondary btn-success w-100"
                      style={{
                        // backgroundColor: "green",
                        borderColor: "#6c757d",
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderRadius: "5px",
                      }}
                    >
                      Complete
                    </button>
                    <br />
                    <button
                      onClick={(e) => handlePay(e)}
                      className="btn btn-secondary btn-danger w-100"
                      style={{
                        // backgroundColor: "green",
                        borderColor: "#6c757d",
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderRadius: "5px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {transactionDetails && (
          <ToastDisplay
            show={true}
            title="Transaction Details"
            message={`STATUS: ${transactionDetails?.message}`}
            type="success"
          />
        )}
      </Layout>
    </>
  );
}
