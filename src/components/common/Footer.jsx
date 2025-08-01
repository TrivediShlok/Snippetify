import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            sx={{
                p: 2,
                textAlign: "center",
                borderTop: "1px solid #eee",
                bgcolor: "#fafafa",
                mt: "auto",
            }}
        >
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Snippetify - Code Snippet Vault
            </Typography>
        </Box>
    );
};

export default Footer;
