"use client";

import React, { useState, useCallback, useEffect } from "react";

import ChartjsProfileWallet from "@/components/chart/ChartjsProfileWallet";
import ChartjsProfileWallet2 from "@/components/chart/ChartjsProfileWallet2";
import ChartjsProfileWallet3 from "@/components/chart/ChartjsProfileWallet3";
import ChartjsProfileWallet4 from "@/components/chart/ChartjsProfileWallet4";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/dateAndTimeFormatter";
import Loading from "../loading";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getCurrentUser } = useAuth();

  const baseurl = "https://aermint.onrender.com/api/v1";

  console.log("user:", getCurrentUser()?.account);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      let url = "";

      if (getCurrentUser()?.account?.interactableType === "USER") {
        url = `user/auth/user-detail`;
      } else if (getCurrentUser()?.account?.interactableType === "VENDOR") {
        url = `vendor/auth/vendor-detail`;
      }
      const response = await fetch(`${baseurl}/${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setUser(data.data);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred. Please try again."
        );
      }
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
                    <p>₦ - {user?.account.currency}</p>
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
          <div className="col-xl-8">
            <div className="tab-content profile-wallet-tab">
              <div className="tab-pane fade show active" id="city-bank">
                <div className="card">
                  <div className="card-body">
                    <div className="wallet-progress-data">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span>Lower Balance</span>
                          <h3>{user?.account.lowerBalance}</h3>
                        </div>
                        <div className="text-end">
                          <span>Completed Balance</span>
                          <h3>{user?.account.completedBalance}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">City Bank</h4>
                    <div id="area-chart-action" className="nav d-block">
                      <span className="active" data-bs-toggle="tab">
                        Day
                      </span>
                      <span data-bs-toggle="tab">Week</span>
                      <span data-bs-toggle="tab">Month</span>
                      <span data-bs-toggle="tab">Year</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <ChartjsProfileWallet />
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="debit-card">
                <div className="card">
                  <div className="card-body">
                    <div className="wallet-progress-data">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span>Spend</span>
                          <h3>$1458.30</h3>
                        </div>
                        <div className="text-end">
                          <span>Budget</span>
                          <h3>$1458.30</h3>
                        </div>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "25%" }}
                          role="progressbar"
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span>25%</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Debit Card</h4>
                    <div id="area-chart-action2" className="nav d-block">
                      <span className="active" data-bs-toggle="tab">
                        Day
                      </span>
                      <span data-bs-toggle="tab">Week</span>
                      <span data-bs-toggle="tab">Month</span>
                      <span data-bs-toggle="tab">Year</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <ChartjsProfileWallet2 />
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="visa-card">
                <div className="card">
                  <div className="card-body">
                    <div className="wallet-progress-data">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span>Spend</span>
                          <h3>$1458.30</h3>
                        </div>
                        <div className="text-end">
                          <span>Budget</span>
                          <h3>$1458.30</h3>
                        </div>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "25%" }}
                          role="progressbar"
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span>25%</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Visa Card</h4>
                    <div id="area-chart-action3" className="nav d-block">
                      <span className="active" data-bs-toggle="tab">
                        Day
                      </span>
                      <span data-bs-toggle="tab">Week</span>
                      <span data-bs-toggle="tab">Month</span>
                      <span data-bs-toggle="tab">Year</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <ChartjsProfileWallet3 />
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="cash">
                <div className="card">
                  <div className="card-body">
                    <div className="wallet-progress-data">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span>Spend</span>
                          <h3>$1458.30</h3>
                        </div>
                        <div className="text-end">
                          <span>Budget</span>
                          <h3>$1458.30</h3>
                        </div>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "25%" }}
                          role="progressbar"
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span>25%</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Cash</h4>
                    <div id="area-chart-action4" className="nav d-block">
                      <span className="active" data-bs-toggle="tab">
                        Day
                      </span>
                      <span data-bs-toggle="tab">Week</span>
                      <span data-bs-toggle="tab">Month</span>
                      <span data-bs-toggle="tab">Year</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <ChartjsProfileWallet4 />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
