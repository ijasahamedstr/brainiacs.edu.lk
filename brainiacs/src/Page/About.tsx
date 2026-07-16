import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";

// Initialize your environment variable
// The fallback || "" ensures the app doesn't break if the .env file is missing
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// 1. Define the shape of the data coming from your Mongoose schema
interface DBStat {
  _id: string;
  title: string;
  count: number;
  suffix: string;
  isActive: boolean;
}

// 2. Define the shape of the data your UI expects
interface StepUI {
  number: string;
  label: string;
}

const About: React.FC = () => {
  // Fallback data just in case the API goes down
  const defaultSteps: StepUI[] = [
    { number: "1700+", label: "current students" },
    { number: "800+", label: "alumni" },
    { number: "1000+", label: "annual enrollments" },
  ];

  const [steps, setSteps] = useState<StepUI[]>(defaultSteps);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch from your Express backend using the environment variable
        // Added a timestamp query parameter to strictly bypass browser caching
        const response = await fetch(`${API_BASE_URL}/api/member-count?t=${new Date().getTime()}`); 
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: DBStat[] = await response.json();

        // Filter out inactive stats and format them for the UI
        const formattedData = data
          .filter(stat => stat.isActive)
          .map(stat => ({
            number: `${stat.count}${stat.suffix || ''}`,
            label: stat.title
          }));

        // Only override the defaults if the database actually returned active stats
        if (formattedData.length > 0) {
          setSteps(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch stats, using default data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ p: 0, m: 0, width: "100%", overflowX: "hidden" }}
    >
      <Box
        sx={{
          width: "100%",
          py: { xs: 6, sm: 8, md: 12, lg: 15 },
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
          minHeight: { xs: "auto", md: "90vh" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            px: {
              xs: 2,
              sm: 4,
              md: "clamp(40px, 8vw, 120px)",
              lg: "clamp(100px, 12vw, 300px)"
            },
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 6, lg: 10 },
          }}
        >
          {/* LEFT COLUMN: Content Section */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "0 1 55%" },
              textAlign: "left",
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                color: "#1a2b3c",
                mb: 1,
                fontSize: {
                  xs: "clamp(1.8rem, 5vw, 2.2rem)",
                  md: "clamp(2.2rem, 4vw, 3.2rem)"
                },
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
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
                fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                textTransform: "uppercase",
                letterSpacing: { xs: "2px", md: "4px" },
                lineHeight: 1.4,
              }}
            >
              IS NOT JUST A PLACE TO STUDY, IT'S A PLACE TO GROW
            </Typography>

            <Box sx={{ maxWidth: "700px", mb: 6 }}>
              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  mb: 3,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.7,
                  color: "#2d3436",
                  fontWeight: 500,
                  borderLeft: "5px solid #35b74b",
                  pl: { xs: 2, md: 4 },
                }}
              >
                Discover Brainiacs Campus standing as a beacon of opportunity for all, driven by a mission to nurture and empower young minds on their path to success.
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.7,
                  color: "#555",
                }}
              >
                Combining knowledge, hands-on experience, and a global perspective. Brainiacs Campus is committed to offering steady guidance to every learner.
              </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{
              display: "flex",
              gap: { xs: 2, md: 2.5 },
              flexDirection: { xs: "column", sm: "row" },
              width: "100%",
              minHeight: "80px", // Prevents layout shift while loading
            }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
                  <CircularProgress size={30} sx={{ color: "#0a5397" }} />
                </Box>
              ) : (
                steps.map((step, index) => (
                  <Box
                    key={index} 
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 2, md: 2.5 },
                      pl: { xs: 3, md: 3 },
                      flex: 1,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e0e0e0",
                      position: "relative",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      animation: `fadeInUp 0.6s ease forwards ${index * 0.15}s`,
                      opacity: 0,
                      "&:hover": {
                        borderColor: "#35b74b",
                        transform: { xs: "translateY(-5px)", md: "translateX(12px)" },
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
                        fontSize: { xs: "1.3rem", md: "1.5rem" },
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
                        fontSize: { xs: "0.75rem", md: "0.85rem" },
                        fontWeight: 700,
                        color: "#1a2b3c",
                        textTransform: "capitalize",
                      }}
                    >
                      {step.label}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {/* RIGHT COLUMN */}
          <Box
            sx={{
              flex: { lg: "0 1 40%" },
              display: { xs: "none", lg: "flex" },
              justifyContent: "center",
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