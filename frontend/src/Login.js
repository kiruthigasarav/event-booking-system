import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://event-booking-system-hjrv.onrender.com";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const login = async () => {
        const response = await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful");

            navigate("/");
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={{ padding: "40px", color: "white" }}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={(e) =>
                    setForm({
                        ...form,
                        email: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                    setForm({
                        ...form,
                        password: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={login}>
                Login
            </button>
        </div>
    );
}

export default Login;