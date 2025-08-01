import React, { useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    Chip,
} from "@mui/material";
import {
    Code,
    Search,
    Share,
    Lock,
    Rocket,
    Bolt, // Changed from Zap to Bolt
    Star,
    Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = ({ user }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Create floating particles
        const createParticle = () => {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = Math.random() * 100 + "vw";
            particle.style.animationDuration = Math.random() * 3 + 2 + "s";
            particle.style.opacity = Math.random();
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 5000);
        };

        const particleInterval = setInterval(createParticle, 300);
        return () => clearInterval(particleInterval);
    }, []);

    const features = [
        {
            icon: <Code />,
            title: "Smart Code Storage",
            description:
                "AI-powered snippet organization with intelligent tagging and categorization.",
            color: "#00f5ff",
        },
        {
            icon: <Search />,
            title: "Quantum Search",
            description:
                "Lightning-fast search across millions of code snippets with advanced filtering.",
            color: "#ff0080",
        },
        {
            icon: <Share />,
            title: "Global Sharing",
            description:
                "Share your code with developers worldwide or keep it private in your vault.",
            color: "#00e676",
        },
        {
            icon: <Security />,
            title: "Cyber Security",
            description:
                "Military-grade encryption protects your valuable code snippets.",
            color: "#ff9800",
        },
    ];

    const stats = [
        { number: "10K+", label: "Code Snippets", icon: <Code /> },
        { number: "500+", label: "Developers", icon: <Star /> },
        { number: "50+", label: "Languages", icon: <Bolt /> }, // Changed from Zap to Bolt
        { number: "99.9%", label: "Uptime", icon: <Rocket /> },
    ];

    return (
        <Container maxWidth="xl">
            {/* Hero Section */}
            <Box textAlign="center" py={10} position="relative">
                <Box className="floating">
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontSize: { xs: "3rem", md: "5rem" },
                            fontWeight: 900,
                            background:
                                "linear-gradient(45deg, #00f5ff, #ff0080, #00e676)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 0 40px rgba(0, 245, 255, 0.5)",
                            mb: 2,
                        }}
                    >
                        SNIPPETIFY
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#b0bec5",
                            mb: 4,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                        }}
                    >
                        The Future of Code Management
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#78909c",
                            mb: 6,
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6,
                        }}
                    >
                        Enter the next generation of code snippet management.
                        Store, organize, and share your code with futuristic
                        AI-powered tools.
                    </Typography>
                </Box>

                {user ? (
                    <Box>
                        <Chip
                            label="AUTHENTICATED USER"
                            sx={{
                                background:
                                    "linear-gradient(45deg, #00f5ff, #00e676)",
                                color: "white",
                                fontSize: "1rem",
                                py: 2,
                                px: 4,
                                mb: 3,
                                fontWeight: 600,
                            }}
                        />
                        <Box>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/dashboard")}
                                className="cyber-button"
                                sx={{
                                    fontSize: "1.2rem",
                                    py: 2,
                                    px: 4,
                                    borderRadius: "30px",
                                    background:
                                        "linear-gradient(45deg, #00f5ff, #ff0080)",
                                    "&:hover": {
                                        transform:
                                            "translateY(-5px) scale(1.05)",
                                        boxShadow:
                                            "0 10px 40px rgba(0, 245, 255, 0.6)",
                                    },
                                }}
                                startIcon={<Rocket />}
                            >
                                LAUNCH DASHBOARD
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#90a4ae",
                                fontSize: "1.1rem",
                                mb: 4,
                            }}
                        >
                            Join the revolution. Authenticate to access your
                            personal code vault.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Stats Section */}
            <Box py={6}>
                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <Paper
                                className="glass-card hover-glow"
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    background: "rgba(20, 20, 30, 0.7)",
                                    backdropFilter: "blur(15px)",
                                    border: "1px solid rgba(0, 245, 255, 0.3)",
                                    borderRadius: "20px",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow:
                                            "0 20px 40px rgba(0, 245, 255, 0.3)",
                                    },
                                }}
                            >
                                <Box color="#00f5ff" mb={2}>
                                    {React.cloneElement(stat.icon, {
                                        fontSize: "large",
                                    })}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: "#00f5ff",
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    {stat.number}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
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
                <Typography
                    variant="h2"
                    textAlign="center"
                    sx={{
                        mb: 6,
                        background: "linear-gradient(45deg, #00f5ff, #ff0080)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    QUANTUM FEATURES
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                className="glass-card hover-glow floating"
                                sx={{
                                    p: 4,
                                    height: "100%",
                                    textAlign: "center",
                                    background: "rgba(20, 20, 30, 0.6)",
                                    backdropFilter: "blur(15px)",
                                    border: `2px solid ${feature.color}30`,
                                    borderRadius: "25px",
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: "4px",
                                        background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                                    },
                                    "&:hover": {
                                        borderColor: feature.color,
                                        boxShadow: `0 0 30px ${feature.color}50`,
                                    },
                                    animationDelay: `${index * 0.2}s`,
                                }}
                            >
                                <Box
                                    sx={{
                                        color: feature.color,
                                        mb: 3,
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {React.cloneElement(feature.icon, {
                                        fontSize: "large",
                                        sx: { fontSize: "3rem" },
                                    })}
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: feature.color,
                                        mb: 2,
                                        fontWeight: 600,
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
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
                        "linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 128, 0.1))",
                    borderRadius: "30px",
                    border: "1px solid rgba(0, 245, 255, 0.3)",
                    mt: 6,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        mb: 3,
                        background: "linear-gradient(45deg, #00f5ff, #ff0080)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Ready to Join the Future?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Start your journey into the next generation of code
                    management
                </Typography>
                {!user && (
                    <Button
                        variant="contained"
                        size="large"
                        className="cyber-button"
                        sx={{
                            fontSize: "1.3rem",
                            py: 2,
                            px: 6,
                            borderRadius: "35px",
                            background:
                                "linear-gradient(45deg, #ff0080, #00f5ff)",
                            "&:hover": {
                                transform: "scale(1.1) translateY(-5px)",
                                boxShadow: "0 15px 40px rgba(255, 0, 128, 0.6)",
                            },
                        }}
                        startIcon={<Bolt />} // Changed from Zap to Bolt
                    >
                        ACTIVATE NOW
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default Home;
