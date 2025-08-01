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
} from "@mui/material";
import { Code, Menu as MenuIcon } from "@mui/icons-material";
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
                sx={{
                    background: "rgba(20, 20, 30, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(0, 245, 255, 0.3)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            <Box
                                sx={{
                                    mr: 2,
                                    p: 1,
                                    borderRadius: "50%",
                                    background:
                                        "linear-gradient(45deg, #00f5ff, #ff0080)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Code sx={{ color: "white" }} />
                            </Box>
                            <Typography
                                variant="h4"
                                component="div"
                                className="neon-text"
                                sx={{
                                    fontWeight: 700,
                                    background:
                                        "linear-gradient(45deg, #00f5ff, #ff0080)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textShadow:
                                        "0 0 20px rgba(0, 245, 255, 0.5)",
                                }}
                            >
                                SNIPPETIFY
                            </Typography>
                        </Box>

                        {user ? (
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#00f5ff" }}
                                >
                                    Welcome, {user.firstName || user.username}
                                </Typography>
                                <IconButton
                                    size="large"
                                    aria-label="account menu"
                                    onClick={handleMenu}
                                    sx={{
                                        background:
                                            "linear-gradient(45deg, #00f5ff, #ff0080)",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            boxShadow:
                                                "0 0 20px rgba(0, 245, 255, 0.5)",
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "transparent",
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    sx={{
                                        "& .MuiPaper-root": {
                                            background: "rgba(20, 20, 30, 0.9)",
                                            backdropFilter: "blur(20px)",
                                            border: "1px solid rgba(0, 245, 255, 0.3)",
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleDashboard}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Box display="flex" gap={2}>
                                <Button
                                    className="cyber-button"
                                    onClick={() => setShowLogin(true)}
                                    sx={{
                                        borderRadius: "25px",
                                        px: 3,
                                        py: 1,
                                        background:
                                            "linear-gradient(45deg, transparent, transparent)",
                                        border: "2px solid #00f5ff",
                                        color: "#00f5ff",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(45deg, #00f5ff, #ff0080)",
                                            color: "white",
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 5px 25px rgba(0, 245, 255, 0.4)",
                                        },
                                    }}
                                >
                                    LOGIN
                                </Button>
                                <Button
                                    className="cyber-button"
                                    onClick={() => setShowSignup(true)}
                                    sx={{
                                        borderRadius: "25px",
                                        px: 3,
                                        py: 1,
                                        background:
                                            "linear-gradient(45deg, #00f5ff, #ff0080)",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 5px 25px rgba(255, 0, 128, 0.4)",
                                        },
                                    }}
                                >
                                    SIGN UP
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
