import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Alert,
  Link
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Updated interface to match your Mongoose Schema
interface PartnerData {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description: string[];
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch partners from the database
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const baseUrl = API_BASE_URL?.replace(/\/$/, "") || "";
        const response = await fetch(`${baseUrl}/api/partners`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch partners data");
        }
        
        const data = await response.json();
        // Adjust this depending on your API response structure (e.g., if it sends { success: true, data: [...] })
        setPartners(data.data || data); 
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <>
      {/* 🔵 Blue Header */}
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Our Partners
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* ⚪ Partner Sections */}
      {!loading && !error && partners.length > 0 && partners.map((partner, index) => (
        <React.Fragment key={partner._id || index}>
          <Container sx={{ py: 6, textAlign: "center" }}>
            
            {/* Logo linked to websiteUrl if it exists */}
            <Box 
              component={partner.websiteUrl ? "a" : "div"} 
              href={partner.websiteUrl} 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-block', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={partner.logoUrl}
                alt={partner.name}
                sx={{
                  width: "220px",
                  height: "auto",
                  mb: 3,
                  cursor: partner.websiteUrl ? "pointer" : "default",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: partner.websiteUrl ? "scale(1.05)" : "none"
                  }
                }}
              />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontFamily: '"Montserrat", sans-serif',
                color: "#2b2b2b",
                fontSize: { xs: "1.2rem", md: "1.5rem" }
              }}
            >
              {partner.name}
            </Typography>

            {/* Description mapping (Since your DB uses an array of strings for paragraphs) */}
            <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
              {partner.description.map((paragraph, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.9,
                    fontFamily: '"Montserrat", sans-serif',
                    textAlign: "justify",
                    mb: 2, // Space between paragraphs
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
            
            {/* Optional text link to website */}
            {partner.websiteUrl && (
              <Link 
                href={partner.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{
                  display: "inline-block",
                  mt: 3,
                  fontFamily: '"Montserrat", sans-serif',
                  color: "#1E56A0",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Visit Website
              </Link>
            )}
          </Container>

          {/* Section Divider */}
          {index !== partners.length - 1 && (
            <Box sx={{ backgroundColor: "#f6f6f6", height: "60px" }} />
          )}
        </React.Fragment>
      ))}

      {/* Fallback if no partners found */}
      {!loading && !error && partners.length === 0 && (
        <Typography align="center" sx={{ py: 10, color: "#555" }}>
          No partners currently listed.
        </Typography>
      )}
    </>
  );
};

export default Partners;