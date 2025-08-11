import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@mui/material";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SnippetDetail from "./pages/SnippetDetail";
import { authService } from "./services/authService";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const userData = await authService.getMe();
                setUser(userData.user);
            }
        } catch (error) {
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Header user={user} setUser={setUser} />
            <Container
                maxWidth="xl"
                sx={{ minHeight: "calc(100vh - 120px)", py: 3 }}
            >
                <Routes>
                    <Route
                        path="/"
                        element={<Home user={user} setUser={setUser} />}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            user ? (
                                <Dashboard user={user} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/snippet/:id"
                        element={
                            user ? (
                                <SnippetDetail user={user} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
            <Footer />
        </div>
    );
}

export default App;
