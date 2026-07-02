import React, { useState } from "react";

interface PaymentItem {
  id: string;
  patientName: string;
  treatment: string;
  amount: string;
  method: "Cash" | "UPI" | "Card";
  date: string;
  status: "Paid" | "Pending" | "Refunded";
}

const PAYMENTS_LIST: PaymentItem[] = [
  {
    id: "TXN-8742",
    patientName: "Riya Shah",
    treatment: "Root Canal Treatment",
    amount: "₹4,500",
    method: "UPI",
    date: "28 Jun 2025",
    status: "Paid",
  },
  {
    id: "TXN-8741",
    patientName: "Amit Patel",
    treatment: "Regular Checkup",
    amount: "₹500",
    method: "Cash",
    date: "27 Jun 2025",
    status: "Paid",
  },
  {
    id: "TXN-8740",
    patientName: "Rahul Mehta",
    treatment: "Teeth Cleaning",
    amount: "₹1,200",
    method: "Card",
    date: "25 Jun 2025",
    status: "Paid",
  },
  {
    id: "TXN-8739",
    patientName: "Hetal Trivedi",
    treatment: "Teeth Whitening",
    amount: "₹8,000",
    method: "UPI",
    date: "24 Jun 2025",
    status: "Pending",
  },
  {
    id: "TXN-8738",
    patientName: "Smit Shah",
    treatment: "Dental Fillings",
    amount: "₹1,500",
    method: "Cash",
    date: "22 Jun 2025",
    status: "Paid",
  },
];

const PaymentsSection = () => {
  const [payments] = useState<PaymentItem[]>(PAYMENTS_LIST);
  const [search, setSearch] = useState("");

  const filtered = payments.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.treatment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Payments & Transactions</h2>
          <p className="sec-subtitle">Billing history and payment collection logs</p>
        </div>
        <button className="sec-add-btn">+ Record Payment</button>
      </div>

      <div className="sec-filters">
        <input
          type="text"
          placeholder="Search by patient or treatment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sec-search wide"
        />
      </div>

      <div className="sec-table-wrap">
        <table className="sec-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Patient</th>
              <th>Treatment</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: "#1e3a8a" }}>{p.id}</td>
                <td>
                  <strong>{p.patientName}</strong>
                </td>
                <td>{p.treatment}</td>
                <td style={{ fontWeight: 600, color: "#0f766e" }}>{p.amount}</td>
                <td>{p.method}</td>
                <td>{p.date}</td>
                <td>
                  <span
                    className={`db-status-badge ${
                      p.status === "Paid"
                        ? "db-status-confirmed"
                        : p.status === "Pending"
                        ? "db-status-pending"
                        : "db-status-cancelled"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsSection;
