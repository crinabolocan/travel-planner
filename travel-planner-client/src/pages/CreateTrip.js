import React, { useEffect, useState } from "react";
import tripApi from "../api/tripPlannerApi";
import destinationApi from "../api/destinationApi";
import "../styles/CreateTrip.css";
import MenuDashboard from "./Menu";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
    const [destinations, setDestinations] = useState([]);
    const [transportOptions, setTransportOptions] = useState([]);
    const [form, setForm] = useState({
        destinationId: "",
        transportOptionId: "",
        startDate: "",
        endDate: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [newDestination, setNewDestination] = useState({
        name: "",
        country: "",
        description: ""
    });

    const handleNewDestinationChange = (e) => {
        setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
    };

    const handleAddDestination = async (e) => {
        e.preventDefault();
        try {
            await destinationApi.post("/destination", newDestination);
            setMessage("Destinația a fost adăugată cu succes!");

            // Golește formularul și reîncarcă lista
            setNewDestination({ name: "", country: "", description: "" });
            const res = await destinationApi.get("/destination");
            setDestinations(res.data);
        } catch (err) {
            console.error("Eroare la adăugarea destinației:", err);
            setMessage("Eroare la adăugare.");
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destRes, transRes] = await Promise.all([
                    destinationApi.get("/destination"),
                    tripApi.get("/transport-option")
                ]);
                setDestinations(destRes.data);
                setTransportOptions(transRes.data);
            } catch (err) {
                console.error("Eroare la preluarea datelor:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await tripApi.post("/trip/create", form);
            setMessage("Călătoria a fost creată cu succes!");
            setTimeout(() => navigate("/my-trips"), 1000);
        } catch (err) {
            console.error("Eroare la crearea călătoriei:", err);
            setMessage("A apărut o eroare.");
        }
    };

    return (

        <div className="dashboard-page">
            <div className="menu">
                <MenuDashboard />
            </div>
            <div className="create-trip-page">
                <h2>Adaugă o nouă călătorie</h2>
                <form onSubmit={handleSubmit} className="create-trip-form">
                    <label>Destinație:</label>
                    <select name="destinationId" value={form.destinationId} onChange={handleChange} required>
                        <option value="">Selectează</option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name} ({d.country})
                            </option>
                        ))}
                    </select>

                    <label>Transport:</label>
                    <select name="transportOptionId" value={form.transportOptionId} onChange={handleChange} required>
                        <option value="">Selectează</option>
                        {transportOptions.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.type} - {t.company} ({t.price} €)
                            </option>
                        ))}
                    </select>

                    <label>Data început:</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />

                    <label>Data sfârșit:</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />

                    <button type="submit">Creează călătoria</button>
                </form>

                {/* Formularul de adăugare a destinației este acum separat */}
                <div className="new-destination-section">
                    <h3>Adaugă o destinație nouă</h3>
                    <form onSubmit={handleAddDestination} className="add-destination-form">
                        <label>Nume:</label>
                        <input
                            type="text"
                            name="name"
                            value={newDestination.name}
                            onChange={handleNewDestinationChange}
                            required
                        />

                        <label>Țară:</label>
                        <input
                            type="text"
                            name="country"
                            value={newDestination.country}
                            onChange={handleNewDestinationChange}
                            required
                        />

                        <label>Descriere:</label>
                        <textarea
                            name="description"
                            value={newDestination.description}
                            onChange={handleNewDestinationChange}
                            required
                        ></textarea>

                        <button type="submit">Adaugă destinația</button>
                    </form>
                </div>


                {message && <p className="trip-message">{message}</p>}
            </div>

        </div>
    );
};

export default CreateTrip;
