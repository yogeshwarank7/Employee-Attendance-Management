import React from "react";
import AttendanceForm from "./AttendanceForm.jsx";
import AttendanceList from "./AttendanceList.jsx";

export default function UserDashboard({ employee, onLogout }) {
  return (
    <div className="container">
      <div className="card">
        <div className="toolbar">
          <h2>Welcome, {employee.name}</h2>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
        <p className="small">ID: {employee.id}</p>
      </div>

      <AttendanceForm employee={employee} />
      <AttendanceList employee={employee} />
    </div>
  );
}
