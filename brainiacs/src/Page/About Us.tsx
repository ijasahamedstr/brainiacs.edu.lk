import React from "react";
import { Box, Breadcrumbs, Link, Typography, Container } from "@mui/material";
import { motion, type Variants } from "framer-motion";

// Material UI Icons for the cards
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const Aboutus: React.FC = () => {
  const primaryFont = "'Montserrat', sans-serif";

  // Course Offerings updated with specific icons
  const courseOfferings = [
    {
      title: "Certificate-Level Courses",
      description:
        "Perfect for students who are just starting their academic journey or looking to gain specialized skills in a particular field. These provide a solid foundation in key subjects.",
      icon: <WorkspacePremiumIcon sx={{ fontSize: 36, color: "#1E40AF" }} />,
    },
    {
      title: "Professional Courses",
      description:
        "Designed for individuals seeking to enhance their expertise and advance their careers. Aligned with industry standards, ensuring students are well-prepared.",
      icon: <WorkOutlineIcon sx={{ fontSize: 36, color: "#1E40AF" }} />,
    },
    {
      title: "Higher Diplomas",
      description:
        "For those who wish to deepen their knowledge in a specific area, offering an in-depth exploration of advanced topics. Ideal for taking the next step.",
      icon: <MenuBookIcon sx={{ fontSize: 36, color: "#1E40AF" }} />,
    },
    {
      title: "Degree Programs",
      description:
        "Provide a comprehensive education in various disciplines, equipping students with the knowledge and skills needed to succeed in today’s competitive job market.",
      icon: <SchoolIcon sx={{ fontSize: 36, color: "#1E40AF" }} />,
    },
    {
      title: "Master’s Degree Programs",
      description:
        "Offer rigorous coursework and research opportunities to achieve the highest level of academic excellence. Designed to prepare students for leadership roles.",
      icon: <AccountBalanceIcon sx={{ fontSize: 36, color: "#1E40AF" }} />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 }, // Changed animation to slide in from left to match list layout
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* Header Banner */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{ overflow: "hidden", height: { xs: "220px", md: "400px" } }}
      >
        <Box
          component="img"
          src="https://lyceumcampus.lk/assets/website/about/about-us-lyceum-campus.webp"
          alt="Brainiacs Campus About Us Banner"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 8s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
      </Box>

      {/* Breadcrumb Section */}
      <Box sx={{ bgcolor: "#F1F5F9", py: 2, boxShadow: "inset 0 -2px 5px rgba(0,0,0,0.05)" }}>
        <Box sx={{ width: "90%", maxWidth: "1300px", mx: "auto" }}>
          <Breadcrumbs separator="›" sx={{ fontSize: { xs: "14px", md: "16px" }, fontWeight: 500 }}>
            <Link underline="hover" color="inherit" href="/" sx={{ color: "#1E293B", fontFamily: primaryFont }}>
              Home
            </Link>
            <Typography sx={{ color: "#1E40AF", fontWeight: 700, fontFamily: primaryFont }}>About Us</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* About Section - Intro & Commitment */}
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
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          sx={{ flex: 1 }}
        >
          <Typography sx={{ color: "#1E40AF", fontWeight: 800, mb: 1, fontFamily: primaryFont, letterSpacing: 1 }}>
            ABOUT BRAINIACS CAMPUS
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, mb: 2 }}>
            Welcome to <b>Brainiacs Campus</b>, a leading educational platform designed to empower students at every stage of their academic journey. We believe that education is the key to unlocking potential and creating opportunities. Our mission is to provide accessible, high-quality education to students from all walks of life.
          </Typography>
          
          <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "18px", fontFamily: primaryFont, mt: 3, mb: 1 }}>
            Our Commitment to Excellence
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, mb: 2 }}>
            Brainiacs Campus is dedicated to fostering a learning environment that is both dynamic and supportive. Education is not just about acquiring knowledge but about developing the skills and confidence needed to thrive. Our curriculum is carefully crafted by experienced educators and industry experts.
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.9, fontFamily: primaryFont, borderLeft: "4px solid #1E40AF", pl: 2, bgcolor: "#F8FAFC", py: 1 }}>
            Whether pursuing a professional course to enhance your career or preparing for a public examination, Brainiacs Campus provides the tools and resources you need to succeed.
          </Typography>
        </Box>

        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
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
            alt="Brainiacs Campus Background"
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
            alt="Brainiacs Campus Students"
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

      {/* Course Offerings Section (Vertical List Layout instead of Grid) */}
      <Box sx={{ width: "90%", maxWidth: "900px", mx: "auto", mb: 10 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            component={motion.h4}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variant="h4"
            sx={{ fontWeight: 800, mb: 2, color: "#0F172A", fontFamily: primaryFont }}
          >
            Comprehensive Course Offerings
          </Typography>
          <Typography
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ color: "#64748B", fontSize: "16px", fontFamily: primaryFont }}
          >
            At Brainiacs Campus, we offer a variety of educational programs tailored to meet the needs of today’s learners, from entry-level certificates to master's degrees.
          </Typography>
        </Box>

        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          sx={{
            display: "flex", 
            flexDirection: "column", // Removed grid/wrap, strictly vertical
            gap: 3,
            pb: 2,
          }}
        >
          {courseOfferings.map((item, i) => (
            <Box
              key={i}
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Icon left, text right on desktop
                alignItems: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
                width: "100%", // Full width layout
                p: { xs: 4, sm: 3 },
                borderRadius: "20px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": {
                  transform: "translateX(10px)", // Slides to the right on hover instead of up
                  boxShadow: "0 15px 30px rgba(30, 64, 175, 0.08)",
                  borderColor: "#1E40AF"
                },
              }}
            >
              {/* Icon Background Style Wrapper */}
              <Box
                sx={{
                  minWidth: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", // Styled background
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: { xs: 3, sm: 0 },
                  mr: { xs: 0, sm: 4 },
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.7), 0 4px 10px rgba(30, 64, 175, 0.1)",
                }}
              >
                {item.icon}
              </Box>

              {/* Text Content */}
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#1E40AF", fontFamily: primaryFont, fontSize: "20px", mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#475569", fontSize: "15px", lineHeight: 1.7, fontFamily: primaryFont }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Additional Info Sections */}
      <Box sx={{ bgcolor: "#F8FAFC", py: 10 }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
            }}
          >
            {/* Examinations & Approach */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#1E293B", fontWeight: 800, fontSize: "22px", fontFamily: primaryFont, mb: 2 }}>
                Support for Public Examinations
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.8, fontFamily: primaryFont, mb: 4 }}>
                We understand the challenges that come with high-stakes tests, and we provide a variety of resources to help students succeed. Our comprehensive study guides are tailored to the specific requirements of various public examinations, offering detailed explanations, practice questions, and tips for effective study strategies. We also offer practical exam preparation tools, including mock exams and practice tests, to ensure you achieve your academic goals.
              </Typography>

              <Typography sx={{ color: "#1E293B", fontWeight: 800, fontSize: "22px", fontFamily: primaryFont, mb: 2 }}>
                A Student-Centered Approach
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: "16px", lineHeight: 1.8, fontFamily: primaryFont }}>
                We put our students at the center of everything we do. Our Campus allows students to learn at their own pace, with access to a wealth of resources and support services. We also believe in the importance of community and collaboration. Our interactive learning environment fosters a sense of belonging and encourages students to engage actively in their studies alongside their peers.
              </Typography>
            </Box>

            {/* Join Us Block */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ bgcolor: "#1E40AF", color: "white", p: { xs: 4, md: 6 }, borderRadius: "20px", boxShadow: "0 20px 40px rgba(30, 64, 175, 0.2)" }}>
                <Typography sx={{ fontWeight: 800, fontSize: "26px", fontFamily: primaryFont, mb: 3 }}>
                  Join Us at Brainiacs Campus
                </Typography>
                <Typography sx={{ fontSize: "16px", lineHeight: 1.8, fontFamily: primaryFont, mb: 4, opacity: 0.9 }}>
                  We invite you to take the next step in your educational journey. Whether you’re looking to gain new skills, advance your career, or achieve academic excellence, Brainiacs Campus is here to support you every step of the way. We are confident that you will find the resources and opportunities you need to reach your full potential.
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "20px", fontFamily: primaryFont, textAlign: "center", mt: 2, pt: 3, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                  At Brainiacs Campus, your future starts here.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Aboutus;