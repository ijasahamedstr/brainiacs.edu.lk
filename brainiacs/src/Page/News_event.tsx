import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CampaignIcon from "@mui/icons-material/Campaign";
import AddIcon from "@mui/icons-material/Add";

const NewsEvent: React.FC = () => {
  const secondaryNews = [
    { title: "Orientation Week Kicks Off", date: "Oct 10, 2025", category: "Campus" },
    { title: "New Scholarship Program", date: "Sep 28, 2025", category: "Finance" },
    { title: "Industry Meet: Tech Careers", date: "Aug 15, 2025", category: "Career" },
    { title: "Global Research Symposium", date: "Aug 05, 2025", category: "Academic" },
  ];

  const featuredNews = {
    title: "ESOFT Metro Campus Awards Ceremony 2025",
    date: "September 12, 2025",
    description:
      "A night of excellence at the BMICH, celebrating the remarkable achievements of over 1,300 graduates paving their way into the future.",
    image: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/new-student-council-installation-lyceum-campus-1-1.webp"
  };

  const primaryFont = '"Montserrat", sans-serif';
  const brandBlue = "#0054f8";

  return (
    <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Box 
        sx={{ 
          display: "grid", 
          gap: 4, 
          gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.8fr" },
          alignItems: "stretch"
        }}
      >
        
        {/* LEFT COLUMN: Featured News */}
        <Box sx={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                fontFamily: primaryFont, 
                color: "#0b1033",
                // Responsive Font Size:
                fontSize: { 
                  xs: '1.25rem', // Smaller size for mobile (0px+)
                  sm: '1.75rem', // Medium size for tablets (600px+)
                  md: '2.125rem' // Default h4 size for desktop (900px+)
                }
              }}
            >
              Latest News
            </Typography>
            </Stack>
            
            {/* Added: View All for Latest News */}
            <Typography 
              sx={{ 
                color: brandBlue, 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center",
                gap: 0.5,
                fontFamily: primaryFont,
                fontSize: "0.9rem",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              View All <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&:hover": { transform: "translateY(-8px)" }
            }}
          >
            <Box
              component="img"
              src={featuredNews.image}
              sx={{
                width: "100%",
                height: { xs: 450, md: 550 }, // Slightly taller on mobile for text room
                objectFit: "cover",
                display: "block"
              }}
            />

            {/* IMPROVED GRADIENT: Darker at bottom, clear at top for text legibility */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100%", // Full height overlay for consistent shading
                background: "linear-gradient(to top, rgba(11, 16, 51, 0.95) 5%, rgba(11, 16, 51, 0.6) 40%, transparent 90%)",
                p: { xs: 3, md: 6 }, // Reduced padding on mobile
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end", // Pushes text to bottom
                color: "white"
              }}
            >
              {/* Category Label */}
              <Typography 
                sx={{ 
                  textTransform: "uppercase", 
                  letterSpacing: 2, 
                  fontWeight: 800, 
                  fontSize: { xs: "0.65rem", md: "0.75rem" }, 
                  color: brandBlue,
                  mb: 1,
                  fontFamily: primaryFont,
                  textShadow: "0px 2px 4px rgba(0,0,0,0.3)" // Adds depth
                }}
              >
                Featured Event
              </Typography>

              {/* Title */}
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1, 
                  fontSize: { xs: "1.6rem", md: "2.5rem" }, // Responsive sizing
                  fontFamily: primaryFont,
                  lineHeight: 1.2,
                  textShadow: "0px 2px 10px rgba(0,0,0,0.5)"
                }}
              >
                {featuredNews.title}
              </Typography>

              {/* Description - Smaller & Hidden on very small screens if needed */}
              <Typography 
                sx={{ 
                  opacity: 0.95, 
                  mb: 3, 
                  maxWidth: "600px", 
                  fontSize: { xs: "0.9rem", md: "1.1rem" }, // Smaller on mobile
                  fontFamily: primaryFont,
                  lineHeight: 1.5,
                  display: { xs: "-webkit-box", sm: "block" }, // Clamp text on mobile
                  overflow: "hidden",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}
              >
                {featuredNews.description}
              </Typography>
              
              {/* Actions & Responsive Time */}
              <Stack 
                direction={{ xs: "column", sm: "row" }} // Stack on mobile, row on tablet+
                spacing={{ xs: 2, sm: 3 }} 
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: brandBlue,
                    borderRadius: "50px",
                    px: { xs: 3, md: 4 },
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    fontFamily: primaryFont,
                    boxShadow: `0 8px 20px ${brandBlue}44`,
                    "&:hover": { bgcolor: "#0041c2" }
                  }}
                >
                  Read Full Story
                </Button>

                {/* DATE/TIME - SMALLER ON MOBILE */}
                <Typography 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1, 
                    fontSize: { xs: "0.8rem", md: "0.95rem" }, // Responsive Time Font
                    fontWeight: 600,
                    fontFamily: primaryFont,
                    color: "rgba(255,255,255,0.8)"
                  }}
                >
                  <EventAvailableIcon sx={{ fontSize: { xs: 18, md: 20 } }} /> {featuredNews.date}
                </Typography>
              </Stack>
            </Box>
          </Box>

    
        </Box>

        {/* RIGHT COLUMN: Event Feed */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800, 
                fontFamily: primaryFont, 
                color: "#0b1033" 
              }}
            >
              Upcoming Events
            </Typography>
            <Typography 
              sx={{ 
                color: brandBlue, 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center",
                gap: 0.5,
                fontFamily: primaryFont,
                fontSize: "0.9rem",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              View All <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
            </Typography>
          </Box>

          <Stack spacing={2}>
            {secondaryNews.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  border: "1px solid #edf2f7",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: brandBlue,
                    boxShadow: "0 10px 30px rgba(0, 84, 248, 0.08)",
                    transform: "translateX(10px)",
                    "& .icon-box": { bgcolor: brandBlue, color: "white", transform: "rotate(-10deg)" }
                  },
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f8f9fc",
                    color: "#0b1033",
                    mr: 2,
                    transition: "0.4s ease"
                  }}
                >
                  <CampaignIcon />
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    sx={{ 
                      fontSize: "0.7rem", 
                      fontWeight: 800, 
                      color: brandBlue, 
                      textTransform: "uppercase",
                      fontFamily: primaryFont 
                    }}
                  >
                    {item.category}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontWeight: 700, 
                      color: "#0b1033", 
                      lineHeight: 1.2, 
                      my: 0.5,
                      fontFamily: primaryFont 
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontSize: "0.85rem", 
                      color: "#718096",
                      fontFamily: primaryFont 
                    }}
                  >
                    {item.date}
                  </Typography>
                </Box>
                
                <ArrowForwardIosIcon sx={{ fontSize: 14, color: "#cbd5e0" }} />
              </Box>
            ))}
            
            <Button
                variant="text"
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                    py: 1.5,
                    borderRadius: "12px",
                    color: "#718096",
                    fontFamily: primaryFont,
                    fontWeight: 600,
                    "&:hover": {
                        color: brandBlue,
                        bgcolor: "rgba(0, 84, 248, 0.04)"
                    }
                }}
            >
                Load More Events
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default NewsEvent;