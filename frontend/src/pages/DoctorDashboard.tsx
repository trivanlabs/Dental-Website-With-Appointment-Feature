import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAppointments,
  getDashboardStats,
  updateAppointmentStatus,
  updateDoctorNotes,
  getExportUrl,
  logout,
  getStoredAdmin,
  type Appointment,
  type DashboardStats,
} from "@/lib/appointmentApi";
import { format, startOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import AppointmentsSection from "@/sections/AppointmentsSection";
import PatientsSection from "@/sections/PatientsSection";
import DentistsSection from "@/sections/DentistsSection";
import ServicesSection from "@/sections/ServicesSection";
import PaymentsSection from "@/sections/PaymentsSection";
import ReviewsSection from "@/sections/ReviewsSection";
import ReportsSection from "@/sections/ReportsSection";
import SettingsSection from "@/sections/SettingsSection";


const SERVICES_DATA = [
  { name: "Regular Checkup", percent: 40, color: "#3b82f6" },
  { name: "Teeth Cleaning", percent: 25, color: "#22c55e" },
  { name: "Fillings", percent: 15, color: "#f59e0b" },
  { name: "Root Canal", percent: 10, color: "#f97316" },
  { name: "Others", percent: 10, color: "#8b5cf6" },
];

const REVIEWS_DATA = [
  { name: "Riya Shah", rating: 5, date: "18 Jun 2025", text: "Very good experience! The staff is friendly and the clinic is very clean." },
  { name: "Amit Patel", rating: 5, date: "17 Jun 2025", text: "Dr. Denish explained everything clearly. Highly recommended!" },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ today: 0, pending: 0, confirmed: 0, total: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchInput, setSearchInput] = useState("");

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [appts, dashStats] = await Promise.all([
        getAppointments(),
        getDashboardStats(),
      ]);
      setAllAppointments(appts);
      setAppointments(appts);
      setStats(dashStats);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Today's appointments
  const todayAppointments = useMemo(() => {
    const todayStr = format(today, "yyyy-MM-dd");
    return allAppointments.filter((a) => a.date === todayStr);
  }, [allAppointments, today]);

  // Upcoming appointments (future, pending/confirmed)
  const upcomingAppointments = useMemo(() => {
    const todayStr = format(today, "yyyy-MM-dd");
    return allAppointments
      .filter((a) => a.date >= todayStr && (a.status === "pending" || a.status === "confirmed"))
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot))
      .slice(0, 5);
  }, [allAppointments, today]);

  // Calendar stats
  const calendarStats = useMemo(() => {
    const todayStr = format(today, "yyyy-MM-dd");
    const weekStart = format(startOfWeek(today), "yyyy-MM-dd");
    const weekEnd = format(endOfWeek(today), "yyyy-MM-dd");
    const monthStart = format(startOfMonth(today), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(today), "yyyy-MM-dd");

    const todayCount = allAppointments.filter((a) => a.date === todayStr && a.status !== "cancelled").length;
    const weekCount = allAppointments.filter((a) => a.date >= weekStart && a.date <= weekEnd && a.status !== "cancelled").length;
    const monthCount = allAppointments.filter((a) => a.date >= monthStart && a.date <= monthEnd && a.status !== "cancelled").length;
    const cancelledCount = allAppointments.filter((a) => a.status === "cancelled").length;

    return { today: todayCount, week: weekCount, month: monthCount, cancelled: cancelledCount };
  }, [allAppointments, today]);

  // Dates with appointments for calendar dots
  const appointmentDates = useMemo(() => {
    const dates = new Set<string>();
    allAppointments.forEach((a) => {
      if (a.status !== "cancelled") dates.add(a.date);
    });
    return dates;
  }, [allAppointments]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateAppointmentStatus(id, status);
      fetchData();
      if (selectedAppointment?._id === id) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    try {
      await updateDoctorNotes(selectedAppointment._id, doctorNotes);
      fetchData();
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const openViewModal = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setDoctorNotes(appt.doctorNotes || "");
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      pending: { className: "db-status-pending", label: "Pending" },
      confirmed: { className: "db-status-confirmed", label: "Confirmed" },
      cancelled: { className: "db-status-cancelled", label: "Cancelled" },
      completed: { className: "db-status-completed", label: "Completed" },
    };
    const s = map[status] || map.pending;
    return <span className={`db-status-badge ${s.className}`}>{s.label}</span>;
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return format(date, "d MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatBookedAt = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d/M/yyyy, h:mm:ss a");
    } catch {
      return dateStr;
    }
  };

  // Calendar rendering
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year: calYear, month: calMonth } = getDaysInMonth(calendarMonth);

  const renderMiniCalendar = () => {
    const days = [];
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (const d of dayNames) {
      days.push(<div key={`h-${d}`} className="db-cal-day-header">{d}</div>);
    }

    // Previous month fill
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(<div key={`prev-${i}`} className="db-cal-day other-month">{prevMonthDays - i}</div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calYear, calMonth, d);
      const dateStr = format(date, "yyyy-MM-dd");
      const isToday = isSameDay(date, today);
      const hasAppt = appointmentDates.has(dateStr);

      days.push(
        <div key={`day-${d}`} className={`db-cal-day ${isToday ? "today" : ""} ${hasAppt ? "has-appt" : ""}`}>
          {d}
          {hasAppt && <span className="db-cal-dot"></span>}
        </div>
      );
    }

    // Next month fill
    const totalCells = days.length - 7; // subtract headers
    const remaining = 42 - totalCells;
    for (let i = 1; i <= remaining && remaining < 14; i++) {
      days.push(<div key={`next-${i}`} className="db-cal-day other-month">{i}</div>);
    }

    return days;
  };

  // Generate patient initials for avatar
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Donut chart SVG
  const renderDonutChart = () => {
    const size = 160;
    const strokeWidth = 28;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {SERVICES_DATA.map((service, i) => {
          const dashLength = (service.percent / 100) * circumference;
          const dashOffset = -offset;
          offset += dashLength;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={service.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "all 0.5s ease" }}
            />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r={radius - strokeWidth / 2 + 2} fill="white" />
      </svg>
    );
  };

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "appointments", icon: "📅", label: "Appointments" },
    { key: "patients", icon: "👥", label: "Patients" },
    { key: "dentists", icon: "🦷", label: "Dentists" },
    { key: "services", icon: "🔧", label: "Services" },
    { key: "payments", icon: "💳", label: "Payments" },
    { key: "reviews", icon: "⭐", label: "Reviews" },
    { key: "reports", icon: "📈", label: "Reports" },
    { key: "settings", icon: "⚙️", label: "Settings" },
  ];

  const renderStars = (count: number) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="db-stats-row">
        <div className="db-stat-card">
          <div className="db-stat-icon-wrap blue">
            <span>🕐</span>
          </div>
          <div className="db-stat-body">
            <span className="db-stat-label">Today's Appointments</span>
            <span className="db-stat-num">{stats.today}</span>
            <span className="db-stat-change positive">+2 from yesterday</span>
          </div>
          <div className="db-stat-sparkline blue"></div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon-wrap green">
            <span>👥</span>
          </div>
          <div className="db-stat-body">
            <span className="db-stat-label">Total Patients</span>
            <span className="db-stat-num">{stats.total > 0 ? stats.total * 12 : 0}</span>
            <span className="db-stat-change positive">+18 this month</span>
          </div>
          <div className="db-stat-sparkline green"></div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon-wrap teal">
            <span>🩺</span>
          </div>
          <div className="db-stat-body">
            <span className="db-stat-label">Total Treatments</span>
            <span className="db-stat-num">{stats.confirmed + stats.pending}</span>
            <span className="db-stat-change positive">+24 this month</span>
          </div>
          <div className="db-stat-sparkline teal"></div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon-wrap gold">
            <span>₹</span>
          </div>
          <div className="db-stat-body">
            <span className="db-stat-label">Monthly Revenue</span>
            <span className="db-stat-num">₹2,48,500</span>
            <span className="db-stat-change positive">+12% this month</span>
          </div>
          <div className="db-stat-sparkline gold"></div>
        </div>
      </div>

      {/* Middle Row: Calendar + Today's Appointments */}
      <div className="db-middle-row">
        {/* Calendar */}
        <div className="db-card db-calendar-card">
          <h3 className="db-card-title">Appointments Overview</h3>
          <div className="db-cal-header">
            <button className="db-cal-nav" onClick={() => setCalendarMonth(new Date(calYear, calMonth - 1, 1))}>‹</button>
            <span className="db-cal-month">{format(calendarMonth, "MMMM yyyy")}</span>
            <button className="db-cal-nav db-cal-today-btn" onClick={() => setCalendarMonth(new Date())}>Today</button>
          </div>
          <div className="db-cal-grid">{renderMiniCalendar()}</div>

          {/* Calendar Stats */}
          <div className="db-cal-stats">
            <div className="db-cal-stat">
              <span className="db-cal-stat-icon">🕐</span>
              <div>
                <span className="db-cal-stat-num">{calendarStats.today}</span>
                <span className="db-cal-stat-label">Today</span>
              </div>
            </div>
            <div className="db-cal-stat">
              <span className="db-cal-stat-icon">📅</span>
              <div>
                <span className="db-cal-stat-num">{calendarStats.week}</span>
                <span className="db-cal-stat-label">This Week</span>
              </div>
            </div>
            <div className="db-cal-stat">
              <span className="db-cal-stat-icon">📊</span>
              <div>
                <span className="db-cal-stat-num">{calendarStats.month}</span>
                <span className="db-cal-stat-label">This Month</span>
              </div>
            </div>
            <div className="db-cal-stat">
              <span className="db-cal-stat-icon">🗑️</span>
              <div>
                <span className="db-cal-stat-num">{calendarStats.cancelled}</span>
                <span className="db-cal-stat-label">Cancelled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="db-card db-today-card">
          <div className="db-card-header">
            <h3 className="db-card-title">Today's Appointments</h3>
            <button className="db-view-all-btn" onClick={() => setActiveNav("appointments")}>View all</button>
          </div>

          {loading ? (
            <div className="db-empty">Loading...</div>
          ) : todayAppointments.length === 0 ? (
            <div className="db-empty">No appointments today</div>
          ) : (
            <div className="db-today-list">
              {todayAppointments.map((appt) => (
                <div key={appt._id} className="db-today-item" onClick={() => openViewModal(appt)}>
                  <div className="db-today-avatar" style={{ background: getAvatarColor(appt.patientName) }}>
                    {getInitials(appt.patientName)}
                  </div>
                  <div className="db-today-info">
                    <span className="db-today-name">{appt.patientName}</span>
                    <span className="db-today-pid">PID: #{appt._id.slice(-5).toUpperCase()}</span>
                  </div>
                  <div className="db-today-time-col">
                    <span className="db-today-time">⏰ {appt.timeSlot}</span>
                    <span className="db-today-date">{formatDateDisplay(appt.date)}</span>
                  </div>
                  <div className="db-today-service-col">
                    <span className="db-today-service">🦷 {appt.concern || "Checkup"}</span>
                    <span className="db-today-doctor">Dr. Denish A.</span>
                  </div>
                  <div className="db-today-status-col">
                    {getStatusBadge(appt.status)}
                    <button className="db-today-more" onClick={(e) => { e.stopPropagation(); openViewModal(appt); }}>⋮</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Upcoming + Top Services + Reviews */}
      <div className="db-bottom-row">
        {/* Upcoming Appointments */}
        <div className="db-card db-upcoming-card">
          <div className="db-card-header">
            <h3 className="db-card-title">Upcoming Appointments</h3>
            <button className="db-view-all-btn" onClick={() => setActiveNav("appointments")}>View all</button>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="db-empty">No upcoming appointments</div>
          ) : (
            <div className="db-upcoming-list">
              {upcomingAppointments.slice(0, 3).map((appt) => (
                <div key={appt._id} className="db-upcoming-item">
                  <div className="db-upcoming-avatar" style={{ background: getAvatarColor(appt.patientName) }}>
                    {getInitials(appt.patientName)}
                  </div>
                  <div className="db-upcoming-info">
                    <span className="db-upcoming-date">{formatDateDisplay(appt.date)}, {appt.timeSlot}</span>
                    <span className="db-upcoming-name">{appt.patientName}</span>
                    <span className="db-upcoming-concern">{appt.concern || "Regular Checkup"}</span>
                  </div>
                  {getStatusBadge(appt.status === "pending" ? "pending" : appt.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Services */}
        <div className="db-card db-services-card">
          <h3 className="db-card-title">Top Services</h3>
          <div className="db-services-content">
            <div className="db-donut-wrap">
              {renderDonutChart()}
            </div>
            <div className="db-services-legend">
              {SERVICES_DATA.map((s, i) => (
                <div key={i} className="db-legend-item">
                  <span className="db-legend-dot" style={{ background: s.color }}></span>
                  <span className="db-legend-name">{s.name}</span>
                  <span className="db-legend-percent">{s.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="db-card db-reviews-card">
          <div className="db-card-header">
            <h3 className="db-card-title">Recent Reviews</h3>
            <button className="db-view-all-btn" onClick={() => setActiveNav("reviews")}>View all</button>
          </div>
          <div className="db-reviews-list">
            {REVIEWS_DATA.map((review, i) => (
              <div key={i} className="db-review-item">
                <div className="db-review-avatar" style={{ background: getAvatarColor(review.name) }}>
                  {getInitials(review.name)}
                </div>
                <div className="db-review-content">
                  <div className="db-review-top">
                    <span className="db-review-name">{review.name}</span>
                    <span className="db-review-stars">{renderStars(review.rating)}</span>
                    <span className="db-review-date">{review.date}</span>
                  </div>
                  <p className="db-review-text">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return renderDashboard();
      case "appointments":
        return <AppointmentsSection />;
      case "patients":
        return <PatientsSection />;
      case "dentists":
        return <DentistsSection />;
      case "services":
        return <ServicesSection />;
      case "payments":
        return <PaymentsSection />;
      case "reviews":
        return <ReviewsSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return renderDashboard();
    }
  };


  return (
    <div className="db-layout">
      {/* ─── Sidebar ──────────────────────────────────────── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <img src={logo} alt="Shiv Shakti" className="db-sidebar-logo" />
          <div>
            <h2 className="db-sidebar-clinic">Shiv Shakti</h2>
            <p className="db-sidebar-subtitle">Dental Clinic</p>
          </div>
        </div>

        <nav className="db-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`db-nav-item ${activeNav === item.key ? "active" : ""}`}
              onClick={() => setActiveNav(item.key)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Book Appointment CTA Card */}
        <div className="db-sidebar-cta">
          <h4>Book Appointment For Your Patient</h4>
          <p>Quickly schedule a new appointment in just a few clicks.</p>
          <button className="db-sidebar-cta-btn" onClick={() => navigate("/book-appointment")}>
            + New Appointment
          </button>
        </div>

        <button className="db-logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* ─── Main Content ─────────────────────────────────── */}
      <main className="db-main">
        {/* Top Header */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-menu-btn">☰</button>
            <div>
              <h1 className="db-welcome">Welcome back, Dr. Denish 👋</h1>
              <p className="db-welcome-sub">Here's what's happening with your clinic today.</p>
            </div>
          </div>
          <div className="db-topbar-right">
            <div className="db-search-bar">
              <span className="db-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search patients, appointments..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button className="db-notif-btn">
              🔔
              <span className="db-notif-badge">2</span>
            </button>
            <div className="db-profile-pill">
              <div className="db-profile-avatar">DA</div>
              <div className="db-profile-info">
                <span className="db-profile-name">Dr. Denish A.</span>
                <span className="db-profile-role">Admin</span>
              </div>
            </div>
          </div>
        </header>
        {/* Render Dynamic Section Content */}
        {renderContent()}
      </main>

      {/* ─── View Modal ───────────────────────────────────── */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Appointment Details</h2>
              <button className="modal-close" onClick={() => setSelectedAppointment(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-detail-row">
                <span className="modal-label">Patient Name</span>
                <span className="modal-value">{selectedAppointment.patientName}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Email</span>
                <span className="modal-value">{selectedAppointment.email}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Mobile</span>
                <span className="modal-value">{selectedAppointment.mobile}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Date</span>
                <span className="modal-value">{formatDateDisplay(selectedAppointment.date)}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Time Slot</span>
                <span className="modal-value">{selectedAppointment.timeSlot}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Status</span>
                <span className="modal-value">{getStatusBadge(selectedAppointment.status)}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Concern</span>
                <span className="modal-value">{selectedAppointment.concern || "—"}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Booked On</span>
                <span className="modal-value">{formatBookedAt(selectedAppointment.bookedAt)}</span>
              </div>
              <div className="modal-notes">
                <label>Doctor's Notes</label>
                <textarea
                  placeholder="Add notes about this appointment..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={4}
                ></textarea>
                <button className="save-notes-btn" onClick={handleSaveNotes}>💾 Save Notes</button>
              </div>
            </div>
            <div className="modal-actions">
              {selectedAppointment.status === "pending" && (
                <>
                  <button className="modal-confirm-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "confirmed")}>
                    ✅ Confirm Appointment
                  </button>
                  <button className="modal-cancel-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "cancelled")}>
                    ❌ Cancel Appointment
                  </button>
                </>
              )}
              {selectedAppointment.status === "confirmed" && (
                <button className="modal-complete-btn" onClick={() => handleStatusUpdate(selectedAppointment._id, "completed")}>
                  🎉 Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
