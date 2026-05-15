import React, { useState } from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

const API =
    "https://event-booking-system-hjrv.onrender.com";

function Register() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "attendee"
    });

    const navigate = useNavigate();

    const register = async () => {

        try {

            const response = await fetch(
                `${API}/register`,
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

            alert(data.message);

            if (
                data.message ===
                "User registered successfully"
            ) {

                navigate("/login");
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
                    Register
                </h2>

                <input
                    style={input}
                    placeholder="Name"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name:
                                e.target.value
                        })
                    }
                />

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

                <select
                    style={input}
                    value={form.role}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            role:
                                e.target.value
                        })
                    }
                >
                    <option value="admin">
                        Admin
                    </option>

                    <option value="organizer">
                        Organizer
                    </option>

                    <option value="attendee">
                        Attendee
                    </option>

                </select>

                <button
                    style={button}
                    onClick={register}
                >
                    Register
                </button>

                <p style={text}>

                    Already have account?

                    <Link
                        to="/login"
                        style={link}
                    >
                        Login
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
    cursor: "pointer"
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

export default Register;