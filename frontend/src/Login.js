import {
  signInWithPopup
} from "firebase/auth";

import {
  auth,
  provider
} from "./firebase";
import React, { useState } from "react";
import {
    useNavigate,
    Link
} from "react-router-dom";

const API =
    "https://event-booking-system-hjrv.onrender.com";

function Login() {
    const googleLogin = async () => {

  try {

    const result =
      await signInWithPopup(
        auth,
        provider
      );

    const user = result.user;

    const googleUser = {
      id: Date.now(),
      name: user.displayName,
      email: user.email,
      role: "attendee"
    };

    localStorage.setItem(
      "user",
      JSON.stringify(googleUser)
    );

    alert("Google Login Success");

    window.location.href = "/";

  } catch (error) {

    console.log(error);

    alert("Google Login Failed");
  }
};
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

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
  style={button}
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
    fontSize: "16px"
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