import React, { useState } from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

const API =
    "https://event-booking-system-hjrv.onrender.com";

function Login() {

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

            if (data.token) {

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
                    "Login Failed"
                );
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
                    🔐 Login
                </h2>

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
                            password: e.target.value
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

                    Don't have an account?

                    <Link
                        style={link}
                        to="/register"
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

export default Login;