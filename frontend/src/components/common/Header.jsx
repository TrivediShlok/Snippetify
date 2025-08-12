import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";
import {
    Code as CodeIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

const Header = ({ user, setUser }) => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        handleProfileMenuClose();
        navigate("/");
        toast.success("Logged out successfully", {
            style: {
                background: darkMode ? "#374151" : "#ffffff",
                color: darkMode ? "#f3f4f6" : "#1f2937",
            },
        });
    };

    const handleAuthSuccess = (data) => {
        setUser(data.user);
        setShowLogin(false);
        setShowSignup(false);
        toast.success("Welcome to Snippetify!", {
            style: {
                background: darkMode ? "#374151" : "#ffffff",
                color: darkMode ? "#f3f4f6" : "#1f2937",
            },
        });
    };

    const switchToSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };

    const switchToLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    borderBottom: `1px solid ${
                        darkMode ? "#475569" : "#e5e7eb"
                    }`,
                    backdropFilter: "blur(8px)",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                    {/* Logo and Brand */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            "&:hover": {
                                opacity: 0.8,
                            },
                        }}
                        onClick={() => navigate("/")}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "12px",
                                background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                            }}
                        >
                            <CodeIcon
                                sx={{ color: "white", fontSize: "20px" }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Snippetify
                        </Typography>
                    </Box>

                    {/* Right side actions */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Dark Mode Toggle */}
                        <IconButton
                            onClick={toggleDarkMode}
                            sx={{
                                color: darkMode ? "#f3f4f6" : "#374151",
                                backgroundColor: darkMode
                                    ? "#374151"
                                    : "#f3f4f6",
                                "&:hover": {
                                    backgroundColor: darkMode
                                        ? "#4b5563"
                                        : "#e5e7eb",
                                },
                            }}
                        >
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {user ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {/* Dashboard Button */}
                                <Button
                                    variant="outlined"
                                    startIcon={<DashboardIcon />}
                                    onClick={() => navigate("/dashboard")}
                                    sx={{
                                        borderRadius: "10px",
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                        color: darkMode ? "#f3f4f6" : "#374151",
                                        "&:hover": {
                                            borderColor: darkMode
                                                ? "#667eea"
                                                : "#3b82f6",
                                            backgroundColor: darkMode
                                                ? "rgba(102, 126, 234, 0.1)"
                                                : "rgba(59, 130, 246, 0.05)",
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>

                                {/* Profile Menu */}
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "primary.main",
                                            fontSize: "1rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {user.firstName
                                            ? user.firstName[0].toUpperCase()
                                            : user.username[0].toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowLogin(true)}
                                    sx={{
                                        borderRadius: "10px",
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                        color: darkMode ? "#f3f4f6" : "#374151",
                                        "&:hover": {
                                            borderColor: darkMode
                                                ? "#667eea"
                                                : "#3b82f6",
                                            backgroundColor: darkMode
                                                ? "rgba(102, 126, 234, 0.1)"
                                                : "rgba(59, 130, 246, 0.05)",
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setShowSignup(true)}
                                    sx={{
                                        borderRadius: "10px",
                                        background:
                                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: "12px",
                        minWidth: 200,
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                        border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user?.firstName || user?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem
                    onClick={() => {
                        navigate("/dashboard");
                        handleProfileMenuClose();
                    }}
                    sx={{ gap: 2 }}
                >
                    <DashboardIcon fontSize="small" />
                    Dashboard
                </MenuItem>
                <MenuItem
                    onClick={handleLogout}
                    sx={{ gap: 2, color: "error.main" }}
                >
                    <LogoutIcon fontSize="small" />
                    Logout
                </MenuItem>
            </Menu>

            {/* Auth Modals */}
            <LoginForm
                open={showLogin}
                onClose={() => setShowLogin(false)}
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={switchToSignup}
            />
            <SignupForm
                open={showSignup}
                onClose={() => setShowSignup(false)}
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={switchToLogin}
            />
        </>
    );
};

export default Header;
