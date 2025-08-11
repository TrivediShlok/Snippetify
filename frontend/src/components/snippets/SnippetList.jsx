import React from "react";
import { Typography, Box } from "@mui/material";
import SnippetCard from "./SnippetCard";

const SnippetList = ({ snippets, onEdit, onDelete, showActions = true }) => {
    if (!snippets || snippets.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary">
                    No snippets found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create your first snippet to get started!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {snippets.map((snippet) => (
                <SnippetCard
                    key={snippet._id}
                    snippet={snippet}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showActions={showActions}
                />
            ))}
        </Box>
    );
};

export default SnippetList;
