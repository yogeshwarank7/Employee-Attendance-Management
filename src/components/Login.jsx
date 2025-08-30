import React, { useEffect, useState } from "react";
import { getEmployees, login, setCurrentUser } from "../utils/storage.js";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("employee");
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [password, setPassword] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") {
      const u = login("admin", adminUser, adminPass);
      if (!u) return alert("Invalid admin credentials");
      setCurrentUser(u);
      onLogin(u);
      return;
    }

    if (!selectedId) return alert("Select an employee");
    if (!password) return alert("Enter password");
    const u = login("employee", selectedId, password);
    if (!u) return alert("Wrong credentials for selected employee");
    setCurrentUser(u);
    onLogin(u);
  };

  return (
    <div className="container">
      <div className="card login-card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="small">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          {role === "employee" ? (
            <>
              <label className="small">Select Employee</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">— select —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <label className="small">Password</label>
              <input
                type="password"
                placeholder="Enter employee password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="small" style={{ marginTop: 8 }}>
                (Employees: yogesh, mikey — password: 123456)
              </div>
            </>
          ) : (
            <>
              <label className="small">Admin Username</label>
              <input placeholder="yoki" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
              <label className="small">Admin Password</label>
              <input type="password" placeholder="yogesh" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
              <div className="small" style={{ marginTop: 8 }}>
                (Admin: yoki / yogesh)
              </div>
            </>
          )}

          <button className="btn" type="submit" style={{ marginTop: 8 }}>Login</button>
        </form>
      </div>
    </div>
  );
}
