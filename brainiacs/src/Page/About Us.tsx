import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

const Aboutus: React.FC = () => {
  const primaryFont = "'Montserrat', sans-serif";

  const values = [
    { title: "Accountability", image: "https://lyceumcampus.lk/assets/img/icons/lineal/accountability-our-values-lyceum-campus.svg" },
    { title: "Integrity", image: "https://lyceumcampus.lk/assets/img/icons/lineal/integrity-our-values-lyceum-campus.svg" },
    { title: "Freedom of Expression", image: "https://lyceumcampus.lk/assets/img/icons/lineal/freedom-of-expresssion-our-values-lyceum-campus.svg" },
    { title: "Social Responsibility", image: "https://lyceumcampus.lk/assets/img/icons/lineal/social-responsibilty-our-values-lyceum-campus.svg" },
    { title: "Inclusiveness", image: "https://lyceumcampus.lk/assets/img/icons/lineal/inclusiveness-our-values-lyceum-campus.svg" },
    { title: "Innovation", image: "https://lyceumcampus.lk/assets/img/icons/lineal/innovation-our-values-lyceum-campus.svg" },
    { title: "Lifelong Learning", image: "https://lyceumcampus.lk/assets/img/icons/lineal/lifelong-learning-our-values-lyceum-campus.svg" },
    { title: "Sustainability", image: "https://lyceumcampus.lk/assets/img/icons/lineal/sustainability-our-values-lyceum-campus.svg" },
  ];

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* ✅ Header Banner with Zoom Effect */}
      <Box sx={{ overflow: "hidden", height: { xs: "220px", md: "400px" } }}>
        <Box
          component="img"
          src="https://lyceumcampus.lk/assets/website/about/about-us-lyceum-campus.webp"
          alt="About Us Banner"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 8s ease",
            "&:hover": { transform: "scale(1.1)" }, // Subtle zoom on hover
          }}
        />
      </Box>

      {/* ✅ Breadcrumb Section with Shadow */}
      <Box sx={{ bgcolor: "#F1F5F9", py: 2, boxShadow: "inset 0 -2px 5px rgba(0,0,0,0.05)" }}>
        <Box sx={{ width: "90%", maxWidth: "1300px", mx: "auto" }}>
          <Breadcrumbs separator="›" sx={{ fontSize: { xs: "14px", md: "16px" }, fontWeight: 500 }}>
            <Link underline="hover" color="inherit" href="/" sx={{ color: "#1E293B", fontFamily: primaryFont }}>Home</Link>
            <Typography sx={{ color: "#1E40AF", fontWeight: 700, fontFamily: primaryFont }}>About Us</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* ✅ About Section with Content Reveal */}
      <Box
        sx={{
          width: "90%",
          maxWidth: "1300px",
          mx: "auto",
          mt: { xs: 8, md: 12 },
          mb: 10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#1E40AF", fontWeight: 800, mb: 1, fontFamily: primaryFont, letterSpacing: 1 }}>OUR STORY</Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, mb: 2 }}>
            Established in 2020, <b>Brainiacs Campus</b>, the higher education arm of the Lyceum Education Group, has been instrumental in moulding the lives and educational journey...
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, mb: 2 }}>
            Located in Sammanthurai, we provide state-of-the-art facilities that embrace international standards where students can thrive for excellence closer to home.
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, borderLeft: "4px solid #1E40AF", pl: 2, bgcolor: "#F8FAFC", py: 1 }}>
            We develop the required skills and attitudes to create a holistic individual who can face the future with confidence.
          </Typography>
        </Box>

        {/* ✅ Right Side Image Collage with Floating Effect */}
             <Box
                  sx={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: { xs: 4, md: 0 },
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", xl: "block" },
                      position: "absolute",
                      top: "-50px",
                      left: "90px",
                      width: "260px",
                      height: "260px",
                      backgroundImage: "radial-gradient(#1E40AF 2px, transparent 2px)",
                      backgroundSize: "18px 18px",
                      borderRadius: "12px",
                      opacity: 0.6,
                      zIndex: 1,
                      filter: "contrast(1.2) brightness(0.9)",
                    }}
                  />
        
                  <Box
                    component="img"
                    src="https://lyceumcampus.lk/assets/website/about/about-us-lyceum-campus-3.webp"
                    alt="Lyceum Campus Background"
                    sx={{
                      display: { xs: "none", xl: "block" },
                      position: "absolute",
                      top: "-60px",
                      right: "-90px",
                      width: "350px",
                      borderRadius: "16px",
                      zIndex: 2,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                    }}
                  />
        
                  <Box
                    component="img"
                    src="https://lyceumcampus.lk/assets/website/about/about-us-lyceum-campus-2.webp"
                    alt="Lyceum Campus Students"
                    sx={{
                      position: "relative",
                      width: { xs: "90%", md: "85%" },
                      maxWidth: "350px",
                      borderRadius: "16px",
                      zIndex: 3,
                      boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
                    }}
                  />
                </Box>
   
      </Box>

      {/* ✅ Our Values Section with 3D Cards */}
      <Box sx={{ textAlign: "center", width: "90%", maxWidth: "1300px", mx: "auto", mb: 12 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "#0F172A", fontFamily: primaryFont }}>
          Our Values
        </Typography>
        <Typography sx={{ color: "#64748B", maxWidth: "700px", mx: "auto", mb: 8, fontSize: "16px", fontFamily: primaryFont }}>
          Creating sustainable quality globally recognized education while embracing our core values.
        </Typography>

        <Box sx={{ 
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4,
          overflowX: { xs: "auto", md: "visible" }, pb: 2,
          "&::-webkit-scrollbar": { display: "none" }
        }}>
          {values.map((item, i) => (
            <Box
              key={i}
              sx={{
                width: { xs: "200px", sm: "240px", md: "22%" },
                textAlign: "center",
                p: 3,
                borderRadius: "20px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { 
                  transform: "translateY(-12px)",
                  boxShadow: "0 15px 30px rgba(30, 64, 175, 0.1)",
                  borderColor: "#1E40AF"
                },
              }}
            >
              <Box sx={{
                width: "85px", height: "85px", mx: "auto", mb: 3, borderRadius: "50%",
                bgcolor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #F1F5F9", transition: "0.3s",
                ".MuiBox-root:hover &": { bgcolor: "#EEF2FF", borderColor: "#1E40AF" }
              }}>
                <Box component="img" src={item.image} alt={item.title} sx={{ width: "40px", height: "40px", objectFit: "contain" }} />
              </Box>

              <Typography sx={{ fontWeight: 700, color: "#1E293B", fontFamily: primaryFont, fontSize: "15px" }}>
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Aboutus;