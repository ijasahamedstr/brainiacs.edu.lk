import React from "react";
import { Box, Container, Typography } from "@mui/material";

const About: React.FC = () => {
  const steps = [
    { number: "1700+", label: "current students" },
    { number: "800+", label: "alumni" },
    { number: "1000+", label: "annual enrollments" },
  ];

  return (
    <Container maxWidth={false} disableGutters sx={{ p: 0, m: 0, width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          py: { xs: "80px", md: "120px" }, // More vertical breathing room
          backgroundColor: { xs: "#FAFAFA", md: "transparent" },
          backgroundImage: {
            xs: "none",
            md: "url('https://i.ibb.co/v6rL5NRm/about-bg.webp')",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          minHeight: "90vh",
        }}
      >
        <Box
          sx={{
            width: "100%",
            // EXTREME PADDING: Increased for more left/right space
            px: { xs: 4, md: 12, lg: 20, xl: 30 }, 
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { lg: 15 }, // Large gap between the two columns
          }}
        >
          {/* LEFT COLUMN: Content Section */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "0 1 50%" },
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                color: "#1a2b3c",
                mb: 1,
                fontSize: { xs: "2.2rem", md: "2.8rem", lg: "2.8rem" },
                // Change this value to make the space smaller
                letterSpacing: "1.5px", 
                lineHeight: 1.1,
                textTransform: "none", // Ensures it stays "Brainiacs Campus" and not uppercase
              }}
            >
              Brainiacs Campus
          </Typography>

            <Typography
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                color: "#0a5397",
                mb: 4,
                fontSize: { xs: "0.9rem", md: "0.9rem" },
                textTransform: "uppercase",
                letterSpacing: "4px",
              }}
            >
              is not just about Higher Education, it's more than that
            </Typography>

            <Box sx={{ maxWidth: "600px", mb: 6 }}>
              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  mb: 3,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  lineHeight: 1.7,
                  color: "#2d3436",
                  fontWeight: 500,
                  borderLeft: "5px solid #35b74b",
                  pl: 4,
                }}
              >
                Witness Lyceum Campus symbolizing great significance among all with a vision of facilitating and guiding young souls on their journey of learning.
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  lineHeight: 1.7,
                  color: "#555",
                }}
              >
                The perfect blend of knowledge, continuous learning, and global integration. Lyceum Campus is geared to provide unwavering support to all students.
              </Typography>
            </Box>

            {/* Stats Cards - ORIGINAL EFFECTS APPLIED */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {steps.map((step, index) => (
                <Box
                  key={step.number}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    pl: 4,
                    minWidth: "190px",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e0e0e0",
                    position: "relative",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    animation: `fadeInUp 0.6s ease forwards ${index * 0.15}s`,
                    opacity: 0,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#35b74b",
                      transform: "translateX(12px)", // Original slide effect
                      boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                      "& .left-accent": { height: "100%", background: "#35b74b" }
                    },
                  }}
                >
                  <Box
                    className="left-accent"
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "6px",
                      height: "45%",
                      bgcolor: "#0a5397",
                      transition: "0.4s ease",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: "#0a5397",
                      mb: 0.2,
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#1a2b3c",
                      textTransform: "capitalize",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT COLUMN: Visual Section */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "0 1 40%" },
              display: { xs: "none", lg: "flex" },
              justifyContent: "flex-end", // Push image to the far right
            }}
          >
           
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
};

export default About;