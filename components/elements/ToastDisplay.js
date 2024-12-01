import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastDisplay = ({ title = "Notification", message = "", type = "info", show, onClose }) => {
  // Determine toast styles based on type
  const toastStyles = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    info: "bg-info text-white",
    warning: "bg-warning text-dark",
  };

  const currentStyle = toastStyles[type] || "bg-secondary text-white";

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} className={currentStyle}>
        <Toast.Header closeButton>
          <strong className="me-auto">{title}</strong>
          {/* <small>Just now</small> */}
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastDisplay;
