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
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ContentCopy as CopyIcon,
    Visibility as ViewIcon,
    Code as CodeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SnippetCard = ({ snippet, onEdit, onDelete, onToggleLike, user }) => {
    const navigate = useNavigate();
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

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            toast.success("Code copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy code");
        }
    };

    const getLanguageColor = (language) => {
        const colors = {
            javascript: "#f7df1e",
            python: "#3776ab",
            java: "#ed8b00",
            react: "#61dafb",
            html: "#e34f26",
            css: "#1572b6",
            typescript: "#3178c6",
            php: "#777bb4",
            ruby: "#cc342d",
            go: "#00add8",
            rust: "#000000",
            other: "#6b7280",
        };
        return colors[language?.toLowerCase()] || colors.other;
    };

    const truncateCode = (code, maxLength = 150) => {
        if (code.length <= maxLength) return code;
        return code.substring(0, maxLength) + "...";
    };

    return (
        <Fade in={true} timeout={600}>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    borderRadius: "16px",
                    boxShadow: isHovered
                        ? "0 20px 40px rgba(0,0,0,0.12)"
                        : "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    border: "1px solid",
                    borderColor: isHovered ? "#e3f2fd" : "#f5f5f5",
                    background:
                        "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: `linear-gradient(90deg, ${getLanguageColor(
                            snippet.programmingLanguage
                        )}, ${getLanguageColor(
                            snippet.programmingLanguage
                        )}80)`,
                    },
                }}
            >
                <CardContent
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {/* Header Section */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: getLanguageColor(
                                    snippet.programmingLanguage
                                ),
                                fontSize: "0.875rem",
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                            <CodeIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    color: "#1a1a1a",
                                    cursor: "pointer",
                                    mb: 0.5,
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    "&:hover": {
                                        color: "#2563eb",
                                    },
                                }}
                                onClick={() =>
                                    navigate(`/snippet/${snippet._id}`)
                                }
                            >
                                {snippet.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#666",
                                    fontSize: "0.875rem",
                                    lineHeight: 1.4,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    minHeight: "35px",
                                }}
                            >
                                {snippet.description ||
                                    "No description provided"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Code Preview Section */}
                    <Box
                        sx={{
                            backgroundColor: "#1e1e1e",
                            borderRadius: "12px",
                            p: 2,
                            position: "relative",
                            overflow: "hidden",
                            border: "1px solid #333",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Chip
                                label={
                                    snippet.programmingLanguage?.toUpperCase() ||
                                    "CODE"
                                }
                                size="small"
                                sx={{
                                    bgcolor: getLanguageColor(
                                        snippet.programmingLanguage
                                    ),
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    height: "20px",
                                }}
                            />
                            <Tooltip title="Copy code">
                                <IconButton
                                    size="small"
                                    onClick={handleCopyCode}
                                    sx={{
                                        color: "#9ca3af",
                                        "&:hover": {
                                            color: "#fff",
                                            bgcolor: "rgba(255,255,255,0.1)",
                                        },
                                    }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography
                            component="pre"
                            sx={{
                                fontFamily:
                                    '"Fira Code", "Consolas", "Monaco", monospace',
                                fontSize: "0.8rem",
                                color: "#e5e7eb",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                lineHeight: 1.5,
                                maxHeight: "120px",
                                overflow: "hidden",
                            }}
                        >
                            {truncateCode(snippet.code)}
                        </Typography>
                    </Box>

                    {/* Tags Section */}
                    {snippet.tags && snippet.tags.length > 0 && (
                        <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                                        borderColor: "#e0e0e0",
                                        color: "#666",
                                        "&:hover": {
                                            borderColor: "#2563eb",
                                            color: "#2563eb",
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
                                        borderColor: "#e0e0e0",
                                        color: "#999",
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
                            sx={{ color: "#888", fontSize: "0.75rem" }}
                        >
                            by{" "}
                            {snippet.author?.username ||
                                snippet.author?.firstName ||
                                "Unknown"}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "#888", fontSize: "0.75rem" }}
                        >
                            {new Date(snippet.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </CardContent>

                <Divider sx={{ borderColor: "#f0f0f0" }} />

                {/* Actions Section */}
                <CardActions
                    sx={{
                        px: 3,
                        py: 1.5,
                        justifyContent: "space-between",
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <Tooltip title={isLiked ? "Unlike" : "Like"}>
                            <IconButton
                                size="small"
                                onClick={() =>
                                    onToggleLike && onToggleLike(snippet._id)
                                }
                                sx={{
                                    color: isLiked ? "#ef4444" : "#9ca3af",
                                    "&:hover": {
                                        color: "#ef4444",
                                        backgroundColor:
                                            "rgba(239, 68, 68, 0.1)",
                                    },
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
                            sx={{ color: "#666", fontSize: "0.8rem" }}
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
                                sx={{ color: "#9ca3af" }}
                            />
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", fontSize: "0.8rem" }}
                            >
                                {snippet.views || 0}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View full snippet">
                            <IconButton
                                size="small"
                                onClick={() =>
                                    navigate(`/snippet/${snippet._id}`)
                                }
                                sx={{
                                    color: "#2563eb",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(37, 99, 235, 0.1)",
                                    },
                                }}
                            >
                                <ViewIcon fontSize="small" />
                            </IconButton>
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
                                            },
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
                                            },
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
