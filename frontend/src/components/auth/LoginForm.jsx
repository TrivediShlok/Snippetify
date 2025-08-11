import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Typography,
    Link,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

const LoginForm = ({ open, onClose, onSuccess, onSwitchToSignup }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const response = await authService.login(data);
            toast.success("Login successful!");
            onSuccess(response);
            reset();
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Login to Snippetify</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 1 }}
                >
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        {...register("password", {
                            required: "Password is required",
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>

                    <Box textAlign="center">
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSwitchToSignup();
                                }}
                            >
                                Sign up here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginForm;
