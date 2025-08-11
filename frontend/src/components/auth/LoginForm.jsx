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

const LoginForm = ({ open, onClose, onSuccess, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const response = await authService.login(formData);

            if (response.success) {
                onSuccess(response.data);
                setFormData({ email: "", password: "" });
            }
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: "", password: "" });
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
                    Sign In to Snippetify
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
                                "Sign In"
                            )}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{" "}
                                <Button
                                    variant="text"
                                    onClick={onSwitchToSignup}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        p: 0,
                                        minWidth: "auto",
                                    }}
                                >
                                    Sign up here
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LoginForm;
