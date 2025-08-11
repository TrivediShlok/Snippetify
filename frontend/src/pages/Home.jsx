import React, { useState, useEffect } from "react";
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
    Security,
    Rocket,
    Star,
    TrendingUp,
    Speed,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TypingEffect = () => {
    const messages = [
        "Snippetify",
        "One Stop Solution",
        "Code Management",
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typeSpeed, setTypeSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const currentMessage = messages[currentMessageIndex];

            if (isDeleting) {
                setCurrentText(
                    currentMessage.substring(0, currentText.length - 1)
                );
                setTypeSpeed(75);
            } else {
                setCurrentText(
                    currentMessage.substring(0, currentText.length + 1)
                );
                setTypeSpeed(150);
            }

            if (!isDeleting && currentText === currentMessage) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && currentText === "") {
                setIsDeleting(false);
                setCurrentMessageIndex(
                    (prevIndex) => (prevIndex + 1) % messages.length
                );
            }
        };

        const timer = setTimeout(handleTyping, typeSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentMessageIndex, typeSpeed, messages]);

    return (
        <Typography
            variant="h1"
            component="h1"
            sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                mb: 2,
                color: "#1f2937",
                minHeight: { xs: "80px", md: "100px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {currentText}
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    width: "3px",
                    height: { xs: "40px", md: "50px" },
                    backgroundColor: "#3b82f6",
                    marginLeft: "4px",
                    animation: "blink 1s infinite",
                    "@keyframes blink": {
                        "0%, 50%": { opacity: 1 },
                        "51%, 100%": { opacity: 0 },
                    },
                }}
            />
        </Typography>
    );
};

