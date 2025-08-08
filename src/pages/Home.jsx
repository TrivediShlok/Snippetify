import React from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    Chip,
    Avatar,
} from "@mui/material";
import {
    Code,
    Search,
    Share,
    Security,
    Rocket,
    Star,
    TrendingUp,
    Speed,
    AutoAwesome,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = ({ user }) => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Code />,
            title: "Smart Organization",
            description:
                "Organize your code snippets with AI-powered categorization and intelligent search capabilities.",
            color: "#6366f1",
            bgColor: "rgba(99, 102, 241, 0.1)",
        },
        {
            icon: <Search />,
            title: "Lightning Search",
            description:
                "Find any snippet instantly with our powerful search engine that understands your code.",
            color: "#10b981",
            bgColor: "rgba(16, 185, 129, 0.1)",
        },
        {
            icon: <Share />,
            title: "Seamless Sharing",
            description:
                "Share your snippets with the world or keep them private in your secure personal vault.",
            color: "#ec4899",
            bgColor: "rgba(236, 72, 153, 0.1)",
        },
        {
            icon: <Security />,
            title: "Bank-Level Security",
            description:
                "Your code is protected with enterprise-grade security and encrypted storage.",
            color: "#f59e0b",
            bgColor: "rgba(245, 158, 11, 0.1)",
        },
    ];

    const stats = [
        {
            number: "50K+",
            label: "Code Snippets",
            icon: <Code />,
            color: "#6366f1",
        },
        {
            number: "2.5K+",
            label: "Happy Developers",
            icon: <Star />,
            color: "#ec4899",
        },
        {
            number: "100+",
            label: "Programming Languages",
            icon: <Speed />,
            color: "#10b981",
        },
        {
            number: "99.9%",
            label: "Uptime",
            icon: <TrendingUp />,
            color: "#f59e0b",
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Hero Section */}
            <Box
                className="hero-section"
                textAlign="center"
                position="relative"
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Chip
                        icon={<AutoAwesome />}
                        label="✨ The Future of Code Management"
                        sx={{
                            mb: 3,
                            background:
                                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            color: "#6366f1",
                            fontWeight: 500,
                            px: 2,
                            py: 0.5,
                        }}
                    />
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "2.5rem",
                                sm: "3.5rem",
                                md: "4.5rem",
                            },
                            fontWeight: 800,
                            mb: 3,
                            background:
                                "linear-gradient(135deg, #1f2937 0%, #6366f1 50%, #ec4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "-0.02em",
                        }}
                    >
                    All Your Code Snippets<br/>At One Place<br />
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#6b7280",
                            mb: 4,
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6,
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: 400,
                        }}
                    >
                        Store, organize, and share your code snippets with our
                        beautiful, intuitive platform designed for modern
                        developers.
                    </Typography>

                    {user ? (
                        <Box>
                            <Chip
                                label={`Welcome back, ${
                                    user.firstName || user.username
                                }! 🎉`}
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor: "#10b981",
                                            width: 24,
                                            height: 24,
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                sx={{
                                    mb: 4,
                                    background:
                                        "linear-gradient(135deg, #10b981, #059669)",
                                    color: "white",
                                    fontSize: "1rem",
                                    py: 2,
                                    px: 3,
                                    fontWeight: 600,
                                }}
                            />
                            <Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate("/dashboard")}
                                    startIcon={<Rocket />}
                                    sx={{
                                        fontSize: "1.1rem",
                                        py: 2,
                                        px: 4,
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                        boxShadow:
                                            "0 8px 25px rgba(99, 102, 241, 0.3)",
                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 12px 35px rgba(99, 102, 241, 0.4)",
                                        },
                                    }}
                                >
                                    Open Dashboard
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            gap={2}
                            justifyContent="center"
                            flexWrap="wrap"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/")} // This would trigger signup
                                sx={{
                                    fontSize: "1.1rem",
                                    py: 2,
                                    px: 4,
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                    boxShadow:
                                        "0 8px 25px rgba(99, 102, 241, 0.3)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                            "0 12px 35px rgba(99, 102, 241, 0.4)",
                                    },
                                }}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    fontSize: "1.1rem",
                                    py: 2,
                                    px: 4,
                                    borderRadius: "12px",
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
                                View Demo
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Stats Section */}
            <Box py={6}>
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <Paper className="stats-card" elevation={0}>
                                <Box
                                    sx={{
                                        color: stat.color,
                                        mb: 2,
                                        p: 1,
                                        borderRadius: "12px",
                                        backgroundColor: `${stat.color}15`,
                                        display: "inline-flex",
                                    }}
                                >
                                    {React.cloneElement(stat.icon, {
                                        fontSize: "large",
                                    })}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: "#1f2937",
                                        fontWeight: 800,
                                        mb: 1,
                                        fontSize: { xs: "2rem", md: "2.5rem" },
                                    }}
                                >
                                    {stat.number}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "#6b7280",
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Features Section */}
            <Box py={8}>
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            background:
                                "linear-gradient(135deg, #1f2937 0%, #6366f1 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Why Developers Love Us
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#6b7280",
                            fontWeight: 400,
                            maxWidth: "500px",
                            mx: "auto",
                        }}
                    >
                        Everything you need to manage your code snippets
                        beautifully and efficiently.
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper className="feature-card" elevation={0}>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "16px",
                                        background: feature.bgColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mx: "auto",
                                        mb: 3,
                                        color: feature.color,
                                    }}
                                >
                                    {React.cloneElement(feature.icon, {
                                        fontSize: "large",
                                    })}
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#1f2937",
                                        mb: 2,
                                        fontWeight: 600,
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        lineHeight: 1.6,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* CTA Section */}
            <Box
                textAlign="center"
                py={10}
                sx={{
                    background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
                    borderRadius: "24px",
                    border: "1px solid rgba(99, 102, 241, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        background:
                            "linear-gradient(135deg, #1f2937 0%, #6366f1 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Ready to Transform Your Workflow?
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#6b7280",
                        mb: 4,
                        fontWeight: 400,
                    }}
                >
                    Join thousands of developers who've already made the switch
                </Typography>
                {!user && (
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            fontSize: "1.1rem",
                            py: 2,
                            px: 6,
                            borderRadius: "12px",
                            background:
                                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                transform: "translateY(-2px)",
                                boxShadow:
                                    "0 12px 35px rgba(99, 102, 241, 0.4)",
                            },
                        }}
                        startIcon={<Star />}
                    >
                        Start Your Journey
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default Home;
