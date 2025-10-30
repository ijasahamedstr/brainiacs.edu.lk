import React from "react";
import { Box, Typography, Container } from "@mui/material";

interface Partner {
  logo: string;
  title: string;
  description: string;
  alt: string;
}

const partners: Partner[] = [
  {
    logo: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/our-story/our-partners/deakin-university-lyceum-campus-partner.webp",
    alt: "Deakin University",
    title: "Victoria's #1 university for best education experience *",
    description: `
      As one of Australia’s leading tertiary education providers, Deakin offers a personalised experience enhanced by world-class programs and innovative digital engagement. 
      For over 45 years, Deakin University has supported over 300,000 students on their journeys toward success in educational and professional pathways.
      
      With four outstanding campuses in Melbourne, Geelong and Warrnambool, and a premium online learning platform that exceeds any other in Australia, Deakin students enjoy unlimited access to world-leading facilities and a friendly, welcoming atmosphere – whether studying on campus or online.
      
      Being Victoria’s #1 university for best education experience, Deakin features practical learning allowing students to apply their knowledge and skills in real-world circumstances.
      
      Another key aspect of Deakin University is its strength in research and innovation, conducted in world-leading research facilities. Deakin brings together diverse disciplines to solve global challenges and keep people at the heart of its research.
    `,
  },
  {
    logo: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/our-story/our-partners/dlc-lyceum-campus-partner-1.webp",
    alt: "Distance Learning Centre",
    title: "Empowering professional distance learning in Sri Lanka",
    description: `
      The Distance Learning Centre (DLC) is a leader in professional distance education in Sri Lanka under the Ministry of Public Administration, Home Affairs, Provincial Councils and Local Government. 
      It empowers learners with globally aligned knowledge and professional skills to enhance their competitiveness.
      
      DLC is dedicated to providing flexible, high-quality learning facilities that help learners achieve their career goals efficiently. 
      Its wide range of programs serves as a foundation for higher qualifications and career advancement, with a strong commitment to excellence and continuous improvement.
    `,
  },
  {
    logo: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/our-story/our-partners/pearson-lyceum-campus-partner.webp",
    alt: "Pearson",
    title: "Global education leader empowering lifelong learning",
    description: `
      Pearson is the world’s leading learning company with expertise in educational publishing, assessment, and digital learning solutions. 
      Through its partnership with Lyceum Campus, Pearson brings world-class education pathways that enable students to access globally recognized qualifications.
      
      Pearson’s focus on innovation and quality ensures that students develop the skills needed for success in today’s competitive and technology-driven world.
    `,
  },
];

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
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Our Partners
        </Typography>
      </Box>

      {/* ⚪ Partner Sections */}
      {partners.map((partner, index) => (
        <React.Fragment key={index}>
          <Container sx={{ py: 6, textAlign: "center" }}>
            <Box
              component="img"
              src={partner.logo}
              alt={partner.alt}
              sx={{
                width: "220px",
                height: "auto",
                mb: 3,
              }}
            />

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontFamily: '"Montserrat", sans-serif',
                color: "#2b2b2b",
              }}
            >
              {partner.title}
            </Typography>

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
              {partner.description.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line.trim() && <>{line.trim()}<br /><br /></>}
                </React.Fragment>
              ))}
            </Typography>
          </Container>

          {/* Section Divider */}
          {index !== partners.length - 1 && (
            <Box sx={{ backgroundColor: "#f6f6f6", height: "60px" }} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Partners;
