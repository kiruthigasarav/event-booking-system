import React, { useState } from "react";
import {
    useNavigate,
    Link
} from "react-router-dom";

const API =
    "https://event-booking-system-hjrv.onrender.com";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const login = async () => {
        if (
            !form.email ||
            !form.password
        ) {
            alert("Fill all fields");
            return;
        }

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

                alert("Login Successful");

                navigate("/");
            } else {
                alert(
                    data.message ||
                        "Login failed"
                );
            }
        } catch (error) {
            console.log(error);

            alert("Server error");
        }
    };

    return (
        <div style={container}>
            <div style={box}>
                <h1 style={title}>
                    🎟 Event Booking
                </h1>

                <h2 style={heading}>
                    Login
                </h2>

                <input
                    style={input}
                    type="email"
                    placeholder="Enter Email"
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
                    placeholder="Enter Password"
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

                <p style={text}>
                    Don't have account?
                </p>

                <Link
                    style={linkBtn}
                    to="/register"
                >
                    Register Here
                </Link>
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
        "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)",
    fontFamily: "Poppins, sans-serif"
};

const box = {
    width: "400px",
    background:
        "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "25px",
    color: "white",
    boxShadow:
        "0 8px 32px rgba(0,0,0,0.3)",
    textAlign: "center"
};

const title = {
    fontSize: "38px",
    marginBottom: "10px"
};

const heading = {
    marginBottom: "25px",
    fontSize: "30px"
};

const input = {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
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
    cursor: "pointer"
};

const text = {
    marginTop: "20px",
    marginBottom: "10px"
};

const linkBtn = {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px"
};

export default Login;