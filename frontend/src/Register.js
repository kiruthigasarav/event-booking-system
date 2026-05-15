import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://event-booking-system-hjrv.onrender.com";

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

            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                navigate("/login");

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.log(error);
            alert("Registration failed");
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Poppins, sans-serif"
            }}
        >

            <div
                style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "40px",
                    borderRadius: "20px",
                    width: "400px",
                    backdropFilter: "blur(10px)",
                    color: "white"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >
                    Register
                </h1>

                <input
                    style={input}
                    type="text"
                    placeholder="Enter Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    style={input}
                    type="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    style={input}
                    type="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                />

                <br /><br />

                <select
                    style={input}
                    value={form.role}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            role: e.target.value
                        })
                    }
                >
                    <option value="admin">Admin</option>
                    <option value="organizer">Organizer</option>
                    <option value="attendee">Attendee</option>
                </select>

                <br /><br />

                <button
                    style={button}
                    onClick={register}
                >
                    Register
                </button>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    Already have an account?
                </p>

                <div
                    style={{
                        textAlign: "center"
                    }}
                >
                    <Link
                        to="/login"
                        style={{
                            color: "#38bdf8",
                            textDecoration: "none",
                            fontWeight: "bold"
                        }}
                    >
                        Login Here
                    </Link>
                </div>

            </div>

        </div>
    );
}

const input = {
    width: "100%",
    padding: "14px",
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
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer"
};

export default Register;