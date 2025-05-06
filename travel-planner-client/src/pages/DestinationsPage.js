import React, { useEffect, useState } from "react";
import destinationApi from "../api/destinationApi";
import MenuDashboard from "./Menu";
import "../styles/DestinationsPage.css";

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", country: "", description: "" });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await destinationApi.get("/destination");
      setDestinations(res.data);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await destinationApi.put(`/destination/${editing.id}`, form);
      } else {
        await destinationApi.post("/destination", form);
      }
      setForm({ name: "", country: "", description: "" });
      setEditing(null);
      fetchDestinations();
    } catch (err) {
      console.error("Eroare la salvare:", err);
    }
  };

  const handleEdit = (dest) => {
    setForm(dest);
    setEditing(dest);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sigur vrei să ștergi această destinație?")) {
      await destinationApi.delete(`/destination/${id}`);
      fetchDestinations();
    }
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="menu">
        <MenuDashboard />
      </div>

      <div className="destinations-container">
        <h2 className="section-title">Destinații</h2>

        <input
          className="search-input"
          type="text"
          placeholder="Caută destinație..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form className="dest-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Nume" value={form.name} onChange={handleChange} required />
          <input name="country" placeholder="Țară" value={form.country} onChange={handleChange} required />
          <textarea name="description" placeholder="Descriere" value={form.description} onChange={handleChange} required />
          <button type="submit" className="buton_location">
            {editing ? "Salvează modificările" : "Adaugă destinație"}
          </button>
        </form>

        <div className="table-wrapper">
          <table className="dest-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nume</th>
                <th>Țară</th>
                <th>Descriere</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.country}</td>
                  <td>{d.description}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(d)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(d.id)}>Șterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;