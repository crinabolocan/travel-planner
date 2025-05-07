import React, { useEffect, useState } from "react";
import tripApi from "../api/tripPlannerApi";
import destinationApi from "../api/destinationApi";
import "../styles/CreateTrip.css";
import MenuDashboard from "./Menu";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
    const [destinations, setDestinations] = useState([]);
    const [transportOptions, setTransportOptions] = useState([]);
    const [form, setForm] = useState({
        destinationId: "",
        transportOptionId: "",
        startDate: "",
        endDate: "",
        activities: []
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [newDestination, setNewDestination] = useState({
        name: "",
        country: "",
        description: ""
    });
    const [newTransport, setNewTransport] = useState({
        type: "",
        company: "",
        price: ""
    });
    const [toast, setToast] = useState(null);

    const handleNewTransportChange = (e) => {
        setNewTransport({ ...newTransport, [e.target.name]: e.target.value });
    };

    const handleAddTransport = async (e) => {
        e.preventDefault();
        try {
            await tripApi.post("/transport-option", {
                ...newTransport,
                price: parseFloat(newTransport.price),
            });
            // Afișează mesaj de succes cu toast
            setToast({ message: "Transportul a fost adăugat cu succes!", type: "success" });
            setNewTransport({ type: "", company: "", price: "" });

            // Reîncarcă lista
            const res = await tripApi.get("/transport-option");
            setTransportOptions(res.data);
        } catch (err) {
            console.error("Eroare la adăugarea transportului:", err);
            // cu toast
            setToast({ message: "Eroare la adăugare transport.", type: "error" });
        }
    };

    const handleNewDestinationChange = (e) => {
        setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
    };

    const handleAddDestination = async (e) => {
        e.preventDefault();
        try {
            await destinationApi.post("/destination", newDestination);
            // Afișează mesaj de succes cu toast
            setToast({ message: "Destinația a fost adăugată cu succes!", type: "success" });

            // Golește formularul și reîncarcă lista
            setNewDestination({ name: "", country: "", description: "" });
            const res = await destinationApi.get("/destination");
            setDestinations(res.data);
        } catch (err) {
            console.error("Eroare la adăugarea destinației:", err);
            // cu toast
            setToast({ message: "Eroare la adăugare destinație.", type: "error" });
        }
    };
    const [activityInput, setActivityInput] = useState("");

    const handleAddActivity = () => {
        if (activityInput.trim()) {
            setForm({ ...form, activities: [...form.activities, activityInput.trim()] });
            setActivityInput("");
        }
    };

    const handleRemoveActivity = (index) => {
        const updated = [...form.activities];
        updated.splice(index, 1);
        setForm({ ...form, activities: updated });
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

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        if (start >= end) {
            setToast({ message: "Data de sfârșit trebuie să fie după data de început.", type: "error" });
            return;
        }

        try {
            await tripApi.post("/trip/create", form);
            setToast({ message: "Călătoria a fost creată cu succes!", type: "success" });
            setTimeout(() => navigate("/my-trips"), 1000);
        } catch (err) {
            console.error("Eroare la crearea călătoriei:", err);

            if (err.response?.data?.errors) {
                const errorObj = err.response.data.errors;

                const allMessages = Object.values(errorObj)
                    .flat()
                    .map((msg, index) => <li key={index}>{msg}</li>);

                setMessage(<ul className="error-list">{allMessages}</ul>);
            } else {
                setMessage("A apărut o eroare.");
            }
        }
    };


    return (
        <div className="dashboard-page">
            <div className="menu">
                <MenuDashboard />
            </div>
            <div className="create-trip-container">
                <h2>Adaugă o nouă călătorie</h2>

                <form className="trip-form" onSubmit={handleSubmit}>
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
                                {t.type} - {t.company} ({t.price} RON)
                            </option>
                        ))}
                    </select>

                    <label>Data început:</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />

                    <label>Data sfârșit:</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
                    <div className="activities-section">
                        <label>Activități:</label>
                        <div className="activity-input-group">
                            <input
                                type="text"
                                value={activityInput}
                                onChange={(e) => setActivityInput(e.target.value)}
                                placeholder="Ex: Vizită muzeu, hiking, etc."
                            />
                            <button type="button" onClick={handleAddActivity} className="buton_location">
                                Adaugă
                            </button>
                        </div>
                        <ul className="activity-list">
                            {form.activities.map((act, index) => (
                                <li key={index}>
                                    {act}{" "}
                                    <button type="button" onClick={() => handleRemoveActivity(index)} className="remove-btn">
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <button type="submit" className="buton_location">Creează călătoria</button>
                </form>

                <div className="add-destination-section">
                    <h3>Adaugă o destinație nouă</h3>
                    <form onSubmit={handleAddDestination} className="trip-form">
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
                        <button type="submit" className="buton_location">Adaugă destinația</button>
                    </form>
                </div>

                <div className="add-destination-section">
                    <h3>Adaugă o opțiune de transport</h3>
                    <form onSubmit={handleAddTransport} className="trip-form">
                        <label>Tip:</label>
                        <input
                            type="text"
                            name="type"
                            value={newTransport.type}
                            onChange={handleNewTransportChange}
                            required
                        />
                        <label>Companie:</label>
                        <input
                            type="text"
                            name="company"
                            value={newTransport.company}
                            onChange={handleNewTransportChange}
                            required
                        />
                        <label>Preț (RON):</label>
                        <input
                            type="number"
                            name="price"
                            value={newTransport.price}
                            onChange={handleNewTransportChange}
                            required
                        />
                        <button type="submit" className="buton_location">Adaugă transport</button>
                    </form>
                </div>


                {message && <div className="trip-message">{message}</div>}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateTrip;
