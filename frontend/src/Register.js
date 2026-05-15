import React, { useState } from "react";

const API = "https://event-booking-system-hjrv.onrender.com";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const register = async () => {
        const response = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.text();

        alert(data);
    };

    return (
        <div style={{ padding: "40px", color: "white" }}>
            <h2>Register</h2>

            <input
                placeholder="Name"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value
                    })
                }
            />

            <br /><br />

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

            <button onClick={register}>
                Register
            </button>
        </div>
    );
}

export default Register;