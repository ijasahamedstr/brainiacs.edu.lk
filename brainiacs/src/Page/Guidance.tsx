import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Grow, 
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Guidance: React.FC = () => {
  // Brand Styling Constants
  const primaryFont = "'Montserrat', sans-serif";
  const brandBlue = "#0a5397";
  const brandGreen = "#35b74b";

  // State Management
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    qualification: "",
    programme: "",
    email: "",
    contact: "",
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Main Action: Save to DB then WhatsApp
  const handleWhatsApp = async () => {
    if (!form.firstName || !form.email || !form.contact) {
      alert("Please fill in the required fields (Name, Email, and WhatsApp).");
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${BASE_URL}/api/guidance`, form);

      if (response.status === 201 || response.status === 200) {
        setSuccessMsg(true);

        const message = 
          `*◆ New Guidance Request Received*%0A%0A` +
          `*Name:* ${form.firstName} ${form.lastName}%0A` +
          `*Mobile:* ${form.contact}%0A` +
          `*Email:* ${form.email}%0A%0A` +
          `*Qualification:* ${form.qualification}%0A` +
          `*Programme:* ${form.programme}%0A%0A` +
          `*Status:* Pending Review%0A%0A` +
          `---%0A` +
          `*Brainiacs Campus*`;

        const phoneNumber = "94768696704"; 
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

        setForm({
          firstName: "",
          lastName: "",
          qualification: "",
          programme: "",
          email: "",
          contact: "",
        });
      }
    } catch (error: any) {
      console.error("Database Save Error:", error);
      alert(error.response?.data?.message || "System Error: Could not save your request.");
    } finally {
      setLoading(false);
    }
  };

  // Custom Styles
  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      fontFamily: primaryFont,
      backgroundColor: "#fff",
      borderRadius: "16px",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:-webkit-autofill": { borderRadius: "16px" },
      "&:hover fieldset": { borderColor: brandBlue },
      "&.Mui-focused fieldset": { 
        borderColor: brandBlue, 
        borderWidth: "1px", 
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(10, 83, 151, 0.1)",
      }
    },
    "& .MuiInputLabel-root": { fontFamily: primaryFont, fontSize: { xs: "0.85rem", sm: "0.9rem" } },
  };

  const menuItemSX = { 
    fontFamily: primaryFont,
    fontSize: { xs: "0.85rem", sm: "0.9rem" },
    "&:hover": { backgroundColor: "rgba(10, 83, 151, 0.08)" }
  };

  return (
    <Box component="section" sx={{ py: { xs: 4, sm: 6, md: 8, lg: 12 }, bgcolor: "#f8fafc" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            borderRadius: { xs: "24px", md: "40px" },
            overflow: "hidden",
            boxShadow: "0 40px 80px -20px rgba(10, 83, 151, 0.15)",
            bgcolor: "#fff",
          }}
        >
          {/* LEFT COLUMN: BRANDING & VISUALS */}
          <Box
            sx={{
              width: { xs: "100%", lg: "45%" },
              position: "relative",
              p: { xs: 3, sm: 5, md: 6, lg: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#f0f4f8",
              overflow: "hidden"
            }}
          >
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
              <Typography sx={{ fontFamily: primaryFont, color: brandBlue, fontWeight: 800, fontSize: { xs: "0.75rem", sm: "0.85rem" }, letterSpacing: { xs: 2, sm: 3 }, textTransform: "uppercase", mb: 2, display: "block" }}>
                Start Your Journey
              </Typography>

              {/* UPDATED: Smaller main heading */}
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem", xl: "3rem" }, fontFamily: primaryFont, lineHeight: 1.1, color: "#0b1033", mb: { xs: 3, lg: 4 } }}>
                Shape Your <br />
                <span style={{ background: `linear-gradient(90deg, ${brandBlue}, ${brandGreen})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Future</span> With Us
              </Typography>

              <Box sx={{ position: "relative", mt: { xs: 3, md: 4 }, mb: { xs: 4, md: 4 } }}>
                <Box component="img" src="https://i.ibb.co/ynPqgtGS/form-image.png" sx={{ width: "100%", height: { xs: "220px", sm: "300px", lg: "350px", xl: "400px" }, objectFit: "cover", borderRadius: "30px 100px 30px 30px", boxShadow: "20px 20px 60px rgba(0,0,0,0.1)" }} />
                
                <Box sx={{ 
                  position: "absolute", 
                  top: { xs: -10, sm: -20 }, 
                  right: { xs: 5, sm: -10 }, 
                  bgcolor: "rgba(255,255,255,0.9)", 
                  p: { xs: 1.5, sm: 2 }, 
                  borderRadius: "16px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: { xs: 1, sm: 1.5 }, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
                  backdropFilter: "blur(10px)" 
                }}>
                    <VerifiedUserIcon sx={{ color: brandGreen, fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: { xs: "0.7rem", sm: "0.8rem" }, color: "#0b1033" }}>
                        Certified Expert <br /> Guidance
                    </Typography>
                </Box>

                <Box sx={{ 
                  position: "absolute", 
                  bottom: { xs: 10, sm: 20 }, 
                  left: { xs: 5, sm: -20 }, 
                  bgcolor: brandBlue, 
                  color: "#fff", 
                  p: { xs: 1.5, sm: 2 }, 
                  borderRadius: "16px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: { xs: 1, sm: 1.5 }, 
                  boxShadow: "0 10px 25px rgba(10, 83, 151, 0.3)" 
                }}>
                    <SupportAgentIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                        24/7 WhatsApp <br /> Support
                    </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontFamily: primaryFont, color: "#64748b", lineHeight: 1.8, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                Get personalized academic counseling and discover the perfect career path tailored for your goals.
              </Typography>
            </Box>
          </Box>

          {/* RIGHT COLUMN: FORM */}
          <Box sx={{ 
            width: { xs: "100%", lg: "55%" }, 
            p: { xs: 3, sm: 5, md: 6, lg: 8 }, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center" 
          }}>
            <Grow in timeout={800} style={{ transformOrigin: 'top center' }}>
              <Box>
                {/* UPDATED: Smaller form heading */}
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: primaryFont, color: "#0b1033", mb: 1, fontSize: { xs: "1.5rem", sm: "1.85rem" } }}>
                  Request Consultation
                </Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#718096", mb: { xs: 3, sm: 5 }, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                  Fill in your details and we will reach out via WhatsApp.
                </Typography>

                <Stack spacing={{ xs: 2, sm: 2.5 }}>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 2 } }}>
                    <TextField fullWidth name="firstName" label="First Name" value={form.firstName} onChange={handleChange} sx={fieldStyle} 
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                    />
                    <TextField fullWidth name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} sx={fieldStyle} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 2 } }}>
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

                  <TextField fullWidth name="email" label="Email Address" value={form.email} onChange={handleChange} sx={fieldStyle} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                  />
                  <TextField fullWidth name="contact" label="WhatsApp Number" value={form.contact} onChange={handleChange} sx={fieldStyle} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneIcon sx={{ color: brandBlue }} /></InputAdornment> }} 
                  />

                  {/* UPDATED: Smaller button padding and font size */}
                  <Button
                    variant="contained"
                    disabled={loading}
                    onClick={handleWhatsApp}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WhatsAppIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 1.75 }, // Slimmer padding
                      mt: { xs: 1, sm: 0 },
                      borderRadius: "16px", // Adjusted slightly for the slimmer button profile
                      backgroundColor: brandBlue,
                      fontFamily: primaryFont,
                      fontWeight: 700, // Dropped from 800 to 700 to match smaller size
                      fontSize: { xs: "0.9rem", sm: "1rem" }, // Smaller font size
                      textTransform: "none",
                      boxShadow: "0 8px 16px rgba(10, 83, 151, 0.15)",
                      transition: "all 0.25s ease-in-out",
                      "&.Mui-disabled": { backgroundColor: "#ccc" },
                      "&:hover": { 
                        backgroundColor: "#08447a", 
                        transform: "translateY(-2px)", 
                        boxShadow: "0 10px 20px rgba(10, 83, 151, 0.25)" 
                      },
                      "&:active": {
                        transform: "translateY(0) scale(0.98)",
                        boxShadow: "0 4px 8px rgba(10, 83, 151, 0.2)",
                      }
                    }}
                  >
                    {loading ? "Saving Details..." : "Send Request to WhatsApp"}
                  </Button>
                </Stack>
              </Box>
            </Grow>
          </Box>
        </Box>
      </Container>

      <Snackbar open={successMsg} autoHideDuration={6000} onClose={() => setSuccessMsg(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: '12px', fontFamily: primaryFont }}>
          Request saved successfully! Opening WhatsApp...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Guidance;