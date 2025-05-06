import React, { useEffect, useState } from 'react';
import tripApi from '../api/tripPlannerApi';
import ReviewSection from "../pages/ReviewSection";
import MenuDashboard from './Menu';
import "../styles/MyTrips.css";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateTransport = async (tripId, newTransportId) => {
    try {
      await tripApi.put(`/trip/${tripId}/transport`, JSON.stringify(newTransportId), {
        headers: { 'Content-Type': 'application/json' }
      });
      // Refresh trips
      const res = await tripApi.get('/trip/my-trips');
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to update transport:", err);
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Sigur vrei să ștergi această călătorie?")) return;

    try {
      await tripApi.delete(`/trip/${tripId}`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      console.error("Eroare la ștergerea călătoriei:", err);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const [tripRes, transportRes] = await Promise.all([
          tripApi.get('/trip/my-trips'),
          tripApi.get('/transport-option')
        ]);

        setTrips(tripRes.data);
        setTransportOptions(transportRes.data);
      } catch (err) {
        console.error('Eroare la preluarea datelor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  return (
    <div className="dashboard-page">
      <div className="menu">
        <MenuDashboard />
      </div>

      <div className="container" data-aos="fade-up">
        <h2 className="carousel-title">Călătoriile Mele</h2>

        {trips.length === 0 ? (
          <p>Nu ai nicio călătorie salvată.</p>
        ) : (
          <div className="trip-steps">
            {trips.map((trip) => (
              <div key={trip.id} className="location-card_trip" data-aos="fade-up">
                <h4>{trip.destination?.name || "Destinație necunoscută"}</h4>
                <p><strong>Perioadă:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                <p><strong>Transport:</strong> {trip.transportOption?.type || "Nespecificat"}</p>
                <ReviewSection tripId={trip.id} />

                <div className="location-buttons">
                  <select
                    value={trip.transportOption?.id || ""}
                    onChange={(e) => updateTransport(trip.id, parseInt(e.target.value))}
                    className="buton_location"
                  >
                    <option value="">Modifică transport</option>
                    {transportOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.type} - {option.company} ({option.price} RON)
                      </option>
                    ))}
                  </select>
                  <button className="buton_location" onClick={() => deleteTrip(trip.id)}>
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="carousel-container2" data-aos="fade-up">
          <h2 className="carousel-title">Opțiuni de Transport Disponibile</h2>
          {transportOptions.length === 0 ? (
            <p>Nu există opțiuni de transport disponibile.</p>
          ) : (
            <div className="trip-steps">
              {transportOptions.map(option => (
                <div key={option.id} className="location-card" data-aos="fade-up">
                  <h4>{option.type}</h4>
                  <p><strong>Companie:</strong> {option.company}</p>
                  <p><strong>Preț:</strong> {option.price} €</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;