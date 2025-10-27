import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Partners: React.FC = () => {
  return (
    <>
      {/* 🔵 Blue Header */}
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif'
          }}
        >
          Our Partners
        </Typography>
      </Box>

      {/* ⚪ White Content Section */}
      <Container sx={{ py: 6, textAlign: "center" }}>
        {/* University Logo */}
        <Box
          component="img"
          src="https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/our-story/our-partners/deakin-university-lyceum-campus-partner.webp"
          alt="Deakin University"
          sx={{
            width: "220px",
            height: "auto",
            mb: 3,
          }}
        />

        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontFamily: '"Montserrat", sans-serif',
            color: "#2b2b2b",
          }}
        >
          Victoria's #1 university for best education experience *
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "#555",
            lineHeight: 1.9,
           fontFamily: '"Montserrat", sans-serif',
            textAlign: "justify",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          As one of Australia&apos;s leading tertiary education providers,
          Deakin offers a personalised experience enhanced by world-class
          programs and innovative digital engagement. As an internationally
          recognised university for over 45 years, Deakin University has
          supported over 300,000 students on their journeys towards success
          in the educational and professional pathways.
          <br />
          <br />
          With four outstanding campuses in Melbourne, Geelong and
          Warrnambool, and a premium online learning platform that exceeds
          any other in Australia, all 60,000 of Deakin students enjoy
          unlimited access to world-leading facilities and a friendly,
          welcoming atmosphere – regardless of whether they&apos;re studying
          on campus or online.
          <br />
          <br />
          Being Victoria&apos;s #1 university for best education experience,
          Deakin features practical learning allowing students to apply the
          knowledge & skills gained in real-world circumstances.
          <br />
          <br />
          Another highlighting aspect of Deakin University is their strength
          in Research & Innovation conducted in world leading research
          facilities with a multidisciplinary approach with the objective of
          inspiring young researchers. Deakin brings together different
          schools of thinking to help us solve some of the biggest, most
          complex global challenges. This application of shared knowledge
          keeps people at the centre of its research.
        </Typography>
      </Container>

      {/* Light gray section divider */}
      <Box sx={{ backgroundColor: "#f6f6f6", height: "60px" }} />
    </>
  );
};

export default Partners;
