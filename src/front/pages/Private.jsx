import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPrivate = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(backendUrl + "/private", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await resp.json();
                if (resp.ok) setMessage(data.msg);
                else navigate("/login");
            } catch (err) {
                navigate("/login");
            }
        };
        fetchPrivate();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Private Page</h1>
            <p>{message}</p>
        </div>
    );
};