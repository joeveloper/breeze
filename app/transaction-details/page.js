"use client";

import ChartjsDonut from "@/components/chart/ChartjsDonut";
import Layout from "@/components/layout/Layout";
import AnalyticsMenu from "@/components/layout/AnalyticsMenu";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useEffect, useState } from "react";
import { formatDate, formatDateAndTime } from "../../utils/dateAndTimeFormatter";

export default function TransactionDetails() {
  const param = useSearchParams();
  const data = param.get("data");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        setLoading(true);
        const decoded = JSON.parse(decodeURIComponent(data));
        setParsedData(decoded);
        console.log("Decoded Data:", decoded);
      } catch (error) {
        console.error("Error decoding data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);
  return (
    <>
      <Layout breadcrumbTitle="Transaction Details">
        {loading && <Loading />}
        <div className="row">
          <div className="col-xxl-12 col-xl-12">
            {/* <AnalyticsMenu /> */}
            <div className="d-flex justify-content-around">
              <div className="w-50">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Transaction Details</h4>
                  </div>
                  <div className="card-body">
                    {/* <ChartjsDonut /> */}
                    <div className="list-1 mt-3">
                      <ul>
                        <li>
                          <p className="mb-0">Transaction Ref</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.transactionRef || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Transaction Type</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.transactionType || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Transaction Amount</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.currency}</span><span>{parsedData?.amount || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Transaction Fees</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.fees || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Vendor Name</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.vendorName || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Customer Name</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.customerName || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Transaction Creation Date</p>
                          <h5 className="mb-0">
                            {/* <span>{formatDateAndTime(parsedData?.createdAt) || "N/A"}</span> */}
                            <span>{formatDateAndTime(parsedData?.createdAt) || "N/A"}</span>
                          </h5>
                        </li>
                        <li>
                          <p className="mb-0">Transaction Completion Date</p>
                          <h5 className="mb-0">
                            <span>{parsedData?.completionDate || "N/A"}</span>
                          </h5>
                        </li>
                      </ul>
                    </div>
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
