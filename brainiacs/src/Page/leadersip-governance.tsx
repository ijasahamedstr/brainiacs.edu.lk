import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Rellax from "rellax";

// ✅ Swiper CSS imports
import "swiper/css";
import "swiper/css/pagination";

const councilMembers = [
  {
    name: "Emeritus Prof. Mohan de Silva",
    title: "President",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/PNE8UyfWCx0log3v6m7K0JtS0lDb01jr1ae0wPqp.jpg",
    bio: "Leads the academic vision and excellence initiatives of the campus.",
  },
  {
    name: "Dr. Mohan Lal Grero",
    title: "Deputy President",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/HQ7os8IG9EmhZdvA8S7bbOZge7BqdgHUriZwD6kW.png",
    bio: "Supports leadership strategy and institutional growth.",
  },
  {
    name: "Emeritus Prof. Uma Coomaraswamy",
    title: "Academic Affairs & Quality Assurance Consultant",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/0cBkxqGmlj4PhVzOlcUIdhIysuqyfCFEEosrXNI1.jpg",
    bio: "Oversees quality assurance and academic development.",
  },
  {
    name: "Mr. Nikitha Grero",
    title: "Group Chairman & Chief Executive Officer",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/lk0RiITJTuF1d9e6JkE2UMXNjjBBEDycCqcsK0Nd.jpg",
    bio: "Provides strategic direction and visionary leadership for the group.",
  },
  {
    name: "Mr. Nikitha Grero",
    title: "Group Chairman & Chief Executive Officer",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/JqG6NkZOd4QNbzQowWcQLya2GdyPlKALPfTHdmBk.jpg",
    bio: "Provides strategic direction and visionary leadership for the group.",
  },
];

// 👇 New Management Members (second section)
const managementMembers = [
  {
    name: "Dr. John Smith",
    title: "Chief Academic Officer",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=800&q=80",
    bio: "Oversees academic programs and drives innovation in teaching and learning.",
  },
  {
    name: "Ms. Sarah Johnson",
    title: "Director of Student Affairs",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    bio: "Ensures student engagement and fosters a vibrant campus community.",
  },
  {
    name: "Mr. Kevin Lee",
    title: "Chief Operating Officer",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
    bio: "Oversees daily operations and ensures efficiency across departments.",
  },
  {
    name: "Ms. Amanda Perez",
    title: "Head of Communications",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    bio: "Leads brand strategy and communication excellence across the organization.",
  },
];

const LeadershipGovernance: React.FC = () => {
  useEffect(() => {
    new Rellax(".rellax");
  }, []);

  return (
    <>
      {/* ---------------- COUNCIL MEMBERS SECTION ---------------- */}
      <Box
        sx={{
          backgroundColor: "#f9fbff",
          py: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parallax Soft Blue Circle */}
        <Box
          className="rellax"
          data-rellax-speed="-2"
          sx={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "#cce4ff",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "text.secondary",
              mb: 1,
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Council Members
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "#0a5397",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Meet the Minds Shaping Campus Excellence
          </Typography>

          {/* Swiper Slider */}
          <Swiper
            spaceBetween={30}
            slidesPerView={1.2}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            modules={[Autoplay, Pagination]}
            style={{ paddingBottom: "50px" }}
          >
            {councilMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.8s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "rotateY(180deg)",
                    },
                    perspective: "1000px",
                  }}
                >
                  {/* Front Side */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 3,
                      backfaceVisibility: "hidden",
                      textAlign: "center",
                      boxShadow: 3,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        objectFit: "cover",
                        mx: "auto",
                        mt: 3,
                      }}
                    />
                    <Box sx={{ py: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.6,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {member.title}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Back Side */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: 3,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg, #1a237e, #3949ab)",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      px: 3,
                      boxShadow: 4,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        opacity: 0.9,
                        mb: 2,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {member.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                        maxWidth: 240,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {member.bio}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

    </>
  );
};

export default LeadershipGovernance;
