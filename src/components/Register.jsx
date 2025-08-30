import React, { useState } from "react";
import { addEmployee } from "../utils/storage.js";

export default function Register({ goLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !password) return alert("All fields required");
    addEmployee({ name, password });
    alert("Employee added!");
    goLogin();
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2>Add Employee (Admin only)</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn" type="submit">Add Employee</button>
        </form>
        <button className="btn" style={{ marginTop: 8 }} onClick={goLogin}>Back</button>
      </div>
    </div>
  );
}
