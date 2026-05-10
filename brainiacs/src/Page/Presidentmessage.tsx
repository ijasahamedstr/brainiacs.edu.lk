import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const Presidentmessage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#fff", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 4 },
            alignItems: { xs: "center", md: "flex-start" }, // center on mobile/tablet
            pt: { xs: 10, md: 15 }, 
          }}
        >
          {/* Column 1 - Title */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              mx: { xs: "auto", md: 0 }, // center horizontally on mobile/tablet
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              color="#002D72"
              sx={{
                lineHeight: 1.3,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Message <br /> from <br /> President
            </Typography>
          </Box>

          {/* Column 2 - Image with Special Effect */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              mx: { xs: "auto", md: 0 }, // center horizontally on mobile/tablet
              perspective: "1000px",
            }}
          >
            <Box
              component="img"
              src="https://i.ibb.co/sdh9h32R/Gemini-Generated-Image-n6ky85n6ky85n6ky.png"
              alt="President"
              sx={{
                width: "100%",
                maxWidth: 250,
                borderRadius: "10px",
                transition: "transform 0.5s, box-shadow 0.5s",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                "&:hover": {
                  transform: "scale(1.05) rotate(-2deg)",
                  boxShadow: "0 20px 30px rgba(0,0,0,0.3)",
                },
              }}
            />
          </Box>

          {/* Column 3 - Message & Name */}
          <Box sx={{ flex: 2 }}>
            <Box
              sx={{
                borderTop: "4px solid #002D72",
                pt: 2,
              }}
            >
              {/* Top Quote Inline (Flipped) */}
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <FormatQuoteIcon
                  sx={{
                    color: "#c00",
                    fontSize: 40,
                    mr: 1,
                    transform: "scaleX(-1)",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333",
                    lineHeight: 1.8,
                    textAlign: "justify",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  BMS is a provider of high-quality education in association with
                  the best of British universities. We are committed to providing
                  the best study opportunities for both school leavers and those who
                  are working or thinking of returning to study, with our very
                  successful concept of ‘Managing Work, Study & Home’. We are
                  equipped with excellent, well-qualified academic staff; a
                  supportive, student-friendly learning environment; and
                  state-of-the-art facilities to give you the best learning
                  experience. We are thankful to you for taking the time to consider
                  BMS as your study option. Our team looks forward to welcoming you
                  at BMS, where we know you will have a pleasant, enjoyable,
                  challenging and successful journey.
                  {/* Bottom Quote Inline */}
                  <FormatQuoteIcon
                    sx={{
                      color: "#c00",
                      fontSize: 40,
                      ml: 1,
                      verticalAlign: "bottom",
                    }}
                  />
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  p: 3, 
                  backgroundColor: "#fff", 
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  borderLeft: "6px solid #002D72",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateX(10px)" }
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#002D72", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Dr. A L Joufer Sadique
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ 
                    display: "block", 
                    mt: 1, 
                    color: "text.secondary", 
                    lineHeight: 1.5,
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  B.Sc (Hons), PGDM, FCPM, and D.Lit (Honorary) <br />
                  <strong>Retired University Registrar</strong> | Chairman of the Board of Governors
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Presidentmessage;
