import React, { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

const API =
    "https://event-booking-system-hjrv.onrender.com";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "attendee"
    });

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
                await response.text();

            alert(data);

            if (
                data ===
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
                    📝 Register
                </h2>

                <input
                    style={input}
                    placeholder="Enter Name"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

                <input
                    style={input}
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                />

                <input
                    style={input}
                    type="password"
                    placeholder="Enter Password"
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
                    onChange={(e) =>
                        setForm({
                            ...form,
                            role: e.target.value
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

                    Already have an account?

                    <Link
                        style={link}
                        to="/login"
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

    alignItems: "center"
};

const box = {

    background:
        "rgba(255,255,255,0.12)",

    padding: "40px",

    borderRadius: "20px",

    width: "350px",

    display: "flex",

    flexDirection: "column",

    gap: "20px"
};

const title = {

    color: "white",

    textAlign: "center",

    fontSize: "32px"
};

const input = {

    padding: "14px",

    borderRadius: "10px",

    border: "none",

    outline: "none",

    fontSize: "16px"
};

const button = {

    background:
        "linear-gradient(135deg,#06b6d4,#3b82f6)",

    color: "white",

    border: "none",

    padding: "14px",

    borderRadius: "12px",

    fontSize: "18px",

    cursor: "pointer",

    fontWeight: "bold"
};

const text = {

    color: "white",

    textAlign: "center"
};

const link = {

    color: "#38bdf8",

    marginLeft: "5px",

    textDecoration: "none",

    fontWeight: "bold"
};

export default Register;