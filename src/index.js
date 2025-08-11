import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#3b82f6",
            light: "#60a5fa",
            dark: "#2563eb",
        },
        secondary: {
            main: "#ec4899",
            light: "#f472b6",
            dark: "#db2777",
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#1f2937",
            secondary: "#6b7280",
        },
        success: {
            main: "#10b981",
        },
        warning: {
            main: "#f59e0b",
        },
        error: {
            main: "#ef4444",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "3rem",
        },
        h2: {
            fontWeight: 600,
            fontSize: "2.25rem",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.875rem",
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                    },
                },
            },
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#ffffff",
                            color: "#1f2937",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                        },
                    }}
                />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
