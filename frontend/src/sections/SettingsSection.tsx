import React, { useState } from "react";
import { changePassword } from "@/lib/appointmentApi";
import { useToast } from "@/components/ui/use-toast";

const SettingsSection = () => {
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState("Shiv Shakti Dental Clinic");
  const [address, setAddress] = useState("102-105, Platinum Heights, near Science City Road, Sola, Ahmedabad, Gujarat");
  const [phone, setPhone] = useState("+91 93132 88482");

  const [currPw, setCurrPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Updated",
      description: "Clinic profile details have been saved successfully.",
    });
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }
    setLoading(true);
    try {
      await changePassword(currPw, newPw);
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
      setCurrPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Settings & Settings</h2>
          <p className="sec-subtitle">Manage clinic details and account security</p>
        </div>
      </div>

      <div className="sec-settings-grid">
        <div className="sec-settings-card">
          <h3>Clinic Profile</h3>
          <form onSubmit={handleUpdateInfo} className="sec-settings-form">
            <div className="form-group">
              <label>Clinic Name</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Clinic Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button type="submit" className="save-notes-btn">Save Profile Info</button>
          </form>
        </div>

        <div className="sec-settings-card">
          <h3>Security & Credentials</h3>
          <form onSubmit={handleChangePw} className="sec-settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                required
                value={currPw}
                onChange={(e) => setCurrPw(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
            <button type="submit" className="save-notes-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
