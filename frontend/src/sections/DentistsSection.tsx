const DENTISTS = [
  {
    name: "Dr. Denish Ahalpara",
    role: "Founder & Chief Dentist",
    specialization: "General Dentistry, Cosmetic Dentistry",
    experience: "10+ Years",
    email: "dr.denish@shivshakti.com",
    phone: "+91 93132 88482",
    available: true,
    schedule: "Mon-Sat, 9:00 AM - 6:00 PM",
    patients: 1248,
    rating: 4.9,
  },
  {
    name: "Dr. Krunal Patel",
    role: "Senior Dentist",
    specialization: "Orthodontics, Root Canal Treatment",
    experience: "8+ Years",
    email: "dr.krunal@shivshakti.com",
    phone: "+91 87654 32109",
    available: true,
    schedule: "Mon-Fri, 10:00 AM - 5:00 PM",
    patients: 856,
    rating: 4.8,
  },
  {
    name: "Dr. Priya Sharma",
    role: "Dental Surgeon",
    specialization: "Oral Surgery, Implantology",
    experience: "6+ Years",
    email: "dr.priya@shivshakti.com",
    phone: "+91 76543 21098",
    available: false,
    schedule: "Tue-Sat, 9:00 AM - 4:00 PM",
    patients: 542,
    rating: 4.7,
  },
];

const DentistsSection = () => {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const getColor = (name: string) => {
    const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
    let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  };

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Dentists</h2>
          <p className="sec-subtitle">Our team of dental professionals</p>
        </div>
        <button className="sec-add-btn">+ Add Dentist</button>
      </div>

      <div className="sec-grid sec-grid-dentists">
        {DENTISTS.map((d, i) => (
          <div key={i} className="sec-dentist-card">
            <div className="sec-dentist-top">
              <div className="sec-dentist-avatar" style={{ background: getColor(d.name) }}>
                {getInitials(d.name)}
              </div>
              <span className={`sec-dentist-status ${d.available ? "online" : "offline"}`}>
                {d.available ? "Available" : "Off Duty"}
              </span>
            </div>
            <h3 className="sec-dentist-name">{d.name}</h3>
            <p className="sec-dentist-role">{d.role}</p>
            <div className="sec-dentist-detail">
              <span>🦷</span> <span>{d.specialization}</span>
            </div>
            <div className="sec-dentist-detail">
              <span>📅</span> <span>{d.schedule}</span>
            </div>
            <div className="sec-dentist-detail">
              <span>⏱️</span> <span>{d.experience} Experience</span>
            </div>
            <div className="sec-dentist-footer">
              <div className="sec-dentist-stat">
                <span className="sec-dentist-stat-num">{d.patients}</span>
                <span>Patients</span>
              </div>
              <div className="sec-dentist-stat">
                <span className="sec-dentist-stat-num">⭐ {d.rating}</span>
                <span>Rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DentistsSection;
