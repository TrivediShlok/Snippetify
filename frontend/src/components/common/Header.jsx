import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Container,
    Chip,
} from "@mui/material";
import { Code, Person, Dashboard as DashboardIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";

const Header = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        handleClose();
    };

    const handleDashboard = () => {
        navigate("/dashboard");
        handleClose();
    };

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    color: "#1f2937",
                    borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            <Box
                                sx={{
                                    mr: 2,
                                    p: 1.5,
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 4px 12px rgba(99, 102, 241, 0.3)",
                                }}
                            >
                                <Code
                                    sx={{ color: "white", fontSize: "24px" }}
                                />
                            </Box>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    background:
                                        "linear-gradient(135deg, #1f2937 0%, #6366f1 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Snippetify
                            </Typography>
                        </Box>

                        {user ? (
                            <Box display="flex" alignItems="center" gap={2}>
                                <Chip
                                    label={`Hi, ${
                                        user.firstName || user.username
                                    }!`}
                                    variant="outlined"
                                    sx={{
                                        borderColor: "rgba(99, 102, 241, 0.3)",
                                        color: "#6366f1",
                                        fontWeight: 500,
                                        "& .MuiChip-label": {
                                            px: 2,
                                        },
                                    }}
                                />
                                <IconButton
                                    size="large"
                                    aria-label="account menu"
                                    onClick={handleMenu}
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                        color: "white",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: "transparent",
                                        }}
                                    >
                                        <Person />
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    sx={{
                                        "& .MuiPaper-root": {
                                            background:
                                                "rgba(255, 255, 255, 0.95)",
                                            backdropFilter: "blur(20px)",
                                            border: "1px solid rgba(229, 231, 235, 0.5)",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                            mt: 1,
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleDashboard}
                                        sx={{
                                            borderRadius: "8px",
                                            mx: 1,
                                            my: 0.5,
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(99, 102, 241, 0.04)",
                                            },
                                        }}
                                    >
                                        <DashboardIcon
                                            sx={{ mr: 1, fontSize: "20px" }}
                                        />
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            borderRadius: "8px",
                                            mx: 1,
                                            my: 0.5,
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(239, 68, 68, 0.04)",
                                                color: "#ef4444",
                                            },
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Box display="flex" gap={2} alignItems="center">
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowLogin(true)}
                                    sx={{
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1,
                                        borderColor: "rgba(99, 102, 241, 0.3)",
                                        color: "#6366f1",
                                        "&:hover": {
                                            borderColor: "#6366f1",
                                            backgroundColor:
                                                "rgba(99, 102, 241, 0.04)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained"
                                    className="beautiful-button"
                                    onClick={() => setShowSignup(true)}
                                    sx={{
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1,
                                        background:
                                            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                        boxShadow:
                                            "0 4px 12px rgba(99, 102, 241, 0.3)",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 8px 20px rgba(99, 102, 241, 0.4)",
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <LoginForm
                open={showLogin}
                onClose={() => setShowLogin(false)}
                onSuccess={(userData) => {
                    setUser(userData.user);
                    setShowLogin(false);
                }}
                onSwitchToSignup={() => {
                    setShowLogin(false);
                    setShowSignup(true);
                }}
            />

            <SignupForm
                open={showSignup}
                onClose={() => setShowSignup(false)}
                onSuccess={(userData) => {
                    setUser(userData.user);
                    setShowSignup(false);
                }}
                onSwitchToLogin={() => {
                    setShowSignup(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
};

export default Header;
