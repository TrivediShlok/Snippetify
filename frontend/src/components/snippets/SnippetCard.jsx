import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Box,
    IconButton,
    Avatar,
} from "@mui/material";
import {
    Edit,
    Delete,
    Visibility,
    Code,
    Public,
    Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SnippetCard = ({ snippet, onEdit, onDelete, showActions = true }) => {
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/snippet/${snippet._id}`);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(snippet);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(snippet._id);
    };

    const languageColors = {
        javascript: "#f7df1e",
        python: "#3776ab",
        java: "#ed8b00",
        cpp: "#00599c",
        html: "#e34f26",
        css: "#1572b6",
        react: "#61dafb",
        node: "#68a063",
    };

    return (
        <Card
            className="snippet-card hover-glow"
            onClick={handleView}
            sx={{
                mb: 3,
                borderRadius: "20px",
                background: "rgba(20, 20, 30, 0.7)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(0, 245, 255, 0.2)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s ease",
                cursor: "pointer",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${
                        languageColors[snippet.language?.toLowerCase()] ||
                        "#00f5ff"
                    }, transparent)`,
                },
                "&:hover": {
                    transform: "translateY(-10px) scale(1.02)",
                    boxShadow: "0 20px 40px rgba(0, 245, 255, 0.4)",
                    borderColor: "rgba(0, 245, 255, 0.6)",
                    "& .action-buttons": {
                        opacity: 1,
                        transform: "translateX(0)",
                    },
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                >
                    <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    background: `linear-gradient(45deg, ${
                                        languageColors[
                                            snippet.language?.toLowerCase()
                                        ] || "#00f5ff"
                                    }, #ff0080)`,
                                }}
                            >
                                <Code />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#00f5ff",
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {snippet.title}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Chip
                                        label={snippet.language?.toUpperCase()}
                                        size="small"
                                        sx={{
                                            background:
                                                languageColors[
                                                    snippet.language?.toLowerCase()
                                                ] || "#00f5ff",
                                            color: "white",
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                        }}
                                    />
                                    {snippet.isPublic ? (
                                        <Chip
                                            icon={
                                                <Public
                                                    sx={{ fontSize: "14px" }}
                                                />
                                            }
                                            label="PUBLIC"
                                            size="small"
                                            sx={{
                                                background:
                                                    "rgba(0, 230, 118, 0.2)",
                                                color: "#00e676",
                                                border: "1px solid #00e676",
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            icon={
                                                <Lock
                                                    sx={{ fontSize: "14px" }}
                                                />
                                            }
                                            label="PRIVATE"
                                            size="small"
                                            sx={{
                                                background:
                                                    "rgba(255, 152, 0, 0.2)",
                                                color: "#ff9800",
                                                border: "1px solid #ff9800",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mb: 2,
                                lineHeight: 1.6,
                                fontSize: "0.95rem",
                            }}
                        >
                            {snippet.description || "No description provided"}
                        </Typography>

                        {snippet.tags && snippet.tags.length > 0 && (
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 2 }}
                                flexWrap="wrap"
                            >
                                {snippet.tags?.slice(0, 3).map((tag, index) => (
                                    <Chip
                                        key={tag._id || tag || index}
                                        label={
                                            typeof tag === "object"
                                                ? tag.name
                                                : tag
                                        }
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor:
                                                "rgba(255, 0, 128, 0.5)",
                                            color: "#ff0080",
                                            fontSize: "0.7rem",
                                            mb: 0.5,
                                        }}
                                    />
                                ))}
                                {snippet.tags.length > 3 && (
                                    <Chip
                                        label={`+${snippet.tags.length - 3}`}
                                        size="small"
                                        sx={{
                                            background:
                                                "rgba(0, 245, 255, 0.2)",
                                            color: "#00f5ff",
                                            fontSize: "0.7rem",
                                        }}
                                    />
                                )}
                            </Stack>
                        )}

                        <Box display="flex" alignItems="center" gap={3}>
                            <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                            >
                                📅{" "}
                                {new Date(
                                    snippet.createdAt
                                ).toLocaleDateString()}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                            >
                                👁️ {snippet.views || 0} views
                            </Typography>
                        </Box>
                    </Box>

                    {showActions && (
                        <Stack
                            direction="row"
                            spacing={1}
                            className="action-buttons"
                            sx={{
                                opacity: 0,
                                transform: "translateX(20px)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <IconButton
                                size="small"
                                onClick={handleView}
                                sx={{
                                    background: "rgba(0, 245, 255, 0.1)",
                                    color: "#00f5ff",
                                    border: "1px solid rgba(0, 245, 255, 0.3)",
                                    "&:hover": {
                                        background: "rgba(0, 245, 255, 0.2)",
                                        transform: "scale(1.1)",
                                    },
                                }}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleEdit}
                                sx={{
                                    background: "rgba(255, 0, 128, 0.1)",
                                    color: "#ff0080",
                                    border: "1px solid rgba(255, 0, 128, 0.3)",
                                    "&:hover": {
                                        background: "rgba(255, 0, 128, 0.2)",
                                        transform: "scale(1.1)",
                                    },
                                }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                sx={{
                                    background: "rgba(255, 23, 68, 0.1)",
                                    color: "#ff1744",
                                    border: "1px solid rgba(255, 23, 68, 0.3)",
                                    "&:hover": {
                                        background: "rgba(255, 23, 68, 0.2)",
                                        transform: "scale(1.1)",
                                    },
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Stack>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default SnippetCard;
