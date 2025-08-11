import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { authService } from "../../services/authService";

const SignupForm = ({ open, onClose, onSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await authService.register(formData);

            if (response.success) {
                onSuccess(response.data);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                });
            }
        } catch (error) {
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        });
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 600 }}
                >
                    Join Snippetify
                </Typography>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ mb: 2 }}
                        helperText="3-30 characters, letters, numbers, and underscores only"
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ mb: 2 }}
                        helperText="Minimum 6 characters"
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Box sx={{ width: "100%" }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{" "}
                                <Button
                                    variant="text"
                                    onClick={onSwitchToLogin}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        p: 0,
                                        minWidth: "auto",
                                    }}
                                >
                                    Sign in here
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SignupForm;
