import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { bootstrap, getCurrentUser, setCurrentUser, getTheme } from "./utils/storage.js";
import useAutoLogout from "./hooks/useAutoLogout.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    bootstrap(); // ensure data seeded
    const cur = getCurrentUser();
    if (cur) setUser(cur);
    document.documentElement.setAttribute("data-theme", theme);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useAutoLogout(() => {
    if (user) {
      setCurrentUser(null);
      setUser(null);
      alert("Session expired — logged out for inactivity.");
    }
  }, 5 * 60 * 1000); // 5 minutes

  const onLogin = (u) => {
    setCurrentUser(u);
    setUser(u);
  };

  const onLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <div className="app">
      <ThemeToggle theme={theme} setTheme={setThemeState} />
      {!user ? (
        <Login onLogin={onLogin} />
      ) : user.role === "admin" ? (
        <AdminDashboard onLogout={onLogout} />
      ) : (
        <UserDashboard employee={user} onLogout={onLogout} />
      )}
    </div>
  );
}
