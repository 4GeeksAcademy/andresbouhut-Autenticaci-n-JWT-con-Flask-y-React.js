import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { StoreProvider } from './hooks/useGlobalReducer'  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import { AppRoutes } from './routes';  // Import the AppRoutes component

const Main = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if(!backendUrl || backendUrl === "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            {/* Provide global state to all components */}
            <StoreProvider>
                {/* Set up routing for the application */}
                <AppRoutes />
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
const rootElement = document.getElementById('root');
if(rootElement) {
    ReactDOM.createRoot(rootElement).render(<Main />);
} else {
    console.error("Root element not found.");
}
