import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Rellax from "rellax";

// ✅ Swiper CSS imports
import "swiper/css";
import "swiper/css/pagination";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const LeadershipGovernance: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data from the database
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const baseUrl = API_BASE_URL?.replace(/\/$/, "") || "";
        const response = await fetch(`${baseUrl}/api/board-governance`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch board members data");
        }
        
        const data = await response.json();
        setMembers(data.data || data); 
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // 2. Initialize Rellax for parallax effects
  useEffect(() => {
    const rellax = new Rellax(".rellax");
    return () => {
      rellax.destroy();
    };
  }, []);

  return (
    <>
      {/* ---------------- COUNCIL MEMBERS SECTION ---------------- */}
      <Box
        sx={{
          backgroundColor: "#f9fbff",
          pt: { xs: 15, md: 25 },
          pb: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parallax Soft Blue Circle */}
        <Box
          className="rellax"
          data-rellax-speed="-2"
          sx={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "#cce4ff",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "text.secondary",
              mb: 1,
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Council Members
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "#0a5397",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Meet the Minds Shaping Campus Excellence
          </Typography>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Swiper Slider */}
          {!loading && !error && members.length > 0 && (
            <Swiper
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              loop={members.length >= 4} 
              // ✅ Updated Breakpoints for Perfect Centering on Mobile
              breakpoints={{
                // Tiny mobile devices (iPhone SE)
                320: { 
                  slidesPerView: 1, 
                  spaceBetween: 20,
                  centeredSlides: true 
                },
                // Standard mobile devices
                480: { 
                  slidesPerView: 1.2, 
                  spaceBetween: 20,
                  centeredSlides: true // <-- This ensures the card stays in the middle
                },
                // Tablets and up (Back to normal left-aligned grid)
                768: { 
                  slidesPerView: 2, 
                  spaceBetween: 30,
                  centeredSlides: false 
                },
                900: { 
                  slidesPerView: 3, 
                  spaceBetween: 30,
                  centeredSlides: false 
                },
                1200: { 
                  slidesPerView: 4, 
                  spaceBetween: 30,
                  centeredSlides: false 
                },
              }}
              modules={[Autoplay, Pagination]}
              style={{ paddingBottom: "50px" }}
            >
              {members.map((member, index) => (
                <SwiperSlide key={member._id || index}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: { xs: 320, sm: "100%" }, // Prevents cards from getting too wide on mobile
                      mx: "auto", // Centers the Box inside the SwiperSlide
                      height: 400,
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "rotateY(180deg)",
                      },
                      perspective: "1000px",
                    }}
                  >
                    {/* Front Side */}
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 3,
                        backfaceVisibility: "hidden",
                        textAlign: "center",
                        boxShadow: 3,
                        backgroundColor: "#fff",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={member.imageUrl}
                        alt={member.name}
                        sx={{
                          width: 220,
                          height: 220,
                          borderRadius: "50%",
                          objectFit: "cover",
                          mx: "auto",
                          mt: 3,
                        }}
                      />
                      <Box sx={{ py: 3, px: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.6,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          {member.jobDescription}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Back Side */}
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 3,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #1a237e, #3949ab)",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 3,
                        boxShadow: 4,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          opacity: 0.9,
                          mb: 2,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {member.jobDescription}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.7,
                          maxWidth: 240,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {member.detailedBio}
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Fallback if no members found */}
          {!loading && !error && members.length === 0 && (
            <Typography align="center" sx={{ color: "text.secondary", mt: 4 }}>
              No council members found.
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
};

export default LeadershipGovernance;