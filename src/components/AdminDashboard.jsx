import React, { useEffect, useState } from "react";
import { getEmployees, addEmployee, removeEmployee, updateEmployee, downloadAttendanceCSV, getAttendance } from "../utils/storage.js";

export default function AdminDashboard({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPass, setEditingPass] = useState("");

  const refresh = () => setEmployees(getEmployees());

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !password) return alert("Name & password required");
    addEmployee({ name, password });
    setName(""); setPassword("");
    refresh();
    alert("Employee added");
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditingName(emp.name);
    setEditingPass("");
  };
  const saveEdit = () => {
    updateEmployee(editingId, { name: editingName, password: editingPass || undefined });
    setEditingId(null);
    refresh();
  };

  const del = (id) => {
    if (!confirm("Delete employee?")) return;
    removeEmployee(id);
    refresh();
  };

  const exportCsv = () => {
    downloadAttendanceCSV();
  };

  const attendance = getAttendance();

  return (
    <div className="container">
      <div className="card">
        <div className="toolbar">
          <h2>Admin Dashboard</h2>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" onClick={exportCsv}>Export CSV</button>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <h3>Employees</h3>
        <form onSubmit={handleAdd} style={{marginBottom:12}}>
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="btn" type="submit">Add</button>
          </div>
        </form>

        {employees.length === 0 ? <p className="small">No employees</p> : (
          <table className="table">
            <thead><tr><th>#</th><th>Name</th><th>Actions</th></tr></thead>
            <tbody>
              {employees.map((e,i)=>(
                <tr key={e.id}>
                  <td>{i+1}</td>
                  <td>
                    {editingId === e.id ? (
                      <input value={editingName} onChange={(ev)=>setEditingName(ev.target.value)} />
                    ) : e.name}
                  </td>
                  <td style={{textAlign:"right"}}>
                    {editingId === e.id ? (
                      <>
                        <input type="password" placeholder="New pass (opt)" value={editingPass} onChange={(ev)=>setEditingPass(ev.target.value)} style={{marginRight:8}} />
                        <button className="btn" onClick={saveEdit}>Save</button>
                        <button className="btn" onClick={()=>setEditingId(null)} style={{marginLeft:8}}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={()=>startEdit(e)}>Edit</button>
                        <button className="btn" onClick={()=>del(e.id)} style={{marginLeft:8}}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Attendance Logs (recent)</h3>
        {attendance.length === 0 ? <p className="small">No attendance recorded</p> : (
          <table className="table">
            <thead><tr><th>#</th><th>Employee ID</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {attendance.slice().reverse().map((r,i)=>(
                <tr key={i}><td>{i+1}</td><td>{r.empId}</td><td>{r.date}</td><td>{r.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
