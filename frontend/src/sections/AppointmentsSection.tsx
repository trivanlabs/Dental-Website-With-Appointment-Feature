import { useState, useEffect, useCallback } from "react";
import {
  getAppointments,
  updateAppointmentStatus,
  updateDoctorNotes,
  getExportUrl,
  type Appointment,
} from "@/lib/appointmentApi";
import { format } from "date-fns";

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const appts = await getAppointments({
        status: activeFilter !== "all" ? activeFilter : undefined,
        search: searchQuery || undefined,
        date: dateFilter || undefined,
      });
      setAppointments(appts);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchQuery, dateFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    await updateAppointmentStatus(id, status);
    fetchData();
    if (selectedAppointment?._id === id) setSelectedAppointment(null);
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    await updateDoctorNotes(selectedAppointment._id, doctorNotes);
    fetchData();
  };

  const handleExport = () => {
    window.open(getExportUrl({
      status: activeFilter !== "all" ? activeFilter : undefined,
      search: searchQuery || undefined,
      date: dateFilter || undefined,
    }), "_blank");
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      pending: { cls: "db-status-pending", label: "Pending" },
      confirmed: { cls: "db-status-confirmed", label: "Confirmed" },
      cancelled: { cls: "db-status-cancelled", label: "Cancelled" },
      completed: { cls: "db-status-completed", label: "Completed" },
    };
    const s = map[status] || map.pending;
    return <span className={`db-status-badge ${s.cls}`}>{s.label}</span>;
  };

  const formatDate = (d: string) => {
    try { return format(new Date(d + "T00:00:00"), "d MMM yyyy"); } catch { return d; }
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Appointments</h2>
          <p className="sec-subtitle">Manage and track all patient appointments</p>
        </div>
        <button className="sec-export-btn" onClick={handleExport}>📊 Export Excel</button>
      </div>

      {/* Filters */}
      <div className="sec-filters">
        <div className="sec-filter-tabs">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`sec-filter-tab ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >{f.label}</button>
          ))}
        </div>
        <div className="sec-filter-inputs">
          <input
            type="text"
            placeholder="Search patient..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sec-search"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="sec-date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="sec-table-wrap">
        {loading ? (
          <div className="db-empty">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="db-empty">No appointments found</div>
        ) : (
          <table className="sec-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Mobile</th>
                <th>Concern</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <div className="sec-patient-cell">
                      <strong>{appt.patientName}</strong>
                      <span>{appt.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="sec-patient-cell">
                      <span>{formatDate(appt.date)}</span>
                      <span style={{ color: "#94a3b8" }}>{appt.timeSlot}</span>
                    </div>
                  </td>
                  <td>{appt.mobile}</td>
                  <td>{appt.concern || "—"}</td>
                  <td>{getStatusBadge(appt.status)}</td>
                  <td>
                    <div className="sec-actions">
                      <button className="sec-action-btn" onClick={() => { setSelectedAppointment(appt); setDoctorNotes(appt.doctorNotes || ""); }}>👁️ View</button>
                      {appt.status === "pending" && (
                        <>
                          <button className="sec-action-btn confirm" onClick={() => handleStatusUpdate(appt._id, "confirmed")}>✅</button>
                          <button className="sec-action-btn cancel" onClick={() => handleStatusUpdate(appt._id, "cancelled")}>❌</button>
                        </>
                      )}
                      {appt.status === "confirmed" && (
                        <button className="sec-action-btn complete" onClick={() => handleStatusUpdate(appt._id, "completed")}>🎉</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Appointment Details</h2>
              <button className="modal-close" onClick={() => setSelectedAppointment(null)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                ["Patient", selectedAppointment.patientName],
                ["Email", selectedAppointment.email],
                ["Mobile", selectedAppointment.mobile],
                ["Date", formatDate(selectedAppointment.date)],
                ["Time", selectedAppointment.timeSlot],
                ["Concern", selectedAppointment.concern || "—"],
              ].map(([l, v]) => (
                <div className="modal-detail-row" key={l}>
                  <span className="modal-label">{l}</span>
                  <span className="modal-value">{v}</span>
                </div>
              ))}
              <div className="modal-detail-row">
                <span className="modal-label">Status</span>
                <span className="modal-value">{getStatusBadge(selectedAppointment.status)}</span>
              </div>
              <div className="modal-notes">
                <label>Doctor's Notes</label>
                <textarea value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)} rows={3} placeholder="Add notes..." />
                <button className="save-notes-btn" onClick={handleSaveNotes}>💾 Save Notes</button>
              </div>
            </div>
            <div className="modal-actions">
              {selectedAppointment.status === "pending" && (
                <>
                  <button className="modal-confirm-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "confirmed")}>✅ Confirm</button>
                  <button className="modal-cancel-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "cancelled")}>❌ Cancel</button>
                </>
              )}
              {selectedAppointment.status === "confirmed" && (
                <button className="modal-complete-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "completed")}>🎉 Complete</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
