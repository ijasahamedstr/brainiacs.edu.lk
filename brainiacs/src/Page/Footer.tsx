import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { 
  Facebook, 
  Instagram, 
  Email, 
  Phone, 
  WhatsApp 
} from "@mui/icons-material";

const Footer: React.FC = () => {
  const primaryFont = '"Montserrat", sans-serif';
  const brandBlue = "#0a5397"; // Your brand color

  // Social Media Data with Custom Brand Colors
  const socialLinks = [
    { icon: <Phone fontSize="small" />, link: "tel:+974502260200", color: "#4caf50" },
    { icon: <WhatsApp fontSize="small" />, link: "https://wa.me/974502260200", color: "#25D366" },
    { icon: <Email fontSize="small" />, link: "mailto:info@almtcqatar.com", color: "#EA4335" },
    { icon: <Facebook fontSize="small" />, link: "https://facebook.com", color: "#1877F2" },
    { icon: <Instagram fontSize="small" />, link: "https://instagram.com", color: "#E4405F" },
  ];

  return (
    <Box component="footer" sx={{ fontFamily: primaryFont }}>
      {/* Main Footer Section */}
      <Box
        sx={{
          backgroundColor: "#7a7676", // Dark grey background
          color: "#fff",
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Logo & Social Icons */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "30%" },
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp"
                alt="MTC Logo"
                sx={{
                  width: 160,
                  height: "auto",
                  mb: 1,
                  // filter: "brightness(0) invert(1)", 
                }}
              />
              
              <Typography
                variant="body2"
                sx={{ 
                  fontWeight: 600, 
                  fontSize: "0.85rem", 
                  textTransform: "uppercase", 
                  letterSpacing: 1.5,
                  fontFamily: primaryFont,
                  opacity: 0.8
                }}
              >
                Connect with us
              </Typography>

              <Stack direction="row" spacing={1.5}>
                {socialLinks.map((item, index) => (
                  <IconButton
                    key={index}
                    href={item.link}
                    target="_blank"
                    sx={{
                      color: "#fff",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      width: 40,
                      height: 40,
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: item.color,
                        borderColor: item.color,
                        transform: "translateY(-5px)",
                        boxShadow: `0 10px 20px ${item.color}66`,
                      },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                borderColor: "rgba(255,255,255,0.15)",
              }}
            />

            {/* Address Section */}
            <Box sx={{ flexBasis: { xs: "100%", md: "25%" } }}>
              <Typography
                variant="h6"
                sx={{ 
                    mb: 3, 
                    fontSize: "0.95rem", 
                    fontWeight: 800, 
                    fontFamily: primaryFont,
                    color: brandBlue // Applied Heading Color
                }}
              >
                ADDRESS
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.8, opacity: 0.9, fontFamily: primaryFont }}
              >
                Al Mubthadieen Trading & Contracting (MTC)
                <br />
                P.O.BOX 23693,
                <br />
                Tel: +974 502260200,
                <br />
                Al Muntazah, Al Rawabi St, Doha,
                <br />
                Office Doha - Qatar
              </Typography>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" }, borderColor: "rgba(255,255,255,0.15)" }}
            />

            {/* Contact Section */}
            <Box sx={{ flexBasis: { xs: "100%", md: "20%" } }}>
              <Typography
                variant="h6"
                sx={{ 
                    mb: 3, 
                    fontSize: "0.95rem", 
                    fontWeight: 800, 
                    fontFamily: primaryFont,
                    color: brandBlue // Applied Heading Color
                }}
              >
                CONTACT
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body2" sx={{ fontFamily: primaryFont }}>
                  +94 672260200 <br /> +974 502260200
                </Typography>
                <Link
                  href="mailto:info@almtcqatar.com"
                  sx={{
                    color: "inherit",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    fontFamily: primaryFont,
                    fontWeight: 500,
                    "&:hover": { color: brandBlue }, // Links hover to brand blue
                  }}
                >
                  info@almtcqatar.com
                </Link>
              </Box>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" }, borderColor: "rgba(255,255,255,0.15)" }}
            />

            {/* Opening Hours */}
            <Box sx={{ flexBasis: { xs: "100%", md: "20%" } }}>
              <Typography
                variant="h6"
                sx={{ 
                    mb: 3, 
                    fontSize: "0.95rem", 
                    fontWeight: 800, 
                    fontFamily: primaryFont,
                    color: brandBlue // Applied Heading Color
                }}
              >
                OPENING HOURS
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.8, opacity: 0.9, fontFamily: primaryFont }}
              >
                Saturday - Thursday
                <br />
                8:00 AM - 6:00 PM
                <br />
                Friday: Closed
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Footer Bar */}
      <Box sx={{ backgroundColor: "#000", py: 2.5 }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontFamily: primaryFont }}
          >
            Copyright © 2026 | Al Mubthadieen Trading & Contracting (MTC)
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={2} 
            divider={<Typography sx={{ color: "rgba(255,255,255,0.2)" }}>|</Typography>}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {["Home", "Portfolio", "Project", "Expertise", "Contact us"].map((text) => (
              <Link
                key={text}
                href="#"
                sx={{
                  color: "#FFF",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontFamily: primaryFont,
                  transition: "color 0.2s",
                  "&:hover": { color: brandBlue }, // Bottom menu hover to brand blue
                }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;