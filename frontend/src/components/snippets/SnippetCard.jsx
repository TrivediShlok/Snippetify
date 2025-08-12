import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Box,
    Chip,
    Tooltip,
    Avatar,
    Divider,
    Fade,
    Button,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Visibility as ViewIcon,
    Public as PublicIcon,
    Lock as LockIcon,
    ContentCopy as CopyIcon,
    Code as CodeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

const SnippetCard = ({ snippet, onEdit, onDelete, onToggleLike, user }) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    const isOwner =
        user &&
        snippet.author &&
        (user.id === snippet.author._id || user.id === snippet.author);
    const isLiked =
        snippet.likes &&
        snippet.likes.some(
            (like) => like.user === user?.id || like.user?._id === user?.id
        );

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

    const truncateCode = (code, maxLength = 150) => {
        if (!code) return "No code available";
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    const handleCopyCode = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(snippet.code || "");
            toast.success("Code copied to clipboard!", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } catch (error) {
            toast.error("Failed to copy code", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Today";
        if (diffDays === 2) return "Yesterday";
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <Fade in={true} timeout={600}>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    border: `1px solid ${
                        isHovered
                            ? darkMode
                                ? "#667eea"
                                : "#3b82f6"
                            : darkMode
                            ? "#374151"
                            : "#e5e7eb"
                    }`,
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    boxShadow: isHovered
                        ? darkMode
                            ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                            : "0 25px 50px -12px rgba(0,0,0,0.15)"
                        : darkMode
                        ? "0 10px 15px -3px rgba(0,0,0,0.3)"
                        : "0 10px 15px -3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    overflow: "hidden",
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
                {/* Header Section */}
                <Box sx={{ p: 3, pb: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: getLanguageColor(
                                    snippet.programmingLanguage ||
                                        snippet.language
                                ),
                                fontSize: "1rem",
                                fontWeight: "bold",
                                color: "#ffffff",
                                flexShrink: 0,
                                border: "3px solid rgba(255,255,255,0.2)",
                            }}
                        >
                            <CodeIcon />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                    cursor: "pointer",
                                    mb: 1,
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    "&:hover": {
                                        color: "#667eea",
                                    },
                                }}
                                onClick={() =>
                                    navigate(`/snippet/${snippet._id}`)
                                }
                            >
                                {snippet.title || "Untitled Snippet"}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <Chip
                                    label={(
                                        snippet.programmingLanguage ||
                                        snippet.language ||
                                        "text"
                                    ).toUpperCase()}
                                    size="small"
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
                                        fontSize: "0.75rem",
                                        height: "24px",
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
                                    {snippet.isPublic ? (
                                        <PublicIcon
                                            sx={{
                                                fontSize: "18px",
                                                color: "#10b981",
                                            }}
                                        />
                                    ) : (
                                        <LockIcon
                                            sx={{
                                                fontSize: "18px",
                                                color: "#f59e0b",
                                            }}
                                        />
                                    )}
                                </Tooltip>
                            </Box>

                            {snippet.description && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.5,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {snippet.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Code Preview Section */}
                <CardContent sx={{ flexGrow: 1, p: 3, pt: 0 }}>
                    <Box
                        sx={{
                            backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
                            borderRadius: "12px",
                            border: `1px solid ${
                                darkMode ? "#374151" : "#e5e7eb"
                            }`,
                            position: "relative",
                            overflow: "hidden",
                            mb: 2,
                        }}
                    >
                        {/* Code Header */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                backgroundColor: darkMode
                                    ? "#1e293b"
                                    : "#ffffff",
                                borderBottom: `1px solid ${
                                    darkMode ? "#374151" : "#e5e7eb"
                                }`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#ef4444",
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#f59e0b",
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#10b981",
                                    }}
                                />
                            </Box>

                            <Tooltip title="Copy code">
                                <IconButton
                                    size="small"
                                    onClick={handleCopyCode}
                                    sx={{
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                        "&:hover": {
                                            color: darkMode
                                                ? "#f3f4f6"
                                                : "#374151",
                                            backgroundColor: darkMode
                                                ? "#374151"
                                                : "#f3f4f6",
                                        },
                                    }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Code Content */}
                        <Box
                            sx={{
                                p: 2,
                                maxHeight: "120px",
                                overflow: "hidden",
                            }}
                        >
                            <Typography
                                component="pre"
                                sx={{
                                    fontFamily:
                                        '"Fira Code", "JetBrains Mono", "Consolas", "Monaco", monospace',
                                    fontSize: "0.8rem",
                                    color: darkMode ? "#e2e8f0" : "#1e293b",
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    lineHeight: 1.6,
                                    overflow: "hidden",
                                }}
                            >
                                {truncateCode(snippet.code)}
                            </Typography>
                        </Box>

                        {/* Fade overlay for truncated code */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "20px",
                                background: darkMode
                                    ? "linear-gradient(transparent, #0f172a)"
                                    : "linear-gradient(transparent, #f8fafc)",
                            }}
                        />
                    </Box>

                    {/* Tags Section */}
                    {snippet.tags && snippet.tags.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.75,
                                mb: 2,
                            }}
                        >
                            {snippet.tags.slice(0, 4).map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: "0.7rem",
                                        height: "24px",
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
                            {snippet.tags.length > 4 && (
                                <Chip
                                    label={`+${snippet.tags.length - 4}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontSize: "0.7rem",
                                        height: "24px",
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                        color: darkMode ? "#64748b" : "#9ca3af",
                                    }}
                                />
                            )}
                        </Box>
                    )}

                    {/* Author and Date */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: darkMode ? "#64748b" : "#6b7280",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                            }}
                        >
                            by{" "}
                            {snippet.author?.username ||
                                snippet.author?.firstName ||
                                "Unknown"}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: darkMode ? "#64748b" : "#6b7280",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                            }}
                        >
                            {formatDate(snippet.createdAt)}
                        </Typography>
                    </Box>
                </CardContent>

                <Divider
                    sx={{ borderColor: darkMode ? "#374151" : "#f0f0f0" }}
                />

                {/* Actions Section */}
                <CardActions
                    sx={{
                        px: 3,
                        py: 2,
                        justifyContent: "space-between",
                        backgroundColor: darkMode ? "#334155" : "#f8fafc",
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                        <Tooltip title={isLiked ? "Unlike" : "Like"}>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    onToggleLike && onToggleLike(snippet._id)
                                }
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
                                        transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {isLiked ? (
                                    <FavoriteIcon fontSize="small" />
                                ) : (
                                    <FavoriteBorderIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant="body2"
                            sx={{
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                            }}
                        >
                            {snippet.likes?.length || 0}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                ml: 1,
                            }}
                        >
                            <ViewIcon
                                fontSize="small"
                                sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                }}
                            >
                                {snippet.views || 0}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View details">
                            <Button
                                size="small"
                                onClick={() =>
                                    navigate(`/snippet/${snippet._id}`)
                                }
                                startIcon={<ViewIcon />}
                                sx={{
                                    color: "#667eea",
                                    minWidth: "auto",
                                    px: 1.5,
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(102, 126, 234, 0.1)",
                                        transform: "translateY(-1px)",
                                    },
                                    transition: "all 0.2s ease",
                                }}
                            >
                                View
                            </Button>
                        </Tooltip>

                        {isOwner && (
                            <>
                                <Tooltip title="Edit snippet">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            onEdit && onEdit(snippet)
                                        }
                                        sx={{
                                            color: "#10b981",
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(16, 185, 129, 0.1)",
                                                transform: "scale(1.1)",
                                            },
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete snippet">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            onDelete && onDelete(snippet._id)
                                        }
                                        sx={{
                                            color: "#ef4444",
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(239, 68, 68, 0.1)",
                                                transform: "scale(1.1)",
                                            },
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </CardActions>
            </Card>
        </Fade>
    );
};

export default SnippetCard;
