import { useState, useEffect, useMemo } from "react";
import { getAppointments, type Appointment } from "@/lib/appointmentApi";

interface Patient {
  name: string;
  email: string;
  mobile: string;
  totalVisits: number;
  lastVisit: string;
  status: string;
}

const PatientsSection = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments().then(setAppointments).finally(() => setLoading(false));
  }, []);

  const patients = useMemo(() => {
    const map = new Map<string, Patient>();
    appointments.forEach((a) => {
      const key = a.email || a.mobile;
      const existing = map.get(key);
      if (existing) {
        existing.totalVisits++;
        if (a.date > existing.lastVisit) {
          existing.lastVisit = a.date;
          existing.status = a.status;
        }
      } else {
        map.set(key, {
          name: a.patientName,
          email: a.email,
          mobile: a.mobile,
          totalVisits: 1,
          lastVisit: a.date,
          status: a.status,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  }, [appointments]);

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.mobile.includes(q)
    );
  }, [patients, search]);

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const getColor = (name: string) => {
    const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
    let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  };

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Patients</h2>
          <p className="sec-subtitle">All registered patients from appointments</p>
        </div>
        <div className="sec-header-stat">
          <span className="sec-header-stat-num">{patients.length}</span>
          <span>Total Patients</span>
        </div>
      </div>

      <div className="sec-filters">
        <input
          type="text"
          placeholder="Search by name, email, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sec-search wide"
        />
      </div>

      {loading ? (
        <div className="db-empty">Loading patients...</div>
      ) : filtered.length === 0 ? (
        <div className="db-empty">No patients found</div>
      ) : (
        <div className="sec-grid sec-grid-patients">
          {filtered.map((p, i) => (
            <div key={i} className="sec-patient-card">
              <div className="sec-patient-avatar" style={{ background: getColor(p.name) }}>
                {getInitials(p.name)}
              </div>
              <div className="sec-patient-info">
                <h4>{p.name}</h4>
                <p>📧 {p.email}</p>
                <p>📱 {p.mobile}</p>
              </div>
              <div className="sec-patient-stats">
                <div className="sec-patient-stat">
                  <span className="sec-patient-stat-num">{p.totalVisits}</span>
                  <span>Visits</span>
                </div>
                <div className="sec-patient-stat">
                  <span className="sec-patient-stat-label">Last Visit</span>
                  <span>{p.lastVisit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsSection;
