import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Fade,
  Stack,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Guidance: React.FC = () => {
  const primaryFont = "'Montserrat', sans-serif";
  const brandBlue = "#0a5397";
  const brandGreen = "#35b74b";

  const menuItemSX = { 
    fontFamily: primaryFont,
    fontSize: "0.9rem",
    "&:hover": { backgroundColor: "rgba(10, 83, 151, 0.08)" }
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    qualification: "",
    programme: "",
    email: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const message = `Hello I Need Guidance! %0A I'm ${form.firstName} ${form.lastName}.%0A Qualification: ${form.qualification}%0A Interest: ${form.programme}`;
    const phoneNumber = "+94768696704";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      fontFamily: primaryFont,
      backgroundColor: "#fff",
      borderRadius: "16px",
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:hover fieldset": { borderColor: brandBlue },
      "&.Mui-focused fieldset": { borderColor: brandBlue, borderWidth: "2px" },
    },
    "& .MuiInputLabel-root": { fontFamily: primaryFont, fontSize: "0.9rem" },
  };

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 12 }, bgcolor: "#f8fafc" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 0 },
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: "0 40px 80px -20px rgba(10, 83, 151, 0.15)",
            bgcolor: "#fff",
          }}
        >
          {/* LEFT COLUMN: BRAND NEW DIFFERENT STYLE */}
          <Box
            sx={{
              flexBasis: "45%",
              position: "relative",
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#f0f4f8",
              overflow: "hidden"
            }}
          >
            {/* Background Decorative Pattern */}
            <Box sx={{ 
                position: "absolute", 
                top: 20, 
                left: 20, 
                width: 100, 
                height: 100, 
                backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)", 
                backgroundSize: "15px 15px",
                opacity: 0.5 
            }} />

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                sx={{
                  fontFamily: primaryFont,
                  color: brandBlue,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  mb: 2,
                  display: "block"
                }}
              >
                Start Your Journey
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", md: "3.2rem" },
                  fontFamily: primaryFont,
                  lineHeight: 1.1,
                  color: "#0b1033",
                  mb: 3,
                }}
              >
                Shape Your <br />
                <span style={{ 
                    background: `linear-gradient(90deg, ${brandBlue}, ${brandGreen})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>Future</span> With Us
              </Typography>

              {/* Unique Image Presentation */}
              <Box sx={{ position: "relative", mt: 4, mb: 4 }}>
                <Box
                  component="img"
                  src="https://i.ibb.co/ynPqgtGS/form-image.png"
                  sx={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "30px 100px 30px 30px",
                    boxShadow: "20px 20px 60px rgba(0,0,0,0.1)",
                  }}
                />
                
                {/* Floating Badge 1 */}
                <Box sx={{
                    position: "absolute",
                    top: -20,
                    right: -10,
                    bgcolor: "#fff",
                    p: 2,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.9)"
                }}>
                    <VerifiedUserIcon sx={{ color: brandGreen }} />
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.8rem", color: "#0b1033" }}>
                        Certified Expert <br /> Guidance
                    </Typography>
                </Box>

                {/* Floating Badge 2 */}
                <Box sx={{
                    position: "absolute",
                    bottom: 20,
                    left: -20,
                    bgcolor: brandBlue,
                    color: "#fff",
                    p: 2,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    boxShadow: "0 10px 25px rgba(10, 83, 151, 0.3)",
                }}>
                    <SupportAgentIcon />
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, fontSize: "0.8rem" }}>
                        24/7 WhatsApp <br /> Support
                    </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontFamily: primaryFont, color: "#64748b", lineHeight: 1.8 }}>
                Get personalized academic counseling and discover the perfect career path tailored for your goals.
              </Typography>
            </Box>
          </Box>

          {/* RIGHT COLUMN: Form (Kept the layout you liked) */}
          <Box
            sx={{
              flexBasis: "55%",
              p: { xs: 4, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Fade in timeout={1000}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: primaryFont, color: "#0b1033", mb: 1 }}>
                  Request Consultation
                </Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#718096", mb: 5 }}>
                  Fill in your details and we will reach out via WhatsApp.
                </Typography>

                <Stack spacing={3}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <TextField fullWidth name="firstName" label="First Name" onChange={handleChange} sx={fieldStyle} 
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                    />
                    <TextField fullWidth name="lastName" label="Last Name" onChange={handleChange} sx={fieldStyle} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <TextField select fullWidth name="qualification" label="Qualification" value={form.qualification} onChange={handleChange} sx={fieldStyle}>
                      <MenuItem sx={menuItemSX} value="High School">High School</MenuItem>
                      <MenuItem sx={menuItemSX} value="Diploma">Diploma</MenuItem>
                      <MenuItem sx={menuItemSX} value="Bachelor's">Bachelor's</MenuItem>
                    </TextField>
                    <TextField select fullWidth name="programme" label="Programme" value={form.programme} onChange={handleChange} sx={fieldStyle}>
                      <MenuItem sx={menuItemSX} value="Computer Science">Computer Science</MenuItem>
                      <MenuItem sx={menuItemSX} value="Business">Business</MenuItem>
                    </TextField>
                  </Box>

                  <TextField fullWidth name="email" label="Email Address" onChange={handleChange} sx={fieldStyle} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                  />
                  <TextField fullWidth name="contact" label="WhatsApp Number" onChange={handleChange} sx={fieldStyle} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                  />

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleWhatsApp}
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      py: 2.5,
                      borderRadius: "20px",
                      backgroundColor: brandBlue,
                      fontFamily: primaryFont,
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      boxShadow: "0 20px 40px rgba(10, 83, 151, 0.25)",
                      transition: "0.4s",
                      "&:hover": { backgroundColor: "#08447a", transform: "translateY(-5px)", boxShadow: "0 25px 50px rgba(10, 83, 151, 0.35)" },
                    }}
                  >
                    Send Request to WhatsApp
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Guidance;