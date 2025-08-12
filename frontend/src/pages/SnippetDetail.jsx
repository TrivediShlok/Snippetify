import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Button,
    Chip,
    Avatar,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    ArrowBack as BackIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Public as PublicIcon,
    Lock as LockIcon,
    Visibility as ViewIcon,
    Code as CodeIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { snippetService } from "../services/snippetService";
import CodeBlock from "../components/common/CodeBlock";
import toast from "react-hot-toast";

const SnippetDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSnippet = async () => {
            if (!id) {
                setError("Invalid snippet ID");
                setLoading(false);
                return;
            }

            try {
                console.log("Loading snippet with ID:", id);
                const response = await snippetService.getSnippet(id);

                if (response.success && response.data) {
                    setSnippet(response.data.snippet);
                    console.log("Snippet loaded:", response.data.snippet);
                } else {
                    setError(response.message || "Snippet not found");
                }
            } catch (error) {
                console.error("Load snippet error:", error);
                setError(error.message || "Failed to load snippet");
            } finally {
                setLoading(false);
            }
        };

        loadSnippet();
    }, [id]);

    const handleToggleLike = async () => {
        if (!user) {
            toast.error("Please login to like snippets");
            return;
        }

        try {
            const response = await snippetService.toggleLike(snippet._id);
            if (response.success) {
                setSnippet((prev) => ({
                    ...prev,
                    likes: response.data.isLiked
                        ? [...(prev.likes || []), { user: user.id }]
                        : (prev.likes || []).filter(
                              (like) => like.user !== user.id
                          ),
                }));
                toast.success(response.message, {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            }
        } catch (error) {
            console.error("Toggle like error:", error);
            toast.error(error.message || "Failed to toggle like", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        }
    };

    const getLanguageColor = (language) => {
        const colors = {
            javascript: "#f7df1e",
            typescript: "#3178c6",
            python: "#3776ab",
            java: "#ed8b00",
            c: "#00599c",
            cpp: "#00599c",
            csharp: "#239120",
            php: "#777bb4",
            ruby: "#cc342d",
            go: "#00add8",
            rust: "#000000",
            html: "#e34f26",
            css: "#1572b6",
            scss: "#cf649a",
            sql: "#336791",
            other: "#6b7280",
        };
        return colors[language?.toLowerCase()] || colors.other;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isOwner =
        user &&
        snippet &&
        (user.id === snippet.author?._id || user.id === snippet.author);
    const isLiked =
        snippet?.likes &&
        snippet.likes.some(
            (like) => like.user === user?.id || like.user?._id === user?.id
        );

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "60vh",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <CircularProgress size={50} sx={{ color: "#667eea" }} />
                    <Typography
                        variant="h6"
                        sx={{
                            color: darkMode ? "#94a3b8" : "#6b7280",
                            fontWeight: 500,
                        }}
                    >
                        Loading snippet...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error || !snippet) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                        border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "20px",
                    }}
                >
                    <CodeIcon
                        sx={{
                            fontSize: 80,
                            color: darkMode ? "#475569" : "#d1d5db",
                            mb: 2,
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: darkMode ? "#f1f5f9" : "#1f2937",
                        }}
                    >
                        Snippet Not Found
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            color: darkMode ? "#94a3b8" : "#6b7280",
                        }}
                    >
                        {error ||
                            "The snippet you are looking for does not exist or has been removed."}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<BackIcon />}
                        onClick={() => navigate("/dashboard")}
                        sx={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                            px: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate("/dashboard")}
                    sx={{
                        mb: 3,
                        color: darkMode ? "#94a3b8" : "#6b7280",
                        "&:hover": {
                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                        },
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* Main Content */}
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: darkMode
                        ? "0 10px 15px -3px rgba(0,0,0,0.3)"
                        : "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        p: 4,
                        borderBottom: `1px solid ${
                            darkMode ? "#374151" : "#f0f0f0"
                        }`,
                        position: "relative",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: `linear-gradient(90deg, ${getLanguageColor(
                                snippet.programmingLanguage || snippet.language
                            )}, ${getLanguageColor(
                                snippet.programmingLanguage || snippet.language
                            )}cc)`,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 3,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                backgroundColor: getLanguageColor(
                                    snippet.programmingLanguage ||
                                        snippet.language
                                ),
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color: "#ffffff",
                            }}
                        >
                            <CodeIcon fontSize="large" />
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                    lineHeight: 1.2,
                                }}
                            >
                                {snippet.title}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Chip
                                    label={(
                                        snippet.programmingLanguage ||
                                        snippet.language ||
                                        "text"
                                    ).toUpperCase()}
                                    sx={{
                                        backgroundColor: `${getLanguageColor(
                                            snippet.programmingLanguage ||
                                                snippet.language
                                        )}20`,
                                        color: getLanguageColor(
                                            snippet.programmingLanguage ||
                                                snippet.language
                                        ),
                                        fontWeight: 700,
                                        fontSize: "0.875rem",
                                        height: "32px",
                                        border: `1px solid ${getLanguageColor(
                                            snippet.programmingLanguage ||
                                                snippet.language
                                        )}40`,
                                    }}
                                />

                                <Tooltip
                                    title={
                                        snippet.isPublic
                                            ? "Public snippet"
                                            : "Private snippet"
                                    }
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        {snippet.isPublic ? (
                                            <PublicIcon
                                                sx={{
                                                    fontSize: "20px",
                                                    color: "#10b981",
                                                }}
                                            />
                                        ) : (
                                            <LockIcon
                                                sx={{
                                                    fontSize: "20px",
                                                    color: "#f59e0b",
                                                }}
                                            />
                                        )}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: snippet.isPublic
                                                    ? "#10b981"
                                                    : "#f59e0b",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {snippet.isPublic
                                                ? "Public"
                                                : "Private"}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Box>

                            {snippet.description && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                        lineHeight: 1.6,
                                        mb: 2,
                                        fontWeight: 400,
                                    }}
                                >
                                    {snippet.description}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        by{" "}
                                        <strong>
                                            {snippet.author?.username ||
                                                snippet.author?.firstName ||
                                                "Unknown"}
                                        </strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: darkMode
                                                ? "#64748b"
                                                : "#9ca3af",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {formatDate(snippet.createdAt)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <ViewIcon
                                            sx={{
                                                fontSize: "16px",
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#6b7280",
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#6b7280",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {snippet.views || 0} views
                                        </Typography>
                                    </Box>

                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ mx: 1 }}
                                    />

                                    <Tooltip
                                        title={isLiked ? "Unlike" : "Like"}
                                    >
                                        <IconButton
                                            onClick={handleToggleLike}
                                            sx={{
                                                color: isLiked
                                                    ? "#ef4444"
                                                    : darkMode
                                                    ? "#94a3b8"
                                                    : "#6b7280",
                                                "&:hover": {
                                                    color: "#ef4444",
                                                    backgroundColor:
                                                        "rgba(239, 68, 68, 0.1)",
                                                },
                                            }}
                                        >
                                            {isLiked ? (
                                                <FavoriteIcon />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {snippet.likes?.length || 0}
                                    </Typography>

                                    {isOwner && (
                                        <>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{ mx: 1 }}
                                            />
                                            <Tooltip title="Edit snippet">
                                                <IconButton
                                                    onClick={() =>
                                                        navigate(`/dashboard`)
                                                    } // You can implement edit functionality
                                                    sx={{
                                                        color: "#10b981",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "rgba(16, 185, 129, 0.1)",
                                                        },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Code Section */}
                <Box sx={{ p: 4 }}>
                    <CodeBlock
                        code={snippet.code}
                        language={
                            snippet.programmingLanguage ||
                            snippet.language ||
                            "javascript"
                        }
                        showLineNumbers={true}
                        maxHeight="none"
                        showCopyButton={true}
                        title={`${snippet.title} - ${(
                            snippet.programmingLanguage ||
                            snippet.language ||
                            "text"
                        ).toUpperCase()}`}
                    />
                </Box>

                {/* Tags Section */}
                {snippet.tags && snippet.tags.length > 0 && (
                    <Box sx={{ px: 4, pb: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                            }}
                        >
                            Tags
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {snippet.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    variant="outlined"
                                    sx={{
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                        "&:hover": {
                                            borderColor: "#667eea",
                                            color: "#667eea",
                                            backgroundColor: darkMode
                                                ? "rgba(102, 126, 234, 0.1)"
                                                : "rgba(102, 126, 234, 0.05)",
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default SnippetDetail;
