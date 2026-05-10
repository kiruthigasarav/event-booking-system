import React, { useState } from "react";
 
export default function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login"); // renamed from 'tab' to avoid shadowing
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "attendee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      if (!res.ok) { setError(await res.text()); return; }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      onLogin(data); // pass { token, role, userId, name } up to App
    } catch (e) {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };
 
  const handleRegister = async () => {
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const msg = await res.text();
      if (!res.ok) { setError(msg); return; }
      alert(msg + " — please sign in.");
      setActiveTab("login");
      setForm({ name: "", email: "", password: "", role: "attendee" });
    } catch (e) {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={mainContainer}>
      <div style={overlay}>
        <h1 style={mainTitle}>🎟 Event Booking System</h1>
 
        {/* Tabs */}
        <div style={tabRow}>
          {["login", "register"].map(t => (
            <button
              key={t}
              style={activeTab === t ? activeTabStyle : inactiveTabStyle}
              onClick={() => { setActiveTab(t); setError(""); }}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
 
        {error && <p style={errorBox}>{error}</p>}
 
        {activeTab === "login" && (
          <div style={formBox}>
            <h2 style={heading}>Welcome back</h2>
            <input
              style={input}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <input
              style={input}
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e => set("password", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <button style={primaryBtn} onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        )}
 
        {activeTab === "register" && (
          <div style={formBox}>
            <h2 style={heading}>Create account</h2>
            <input
              style={input}
              placeholder="Full Name"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
            <input
              style={input}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
            <input
              style={input}
              placeholder="Password (min 8 chars)"
              type="password"
              value={form.password}
              onChange={e => set("password", e.target.value)}
            />
            <select style={input} value={form.role} onChange={e => set("role", e.target.value)}>
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
            <button style={primaryBtn} onClick={handleRegister} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
 
const mainContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)",
  padding: "30px",
  fontFamily: "Poppins,sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
const overlay = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "25px",
  padding: "40px",
  color: "white",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  width: "100%",
  maxWidth: "460px"
};
const mainTitle = { fontSize: "28px", fontWeight: "bold", marginBottom: "24px", textAlign: "center" };
const tabRow = {
  display: "flex",
  gap: "8px",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "4px",
  marginBottom: "24px"
};
const activeTabStyle = {
  flex: 1, padding: "10px", border: "none", borderRadius: "10px",
  background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "16px"
};
const inactiveTabStyle = {
  flex: 1, padding: "10px", border: "none", borderRadius: "10px",
  background: "transparent", color: "rgba(255,255,255,0.6)",
  fontWeight: "600", cursor: "pointer", fontSize: "16px"
};
const formBox = { display: "flex", flexDirection: "column", gap: "12px" };
const heading = { fontSize: "22px", marginBottom: "8px" };
const input = {
  padding: "14px", borderRadius: "12px", border: "none",
  outline: "none", fontSize: "16px", width: "100%", boxSizing: "border-box"
};
const primaryBtn = {
  background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white", border: "none", padding: "14px", borderRadius: "12px",
  fontWeight: "bold", cursor: "pointer", fontSize: "18px", marginTop: "4px",
  opacity: 1
};
const errorBox = {
  background: "rgba(239,68,68,0.2)", border: "1px solid #ef4444",
  borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", fontSize: "14px"
};