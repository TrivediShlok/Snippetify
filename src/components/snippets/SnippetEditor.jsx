import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Switch,
    Paper,
    Grid,
    Chip,
    Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const LANGUAGES = [
    "javascript",
    "python",
    "java",
    "c",
    "cpp",
    "go",
    "ruby",
    "php",
    "typescript",
    "html",
    "css",
    "sql",
    "bash",
    "json",
    "xml",
];

const SnippetEditor = ({
    onSave,
    initialData,
    isEditing,
    isSaving,
    onCancel,
}) => {
    const [tagInput, setTagInput] = useState("");

    const { handleSubmit, control, reset, watch, setValue } = useForm({
        defaultValues: initialData || {
            title: "",
            description: "",
            code: "",
            language: "javascript",
            tags: [],
            isPublic: false,
        },
    });

    const currentTags = watch("tags") || [];

    const handleTagAdd = () => {
        if (
            tagInput.trim() &&
            !currentTags.includes(tagInput.trim().toLowerCase())
        ) {
            const newTags = [...currentTags, tagInput.trim().toLowerCase()];
            setValue("tags", newTags);
            setTagInput("");
        }
    };

    const handleTagDelete = (tagToDelete) => {
        const newTags = currentTags.filter((tag) => tag !== tagToDelete);
        setValue("tags", newTags);
    };

    const handleTagKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleTagAdd();
        }
    };

    const handleReset = () => {
        reset(initialData);
        setTagInput("");
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
                {isEditing ? "Edit Snippet" : "Create New Snippet"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSave)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Title is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Snippet Title"
                                    fullWidth
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Controller
                            name="language"
                            control={control}
                            rules={{ required: "Language is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Programming Language"
                                    fullWidth
                                    margin="normal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang.toUpperCase()}
                                        </option>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description (Optional)"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="code"
                            control={control}
                            rules={{ required: "Code is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Code"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={8}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    sx={{
                                        "& .MuiInputBase-input": {
                                            fontFamily:
                                                'Monaco, Consolas, "Courier New", monospace',
                                            fontSize: "14px",
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Tags
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Add Tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagKeyPress}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                            <Button
                                onClick={handleTagAdd}
                                variant="outlined"
                                size="small"
                            >
                                Add
                            </Button>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {currentTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagDelete(tag)}
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="isPublic"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                        />
                                    }
                                    label="Make this snippet public"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSaving}
                                size="large"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : isEditing
                                    ? "Update Snippet"
                                    : "Create Snippet"}
                            </Button>

                            <Button
                                onClick={handleReset}
                                variant="outlined"
                                disabled={isSaving}
                            >
                                Reset
                            </Button>

                            {onCancel && (
                                <Button
                                    onClick={onCancel}
                                    variant="text"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default SnippetEditor;
