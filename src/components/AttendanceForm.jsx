import React, { useEffect, useState } from "react";
import { addAttendance, isMarked } from "../utils/storage.js";

export default function AttendanceForm({ employee, onAttendanceMarked }) {
  const [status, setStatus] = useState("present");
  const [already, setAlready] = useState(false);
  const today = new Date().toISOString().slice(0,10);

  useEffect(() => {
    setAlready(isMarked(employee.id, today));
  }, [employee.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (already) return alert("You have already marked attendance for today.");
    addAttendance(employee.id, status, today);
    setAlready(true);
    alert("Attendance marked for today.");
    if (typeof onAttendanceMarked === "function") onAttendanceMarked();
  };

  return (
    <div className="card">
      <h3>Mark Attendance — {today}</h3>
      <form onSubmit={handleSubmit}>
        <label className="small">Status</label>
        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
        <div style={{marginTop:8}}>
          <button className="btn" type="submit" disabled={already}>{already ? "Already Marked" : "Mark Attendance"}</button>
        </div>
      </form>
    </div>
  );
}
