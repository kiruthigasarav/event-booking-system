import React, { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  signInWithPopup
} from "firebase/auth";

import {
  auth,
  provider
} from "./firebase";

const API =
  "https://event-booking-system-hjrv.onrender.com";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  /* ================= NORMAL LOGIN ================= */

  const login = async () => {

    try {

      const response = await fetch(
        `${API}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data =
        await response.json();

      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "token",
          data.token
        );

        alert(
          "Login Successful"
        );

        navigate("/");

      } else {

        alert(data.message);
      }

    } catch (error) {

      console.log(error);

      alert("Server Error");
    }
  };

  /* ================= GOOGLE LOGIN ================= */

  const googleLogin = async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const googleUser =
        result.user;

      /* CHECK USER EXISTS */

      const checkResponse =
        await fetch(
          `${API}/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              name:
                googleUser.displayName,
              email:
                googleUser.email
            })
          }
        );

      const data =
        await checkResponse.json();

      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "token",
          data.token
        );

        alert(
          "Google Login Successful"
        );

        navigate("/");

      } else {

        alert(data.message);
      }

    } catch (error) {

      console.log(error);

      alert("Google Login Failed");
    }
  };

  return (

    <div style={container}>

      <div style={box}>

        <h2 style={title}>
          Login
        </h2>

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value
            })
          }
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value
            })
          }
        />

        <button
          style={button}
          onClick={login}
        >
          Login
        </button>

        <button
          style={googleBtn}
          onClick={googleLogin}
        >
          Sign in with Google
        </button>

        <p style={text}>

          Don't have an account?

          <Link
            to="/register"
            style={link}
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

/* ================= CSS ================= */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)"
};

const box = {
  background:
    "rgba(255,255,255,0.08)",
  padding: "40px",
  borderRadius: "20px",
  width: "350px",
  backdropFilter: "blur(10px)",
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.3)"
};

const title = {
  color: "white",
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "35px"
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box"
};

const button = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg,#06b6d4,#3b82f6)",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px"
};

const googleBtn = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#db4437",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "15px"
};

const text = {
  color: "white",
  marginTop: "20px",
  textAlign: "center"
};

const link = {
  color: "#38bdf8",
  marginLeft: "8px",
  textDecoration: "none",
  fontWeight: "bold"
};

export default Login;