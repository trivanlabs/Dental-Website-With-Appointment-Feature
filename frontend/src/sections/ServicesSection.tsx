import React, { useState } from "react";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  status: "Active" | "Inactive";
  description: string;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: "SRV-001",
    name: "Regular Checkup",
    category: "General",
    price: "₹500",
    duration: "20 mins",
    status: "Active",
    description: "Routine oral checkup, cleaning inspection, and consultation.",
  },
  {
    id: "SRV-002",
    name: "Teeth Cleaning",
    category: "Preventive",
    price: "₹1,200",
    duration: "30-45 mins",
    status: "Active",
    description: "Professional scaling and polishing to remove plaque and tartar.",
  },
  {
    id: "SRV-003",
    name: "Dental Fillings",
    category: "Restorative",
    price: "₹1,500",
    duration: "30 mins",
    status: "Active",
    description: "Composite tooth-colored fillings for cavity restoration.",
  },
  {
    id: "SRV-004",
    name: "Root Canal Treatment",
    category: "Endodontics",
    price: "₹4,500",
    duration: "45-60 mins",
    status: "Active",
    description: "Advanced root canal therapy to save infected teeth.",
  },
  {
    id: "SRV-005",
    name: "Teeth Whitening",
    category: "Cosmetic",
    price: "₹8,000",
    duration: "60 mins",
    status: "Active",
    description: "In-office laser teeth whitening for immediate shade improvement.",
  },
  {
    id: "SRV-006",
    name: "Dental Implants",
    category: "Surgical",
    price: "₹25,000",
    duration: "90 mins",
    status: "Active",
    description: "Permanent titanium implants for tooth replacement.",
  },
];

const ServicesSection = () => {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);
  const [search, setSearch] = useState("");

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Services & Treatments</h2>
          <p className="sec-subtitle">Manage dental procedures and pricing</p>
        </div>
        <button className="sec-add-btn">+ Add Service</button>
      </div>

      <div className="sec-filters">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sec-search wide"
        />
      </div>

      <div className="sec-table-wrap">
        <table className="sec-table">
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: "#1e3a8a" }}>{s.id}</td>
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>{s.category}</td>
                <td style={{ fontWeight: 600, color: "#0f766e" }}>{s.price}</td>
                <td>{s.duration}</td>
                <td>
                  <span
                    className={`db-status-badge ${
                      s.status === "Active" ? "db-status-confirmed" : "db-status-cancelled"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "250px" }}>
                  {s.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesSection;
