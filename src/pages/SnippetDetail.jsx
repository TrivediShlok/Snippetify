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
    Divider,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
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
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!snippet) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="h6" color="error">
                    Snippet not found
                </Typography>
            </Box>
        );
    }

    const isOwner = user && snippet.author && snippet.author._id === user._id;

    return (
        <Box>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/dashboard")}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

            <Paper sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    mb={2}
                >
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {snippet.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                        >
                            {snippet.description || "No description provided"}
                        </Typography>
                    </Box>

                    {isOwner && (
                        <Stack direction="row" spacing={1}>
                            <Button
                                startIcon={<Edit />}
                                onClick={handleEdit}
                                variant="outlined"
                                size="small"
                            >
                                Edit
                            </Button>
                            <Button
                                startIcon={<Delete />}
                                onClick={handleDelete}
                                variant="outlined"
                                color="error"
                                size="small"
                            >
                                Delete
                            </Button>
                        </Stack>
                    )}
                </Box>

                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                    <Chip
                        label={snippet.language?.toUpperCase()}
                        color="primary"
                    />
                    {snippet.tags?.map((tag) => (
                        <Chip
                            key={tag._id || tag}
                            label={typeof tag === "object" ? tag.name : tag}
                            variant="outlined"
                            size="small"
                        />
                    ))}
                    <Chip
                        label={snippet.isPublic ? "Public" : "Private"}
                        variant="outlined"
                        size="small"
                    />
                </Stack>

                <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                        Created:{" "}
                        {new Date(snippet.createdAt).toLocaleDateString()} •
                        Views: {snippet.views || 0}
                        {snippet.author && (
                            <>
                                {" "}
                                • By:{" "}
                                {snippet.author.username ||
                                    snippet.author.firstName}
                            </>
                        )}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box position="relative">
                    <Button
                        onClick={copyToClipboard}
                        variant="outlined"
                        size="small"
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            zIndex: 1,
                        }}
                    >
                        Copy
                    </Button>

                    <SyntaxHighlighter
                        language={snippet.language || "javascript"}
                        style={tomorrow}
                        customStyle={{
                            margin: 0,
                            borderRadius: "8px",
                            fontSize: "14px",
                        }}
                    >
                        {snippet.code}
                    </SyntaxHighlighter>
                </Box>
            </Paper>
        </Box>
    );
};

export default SnippetDetail;
