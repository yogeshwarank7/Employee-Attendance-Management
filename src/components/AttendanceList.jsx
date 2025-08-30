import React, { useEffect, useState } from "react";
import { getAttendance, getEmployees } from "../utils/storage.js";

export default function AttendanceList({ employee }) {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  useEffect(() => {
    if (!employee) {
      setRecords(getAttendance());
    } else {
      setRecords(getAttendance(employee.id));
    }
  }, [employee]);

  return (
    <div className="card">
      <h3>Attendance Records</h3>
      {records.length === 0 ? <p className="small">No records</p> : (
        <table className="table">
          <thead><tr><th>#</th><th>Date</th><th>Status</th><th>Employee</th></tr></thead>
          <tbody>
            {records.map((r,i)=> {
              const emp = employees.find(e => e.id === r.empId);
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{r.date}</td>
                  <td>{r.status}</td>
                  <td>{emp ? emp.name : r.empId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
