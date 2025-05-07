// components/Toast.jsx
import React, { useEffect } from "react";
import "../styles/Toast.css";

const Toast = ({ message, onClose, type = "info" }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
