"use client";

import React, { useState, useCallback, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/dateAndTimeFormatter";
import Loading from "../loading";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getCurrentUser } = useAuth(); // Assuming this provides user authentication details
  const baseurl = "https://aermint.onrender.com/api/v1";

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Retrieve storedUser safely and parse it from JSON
      const storedUserString = localStorage?.getItem("currentUser");
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

      if (!storedUser || !storedUser.account) {
        throw new Error("Invalid user data in localStorage");
      }

      let url = "";

      // Set the appropriate API URL based on interactableType
      if (storedUser.account.interactableType === "USER") {
        url = "user/auth/user-detail";
      } else if (storedUser.account.interactableType === "VENDOR") {
        const routableNumber = storedUser.account.routable?.routableNumber;
        if (!routableNumber) {
          throw new Error("Routable number is missing for VENDOR");
        }
        url = `vendor/auth/vendor-detail?routableNumber=${routableNumber}`;
      } else {
        throw new Error("Invalid interactableType");
      }

      // Make the API request
      const response = await fetch(`${baseurl}/${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user details");
      }

      // Parse response data
      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <Layout breadcrumbTitle="Profile">
        {loading && <Loading />}
        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <div className="profile-name">
                  <div className="d-flex">
                    <img src={user?.avatar} alt="" />
                    <div className="flex-grow-1">
                      <h4 className="mb-0">
                        {user?.firstName} {user?.lastName}
                      </h4>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="profile-reg">
                  <div className="registered">
                    <h5>Created: {user && formatDate(user?.createdAt)}</h5>
                    <p>Verified</p>
                  </div>
                  <span className="reg_divider" />
                  <div className="rank">
                    <h5>{user?.account.interactableType}</h5>
                    <p>{user?.account.routable.routableNumber}</p>
                  </div>
                  <span className="reg_divider" />
                  <div className="rank">
                    <h5>{user?.country}</h5>
                    <p>Currency: {user?.account.currency}</p>
                  </div>
                </div>
                <div className="profile-wallet-nav">
                  <ul className="nav nav-tabs">
                    <li>
                      <Link
                        data-bs-toggle="tab"
                        href="#city-bank"
                        className="active"
                      >
                        <span className="icons usd">
                          <i className="fi fi-rr-bank" />
                        </span>
                        Wallet
                        <span>
                          <i className="fi fi-bs-angle-right" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
