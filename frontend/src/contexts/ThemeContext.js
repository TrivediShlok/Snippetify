import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const CustomThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            primary: {
                main: darkMode ? "#667eea" : "#3b82f6",
                light: darkMode ? "#8b94f0" : "#60a5fa",
                dark: darkMode ? "#4c63d2" : "#2563eb",
            },
            secondary: {
                main: darkMode ? "#f472b6" : "#ec4899",
                light: darkMode ? "#f59ad3" : "#f472b6",
                dark: darkMode ? "#e11c7b" : "#db2777",
            },
            background: {
                default: darkMode ? "#0f172a" : "#f8fafc",
                paper: darkMode ? "#1e293b" : "#ffffff",
            },
            surface: {
                main: darkMode ? "#334155" : "#f1f5f9",
            },
            text: {
                primary: darkMode ? "#f1f5f9" : "#1f2937",
                secondary: darkMode ? "#94a3b8" : "#6b7280",
            },
            success: {
                main: darkMode ? "#22c55e" : "#10b981",
            },
            warning: {
                main: darkMode ? "#eab308" : "#f59e0b",
            },
            error: {
                main: darkMode ? "#f87171" : "#ef4444",
            },
            divider: darkMode ? "#475569" : "#e5e7eb",
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: "3rem",
                color: darkMode ? "#f1f5f9" : "#1f2937",
            },
            h2: {
                fontWeight: 600,
                fontSize: "2.25rem",
                color: darkMode ? "#f1f5f9" : "#1f2937",
            },
            h3: {
                fontWeight: 600,
                fontSize: "1.875rem",
                color: darkMode ? "#f1f5f9" : "#1f2937",
            },
            h4: {
                fontWeight: 600,
                fontSize: "1.5rem",
                color: darkMode ? "#f1f5f9" : "#1f2937",
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
                        boxShadow: "none",
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: darkMode
                            ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                            : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: darkMode ? "#334155" : "#ffffff",
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                        backgroundImage: "none",
                    },
                },
            },
        },
    });

    const contextValue = {
        darkMode,
        toggleDarkMode,
        theme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
