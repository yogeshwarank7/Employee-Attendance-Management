import { sha256 } from "./crypto.js";

/* Fixed admin credentials */
const ADMIN = { username: "yoki", password: "yogesh" };

/* localStorage keys */
const KEYS = {
  EMPLOYEES: "em_employees_v3",
  ATTENDANCE: "em_attendance_v3",
  CURRENT: "em_current_user_v3",
  THEME: "em_theme_v3",
};

export function bootstrap() {
  // seed employees (order: 1. yogesh, 2. mikey)
  if (!localStorage.getItem(KEYS.EMPLOYEES)) {
    const seed = [
      { id: 1001, name: "yogesh", passHash: sha256("123456") },
      { id: 1002, name: "mikey", passHash: sha256("123456") },
    ];
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(seed));
  }
  if (!localStorage.getItem(KEYS.ATTENDANCE)) {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.THEME)) {
    // default to dark (you can change to "light")
    localStorage.setItem(KEYS.THEME, "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", localStorage.getItem(KEYS.THEME));
  }
}

/* Employees */
export function getEmployees() {
  return JSON.parse(localStorage.getItem(KEYS.EMPLOYEES) || "[]");
}

export function addEmployee({ name, password }) {
  if (!name || !password) throw new Error("Name & password required");
  const list = getEmployees();
  const id = Date.now();
  const passHash = sha256(password);
  list.push({ id, name, passHash });
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
  return { id, name };
}

export function updateEmployee(id, patch = {}) {
  const list = getEmployees();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const cur = list[idx];
  const updated = { ...cur };
  if (patch.name) updated.name = patch.name;
  if (patch.password) updated.passHash = sha256(patch.password);
  list[idx] = updated;
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
  return updated;
}

export function removeEmployee(id) {
  const list = getEmployees().filter((e) => e.id !== id);
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(list));
  return list;
}

/* Auth */
export function login(role, identifier, password) {
  // role === "admin" => identifier is username
  if (role === "admin") {
    if (String(identifier) === ADMIN.username && String(password) === ADMIN.password) {
      return { role: "admin", username: ADMIN.username };
    }
    return null;
  }
  // employee login: identifier is employee id (number or string)
  const employees = getEmployees();
  const empId = typeof identifier === "number" ? identifier : parseInt(identifier, 10);
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return null;
  if (emp.passHash === sha256(password)) {
    return { role: "employee", id: emp.id, name: emp.name };
  }
  return null;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(KEYS.CURRENT) || "null");
}

export function setCurrentUser(u) {
  if (!u) localStorage.removeItem(KEYS.CURRENT);
  else localStorage.setItem(KEYS.CURRENT, JSON.stringify(u));
}

/* Attendance: stored as array of records { empId, date, status } */
export function addAttendance(empId, status, date = null) {
  const d = date || new Date().toISOString().slice(0, 10);
  const arr = JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || "[]");
  const existIdx = arr.findIndex((r) => r.empId === empId && r.date === d);
  if (existIdx !== -1) {
    // overwrite status if already exists
    arr[existIdx].status = status;
  } else {
    arr.push({ empId, date: d, status });
  }
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(arr));
  return true;
}

export function getAttendance(empId = null) {
  const arr = JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || "[]");
  if (empId == null) return arr.sort((a,b)=> b.date.localeCompare(a.date));
  return arr.filter(r => r.empId === empId).sort((a,b)=> b.date.localeCompare(a.date));
}

export function isMarked(empId, date = null) {
  const d = date || new Date().toISOString().slice(0, 10);
  const arr = getAttendance(empId);
  return arr.some(r => r.date === d);
}

/* CSV export: simple rows EmployeeId,Name,Date,Status */
export function buildAttendanceCSV() {
  const employees = getEmployees();
  const attendance = getAttendance();
  const rows = [["EmployeeId","Name","Date","Status"]];
  attendance.forEach(r => {
    const emp = employees.find(e => e.id === r.empId);
    rows.push([r.empId, emp ? emp.name : "Unknown", r.date, r.status]);
  });
  return rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
}

export function downloadAttendanceCSV(filename = "attendance.csv") {
  const csv = buildAttendanceCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* Theme */
export function getTheme() {
  return localStorage.getItem(KEYS.THEME) || "dark";
}
export function setTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
  document.documentElement.setAttribute("data-theme", theme);
}
