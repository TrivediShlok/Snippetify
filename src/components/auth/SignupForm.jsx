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
    Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

const SignupForm = ({ open, onClose, onSuccess, onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const response = await authService.register(data);
            toast.success("Account created successfully!");
            onSuccess(response);
            reset();
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Your Account</DialogTitle>
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

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                margin="normal"
                                {...register("firstName", {
                                    maxLength: {
                                        value: 50,
                                        message:
                                            "First name cannot exceed 50 characters",
                                    },
                                })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                margin="normal"
                                {...register("lastName", {
                                    maxLength: {
                                        value: 50,
                                        message:
                                            "Last name cannot exceed 50 characters",
                                    },
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message:
                                    "Username must be at least 3 characters",
                            },
                            maxLength: {
                                value: 30,
                                message: "Username cannot exceed 30 characters",
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message:
                                    "Username can only contain letters, numbers, and underscores",
                            },
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />

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
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        margin="normal"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Create Account"
                        )}
                    </Button>

                    <Box textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSwitchToLogin();
                                }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SignupForm;
