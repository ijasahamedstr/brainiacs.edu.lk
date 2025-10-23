import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const Guidance: React.FC = () => {
  const menuItemSX = { fontFamily: "'Montserrat', sans-serif" };

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    qualification: "",
    programme: "",
    email: "",
    contact: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open WhatsApp with pre-filled message
  const handleWhatsApp = () => {
    const message = `Hello I Need Guidance! 
I'm ${form.firstName} ${form.lastName}.
Qualification: ${form.qualification}
Interested Programme: ${form.programme}
Email: ${form.email}
Contact: ${form.contact}`;

    const phoneNumber = "94768696704"; // ✅ Sri Lanka number with country code
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Box component="section" sx={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "stretch",
            overflow: "hidden",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Left Column (Image + Overlay Text) */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flexBasis: "30%",
              position: "relative",
              overflow: "hidden",
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))",
                color: "#fff",
                textAlign: "center",
                p: 2,
                pt: 10,
                pb: 4,
                zIndex: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { md: "2.8rem" },
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Need Guidance & Support?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5,
                  opacity: 0.85,
                  fontSize: "1rem",
                  fontFamily: "'Montserrat', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Let's talk about your future. Fill out the form & we'll reach out to guide you.
              </Typography>
            </Box>

            <Box
              component="img"
              src="https://i.ibb.co/ynPqgtGS/form-image.png"
              alt="Brainiacs Campus"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                background: "linear-gradient(135deg, #0a5397, #35b74b)",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </Box>

          {/* Right Column (Form) */}
          <Box
            sx={{
              flexBasis: { xs: "100%", md: "70%" },
              backgroundColor: "#f7f9fb",
              borderRadius: { xs: "16px", md: "0 16px 16px 0" },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* First Name & Last Name */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1 }}
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  size="medium"
                  value={form.firstName}
                  onChange={handleChange}
                  InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                  InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                />
                <TextField
                  sx={{ flex: 1 }}
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  size="medium"
                  value={form.lastName}
                  onChange={handleChange}
                  InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                  InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                />
              </Box>

              {/* Highest Academic Qualification */}
              <TextField
                select
                fullWidth
                name="qualification"
                label="Your Highest Academic Qualification"
                variant="outlined"
                size="medium"
                value={form.qualification}
                onChange={handleChange}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
              >
                <MenuItem sx={menuItemSX} value="High School">High School</MenuItem>
                <MenuItem sx={menuItemSX} value="Diploma">Diploma</MenuItem>
                <MenuItem sx={menuItemSX} value="Bachelor's">Bachelor's</MenuItem>
                <MenuItem sx={menuItemSX} value="Master's">Master's</MenuItem>
                <MenuItem sx={menuItemSX} value="PhD">PhD</MenuItem>
              </TextField>

              {/* Interested Programme */}
              <TextField
                select
                fullWidth
                name="programme"
                label="Interested Programme"
                variant="outlined"
                size="medium"
                value={form.programme}
                onChange={handleChange}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
              >
                <MenuItem sx={menuItemSX} value="Computer Science">Computer Science</MenuItem>
                <MenuItem sx={menuItemSX} value="Business">Business</MenuItem>
                <MenuItem sx={menuItemSX} value="Engineering">Engineering</MenuItem>
                <MenuItem sx={menuItemSX} value="Design">Design</MenuItem>
              </TextField>

              {/* Email & Contact Number */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                }}
              >
                <TextField
                  sx={{ flex: 1 }}
                  name="email"
                  label="Email"
                  variant="outlined"
                  size="medium"
                  value={form.email}
                  onChange={handleChange}
                  InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                  InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                />
                <TextField
                  sx={{ flex: 1 }}
                  name="contact"
                  label="Contact Number"
                  variant="outlined"
                  size="medium"
                  value={form.contact}
                  onChange={handleChange}
                  InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                  InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
                />
              </Box>

              {/* WhatsApp Button */}
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  backgroundColor: "#0a5397",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  alignSelf: { xs: "center", md: "flex-start" },
                  "&:hover": { backgroundColor: "#08447a" },
                  fontFamily: "'Montserrat', sans-serif",
                }}
                onClick={handleWhatsApp}
              >
                Contact via WhatsApp
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Guidance;
