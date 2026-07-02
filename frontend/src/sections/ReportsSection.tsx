import React from "react";

const ReportsSection = () => {
  return (
    <div className="sec-page">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">Analytics & Reports</h2>
          <p className="sec-subtitle">Overview of clinic performance and insights</p>
        </div>
      </div>

      <div className="sec-reports-grid">
        <div className="sec-report-card">
          <h3>Appointments Growth</h3>
          <div className="sec-report-placeholder">
            {/* Visual Bar Graph */}
            <div className="sec-bar-graph">
              <div className="sec-bar" style={{ height: "40%" }}><span className="bar-val">45</span><span className="bar-lbl">Jan</span></div>
              <div className="sec-bar" style={{ height: "55%" }}><span className="bar-val">62</span><span className="bar-lbl">Feb</span></div>
              <div className="sec-bar" style={{ height: "70%" }}><span className="bar-val">84</span><span className="bar-lbl">Mar</span></div>
              <div className="sec-bar" style={{ height: "60%" }}><span className="bar-val">72</span><span className="bar-lbl">Apr</span></div>
              <div className="sec-bar" style={{ height: "85%" }}><span className="bar-val">98</span><span className="bar-lbl">May</span></div>
              <div className="sec-bar" style={{ height: "100%" }}><span className="bar-val">120</span><span className="bar-lbl">Jun</span></div>
            </div>
          </div>
        </div>

        <div className="sec-report-card">
          <h3>Monthly Revenue Insights</h3>
          <div className="sec-report-placeholder">
            <div className="sec-revenue-stats">
              <div className="sec-rev-stat">
                <h4>Total Revenue</h4>
                <p className="rev-num">₹2,48,500</p>
                <span className="positive">+12% vs last month</span>
              </div>
              <div className="sec-rev-stat">
                <h4>Average Ticket</h4>
                <p className="rev-num">₹2,070</p>
                <span>Based on 120 appointments</span>
              </div>
              <div className="sec-rev-stat">
                <h4>Pending Invoices</h4>
                <p className="rev-num" style={{ color: "#f59e0b" }}>₹8,000</p>
                <span>1 Invoice remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
