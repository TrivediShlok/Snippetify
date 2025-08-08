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
            main: "#6366f1", // Beautiful indigo
            light: "#818cf8",
            dark: "#4f46e5",
        },
        secondary: {
            main: "#ec4899", // Elegant pink
            light: "#f472b6",
            dark: "#db2777",
        },
        background: {
            default: "#fafbfc",
            paper: "#ffffff",
        },
        text: {
            primary: "#1f2937",
            secondary: "#6b7280",
        },
        success: {
            main: "#10b981",
            light: "#34d399",
        },
        warning: {
            main: "#f59e0b",
        },
        error: {
            main: "#ef4444",
        },
        grey: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "3.5rem",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
        },
        h2: {
            fontWeight: 600,
            fontSize: "2.25rem",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.875rem",
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.25rem",
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: 1.4,
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                    fontSize: "0.875rem",
                    boxShadow: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                            "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    },
                },
                contained: {
                    background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    "&:hover": {
                        background:
                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    },
                },
                outlined: {
                    borderColor: "#e5e7eb",
                    color: "#374151",
                    "&:hover": {
                        borderColor: "#6366f1",
                        backgroundColor: "rgba(99, 102, 241, 0.04)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    borderRadius: "16px",
                    border: "1px solid #f3f4f6",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        borderColor: "#e5e7eb",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        "& fieldset": {
                            borderColor: "#e5e7eb",
                        },
                        "&:hover fieldset": {
                            borderColor: "#d1d5db",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
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
                            border: "1px solid #f3f4f6",
                            borderRadius: "12px",
                            boxShadow:
                                "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            padding: "16px",
                            fontSize: "0.875rem",
                        },
                        success: {
                            iconTheme: {
                                primary: "#10b981",
                                secondary: "#ffffff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#ffffff",
                            },
                        },
                    }}
                />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