const Home = ({ user }) => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Code />,
            title: "Smart Organization",
            description:
                "Organize your code snippets with intelligent categorization and powerful tagging system.",
            color: "#3b82f6",
        },
        {
            icon: <Search />,
            title: "Lightning Search",
            description:
                "Find any snippet instantly with our advanced search that understands your code.",
            color: "#10b981",
        },
        {
            icon: <Share />,
            title: "Seamless Sharing",
            description:
                "Share snippets with your team or make them public for the developer community.",
            color: "#ec4899",
        },
        {
            icon: <Security />,
            title: "Secure & Private",
            description:
                "Your code is protected with enterprise-grade security and encrypted storage.",
            color: "#f59e0b",
        },
    ];

    const stats = [
        {
            number: "15K+",
            label: "Code Snippets",
            icon: <Code />,
            color: "#3b82f6",
        },
        {
            number: "3.2K+",
            label: "Developers",
            icon: <Star />,
            color: "#ec4899",
        },
        {
            number: "85+",
            label: "Languages",
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
            {/* Hero Section with Better Spacing */}
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: { xs: "40px 24px", md: "60px 32px" },
                    marginBottom: "48px", // Increased spacing
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                }}
            >
                {/* Typing Effect Title */}
                <TypingEffect />

                <Typography
                    variant="h5"
                    sx={{
                        color: "#6b7280",
                        mb: 6, // Increased spacing
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        maxWidth: "600px",
                        mx: "auto",
                        lineHeight: 1.6,
                    }}
                >
                    The modern way to store, organize, and share your code
                    snippets. Built for developers who value efficiency and
                    clean code.
                </Typography>

                {user ? (
                    <Box>
                        <Chip
                            label={`Welcome back, ${
                                user.firstName || user.username
                            }!`}
                            sx={{
                                mb: 4, // Increased spacing
                                backgroundColor: "#ecfdf5",
                                color: "#059669",
                                fontWeight: 600,
                                border: "1px solid #a7f3d0",
                                fontSize: "1rem",
                                py: 1,
                                px: 2,
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/dashboard")}
                            startIcon={<Rocket />}
                            sx={{
                                fontSize: "1.1rem",
                                py: 1.5,
                                px: 4,
                                borderRadius: "10px",
                                backgroundColor: "#3b82f6",
                                "&:hover": {
                                    backgroundColor: "#2563eb",
                                },
                            }}
                        >
                            Open Dashboard
                        </Button>
                    </Box>
                ) : (
                    <Box
                        display="flex"
                        gap={3}
                        justifyContent="center"
                        flexWrap="wrap"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                fontSize: "1.1rem",
                                py: 1.5,
                                px: 4,
                                borderRadius: "10px",
                                backgroundColor: "#3b82f6",
                                "&:hover": {
                                    backgroundColor: "#2563eb",
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
                                py: 1.5,
                                px: 4,
                                borderRadius: "10px",
                                borderColor: "#d1d5db",
                                color: "#374151",
                                "&:hover": {
                                    borderColor: "#3b82f6",
                                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                                    color: "#3b82f6",
                                },
                            }}
                        >
                            View Demo
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Stats Section with Better Spacing */}
            <Box sx={{ py: 8 }}>
                {" "}
                {/* Increased spacing */}
                <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "#1f2937",
                    }}
                >
                    Trusted by Developers Worldwide
                </Typography>
                <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{
                        color: "#6b7280",
                        mb: 8, // Increased spacing
                        fontWeight: 400,
                        maxWidth: "500px",
                        mx: "auto",
                    }}
                >
                    Join thousands of developers who trust Snippetify for their
                    code management needs
                </Typography>
                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    sx={{ maxWidth: "1200px", mx: "auto" }}
                >
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    p: 4,
                                    textAlign: "center",
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        borderColor: stat.color,
                                        boxShadow: `0 8px 30px ${stat.color}15`,
                                        transform: "translateY(-2px)",
                                    },
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: "3px",
                                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                                        borderRadius: "16px 16px 0 0",
                                    },
                                }}
                            >
                                {/* Icon Container */}
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "20px",
                                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 3,
                                        border: `1px solid ${stat.color}20`,
                                    }}
                                >
                                    {React.cloneElement(stat.icon, {
                                        sx: {
                                            fontSize: "36px",
                                            color: stat.color,
                                        },
                                    })}
                                </Box>

                                {/* Number */}
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: "#1f2937",
                                        fontWeight: 800,
                                        mb: 2,
                                        fontSize: { xs: "2.5rem", md: "3rem" },
                                        lineHeight: 1,
                                    }}
                                >
                                    {stat.number}
                                </Typography>

                                {/* Label */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#6b7280",
                                        fontWeight: 500,
                                        fontSize: "1.1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Features Section with Better Spacing */}
            <Box sx={{ py: 8 }}>
                {" "}
                {/* Increased spacing */}
                <Box textAlign="center" mb={8}>
                    {" "}
                    {/* Increased spacing */}
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: "#1f2937",
                        }}
                    >
                        Why Developers Love Us
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#6b7280",
                            fontWeight: 400,
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6,
                        }}
                    >
                        Everything you need to manage your code snippets
                        efficiently and beautifully.
                    </Typography>
                </Box>
                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems="stretch"
                >
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    p: 3,
                                    textAlign: "center",
                                    height: "100%",
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        borderColor: feature.color,
                                        boxShadow: `0 8px 25px ${feature.color}20`,
                                    },
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: "4px",
                                        background: feature.color,
                                        borderRadius: "16px 16px 0 0",
                                    },
                                }}
                            >
                                {/* Icon Container */}
                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "16px",
                                        background: `${feature.color}15`,
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
                                        sx: { fontSize: "32px" },
                                    })}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#1f2937",
                                        mb: 2,
                                        fontWeight: 600,
                                        fontSize: "1.125rem",
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "#6b7280",
                                        lineHeight: 1.6,
                                        fontSize: "0.95rem",
                                        flexGrow: 1,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* CTA Section with Better Spacing */}
            <Box
                textAlign="center"
                py={10} // Increased spacing
                sx={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    mt: 4, // Added top margin
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        mb: 4, // Increased spacing
                        fontWeight: 700,
                        color: "#1f2937",
                    }}
                >
                    Ready to Get Started?
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#6b7280",
                        mb: 6, // Increased spacing
                        fontWeight: 400,
                    }}
                >
                    Join thousands of developers using Snippetify to organize
                    their code
                </Typography>
                {!user && (
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            fontSize: "1.1rem",
                            py: 1.5,
                            px: 6,
                            borderRadius: "10px",
                            backgroundColor: "#3b82f6",
                            "&:hover": {
                                backgroundColor: "#2563eb",
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
