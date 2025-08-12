import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import SnippetCard from "./SnippetCard";

const SnippetList = ({
    snippets = [],
    onEdit,
    onDelete,
    onToggleLike,
    user,
}) => {
    if (!Array.isArray(snippets) || snippets.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" sx={{ color: "#6b7280" }}>
                    No snippets to display
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {snippets.map((snippet) => (
                <Grid item xs={12} sm={6} lg={4} key={snippet._id}>
                    <SnippetCard
                        snippet={snippet}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleLike={onToggleLike}
                        user={user}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default SnippetList;
