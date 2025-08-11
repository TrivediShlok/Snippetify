import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Container,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { snippetService } from "../services/snippetService";
import SnippetList from "../components/snippets/SnippetList";
import SnippetEditor from "../components/snippets/SnippetEditor";
import toast from "react-hot-toast";

const Dashboard = ({ user }) => {
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editSnippet, setEditSnippet] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");

    const loadSnippets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (languageFilter) params.language = languageFilter;
            const response = await snippetService.getSnippets(params);
            setSnippets(response.snippets || []);
        } catch (error) {
            toast.error("Failed to load snippets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSnippets();
    }, [searchTerm, languageFilter]);

    const handleEdit = (snippet) => {
        setEditSnippet(snippet);
        setShowEditor(true);
    };

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editSnippet) {
                await snippetService.updateSnippet(editSnippet._id, data);
                toast.success("Snippet updated successfully!");
            } else {
                await snippetService.createSnippet(data);
                toast.success("Snippet created successfully!");
            }
            setShowEditor(false);
            setEditSnippet(null);
            await loadSnippets();
        } catch (error) {
            toast.error("Failed to save snippet");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this snippet?"))
            return;

        try {
            await snippetService.deleteSnippet(id);
            toast.success("Snippet deleted successfully!");
            await loadSnippets();
        } catch (error) {
            toast.error("Failed to delete snippet");
        }
    };

    const handleCancel = () => {
        setShowEditor(false);
        setEditSnippet(null);
    };

    // Get unique languages for filter
    const languages = [
        ...new Set(snippets.map((s) => s.language).filter(Boolean)),
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 600, color: "#1f2937" }}
                    >
                        My Snippets ({snippets.length})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setEditSnippet(null);
                            setShowEditor(true);
                        }}
                        sx={{
                            backgroundColor: "#3b82f6",
                            "&:hover": {
                                backgroundColor: "#2563eb",
                            },
                        }}
                    >
                        New Snippet
                    </Button>
                </Box>

                {/* Search and Filter */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            placeholder="Search snippets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <Search sx={{ mr: 1, color: "#6b7280" }} />
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#ffffff",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Language</InputLabel>
                            <Select
                                value={languageFilter}
                                onChange={(e) =>
                                    setLanguageFilter(e.target.value)
                                }
                                label="Filter by Language"
                                sx={{
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                <MenuItem value="">All Languages</MenuItem>
                                {languages.map((lang) => (
                                    <MenuItem key={lang} value={lang}>
                                        {lang.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snippet Editor */}
            {showEditor && (
                <Box sx={{ mb: 3 }}>
                    <SnippetEditor
                        initialData={editSnippet}
                        isEditing={!!editSnippet}
                        isSaving={saving}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </Box>
            )}

            {/* Snippets List */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            py: 8,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : snippets.length === 0 ? (
                    <Box className="empty-state">
                        <Typography
                            variant="h6"
                            sx={{ mb: 1, color: "#374151" }}
                        >
                            No snippets found
                        </Typography>
                        <Typography sx={{ color: "#6b7280" }}>
                            {searchTerm || languageFilter
                                ? "Try adjusting your search or filter criteria."
                                : "Create your first snippet to get started!"}
                        </Typography>
                    </Box>
                ) : (
                    <SnippetList
                        snippets={snippets}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default Dashboard;
