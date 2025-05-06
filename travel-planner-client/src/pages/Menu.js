import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import "primeicons/primeicons.css";
import "../styles/Menu.css";

const MenuDashboard = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: "Acasă",
            icon: "pi pi-home",
            command: () => navigate("/dashboard"),
        },
        {
            label: "Călătoriile Mele",
            icon: "pi pi-map-marker",
            command: () => navigate("/my-trips"),
        },
        {
            label: "Transporturi",
            icon: "pi pi-car",
            command: () => navigate("/transport-list"),
        },
        {
            label: "Destinații",
            icon: "pi pi-globe",
            command: () => navigate("/destinations"),
        },
        {
            label: "Feedback",
            icon: "pi pi-comments",
            command: () => navigate("/feedback"),
        },
        {
            label: "Logout",
            icon: "pi pi-sign-out",
            command: () => {
                localStorage.removeItem("token");
                navigate("/login");
            },
        },
    ];


    return (
        <div className="menu-wrapper">
            <Menubar model={items} />
        </div>
    );
};

export default MenuDashboard;
