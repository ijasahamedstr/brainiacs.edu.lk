import React from "react";
import { Box, Typography, Button, Link, useMediaQuery } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";

const Topbar: React.FC = () => {
  // Responsive breakpoints
  const isPhone = useMediaQuery("(max-width:767px)");
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1366px)");

  if (isPhone) return null; // Hidden on small phones

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        bgcolor: "#222",
        color: "#fff",
        px: { sm: 3, md: 6 },
        py: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        overflow: "hidden",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      {/* Left: Contact Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { sm: 2, md: 4 },
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#35b34e",
            fontSize: { sm: "0.9rem", md: "1rem",fontFamily: '"Montserrat", sans-serif', },
          }}
        >
          Need Assistance? Contact Us:
        </Typography>

        {/* Tablet — Only Phone & Email */}
        {isTablet ? (
          <>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                "&:hover": { color: "#35b34e" },
              }}
            >
              <Phone sx={{ mr: 1, fontSize: "1rem" }} />
              <Link
                href="tel:+94672260200"
                underline="none"
                color="inherit"
                sx={{ "&:hover": { color: "#35b34e" },fontFamily: '"Montserrat", sans-serif', }}
              >
                (+94) 672260200
              </Link>
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                "&:hover": { color: "#35b34e" },
              }}
            >
              <Email sx={{ mr: 1, fontSize: "1rem" }} />
              <Link
                href="mailto:info@brainiacs.edu.lk"
                underline="none"
                color="inherit"
                sx={{ "&:hover": { color: "#35b34e" },fontFamily: '"Montserrat", sans-serif', }}
              >
                info@brainiacs.edu.lk
              </Link>
            </Typography>
          </>
        ) : (
          /* Desktop — All Details */
          <>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                "&:hover": { color: "#35b34e" },
              }}
            >
              <Phone sx={{ mr: 1, fontSize: "1rem" }} />
              <Link
                href="tel:+94672260200"
                underline="none"
                color="inherit"
                sx={{ "&:hover": { color: "#35b34e" },fontFamily: '"Montserrat", sans-serif', }}
              >
                (+94) 672260200
              </Link>
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                "&:hover": { color: "#35b34e" },
              }}
            >
              <Email sx={{ mr: 1, fontSize: "1rem" }} />
              <Link
                href="mailto:info@brainiacs.edu.lk"
                underline="none"
                color="inherit"
                sx={{ "&:hover": { color: "#35b34e" }, fontFamily: '"Montserrat", sans-serif', }}
              >
                info@brainiacs.edu.lk
              </Link>
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
                "&:hover": { color: "#35b34e" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              <LocationOn sx={{ mr: 1, fontSize: "1rem" }} />
              No. 100, Alivanniyar Road, Sammanthurai
            </Typography>
          </>
        )}
      </Box>

      {/* Right: Animated Gradient Button (Tablet & Desktop) */}
      <Button
        variant="outlined"
        size="small"
        href="#contact"
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          fontSize: { xs: "0.85rem", sm: "0.95rem" },
          border: "none",
          borderRadius: "20px",
          paddingX: 3,
          color: "#35b34e",
          position: "relative",
          zIndex: 0,
          fontFamily: '"Montserrat", sans-serif',

          "&:before": {
            content: '""',
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: "22px",
            padding: "2px",
            background:
              "linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #7b2ff7, #ff0080)",
            backgroundSize: "300% 300%",
            animation: "gradient 4s linear infinite",
            zIndex: -1,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          },

          "&:hover": {
            bgcolor: "#0a5297",
            color: "white",
            borderColor: "#0a5297",
          },

          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        Inquire Here
      </Button>
    </Box>
  );
};

export default Topbar;
