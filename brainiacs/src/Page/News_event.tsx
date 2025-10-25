import React from "react";
import { Box, Container, Typography,Button } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";

const NewsEvent: React.FC = () => {
  const news = [
    { title: "Orientation Week Kicks Off", date: "Oct 10, 2025" },
    { title: "New Scholarship Program Announced", date: "Sep 28, 2025" },
    { title: "Industry Meet: Careers in Tech", date: "Aug 15, 2025" },
    { title: "Industry Meet: Careers in Tech", date: "Aug 15, 2025" },
  ];

  const news1 = [
  {
    title: "ESOFT Metro Campus Awards Ceremony 2025",
    date: "September 12, 2025",
    description:
      "The ESOFT Metro Campus Awards Ceremony was held on 12th September 2025 at the prestigious BMICH, celebrating the remarkable achievements of over 1,300 students.",
  },
];

  return (
    <Container maxWidth={false} disableGutters sx={{ p: 0, m: 0, width: "100%" }}>
      <Box sx={{ width: "100%", mt: 0 }}>
        <Box
          sx={{
            width: "100%",
            py: { xs: 6, md: 10 },
            fontFamily: '"Montserrat", sans-serif',
            display: "grid",
            gap: 0,
            alignItems: "stretch",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.2fr 0.9fr 1fr" },
          }}
        >
          {/* Column 1 — Image */}
          <Box
            sx={{
               backgroundColor: "#f8f9fc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              pt: { xs: 2, md: 4 }, // top spacing
              pb: { xs: 2, md: 4 }, // bottom spacing
            }}
          >
            <Box
              component="img"
              src="https://i.ibb.co/zWyQj3Yj/547227038-1191532979682125-4255025107900974708-n-1024x683.webp"
              alt="Brainiacs Campus"
              sx={{
                width: "100%",
                height: "100%",
                maxHeight: { xs: 300, sm: 412, md: 549 },
                pl: { sm: 3, md: 6 },
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Column 2 — Latest News */}
            <Box
            sx={{
                backgroundColor: "#f8f9fc",
                p: { xs: 3, sm: 5 },
            }}
            >
            {/* Header */}
            <Box
                sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#0b1033",
                  fontFamily: "'Montserrat', sans-serif",
                  position: "relative",
                  pb: "6px",
                  fontSize: {
                    xs: "22px", // Mobile
                    sm: "26px", // Tablet
                    md: "15px", // Small Laptop
                    lg: "25px", // Desktop
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: {
                      xs: "35px",
                      sm: "45px",
                      md: "55px",
                      lg: "65px",
                    },
                    height: "3px",
                    backgroundColor: "#e51b24",
                  },
                }}
              >
                Latest News
              </Typography>

                <Typography
                sx={{
                    color: "#0b1033",
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: "pointer",
                }}
                >
                All News →
                </Typography>
            </Box>

            {/* News Card */}
            {news1.map((item, i) => (
                <Box
                key={i}
                sx={{
                    borderRadius: 2,
                    p: { xs: 3, sm: 4 },
                    mb: 4,
                }}
                >
                {/* Date */}
                <Typography
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#555",
                    fontSize: "0.9rem",
                    mb: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    <EventNoteIcon sx={{ mr: 1, color: "#0a5397", fontSize: 20 }} />
                    {item.date}
                </Typography>

                {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#111",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: {
                    xs: "16px",  // 📱 Mobile
                    sm: "18px",  // 📱+ Tablet
                    md: "20px",  // 💻 Small Desktop
                    lg: "22px",  // 🖥️ Large Desktop
                  },
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </Typography>

                {/* Description */}
                <Typography
                    sx={{
                    color: "#555",
                    fontSize: "1rem",
                    mb: 3,
                    fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    {item.description}
                </Typography>

                {/* Read More Button */}
                <Button
                    variant="contained"
                    sx={{
                    backgroundColor: "#e51b24",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                    px: 3,
                    py: 1,
                    "&:hover": { backgroundColor: "#c41a21" },
                    }}
                >
                    Read More
                </Button>
                </Box>
            ))}
            </Box>

          {/* Column 3 — Latest Event */}
          <Box
            sx={{
              backgroundColor: "#0e072a",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 3,
            }}
          >

           {news.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  pl: { xs: 2, sm: 3, md: 6 }, // left padding only
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                  "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 4,
                backgroundColor: "#000", // change background to black
                color: "#fff", // change text color to white
                },
                }}
              >
                <EventNoteIcon sx={{ color: "#ffffffff" }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif",color: "#ffffffff" }}>{item.title}</Typography>
                  <Typography sx={{ fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif",color: "#ffffffff" }}>{item.date}</Typography>
                </Box>
              </Box>
            ))}

            <Typography sx={{ color: "#ffffffff", fontWeight: 700, cursor: "pointer",fontFamily: "'Montserrat', sans-serif", }}>
              View all news & events →
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NewsEvent;
