import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

const Aboutus: React.FC = () => {
  const values = [
    {
      title: "Accountability",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/accountability-our-values-lyceum-campus.svg",
    },
    {
      title: "Integrity",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/integrity-our-values-lyceum-campus.svg",
    },
    {
      title: "Freedom of Expression",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/freedom-of-expresssion-our-values-lyceum-campus.svg",
    },
    {
      title: "Social Responsibility",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/social-responsibilty-our-values-lyceum-campus.svg",
    },
    {
      title: "Inclusiveness",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/inclusiveness-our-values-lyceum-campus.svg",
    },
    {
      title: "Innovation",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/innovation-our-values-lyceum-campus.svg",
    },
    {
      title: "Lifelong Learning",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/lifelong-learning-our-values-lyceum-campus.svg",
    },
    {
      title: "Sustainability",
      image:
        "https://lyceumcampus.lk/assets/img/icons/lineal/sustainability-our-values-lyceum-campus.svg",
    },
  ];

  return (
    <>
      {/* ✅ Header Banner */}
      <Box
        component="img"
        src="https://lyceumcampus.lk/assets/website/about/about-us-lyceum-campus.webp"
        alt="About Us Banner"
        sx={{
          width: "100%",
          height: { xs: "220px", md: "400px" },
          objectFit: "cover",
        }}
      />

      {/* ✅ Breadcrumb Section */}
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          fontFamily: "'Montserrat', sans-serif",
          py: 2,
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "1300px",
            mx: "auto",
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 500,
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              sx={{
                color: "#1E293B",
                fontFamily: "'Montserrat', sans-serif",
                "&:hover": { color: "#0F172A" },
              }}
            >
              Home
            </Link>
            <Typography
              sx={{
                color: "#0F172A",
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              About Us
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* ✅ About Section (Text + Image Collage) */}
      <Box
        sx={{
          width: "90%",
          maxWidth: "1300px",
          mx: "auto",
          mt: { xs: 10, md: 12 },
          mb: 10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* ✅ Left Text */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.8,
              fontFamily: "'Montserrat', sans-serif",
              mb: 2,
            }}
          >
            Established in 2022, Lyceum Campus, the higher education arm of the
            Lyceum Education Group, has been instrumental in moulding the lives
            and educational journey of many students by providing a gamut of
            quality, practical and internationally-reputed programmes for
            students with different goals, dreams and ambitions.
          </Typography>

          <Typography
            sx={{
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.8,
              fontFamily: "'Montserrat', sans-serif",
              mb: 2,
            }}
          >
            Located in Nugegoda, one of the main suburbs of Colombo, Lyceum
            Campus provides students with state-of-the-art facilities that
            embrace international standards where students can thrive for
            excellence by experiencing international education in a fully-fledged
            campus closer to home.
          </Typography>

          <Typography
            sx={{
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.8,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Lyceum Campus is committed not only to disseminate knowledge but
            develop the required skills and attitudes to create a holistic
            individual who can face the future with utmost confidence in life.
          </Typography>
        </Box>

        {/* ✅ Right Side Image Collage */}
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

      {/* ✅ Our Values Section */}
      <Box
        sx={{
          textAlign: "center",
          width: "90%",
          maxWidth: "1300px",
          mx: "auto",
          mb: 12,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "#0F172A",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Our Values
        </Typography>

        <Typography
          sx={{
            color: "#475569",
            maxWidth: "900px",
            mx: "auto",
            mb: 6,
            fontSize: "16px",
            lineHeight: 1.8,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          As leaders in education in Sri Lanka, we are committed to creating
          sustainable quality globally recognized education while embracing our
          core values
        </Typography>

        {/* ✅ Values Section with Responsive Slider */}
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", md: "visible" },
            scrollSnapType: { xs: "x mandatory", md: "none" },
            justifyContent: { md: "center" },
            gap: { xs: 3, sm: 4, md: 6 },
            pb: { xs: 2, md: 0 },
            "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar on mobile
          }}
        >
          {values.map((item, i) => (
            <Box
              key={i}
              sx={{
                width: { xs: "100%", sm: "30%", md: "22%" },
                minWidth: { xs: "180px", sm: "220px", md: "unset" },
                textAlign: "center",
                flexShrink: 0,
                scrollSnapAlign: { xs: "center", md: "none" },
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-6px)" },
              }}
            >
              {/* ✅ Icon Circle */}
              <Box
                sx={{
                  width: "90px",
                  height: "90px",
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  border: "3px solid #1E40AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F8FAFC",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#3B82F6",
                    backgroundColor: "#EFF6FF",
                    boxShadow: "0 0 10px rgba(59,130,246,0.3)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: "45px",
                    height: "45px",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#0F172A",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "15px",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Aboutus;
