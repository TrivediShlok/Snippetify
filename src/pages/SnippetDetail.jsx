import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Button,
    Stack,
    CircularProgress,
    Container,
} from "@mui/material";
import { ArrowBack, Edit, Delete, ContentCopy } from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { snippetService } from "../services/snippetService";
import toast from "react-hot-toast";

const SnippetDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSnippet();
    }, [id]);

    const loadSnippet = async () => {
        setLoading(true);
        try {
            const response = await snippetService.getSnippet(id);
            setSnippet(response.snippet);
        } catch (error) {
            toast.error("Failed to load snippet");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate("/dashboard", { state: { editSnippet: snippet } });
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this snippet?"))
            return;

        try {
            await snippetService.deleteSnippet(id);
            toast.success("Snippet deleted successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Failed to delete snippet");
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            toast.success("Code copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy code");
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box className="loading-container">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!snippet) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box className="empty-state">
                    <Typography variant="h6" sx={{ color: "#374151" }}>
                        Snippet not found
                    </Typography>
                </Box>
            </Container>
        );
    }

    const isOwner = user && snippet.author && snippet.author._id === user._id;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/dashboard")}
                sx={{
                    mb: 3,
                    color: "#6b7280",
                    "&:hover": {
                        color: "#3b82f6",
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                    },
                }}
            >
                Back to Dashboard
            </Button>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, mb: 1, color: "#1f2937" }}
                        >
                            {snippet.title}
                        </Typography>
                        <Typography sx={{ color: "#6b7280", mb: 2 }}>
                            {snippet.description || "No description provided"}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ mb: 2 }}
                        >
                            <Chip
                                label={
                                    snippet.language?.toUpperCase() || "UNKNOWN"
                                }
                                color="primary"
                                size="small"
                            />
                            {snippet.tags?.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    variant="outlined"
                                    size="small"
                                />
                            ))}
                        </Stack>

                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Created:{" "}
                            {new Date(snippet.createdAt).toLocaleDateString()} •
                            Views: {snippet.views || 0}
                            {snippet.author && (
                                <>
                                    {" • By: "}
                                    {snippet.author.username ||
                                        snippet.author.firstName}
                                </>
                            )}
                        </Typography>
                    </Box>

                    {isOwner && (
                        <Stack direction="row" spacing={1}>
                            <Button
                                onClick={handleEdit}
                                variant="outlined"
                                size="small"
                                startIcon={<Edit />}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                            >
                                Delete
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#6b7280",
                            fontFamily: "monospace",
                        }}
                    >
                        {snippet.language || "code"}.
                        {snippet.language === "javascript"
                            ? "js"
                            : snippet.language === "python"
                            ? "py"
                            : "txt"}
                    </Typography>
                    <Button
                        onClick={copyToClipboard}
                        size="small"
                        startIcon={<ContentCopy />}
                        sx={{
                            color: "#6b7280",
                            "&:hover": {
                                color: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.05)",
                            },
                        }}
                    >
                        Copy
                    </Button>
                </Box>

                <Box sx={{ overflow: "auto" }}>
                    <SyntaxHighlighter
                        language={snippet.language || "text"}
                        style={tomorrow}
                        customStyle={{
                            margin: 0,
                            padding: "24px",
                            background: "#0f172a",
                            fontSize: "14px",
                            lineHeight: "1.5",
                        }}
                    >
                        {snippet.code}
                    </SyntaxHighlighter>
                </Box>
            </Paper>
        </Container>
    );
};

export default SnippetDetail;
