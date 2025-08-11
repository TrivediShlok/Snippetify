import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Alert, Container } from "@mui/material";

// Import components
import Header from "./components/common/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SnippetDetail from "./pages/SnippetDetail";

// Import services - FIXED IMPORTS
import { authService } from "./services/authService";
import { checkServerHealth } from "./services/api";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverOnline, setServerOnline] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Check server health
                const isServerHealthy = await checkServerHealth();
                setServerOnline(isServerHealthy);

                // Initialize authentication
                const authData = authService.initializeAuth();

                if (authData.isAuthenticated) {
                    try {
                        // Verify token is still valid by getting current user
                        const response = await authService.getCurrentUser();
                        if (response.success) {
                            setUser(response.data.user);
                        } else {
                            authService.logout();
                        }
                    } catch (error) {
                        console.error("Token validation failed:", error);
                        authService.logout();
                    }
                }
            } catch (error) {
                console.error("App initialization error:", error);
                setServerOnline(false);
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    // Show loading spinner while initializing
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDirection="column"
                gap={2}
            >
                <CircularProgress size={40} />
                <Box>Loading Snippetify...</Box>
            </Box>
        );
    }

    // Show server offline message
    if (!serverOnline) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <strong>Server Offline</strong>
                </Alert>
                <Box textAlign="center">
                    <h2>Unable to connect to Snippetify backend</h2>
                    <p>
                        Please make sure your backend server is running on port
                        5000.
                    </p>
                    <p>
                        Run <code>npm run dev</code> in your backend directory.
                    </p>
                </Box>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            <Header user={user} setUser={setUser} />

            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route
                    path="/dashboard"
                    element={
                        user ? (
                            <Dashboard user={user} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/snippet/:id"
                    element={<SnippetDetail user={user} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Box>
    );
}

export default App;
