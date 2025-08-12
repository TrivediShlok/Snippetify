import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Grid,
    Select,
    MenuItem,
    Paper,
    Container,
    Alert,
    Chip,
    InputAdornment,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    Menu,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    Add,
    Search,
    FilterList,
    Clear,
    Code,
    Public,
    Lock,
    Tune,
    CreateNewFolder,
    Folder,
    FolderOpen,
    FileDownload,
    Share,
    MoreVert,
    Collections,
    ViewModule,
    ViewList,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { snippetService } from "../services/snippetService";
import { collectionService } from "../services/collectionService";
import SnippetList from "../components/snippets/SnippetList";
import SnippetEditor from "../components/snippets/SnippetEditor";
import CollectionDialog from "../components/collections/CollectionDialog";
import ShareDialog from "../components/sharing/ShareDialog";
import ExportDialog from "../components/export/ExportDialog";
import toast from "react-hot-toast";

const Dashboard = ({ user }) => {
    const { darkMode } = useTheme();
    const [snippets, setSnippets] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editSnippet, setEditSnippet] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [publicFilter, setPublicFilter] = useState(""); // Fixed: proper state management
    const [collectionFilter, setCollectionFilter] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [error, setError] = useState("");
    const [showCollectionDialog, setShowCollectionDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [selectedSnippets, setSelectedSnippets] = useState([]);
    const [shareSnippet, setShareSnippet] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false,
    });

    const loadSnippets = async (page = 1) => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit: 12,
                sortBy,
                sortOrder,
            };

            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (languageFilter) params.language = languageFilter;

            // FIXED: Proper public filter handling
            if (publicFilter !== "") {
                params.isPublic = publicFilter;
            }

            if (collectionFilter !== "all") {
                params.collection = collectionFilter;
            }

            console.log("Dashboard: Loading snippets with params:", params);
            const response = await snippetService.getSnippets(params);

            if (response.success) {
                setSnippets(response.data.snippets || []);
                setPagination(
                    response.data.pagination || {
                        current: 1,
                        pages: 1,
                        total: 0,
                        hasNext: false,
                        hasPrev: false,
                    }
                );
            } else {
                throw new Error(response.message || "Failed to load snippets");
            }
        } catch (error) {
            console.error("Load snippets error:", error);
            setError(error.message || "Failed to load snippets");
            toast.error(error.message || "Failed to load snippets", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
            setSnippets([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCollections = async () => {
        try {
            const response = await collectionService.getCollections();
            if (response.success) {
                setCollections(response.data.collections || []);
            }
        } catch (error) {
            console.error("Load collections error:", error);
        }
    };

    useEffect(() => {
        loadSnippets();
    }, [
        searchTerm,
        languageFilter,
        publicFilter,
        collectionFilter,
        sortBy,
        sortOrder,
    ]);

    useEffect(() => {
        loadCollections();
    }, []);

    const handleEdit = (snippet) => {
        setEditSnippet(snippet);
        setShowEditor(true);
        setError("");
    };

    const handleSave = async (data) => {
        setSaving(true);
        setError("");

        try {
            if (!data.title || !data.title.trim()) {
                throw new Error("Title is required");
            }
            if (!data.code || !data.code.trim()) {
                throw new Error("Code is required");
            }
            if (!data.language) {
                throw new Error("Programming language is required");
            }

            let response;
            if (editSnippet) {
                response = await snippetService.updateSnippet(
                    editSnippet._id,
                    data
                );
                toast.success("Snippet updated successfully!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            } else {
                response = await snippetService.createSnippet(data);
                toast.success("Snippet created successfully!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            }

            if (response.success) {
                setShowEditor(false);
                setEditSnippet(null);
                await loadSnippets();
                if (data.collection) {
                    await loadCollections(); // Reload collections if snippet was added to one
                }
            } else {
                throw new Error(response.message || "Failed to save snippet");
            }
        } catch (error) {
            console.error("Save snippet error:", error);
            const errorMessage =
                error.message || "Failed to save snippet. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage, {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this snippet?")) {
            return;
        }

        try {
            const response = await snippetService.deleteSnippet(id);
            if (response.success) {
                toast.success("Snippet deleted successfully!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
                await loadSnippets();
            } else {
                throw new Error(response.message || "Failed to delete snippet");
            }
        } catch (error) {
            console.error("Delete snippet error:", error);
            toast.error(error.message || "Failed to delete snippet", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        }
    };

    const handleToggleLike = async (id) => {
        try {
            const response = await snippetService.toggleLike(id);
            if (response.success) {
                setSnippets((prevSnippets) =>
                    prevSnippets.map((snippet) =>
                        snippet._id === id
                            ? {
                                  ...snippet,
                                  likes: response.data.isLiked
                                      ? [
                                            ...(snippet.likes || []),
                                            { user: user.id },
                                        ]
                                      : (snippet.likes || []).filter(
                                            (like) => like.user !== user.id
                                        ),
                              }
                            : snippet
                    )
                );
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

    const handleShare = (snippet) => {
        setShareSnippet(snippet);
        setShowShareDialog(true);
    };

    const handleCollectionCreated = () => {
        loadCollections();
        setShowCollectionDialog(false);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLanguageFilter("");
        setPublicFilter(""); // Fixed: proper clearing
        setCollectionFilter("all");
        setSortBy("createdAt");
        setSortOrder("desc");
    };

    const hasActiveFilters =
        searchTerm ||
        languageFilter ||
        publicFilter !== "" ||
        collectionFilter !== "all";

    // Get unique languages for filter
    const languages = [
        ...new Set(snippets.map((s) => s.programmingLanguage).filter(Boolean)),
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Enhanced Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "20px",
                    boxShadow: darkMode
                        ? "0 8px 30px rgba(0,0,0,0.3)"
                        : "0 8px 30px rgba(0,0,0,0.08)",
                }}
            >
                {/* Title and Stats Section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 3,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                                mb: 1,
                            }}
                        >
                            My Code Snippets
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                    fontWeight: 400,
                                }}
                            >
                                {pagination.total} snippet
                                {pagination.total !== 1 ? "s" : ""} total
                            </Typography>
                            <Chip
                                icon={<Collections />}
                                label={`${collections.length} collection${
                                    collections.length !== 1 ? "s" : ""
                                }`}
                                variant="outlined"
                                sx={{
                                    borderColor: darkMode
                                        ? "#475569"
                                        : "#d1d5db",
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {/* View Mode Toggle */}
                        <Box
                            sx={{
                                display: "flex",
                                border: `1px solid ${
                                    darkMode ? "#475569" : "#e5e7eb"
                                }`,
                                borderRadius: "8px",
                            }}
                        >
                            <Tooltip title="Grid View">
                                <IconButton
                                    size="small"
                                    onClick={() => setViewMode("grid")}
                                    sx={{
                                        color:
                                            viewMode === "grid"
                                                ? "#667eea"
                                                : darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                        backgroundColor:
                                            viewMode === "grid"
                                                ? darkMode
                                                    ? "#334155"
                                                    : "#f1f5f9"
                                                : "transparent",
                                    }}
                                >
                                    <ViewModule />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="List View">
                                <IconButton
                                    size="small"
                                    onClick={() => setViewMode("list")}
                                    sx={{
                                        color:
                                            viewMode === "list"
                                                ? "#667eea"
                                                : darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                        backgroundColor:
                                            viewMode === "list"
                                                ? darkMode
                                                    ? "#334155"
                                                    : "#f1f5f9"
                                                : "transparent",
                                    }}
                                >
                                    <ViewList />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* More Actions Menu */}
                        <Tooltip title="More Actions">
                            <IconButton
                                onClick={(e) =>
                                    setMenuAnchorEl(e.currentTarget)
                                }
                                sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                            >
                                <MoreVert />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={() => setMenuAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    backgroundColor: darkMode
                                        ? "#1e293b"
                                        : "#ffffff",
                                    border: `1px solid ${
                                        darkMode ? "#475569" : "#e5e7eb"
                                    }`,
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setShowCollectionDialog(true);
                                    setMenuAnchorEl(null);
                                }}
                            >
                                <ListItemIcon>
                                    <CreateNewFolder />
                                </ListItemIcon>
                                <ListItemText>New Collection</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setShowExportDialog(true);
                                    setMenuAnchorEl(null);
                                }}
                            >
                                <ListItemIcon>
                                    <FileDownload />
                                </ListItemIcon>
                                <ListItemText>Export Snippets</ListItemText>
                            </MenuItem>
                        </Menu>

                        {/* Create Button */}
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => {
                                setEditSnippet(null);
                                setShowEditor(true);
                                setError("");
                            }}
                            sx={{
                                background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "16px",
                                px: 4,
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                boxShadow:
                                    "0 12px 30px rgba(102, 126, 234, 0.4)",
                                transition:
                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    boxShadow:
                                        "0 16px 40px rgba(102, 126, 234, 0.5)",
                                    transform: "translateY(-3px)",
                                },
                            }}
                        >
                            Create New Snippet
                        </Button>
                    </Box>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 4,
                            borderRadius: "12px",
                            backgroundColor: darkMode ? "#991b1b" : undefined,
                            color: darkMode ? "#fecaca" : undefined,
                        }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                {/* Enhanced Filter Section */}
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: darkMode ? "#334155" : "#f8fafc",
                        border: `2px solid ${darkMode ? "#475569" : "#e2e8f0"}`,
                        borderRadius: "16px",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        {/* Filter Header */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 40,
                                    height: 40,
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                }}
                            >
                                <Tune fontSize="small" />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                }}
                            >
                                Filter & Search
                            </Typography>
                            {hasActiveFilters && (
                                <Chip
                                    label={`${
                                        [
                                            searchTerm,
                                            languageFilter,
                                            publicFilter !== ""
                                                ? "visibility"
                                                : "",
                                            collectionFilter !== "all"
                                                ? "collection"
                                                : "",
                                        ].filter(Boolean).length
                                    } active`}
                                    size="small"
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#fbbf24"
                                            : "#fef3c7",
                                        color: darkMode ? "#1f2937" : "#92400e",
                                        fontWeight: 600,
                                    }}
                                />
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            {/* Search Input */}
                            <Grid item xs={12} lg={4}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#374151",
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Search fontSize="small" />
                                    Search Snippets
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Search by title, description, or tags..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search
                                                    sx={{
                                                        color: darkMode
                                                            ? "#94a3b8"
                                                            : "#9ca3af",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: darkMode
                                                ? "#1e293b"
                                                : "#ffffff",
                                            borderRadius: "12px",
                                            height: "56px",
                                            fontSize: "1rem",
                                            "& fieldset": {
                                                borderColor: darkMode
                                                    ? "#475569"
                                                    : "#d1d5db",
                                                borderWidth: "2px",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#9ca3af",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#3b82f6",
                                                borderWidth: "2px",
                                            },
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                            "&::placeholder": {
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#9ca3af",
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Collection Filter */}
                            <Grid item xs={12} sm={6} lg={2}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#374151",
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Folder fontSize="small" />
                                    Collection
                                </Typography>
                                <Select
                                    fullWidth
                                    value={collectionFilter}
                                    onChange={(e) =>
                                        setCollectionFilter(e.target.value)
                                    }
                                    displayEmpty
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                        borderRadius: "12px",
                                        height: "56px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#d1d5db",
                                            borderWidth: "2px",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#9ca3af",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#3b82f6",
                                                borderWidth: "2px",
                                            },
                                        "& .MuiSelect-select": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#9ca3af",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: `1px solid ${
                                                    darkMode
                                                        ? "#475569"
                                                        : "#e5e7eb"
                                                }`,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#9ca3af",
                                            }}
                                        >
                                            <Folder fontSize="small" />
                                            All Collections
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="uncategorized">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#f1f5f9"
                                                    : "#1f2937",
                                            }}
                                        >
                                            <FolderOpen fontSize="small" />
                                            Uncategorized
                                        </Box>
                                    </MenuItem>
                                    {collections.map((collection) => (
                                        <MenuItem
                                            key={collection._id}
                                            value={collection._id}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    color: darkMode
                                                        ? "#f1f5f9"
                                                        : "#1f2937",
                                                }}
                                            >
                                                <Folder
                                                    fontSize="small"
                                                    sx={{
                                                        color: collection.color,
                                                    }}
                                                />
                                                {collection.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* Language Filter */}
                            <Grid item xs={12} sm={6} lg={2}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#374151",
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Code fontSize="small" />
                                    Language
                                </Typography>
                                <Select
                                    fullWidth
                                    value={languageFilter}
                                    onChange={(e) =>
                                        setLanguageFilter(e.target.value)
                                    }
                                    displayEmpty
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                        borderRadius: "12px",
                                        height: "56px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#d1d5db",
                                            borderWidth: "2px",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#9ca3af",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#3b82f6",
                                                borderWidth: "2px",
                                            },
                                        "& .MuiSelect-select": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#9ca3af",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: `1px solid ${
                                                    darkMode
                                                        ? "#475569"
                                                        : "#e5e7eb"
                                                }`,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#9ca3af",
                                            }}
                                        >
                                            <Code fontSize="small" />
                                            All Languages
                                        </Box>
                                    </MenuItem>
                                    {languages.sort().map((lang) => (
                                        <MenuItem key={lang} value={lang}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    color: darkMode
                                                        ? "#f1f5f9"
                                                        : "#1f2937",
                                                }}
                                            >
                                                <Code fontSize="small" />
                                                {lang.toUpperCase()}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* Visibility Filter - FIXED */}
                            <Grid item xs={12} sm={6} lg={2}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#374151",
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Public fontSize="small" />
                                    Visibility
                                </Typography>
                                <Select
                                    fullWidth
                                    value={publicFilter}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        console.log(
                                            "Dashboard: Setting publicFilter to:",
                                            value
                                        );
                                        setPublicFilter(value);
                                    }}
                                    displayEmpty
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                        borderRadius: "12px",
                                        height: "56px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#d1d5db",
                                            borderWidth: "2px",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#9ca3af",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#3b82f6",
                                                borderWidth: "2px",
                                            },
                                        "& .MuiSelect-select": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#9ca3af",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: `1px solid ${
                                                    darkMode
                                                        ? "#475569"
                                                        : "#e5e7eb"
                                                }`,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#9ca3af",
                                            }}
                                        >
                                            <Public fontSize="small" />
                                            All Snippets
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#f1f5f9"
                                                    : "#1f2937",
                                            }}
                                        >
                                            <Public
                                                fontSize="small"
                                                sx={{ color: "#10b981" }}
                                            />
                                            Public Only
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="false">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#f1f5f9"
                                                    : "#1f2937",
                                            }}
                                        >
                                            <Lock
                                                fontSize="small"
                                                sx={{ color: "#f59e0b" }}
                                            />
                                            Private Only
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </Grid>

                            {/* Sort Options */}
                            <Grid item xs={12} sm={6} lg={2}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#374151",
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    Sort By
                                </Typography>
                                <Select
                                    fullWidth
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] =
                                            e.target.value.split("-");
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                        borderRadius: "12px",
                                        height: "56px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#d1d5db",
                                            borderWidth: "2px",
                                        },
                                        "& .MuiSelect-select": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: `1px solid ${
                                                    darkMode
                                                        ? "#475569"
                                                        : "#e5e7eb"
                                                }`,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="createdAt-desc">
                                        Newest First
                                    </MenuItem>
                                    <MenuItem value="createdAt-asc">
                                        Oldest First
                                    </MenuItem>
                                    <MenuItem value="lastModified-desc">
                                        Recently Modified
                                    </MenuItem>
                                    <MenuItem value="title-asc">A-Z</MenuItem>
                                    <MenuItem value="title-desc">Z-A</MenuItem>
                                    <MenuItem value="views-desc">
                                        Most Viewed
                                    </MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* Active Filters & Clear Button */}
                        {hasActiveFilters && (
                            <Box
                                sx={{
                                    mt: 3,
                                    pt: 3,
                                    borderTop: `1px solid ${
                                        darkMode ? "#475569" : "#e5e7eb"
                                    }`,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#6b7280",
                                                fontWeight: 600,
                                                mr: 1,
                                            }}
                                        >
                                            Active Filters:
                                        </Typography>
                                        {searchTerm && (
                                            <Chip
                                                label={`"${searchTerm}"`}
                                                onDelete={() =>
                                                    setSearchTerm("")
                                                }
                                                size="medium"
                                                sx={{
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1e40af",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                        {languageFilter && (
                                            <Chip
                                                icon={<Code fontSize="small" />}
                                                label={languageFilter.toUpperCase()}
                                                onDelete={() =>
                                                    setLanguageFilter("")
                                                }
                                                size="medium"
                                                sx={{
                                                    backgroundColor: "#dcfce7",
                                                    color: "#166534",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                        {publicFilter !== "" && (
                                            <Chip
                                                icon={
                                                    publicFilter === "true" ? (
                                                        <Public fontSize="small" />
                                                    ) : (
                                                        <Lock fontSize="small" />
                                                    )
                                                }
                                                label={
                                                    publicFilter === "true"
                                                        ? "Public"
                                                        : "Private"
                                                }
                                                onDelete={() =>
                                                    setPublicFilter("")
                                                }
                                                size="medium"
                                                sx={{
                                                    backgroundColor: "#fed7aa",
                                                    color: "#c2410c",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                        {collectionFilter !== "all" && (
                                            <Chip
                                                icon={
                                                    <Folder fontSize="small" />
                                                }
                                                label={
                                                    collectionFilter ===
                                                    "uncategorized"
                                                        ? "Uncategorized"
                                                        : collections.find(
                                                              (c) =>
                                                                  c._id ===
                                                                  collectionFilter
                                                          )?.name ||
                                                          "Collection"
                                                }
                                                onDelete={() =>
                                                    setCollectionFilter("all")
                                                }
                                                size="medium"
                                                sx={{
                                                    backgroundColor: "#f3e8ff",
                                                    color: "#7c3aed",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        onClick={clearFilters}
                                        startIcon={<Clear />}
                                        sx={{
                                            borderRadius: "12px",
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#e5e7eb",
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                            fontWeight: 600,
                                            px: 3,
                                            "&:hover": {
                                                borderColor: "#ef4444",
                                                backgroundColor:
                                                    "rgba(239, 68, 68, 0.05)",
                                                color: "#ef4444",
                                            },
                                        }}
                                    >
                                        Clear All Filters
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Paper>

            {/* Snippet Editor */}
            {showEditor && (
                <Box sx={{ mb: 4 }}>
                    <SnippetEditor
                        initialData={editSnippet}
                        isEditing={!!editSnippet}
                        isSaving={saving}
                        collections={collections}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowEditor(false);
                            setEditSnippet(null);
                            setError("");
                        }}
                    />
                </Box>
            )}

            {/* Snippets List */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "20px",
                    boxShadow: darkMode
                        ? "0 8px 30px rgba(0,0,0,0.3)"
                        : "0 8px 30px rgba(0,0,0,0.08)",
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            py: 12,
                            flexDirection: "column",
                            gap: 3,
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
                            Loading your amazing snippets...
                        </Typography>
                    </Box>
                ) : snippets.length === 0 ? (
                    <Box
                        className="empty-state"
                        sx={{ textAlign: "center", py: 12 }}
                    >
                        <FilterList
                            sx={{
                                fontSize: 80,
                                color: darkMode ? "#475569" : "#d1d5db",
                                mb: 3,
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 2,
                                color: darkMode ? "#f1f5f9" : "#374151",
                                fontWeight: 700,
                            }}
                        >
                            {hasActiveFilters
                                ? "No matching snippets found"
                                : "No snippets yet"}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                mb: 4,
                                maxWidth: "500px",
                                mx: "auto",
                            }}
                        >
                            {hasActiveFilters
                                ? "Try adjusting your search criteria or clear the filters to see all snippets."
                                : "Create your first code snippet to start building your personal collection!"}
                        </Typography>
                        {hasActiveFilters ? (
                            <Button
                                variant="contained"
                                onClick={clearFilters}
                                startIcon={<Clear />}
                                sx={{
                                    borderRadius: "12px",
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                }}
                            >
                                Clear All Filters
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setEditSnippet(null);
                                    setShowEditor(true);
                                    setError("");
                                }}
                                startIcon={<Add />}
                                sx={{
                                    borderRadius: "12px",
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }}
                            >
                                Create Your First Snippet
                            </Button>
                        )}
                    </Box>
                ) : (
                    <SnippetList
                        snippets={snippets}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleLike={handleToggleLike}
                        onShare={handleShare}
                        user={user}
                        viewMode={viewMode}
                        selectedSnippets={selectedSnippets}
                        onSelectionChange={setSelectedSnippets}
                    />
                )}
            </Paper>

            {/* Pagination */}
            {!loading && snippets.length > 0 && pagination.pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: "16px",
                            border: `1px solid ${
                                darkMode ? "#374151" : "#e5e7eb"
                            }`,
                            backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                disabled={!pagination.hasPrev}
                                onClick={() =>
                                    loadSnippets(pagination.current - 1)
                                }
                                sx={{
                                    borderRadius: "12px",
                                    px: 3,
                                    fontWeight: 600,
                                }}
                            >
                                Previous
                            </Button>
                            <Typography
                                sx={{
                                    px: 4,
                                    py: 1,
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    backgroundColor: darkMode
                                        ? "#334155"
                                        : "#f8fafc",
                                    borderRadius: "8px",
                                }}
                            >
                                Page {pagination.current} of {pagination.pages}
                            </Typography>
                            <Button
                                variant="outlined"
                                disabled={!pagination.hasNext}
                                onClick={() =>
                                    loadSnippets(pagination.current + 1)
                                }
                                sx={{
                                    borderRadius: "12px",
                                    px: 3,
                                    fontWeight: 600,
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* Dialogs */}
            <CollectionDialog
                open={showCollectionDialog}
                onClose={() => setShowCollectionDialog(false)}
                onSuccess={handleCollectionCreated}
            />

            <ShareDialog
                open={showShareDialog}
                snippet={shareSnippet}
                onClose={() => {
                    setShowShareDialog(false);
                    setShareSnippet(null);
                }}
            />

            <ExportDialog
                open={showExportDialog}
                snippets={
                    selectedSnippets.length > 0 ? selectedSnippets : snippets
                }
                onClose={() => {
                    setShowExportDialog(false);
                    setSelectedSnippets([]);
                }}
            />
        </Container>
    );
};

export default Dashboard;
