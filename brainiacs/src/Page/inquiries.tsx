import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const Inquiries: React.FC = () => {
  const menuItemSX = { fontFamily: "'Montserrat', sans-serif" };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    programme: "",
    email: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const message = `Hello Inquire Now! 
I'm ${form.firstName} ${form.lastName}.
Interested Programme: ${form.programme || "N/A"}
Email: ${form.email || "N/A"}
Contact: ${form.contact || "N/A"}`;

    const phoneNumber = "94768696704";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Box
      component="section"
      sx={{
        fontFamily: "'Montserrat', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6fa",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "#FAFAFA",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            p: { xs: 3, md: 5 },
          }}
        >
          {/* Heading */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2rem" },
                color: "#0a5397",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Inquire Now
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* First & Last Name */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
              <TextField
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                }}
                name="firstName"
                label="First Name"
                variant="outlined"
                size="medium"
                value={form.firstName}
                onChange={handleChange}
              />
              <TextField
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                }}
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

            {/* Programme */}
            <TextField
              select
              fullWidth
              name="programme"
              label="Interested Programme"
              variant="outlined"
              size="medium"
              value={form.programme}
              onChange={handleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
              InputProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
              InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif" } }}
            >
              <MenuItem sx={menuItemSX} value="Computer Science">
                Computer Science
              </MenuItem>
              <MenuItem sx={menuItemSX} value="Business">
                Business
              </MenuItem>
              <MenuItem sx={menuItemSX} value="Engineering">
                Engineering
              </MenuItem>
              <MenuItem sx={menuItemSX} value="Design">
                Design
              </MenuItem>
            </TextField>

            {/* Email & Contact */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2}}>
              <TextField
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
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
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
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
            <Box sx={{ textAlign: "left", mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0a5397",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  px: 5,
                  py: 1.5,
                  borderRadius: "30px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#08447a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                  },
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

export default Inquiries;
