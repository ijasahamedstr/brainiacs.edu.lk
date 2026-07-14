import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  keyframes,
} from "@mui/material";
import React from "react";
// Import Icons for the Contact Details to replace emojis for better consistency
import EmailIcon from "@mui/icons-material/EmailOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

// --- Animations ---
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Helper component for the Contact details row
interface ContactDetailProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ icon, label, value }) => (
  <Box
    sx={{
      mb: 2,
      display: "flex",
      alignItems: "flex-start",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateX(8px)", // Smooth slide effect on hover
      },
    }}
  >
    <Box sx={{ color: "#0F172A", mr: 1.5, mt: 0.3, display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: "#4B5563",
        fontSize: { xs: "15px", sm: "16px", md: "17px" },
        fontFamily: "'Montserrat', sans-serif",
        lineHeight: 1.6,
        wordBreak: "break-word",
      }}
    >
      {label}: <strong style={{ marginLeft: '4px', color: '#0F172A' }}>{value}</strong>
    </Typography>
  </Box>
);

// Helper function to create the section title with the bottom line
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="h5"
    component="h2"
    sx={{
      color: "#0F172A",
      fontWeight: 700,
      fontSize: { xs: "22px", sm: "26px", md: "30px" }, 
      mb: 3,
      borderBottom: "3px solid #E5E7EB",
      display: "inline-block",
      fontFamily: "'Montserrat', sans-serif",
      pb: 0.5,
    }}
  >
    {children}
  </Typography>
);

const Contactus: React.FC = () => {
  // WhatsApp form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement)?.value || "";
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLInputElement)?.value || "";

    const whatsappNumber = "+94768696704";

    const whatsappMessage = `Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AMobile: ${encodeURIComponent(mobile)}%0ASubject: ${encodeURIComponent(subject)}%0AMessage: ${encodeURIComponent(message)}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: { xs: 5, md: 8 },
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif',
            fontSize: { xs: "24px", sm: "32px", md: "36px" }
          }}
        >
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#F8FAFC",
          pt: 0,
          pb: { xs: 6, md: 10 },
        }}
      >
        {/* 📍 Google Map Section */}
        <Box
          sx={{
            width: "100%",
            height: { xs: "250px", sm: "350px", md: "450px", lg: "500px" },
            overflow: "hidden",
            mb: { xs: 5, md: 8 },
            animation: `${fadeIn} 1.2s ease-in-out`, // Map fade-in animation
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31654.85944097561!2d81.76772117614749!3d7.369872508325106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae53f7ba4dbf747%3A0x7f72f3443a3ceb19!2sBrainiacs%20Campus!5e0!3m2!1sen!2slk!4v1784025375369!5m2!1sen!2slk"
            width="600"
            height="450"
            style={{ border: 0, width: "100%", height: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Google Map Location"
          ></iframe>
        </Box>

        {/* Main Content Section */}
        <Container
          maxWidth="lg"
          sx={{ px: { xs: 2, sm: 4, md: 5 }, fontFamily: "'Montserrat', sans-serif" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 5, md: 8 },
            }}
          >
            {/* Left Column: Welcome + Contact Info */}
            <Box 
              sx={{ 
                flexBasis: "50%", 
                pr: { lg: 4 },
                animation: `${fadeInUp} 0.8s ease-out forwards`, // Slide up animation
              }}
            >
              <SectionTitle>WELCOME TO BRAINIACS CAMPUS</SectionTitle>
              
              {/* Reduced font sizes here */}
              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "13px", sm: "14px", md: "15px" }, 
                  lineHeight: 1.8,
                  mb: 3,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                Every great journey begins with a single step — and yours starts here.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "13px", sm: "14px", md: "15px" },
                  lineHeight: 1.8,
                  mb: 3,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                At Brainiacs Campus, we believe education is more than lectures and exams; it's the foundation on which futures are built. Since 2024, we've been creating a space where curiosity is encouraged, ambition is nurtured, and every student is empowered to discover their full potential.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "13px", sm: "14px", md: "15px" },
                  lineHeight: 1.8,
                  mb: 3,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                Guided by our motto, <b>"Transform Lives, Influence Future,"</b> we don't just prepare students for careers — we prepare them to lead, innovate, and inspire change in a rapidly evolving world.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "13px", sm: "14px", md: "15px" },
                  lineHeight: 1.8,
                  mb: 3,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                Step onto our campus, and you'll find more than classrooms. You'll find mentors who believe in you, peers who push you forward, and an environment built to turn ambition into achievement.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "13px", sm: "14px", md: "15px" },
                  lineHeight: 1.8,
                  mb: 5,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                <b>This is where your story begins. Welcome to Brainiacs Campus.</b>
              </Typography>

              {/* Contact Details */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0F172A",
                    fontWeight: 700,
                    fontSize: { xs: "20px", md: "22px" },
                    mb: 3,
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Sammanthurai - Contact Information
                </Typography>
              </Box>

              <ContactDetail
                icon={<EmailIcon fontSize="small" />}
                label="Email"
                value="info@brainiacs.edu.lk"
              />
              <ContactDetail
                icon={<WhatsAppIcon fontSize="small" />}
                label="Whatsapp"
                value="(+94) 760959385"
              />
              <ContactDetail
                icon={<PhoneIphoneIcon fontSize="small" />}
                label="Mobile"
                value="(+94) 672260200"
              />
            </Box>

            {/* Right Column: Contact Form */}
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={(e) => {
                handleSubmit(e);
                (e.currentTarget as HTMLFormElement).reset();
              }}
              sx={{
                flexBasis: "50%",
                p: { xs: 3, sm: 4, md: 5 },
                border: "1px solid #F8FAFC",
                borderRadius: 3,
                fontFamily: "'Montserrat', sans-serif",
                backgroundColor: "#fff",
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                opacity: 0,
                animation: `${fadeInUp} 0.8s ease-out 0.3s forwards`, // Slide up with slight delay
              }}
            >
              <SectionTitle>SEND YOUR COMMENTS</SectionTitle>

              <TextField
                fullWidth
                label="Your Name (required)"
                name="name"
                variant="standard"
                margin="normal"
                required
                sx={{ mb: 3 }}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
              />
              <TextField
                fullWidth
                label="Your Email (required)"
                name="email"
                type="email"
                variant="standard"
                margin="normal"
                required
                sx={{ mb: 3 }}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                type="tel"
                variant="standard"
                margin="normal"
                sx={{ mb: 3 }}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
              />
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                variant="standard"
                margin="normal"
                sx={{ mb: 3 }}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
              />
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                variant="standard"
                margin="normal"
                multiline
                rows={4}
                sx={{
                  mb: 5,
                  '& .MuiInput-root:before': { borderBottom: '1px solid #9CA3AF' },
                  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '2px solid #0F172A' },
                  '& .MuiInput-root:after': { borderBottom: '2px solid #0F172A' },
                  fontFamily: "'Montserrat', sans-serif",
                }}
                InputProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
                InputLabelProps={{ style: { fontFamily: "'Montserrat', sans-serif", fontSize: '16px' } }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#0F172A',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1E293B',
                    transform: 'translateY(-2px)', 
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease-in-out',
                  width: { xs: '100%', sm: '200px' }, 
                  padding: '12px 30px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  display: 'block',
                  ml: { xs: 0, sm: 'auto' } 
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Contactus;