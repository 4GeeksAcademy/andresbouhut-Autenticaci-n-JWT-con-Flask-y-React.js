import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

            const response = await fetch(backendUrl + "/api/hello");
            const data = await response.json();
            if (response.ok) dispatch({ type: "set_hello", payload: data.message });
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadMessage();
    }, []);

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Home</h1>
            <div className="alert alert-info">
                {store.message ? (
                    <span>{store.message}</span>
                ) : (
                    <span className="text-danger">
                        Iniciando
                    </span>
                )}
            </div>
        </div>
    );
};
