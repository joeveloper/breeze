"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import ChartjsBalanceOvertime2 from "@/components/chart/ChartjsBalanceOvertime2";
import ChartjsBalanceOvertime3 from "@/components/chart/ChartjsBalanceOvertime3";
import ChartjsBalanceOvertime4 from "@/components/chart/ChartjsBalanceOvertime4";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/dateAndTimeFormatter";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function Wallets() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [user, setUser] = useState(null);
  // const [storedUser, setStoredUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pinStatus, setPinStatus] = useState(false);
  const [transactionsList, setTransactionsList] = useState(null);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const router = useRouter();

  const baseurl = "https://aermint.onrender.com/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();

      await fetchUserTransactions();
    };
    fetchData();
  }, []);

  const fetchUserDetails = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const type =
      storedUser?.account?.interactableType === "USER"
        ? "user/auth/user-detail"
        : "vendor/auth/vendor-detail";
    try {
      // setLoading(true);
      const response = await fetch(`${baseurl}/${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        const user = await data?.data;
        setUser(user);
        console.log(user);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message); // Save error message to display
    } finally {
      // setLoading(false);
    }
  }, [user]);

  const fetchUserTransactions = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = storedUser?.id || user?.id;
    const routableNumber =
      storedUser?.account.routable?.routableNumber || user?.routableNumber;
    const type =
      storedUser?.account?.interactableType === "USER"
        ? "user?userId"
        : "vendor?vendorId";
    try {
      setLoading(true);
      const response = await fetch(
        `${baseurl}/transactions/${type}=${userId}&routableNumber=${routableNumber}&page=1&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("tx", data.data);
        setTransactionsList(data.data);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message); // Save error message to display
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkPinStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/user/auth/pin-status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setPinStatus(true);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message); // Save error message to display
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (transaction) => {
    const transactionData = transaction && encodeURIComponent(JSON.stringify(transaction));
    router.push(`/transaction-details?data=${transactionData}`);
  };

  return (
    <>
      <Layout breadcrumbTitle="Wallets">
        {loading && <Loading />}

        {user &&
          user?.account?.interactableType === "USER" &&
          pinStatus === false && (
            <ToastDisplay
              message={
                <span>
                  <Link href="/create-pin">Click here to create a pin.</Link>
                </span>
              }
              type="warning"
            />
          )}
        <div className="wallet-tab">
          <div className="row g-0">
            <div className="col-xl-3">
              <div className="nav d-block">
                <div className="row">
                  <div className="col-xl-12 col-md-6">
                    {/* <div
                      onClick={() => handleOnClick(1)}
                      className={
                        activeIndex === 1 ? "wallet-nav active" : "wallet-nav"
                      }
                    > */}
                    {/* <div className="wallet-nav-icon">
                        <span>
                          <i className="fi fi-rr-bank" />
                        </span>
                      </div> */}
                    {/* <div className="wallet-nav-text">
                        <h3>City Bank</h3>
                        <p>$221,478</p>
                      </div> */}
                    {/* </div> */}
                  </div>
                  {/* <div className="col-xl-12 col-md-6">
                    <div
                      onClick={() => handleOnClick(2)}
                      className={
                        activeIndex === 2 ? "wallet-nav active" : "wallet-nav"
                      }
                    >
                      <div className="wallet-nav-icon">
                        <span>
                          <i className="fi fi-rr-credit-card" />
                        </span>
                      </div>
                      <div className="wallet-nav-text">
                        <h3>Debit Card</h3>
                        <p>$221,478</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-6">
                    <div
                      onClick={() => handleOnClick(3)}
                      className={
                        activeIndex === 3 ? "wallet-nav active" : "wallet-nav"
                      }
                    >
                      <div className="wallet-nav-icon">
                        <span>
                          <i className="fi fi-brands-visa" />
                        </span>
                      </div>
                      <div className="wallet-nav-text">
                        <h3>Visa Card</h3>
                        <p>$221,478</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-6">
                    <div
                      onClick={() => handleOnClick(4)}
                      className={
                        activeIndex === 4 ? "wallet-nav active" : "wallet-nav"
                      }
                    >
                      <div className="wallet-nav-icon">
                        <span>
                          <i className="fi fi-rr-money-bill-wave-alt" />
                        </span>
                      </div>
                      <div className="wallet-nav-text">
                        <h3>Cash</h3>
                        <p>$221,478</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              {user?.account?.interactableType === "USER" && (
                <div className="add-card-link">
                  <h5 className="mb-0">Send Money</h5>
                  <Link href={pinStatus ? "/add-bank" : "#"}>
                    <i className="fi fi-rr-square-plus" />
                  </Link>
                </div>
              )}
            </div>
            <div className="col-xl-9">
              <div className="tab-content wallet-tab-content">
                <div
                  className={
                    activeIndex == 1
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                >
                  {/* <div className="wallet-tab-title">
                    <h3>City Bank</h3>
                  </div> */}
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="wallet-total-balance">
                            <p className="mb-0">Total Balance</p>
                            <h2>
                              {user?.account?.currency}{" "}
                              {user?.account?.upperBalance < 1 && 20000}
                            </h2>
                          </div>
                          {/* <div className="funds-credit">
                            <p className="mb-0">Personal Funds</p>
                            <h5>$32,500.28</h5>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Credit Limits</p>
                            <h5>$2500.00</h5>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="credit-card visa">
                        <div className="type-brand">
                          <h4>Debit Card</h4>
                          <img src="./images/cc/visa.png" alt="" />
                        </div>
                        <div className="cc-number">
                          <h6>1234</h6>
                          <h6>5678</h6>
                          <h6>7890</h6>
                          <h6>9875</h6>
                        </div>
                        <div className="cc-holder-exp">
                          <h5>Saiful Islam</h5>
                          <div className="exp">
                            <span>EXP:</span>
                            <strong>12/21</strong>
                          </div>
                        </div>
                        <div className="cc-info">
                          <div className="row justify-content-between align-items-center">
                            <div className="col-5">
                              <div className="d-flex">
                                <p className="me-3">Status</p>
                                <p>
                                  <strong>Active</strong>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="me-3">Currency</p>
                                <p>
                                  <strong>USD</strong>
                                </p>
                              </div>
                            </div>
                            <div className="col-xl-7">
                              <div className="d-flex justify-content-between">
                                <div className="ms-3">
                                  <p>Credit Limit</p>
                                  <p>
                                    <strong>2000 USD</strong>
                                  </p>
                                </div>
                                <div id="circle1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Total Balance</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div> */}
                    {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Monthly Expenses</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div> */}
                    {/* <div className="col-xxl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Balance Overtime</h4>
                        </div>
                        <div className="card-body">
                          <div className="chartjs-size-monitor">
                            <div className="chartjs-size-monitor-expand">
                              <div />
                            </div>
                            <div className="chartjs-size-monitor-shrink">
                              <div />
                            </div>
                          </div>
                          <ChartjsBalanceOvertime />
                        </div>
                      </div>
                    </div> */}
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">
                            Transactions ({transactionsList?.meta?.totalCount})
                          </h4>
                        </div>
                        <div className="card-body">
                          <div className="transaction-table">
                            <div className="table-responsive">
                              <table className="table mb-0 table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactionsList?.transactions?.length > 0 &&
                                    transactionsList?.transactions?.map(
                                      (transaction, index) => (
                                        <tr
                                          key={index}
                                          onClick={() =>
                                            handleRowClick(transaction)
                                          }
                                          style={{ cursor: "pointer" }} // Add a pointer cursor for better UX
                                        >
                                          <td>
                                            <span className="table-category-icon">
                                              <i className="bg-emerald-500 fi fi-rr-barber-shop" />
                                              {transaction?.transactionType}
                                            </span>
                                          </td>
                                          <td>
                                            {formatDate(transaction?.createdAt)}
                                          </td>
                                          <td>{transaction?.status}</td>
                                          <td>{transaction?.amount}</td>
                                          <td>{transaction?.currency}</td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                                {/* <tbody>
                                  {transactionsList?.transactions?.length > 0 &&
                                    transactionsList?.transactions?.map(
                                      (transaction, index) => (
                                        <tr key={index}>
                                          <Link
                                            href={`transaction-details?id=${transaction?.id}`}
                                          >
                                            <td>
                                              <span className="table-category-icon">
                                                <i className="bg-emerald-500 fi fi-rr-barber-shop" />
                                                {transaction?.transactionType}
                                              </span>
                                            </td>
                                            <td>
                                              {formatDate(
                                                transaction?.createdAt
                                              )}
                                            </td>
                                            <td>{transaction?.status}</td>
                                            <td>{transaction?.amount}</td>
                                            <td>{transaction?.currency}</td>
                                          </Link>
                                        </tr>
                                      )
                                    )}
                                </tbody> */}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    activeIndex == 2
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                >
                  <div className="wallet-tab-title">
                    <h3>Debit Card</h3>
                  </div>
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="wallet-total-balance">
                            <p className="mb-0">Total Balance</p>
                            <h2>$221,478</h2>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Personal Funds</p>
                            <h5>$32,500.28</h5>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Credit Limits</p>
                            <h5>$2500.00</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="credit-card visa">
                        <div className="type-brand">
                          <h4>Debit Card</h4>
                          <img src="./images/cc/visa.png" alt="" />
                        </div>
                        <div className="cc-number">
                          <h6>1234</h6>
                          <h6>5678</h6>
                          <h6>7890</h6>
                          <h6>9875</h6>
                        </div>
                        <div className="cc-holder-exp">
                          <h5>Saiful Islam</h5>
                          <div className="exp">
                            <span>EXP:</span>
                            <strong>12/21</strong>
                          </div>
                        </div>
                        <div className="cc-info">
                          <div className="row justify-content-between align-items-center">
                            <div className="col-5">
                              <div className="d-flex">
                                <p className="me-3">Status</p>
                                <p>
                                  <strong>Active</strong>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="me-3">Currency</p>
                                <p>
                                  <strong>USD</strong>
                                </p>
                              </div>
                            </div>
                            <div className="col-xl-7">
                              <div className="d-flex justify-content-between">
                                <div className="ms-3">
                                  <p>Credit Limit</p>
                                  <p>
                                    <strong>2000 USD</strong>
                                  </p>
                                </div>
                                <div id="circle1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Total Balance</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Monthly Expenses</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Balance Overtime</h4>
                        </div>
                        <div className="card-body">
                          <div className="chartjs-size-monitor">
                            <div className="chartjs-size-monitor-expand">
                              <div />
                            </div>
                            <div className="chartjs-size-monitor-shrink">
                              <div />
                            </div>
                          </div>
                          <ChartjsBalanceOvertime2 />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Transaction History</h4>
                        </div>
                        <div className="card-body">
                          <div className="transaction-table">
                            <div className="table-responsive">
                              <table className="table mb-0 table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-emerald-500 fi fi-rr-barber-shop" />
                                        Beauty
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-teal-500 fi fi-rr-receipt" />
                                        Bills &amp; Fees
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-cyan-500 fi fi-rr-car-side" />
                                        Car
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-sky-500 fi fi-rr-graduation-cap" />
                                        Education
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-blue-500 fi fi-rr-clapperboard-play" />
                                        Entertainment
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    activeIndex == 3
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                >
                  <div className="wallet-tab-title">
                    <h3>Visa Card</h3>
                  </div>
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="wallet-total-balance">
                            <p className="mb-0">Total Balance</p>
                            <h2>$221,478</h2>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Personal Funds</p>
                            <h5>$32,500.28</h5>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Credit Limits</p>
                            <h5>$2500.00</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="credit-card visa">
                        <div className="type-brand">
                          <h4>Debit Card</h4>
                          <img src="./images/cc/visa.png" alt="" />
                        </div>
                        <div className="cc-number">
                          <h6>1234</h6>
                          <h6>5678</h6>
                          <h6>7890</h6>
                          <h6>9875</h6>
                        </div>
                        <div className="cc-holder-exp">
                          <h5>Saiful Islam</h5>
                          <div className="exp">
                            <span>EXP:</span>
                            <strong>12/21</strong>
                          </div>
                        </div>
                        <div className="cc-info">
                          <div className="row justify-content-between align-items-center">
                            <div className="col-5">
                              <div className="d-flex">
                                <p className="me-3">Status</p>
                                <p>
                                  <strong>Active</strong>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="me-3">Currency</p>
                                <p>
                                  <strong>USD</strong>
                                </p>
                              </div>
                            </div>
                            <div className="col-xl-7">
                              <div className="d-flex justify-content-between">
                                <div className="ms-3">
                                  <p>Credit Limit</p>
                                  <p>
                                    <strong>2000 USD</strong>
                                  </p>
                                </div>
                                <div id="circle1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Total Balance</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Monthly Expenses</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Balance Overtime</h4>
                        </div>
                        <div className="card-body">
                          <div className="chartjs-size-monitor">
                            <div className="chartjs-size-monitor-expand">
                              <div />
                            </div>
                            <div className="chartjs-size-monitor-shrink">
                              <div />
                            </div>
                          </div>
                          <ChartjsBalanceOvertime3 />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Transaction History</h4>
                        </div>
                        <div className="card-body">
                          <div className="transaction-table">
                            <div className="table-responsive">
                              <table className="table mb-0 table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-emerald-500 fi fi-rr-barber-shop" />
                                        Beauty
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-teal-500 fi fi-rr-receipt" />
                                        Bills &amp; Fees
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-cyan-500 fi fi-rr-car-side" />
                                        Car
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-sky-500 fi fi-rr-graduation-cap" />
                                        Education
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-blue-500 fi fi-rr-clapperboard-play" />
                                        Entertainment
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    activeIndex == 4
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                >
                  <div className="wallet-tab-title">
                    <h3>Cash</h3>
                  </div>
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="wallet-total-balance">
                            <p className="mb-0">Total Balance</p>
                            <h2>$221,478</h2>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Personal Funds</p>
                            <h5>$32,500.28</h5>
                          </div>
                          <div className="funds-credit">
                            <p className="mb-0">Credit Limits</p>
                            <h5>$2500.00</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="credit-card visa">
                        <div className="type-brand">
                          <h4>Debit Card</h4>
                          <img src="./images/cc/visa.png" alt="" />
                        </div>
                        <div className="cc-number">
                          <h6>1234</h6>
                          <h6>5678</h6>
                          <h6>7890</h6>
                          <h6>9875</h6>
                        </div>
                        <div className="cc-holder-exp">
                          <h5>Saiful Islam</h5>
                          <div className="exp">
                            <span>EXP:</span>
                            <strong>12/21</strong>
                          </div>
                        </div>
                        <div className="cc-info">
                          <div className="row justify-content-between align-items-center">
                            <div className="col-5">
                              <div className="d-flex">
                                <p className="me-3">Status</p>
                                <p>
                                  <strong>Active</strong>
                                </p>
                              </div>
                              <div className="d-flex">
                                <p className="me-3">Currency</p>
                                <p>
                                  <strong>USD</strong>
                                </p>
                              </div>
                            </div>
                            <div className="col-xl-7">
                              <div className="d-flex justify-content-between">
                                <div className="ms-3">
                                  <p>Credit Limit</p>
                                  <p>
                                    <strong>2000 USD</strong>
                                  </p>
                                </div>
                                <div id="circle1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Total Balance</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                      <div className="stat-widget-1">
                        <h6>Monthly Expenses</h6>
                        <h3>$ 432568</h3>
                        <p>
                          <span className="text-success">
                            <i className="fi fi-rr-arrow-trend-up" />
                            2.47%
                          </span>
                          Last month <strong>$24,478</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Balance Overtime</h4>
                        </div>
                        <div className="card-body">
                          <div className="chartjs-size-monitor">
                            <div className="chartjs-size-monitor-expand">
                              <div />
                            </div>
                            <div className="chartjs-size-monitor-shrink">
                              <div />
                            </div>
                          </div>
                          <ChartjsBalanceOvertime4 />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Transaction History</h4>
                        </div>
                        <div className="card-body">
                          <div className="transaction-table">
                            <div className="table-responsive">
                              <table className="table mb-0 table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-emerald-500 fi fi-rr-barber-shop" />
                                        Beauty
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-teal-500 fi fi-rr-receipt" />
                                        Bills &amp; Fees
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-cyan-500 fi fi-rr-car-side" />
                                        Car
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-sky-500 fi fi-rr-graduation-cap" />
                                        Education
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span className="table-category-icon">
                                        <i className="bg-blue-500 fi fi-rr-clapperboard-play" />
                                        Entertainment
                                      </span>
                                    </td>
                                    <td>12.12.2023</td>
                                    <td>
                                      Grocery Items and Beverage soft drinks
                                    </td>
                                    <td>-32.20</td>
                                    <td>USD</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
