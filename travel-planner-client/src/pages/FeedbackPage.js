import React, { useState } from "react";
import tripApi from "../api/tripPlannerApi";
import MenuDashboard from "./Menu";
import "../styles/FeedbackPage.css";

const FeedbackPage = () => {
    const [form, setForm] = useState({
        category: "",
        rating: "",
        agree: false,
        message: ""
    });

    const [response, setResponse] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await tripApi.post("/feedback", form);
            setResponse("Feedback trimis cu succes!");
            setForm({ category: "", rating: "", agree: false, message: "" });
        } catch (err) {
            console.error("Eroare feedback:", err);
            setResponse("A apărut o eroare.");
        }
    };

    return (
        <div className="dashboard-page">
          <div className="menu">
            <MenuDashboard />
          </div>
    
          <div className="feedback-container">
            <h2 className="feedback-title">Trimite Feedback</h2>
    
            <form onSubmit={handleSubmit} className="feedback-form">
              <label htmlFor="category">Categorie:</label>
              <select
                name="category"
                id="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Selectează</option>
                <option value="bug">Eroare</option>
                <option value="suggestion">Sugestie</option>
                <option value="appreciation">Apreciere</option>
              </select>
    
              <label>Rating:</label>
              <div className="radio-group">
                {[1, 2, 3, 4, 5].map((r) => (
                  <label key={r}>
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={form.rating === r.toString()}
                      onChange={handleChange}
                    />
                    {r} ⭐
                  </label>
                ))}
              </div>
    
              <label>Mesaj:</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
              ></textarea>
    
              <button type="submit" className="buton_location">Trimite</button>
              {response && <p className="feedback-response">{response}</p>}
            </form>
          </div>
        </div>
      );
    };
    
    export default FeedbackPage;