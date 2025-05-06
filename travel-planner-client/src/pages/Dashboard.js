import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Carousel } from 'primereact/carousel';
import destinationApi from "../api/destinationApi";
import "../styles/Dashboard.css";

import MenuDashboard from "./Menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "";
  const [destinations, setDestinations] = useState([]);

  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  const destinationTemplate = (dest) => (
    <div className="location-card" data-aos="zoom-in">
      <h4>{dest.name}</h4>
      <p>{dest.country}</p>
      <p className="description">{dest.description}</p>
    </div>
  );

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.get("/destination");
        setDestinations(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea destinațiilor:", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToMyTrips = () => {
    navigate("/my-trips");
  };

  return (
    <div className="dashboard-page">
      <div className="menu">
        <MenuDashboard />
      </div>

      <div className="dashboard-container">
        <section className="header-section">
          <div className="header-text">
            <h1 className="header-title">Bine ai venit, {username}!</h1>
            <p className="description">
              Planifică-ți următoarea aventură alături de platforma noastră.
              Descoperă destinații noi, adaugă excursii și gestionează-ți călătoriile.
            </p>
            <div className="dashboard-actions">
              <button className="start-trip-button" onClick={() => navigate("/my-trips")}>
                Vezi călătoriile tale
              </button>
              <button className="start-trip-button" onClick={() => navigate("/create-trip")}>
                Adaugă o călătorie
              </button>
              <button className="start-trip-button" onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}>
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="carousel-container">
          <h2 className="carousel-title">Destinații disponibile</h2>
          <Carousel
            value={destinations}
            numScroll={1}
            numVisible={3}
            responsiveOptions={responsiveOptions}
            itemTemplate={destinationTemplate}
            circular
            autoplayInterval={7000}
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;