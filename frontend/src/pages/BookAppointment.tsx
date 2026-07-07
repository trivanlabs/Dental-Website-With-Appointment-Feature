import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { createAppointment, getBookedSlots, type BookedSlot } from "@/lib/appointmentApi";
import logo from "@/assets/logo.png";

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM",
  "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM",
  "4:30 PM", "5:00 PM", "5:30 PM",
];

interface FormData {
  patientName: string;
  email: string;
  mobile: string;
  concern: string;
}

interface ConfirmationData {
  patientName: string;
  email: string;
  date: string;
  timeSlot: string;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    email: "",
    mobile: "",
    concern: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [error, setError] = useState("");

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch booked slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      getBookedSlots(dateStr)
        .then(setBookedSlots)
        .catch(() => setBookedSlots([]));
    }
  }, [selectedDate]);

  const isSlotBooked = (slot: string) => {
    return bookedSlots.some((b) => b.timeSlot === slot);
  };

  const isSlotInPast = (slot: string) => {
    if (!selectedDate) return false;
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    if (selectedDateStr !== todayStr) return false;

    const match = slot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return false;

    let [_, hoursStr, minutesStr, period] = match;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (hours < currentHours) return true;
    if (hours === currentHours && minutes <= currentMinutes) return true;
    return false;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    setError("");

    try {
      await createAppointment({
        patientName: formData.patientName,
        email: formData.email,
        mobile: formData.mobile,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedSlot,
        concern: formData.concern,
      });

      setConfirmation({
        patientName: formData.patientName,
        email: formData.email,
        date: format(selectedDate, "EEEE, d MMMM yyyy"),
        timeSlot: selectedSlot,
      });
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setFormData({ patientName: "", email: "", mobile: "", concern: "" });
    setConfirmation(null);
    setError("");
  };

  // ─── Calendar helpers ──────────────────────────────────────────────
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);
  const today = startOfDay(new Date());

  const renderCalendar = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Day headers
    for (const d of dayNames) {
      days.push(
        <div key={`header-${d}`} className="calendar-day-header">
          {d}
        </div>
      );
    }

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = isBefore(date, today);
      const isSelected = selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

      days.push(
        <button
          key={`day-${d}`}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(date);
            setSelectedSlot(null);
          }}
          className={`calendar-day ${isPast ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  // ─── Stepper ───────────────────────────────────────────────────────
  const renderStepper = () => (
    <div className="booking-stepper">
      <div className={`stepper-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
        <div className="stepper-circle">{step > 1 ? "✓" : "1"}</div>
        <span>Pick Date</span>
      </div>
      <div className={`stepper-line ${step > 1 ? "active" : ""}`}></div>
      <div className={`stepper-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
        <div className="stepper-circle">{step > 2 ? "✓" : "2"}</div>
        <span>Choose Time</span>
      </div>
      <div className={`stepper-line ${step > 2 ? "active" : ""}`}></div>
      <div className={`stepper-step ${step >= 3 ? "active" : ""}`}>
        <div className="stepper-circle">3</div>
        <span>Your Details</span>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      {/* Header */}
      <header className="booking-header">
        <div className="booking-header-content">
          <img src={logo} alt="Shiv Shakti Dental" className="booking-logo" />
          <div>
            <h1 className="booking-clinic-name">Shiv Shakti Dental Clinic</h1>
            <p className="booking-doctor-name">Dr. Hetvish Ahalpara</p>
          </div>
        </div>
      </header>

      {step < 4 && renderStepper()}

      <div className="booking-container">
        <div className="booking-card">
          {/* ─── Step 1: Pick Date ───────────────────────────────── */}
          {step === 1 && (
            <>
              <h2 className="booking-step-title">📅 Pick a Date</h2>
              <p className="booking-step-subtitle">Select your preferred appointment date</p>

              <div className="calendar-container">
                <div className="calendar-header">
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="calendar-nav-btn"
                  >
                    ←
                  </button>
                  <span className="calendar-month-title">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="calendar-nav-btn"
                  >
                    →
                  </button>
                </div>
                <div className="calendar-grid">{renderCalendar()}</div>
              </div>

              <button
                className="booking-next-btn"
                disabled={!selectedDate}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </>
          )}

          {/* ─── Step 2: Choose Time ────────────────────────────── */}
          {step === 2 && (
            <>
              <button className="booking-back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <h2 className="booking-step-title">⏰ Choose a Time Slot</h2>
              <p className="booking-step-subtitle">
                {selectedDate && format(selectedDate, "EEEE, d MMMM yyyy")}
              </p>

              <div className="slot-legend">
                <span className="legend-item">
                  <span className="legend-dot available"></span> Available
                </span>
                <span className="legend-item">
                  <span className="legend-dot booked"></span> Booked
                </span>
                <span className="legend-item">
                  <span className="legend-dot selected-legend"></span> Selected
                </span>
              </div>

              <div className="time-slots-grid">
                {TIME_SLOTS.map((slot) => {
                  const booked = isSlotBooked(slot);
                  const inPast = isSlotInPast(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      disabled={booked || inPast}
                      onClick={() => setSelectedSlot(slot)}
                      className={`time-slot ${booked ? "booked" : ""} ${inPast ? "past disabled" : ""} ${isSelected ? "selected" : ""}`}
                    >
                      <span className="slot-time">{slot}</span>
                      {booked && <span className="slot-status">Pending</span>}
                      {inPast && <span className="slot-status">Passed</span>}
                    </button>
                  );
                })}
              </div>

              <button
                className="booking-next-btn"
                disabled={!selectedSlot}
                onClick={() => setStep(3)}
              >
                Continue →
              </button>
            </>
          )}

          {/* ─── Step 3: Your Details ───────────────────────────── */}
          {step === 3 && (
            <>
              <button className="booking-back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <h2 className="booking-step-title">📝 Your Details</h2>
              <p className="booking-step-subtitle">
                {selectedDate && format(selectedDate, "EEEE, d MMMM yyyy")} at {selectedSlot}
              </p>

              {error && <div className="booking-error">{error}</div>}

              <form
                className="booking-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="form-group">
                  <label htmlFor="patientName">Full Name *</label>
                  <input
                    id="patientName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="concern">Dental Concern</label>
                  <textarea
                    id="concern"
                    placeholder="Describe your dental concern (e.g., tooth pain, cleaning, cavity)"
                    rows={3}
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="btn-loading">
                      <span className="spinner"></span> Booking...
                    </span>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ─── Step 4: Confirmation ───────────────────────────── */}
          {step === 4 && confirmation && (
            <div className="confirmation-container">
              <div className="confirmation-emoji">🎉</div>
              <h2 className="confirmation-title">Appointment Requested!</h2>
              <p className="confirmation-subtitle">
                Hi <strong>{confirmation.patientName}</strong>, your appointment request has been submitted.
              </p>

              <div className="confirmation-details">
                <div className="detail-row">
                  <span className="detail-label">📅 Date</span>
                  <span className="detail-value">{confirmation.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Time</span>
                  <span className="detail-value">{confirmation.timeSlot}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📧 Confirmation</span>
                  <span className="detail-value">{confirmation.email}</span>
                </div>
              </div>

              <div className="confirmation-note">
                ⏳ Your appointment is <strong>pending confirmation</strong> from the doctor. You will receive an email/SMS once confirmed.
              </div>

              <button className="booking-submit-btn" onClick={resetForm}>
                Book Another Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
