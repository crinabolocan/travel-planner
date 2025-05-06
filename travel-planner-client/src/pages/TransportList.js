import React, { useEffect, useState } from "react";
import tripApi from "../api/tripPlannerApi";
import MenuDashboard from "./Menu";
import "../styles/TransportList.css";

const TransportList = () => {
    const [transportData, setTransportData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [newTransport, setNewTransport] = useState({ type: "", company: "", price: "" });
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchTransportOptions = async () => {
            try {
                const res = await tripApi.get("/transport-option");
                setTransportData(res.data);
            } catch (err) {
                console.error("Eroare la preluarea transporturilor:", err);
            }
        };

        fetchTransportOptions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransport({ ...newTransport, [name]: value });
    };

    const handleAddTransport = async (e) => {
        e.preventDefault();
        try {
            await tripApi.post("/transport-option", {
                ...newTransport,
                price: parseFloat(newTransport.price),
            });
            const res = await tripApi.get("/transport-option");
            setTransportData(res.data);
            setNewTransport({ type: "", company: "", price: "" });
        } catch (err) {
            console.error("Eroare la adăugare transport:", err);
        }
    };


    const filteredData = transportData.filter((item) =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDelete = (id) => {
        if (window.confirm("Sigur vrei să ștergi această opțiune de transport?")) {
            tripApi.delete(`/transport-option/${id}`).then(() => {
                setTransportData(prev => prev.filter(t => t.id !== id));
            });
        }
    };

    return (
        <div className="dashboard-page">
          <div className="menu">
            <MenuDashboard />
          </div>
    
          <div className="transport-container">
            <h2 className="transport-title">Opțiuni de Transport</h2>
    
            <form className="transport-form" onSubmit={handleAddTransport}>
              <input type="text" name="type" placeholder="Tip (ex: Avion, Tren)" value={newTransport.type} onChange={handleInputChange} required />
              <input type="text" name="company" placeholder="Companie" value={newTransport.company} onChange={handleInputChange} required />
              <input type="number" name="price" placeholder="Preț (RON)" value={newTransport.price} onChange={handleInputChange} required />
              <button type="submit" className="buton_location">Adaugă</button>
            </form>
    
            <input
              type="text"
              placeholder="Caută după tip sau companie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
    
            <div className="transport-table-container">
              <table className="transport-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tip</th>
                    <th>Companie</th>
                    <th>Preț</th>
                    <th>Acțiune</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((option) => (
                    <tr key={option.id}>
                      <td>{option.id}</td>
                      <td>{option.type}</td>
                      <td>{option.company}</td>
                      <td>{option.price} RON</td>
                      <td>
                        <button onClick={() => handleDelete(option.id)} className="btn-delete">Șterge</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default TransportList;