import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  useMediaQuery,
  Stack,
  Container,
  Tooltip,
  Fade,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  LocalPhoneRounded as Phone,
  EmailRounded as Email,
  LocationOnRounded as LocationOn,
  ArrowForwardIosRounded as ArrowIcon,
} from "@mui/icons-material";

/**
 * Topbar Component - Optimized for Brainiacs Edu
 * Font: Montserrat (Global)
 * Features: Responsive, Animated Gradient, Scroll-Aware
 */
const Topbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Responsive Breakpoints
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:1150px)");
  const isDesktop = useMediaQuery("(min-width:1151px)");

  // Detect Scroll for Glassmorphism Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Centralized Style Objects for Cleanliness
  const contactItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1.2,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      "& svg": { color: "#fff" },
    },
  };

  const navLinkStyle = {
    fontSize: { xs: "0.75rem", md: "0.85rem" },
    fontWeight: 600,
    color: "inherit",
    textDecoration: "none",
    fontFamily: '"Montserrat", sans-serif',
    transition: "0.3s",
    letterSpacing: "0.3px",
    "&:hover": { 
      color: "#35b34e",
      textShadow: "0px 0px 8px rgba(53, 179, 78, 0.5)"
    },
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,
        // Font Family applied to the entire root container
        fontFamily: '"Montserrat", sans-serif',
        color: "#ffffff",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        
        // Background logic
        background: scrolled 
          ? "rgba(15, 15, 15, 0.98)" 
          : "linear-gradient(135deg, #121212 0%, #2a2a2a 50%, #121212 100%)",
        backgroundSize: "200% 200%",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled 
          ? "2px solid #35b34e" 
          : "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: scrolled 
          ? "0px 10px 30px rgba(0,0,0,0.5)" 
          : "none",
        py: scrolled ? 1 : 1.8,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT: HELP & CONTACT INFO */}
          <Stack direction="row" spacing={{ xs: 2, md: 5 }} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(53, 179, 78, 0.2)",
                  borderRadius: "8px",
                  p: 0.8,
                  animation: "pulse 2s infinite",
                }}
              >
                <SupportAgentIcon
                  sx={{
                    color: "#35b34e",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#35b34e",
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.95rem" },
                    fontFamily: '"Montserrat", sans-serif',
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    lineHeight: 1,
                  }}
                >
                  {isMobile ? "Assistance" : "Need Assistance?"}
                </Typography>
                {!isMobile && (
                  <Typography
                    sx={{
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Contact our support team
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* CONTACT LINKS - Hidden on Mobile */}
            {!isMobile && (
              <Fade in timeout={1000}>
                <Stack direction="row" spacing={4} alignItems="center">
                  {/* Phone Section */}
                  <Box sx={contactItemStyle}>
                    <Phone sx={{ color: "#35b34e", fontSize: "1.1rem" }} />
                    <Link href="tel:+94672260200" sx={navLinkStyle}>
                      (+94) 672260200
                    </Link>
                  </Box>

                  {/* Email Section - Desktop Only */}
                  {isDesktop && (
                    <Box sx={contactItemStyle}>
                      <Email sx={{ color: "#35b34e", fontSize: "1.1rem" }} />
                      <Link href="mailto:info@brainiacs.edu.lk" sx={navLinkStyle}>
                        info@brainiacs.edu.lk
                      </Link>
                    </Box>
                  )}

                  {/* Location Section - Desktop Only */}
                  {!isTablet && isDesktop && (
                    <Box sx={contactItemStyle}>
                      <LocationOn sx={{ color: "#35b34e", fontSize: "1.1rem" }} />
                      <Tooltip title="Visit Sammanthurai Office" arrow>
                        <Typography sx={{ ...navLinkStyle, cursor: "pointer" }}>
                          No. 100, Alivanniyar Road, Sammanthurai
                        </Typography>
                      </Tooltip>
                    </Box>
                  )}
                </Stack>
              </Fade>
            )}
          </Stack>

          {/* RIGHT: ANIMATED INQUIRY BUTTON */}
          <Box>
            <Button
              variant="contained"
              component={RouterLink}
              to="/inquiries"
              endIcon={!isMobile && <ArrowIcon sx={{ fontSize: "10px !important" }} />}
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                borderRadius: "50px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.8, sm: 1.2 },
                color: "#fff",
                background: "linear-gradient(90deg, #35b34e, #2ecc71, #2ecc71, #35b34e)",
                position: "relative",
                zIndex: 1,
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                transition: "all 0.4s ease",

                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: "52px",
                  padding: "2px",
                  background: "linear-gradient(90deg, #35b34e, #2ecc71, #3498db, #35b34e)",
                  backgroundSize: "300% 300%",
                  animation: "borderRotate 3s linear infinite",
                  zIndex: -1,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                },

                "&:hover": {
                  transform: "scale(1.03) translateY(-2px)",
                  backgroundColor: "rgba(53, 179, 78, 0.1)",
                  boxShadow: "0 8px 25px rgba(53, 179, 78, 0.4)",
                  "& .MuiButton-endIcon": {
                    transform: "translateX(4px)",
                    transition: "0.3s",
                  },
                },

                // Custom Keyframes
                "@keyframes borderRotate": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(53, 179, 78, 0.4)" },
                  "70%": { transform: "scale(1.1)", boxShadow: "0 0 0 10px rgba(53, 179, 78, 0)" },
                  "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(53, 179, 78, 0)" },
                },
              }}
            >
              {isMobile ? "Inquire" : "Inquire Here"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Topbar;