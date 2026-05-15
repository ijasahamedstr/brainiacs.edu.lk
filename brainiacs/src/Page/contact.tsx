import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import React from "react";
// Import Icons for the Contact Details to replace emojis for better consistency
import EmailIcon from "@mui/icons-material/EmailOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

// Helper component for the Contact details row
interface ContactDetailProps {
  icon: React.ReactElement; // Change icon type to ReactElement for MUI Icons
  label: string;
  value: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ icon, label, value }) => (
  <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
    <Box sx={{ color: "#0F172A", mr: 1.5, mt: 0.3, display: 'flex', alignItems: 'center' }}>
      {icon} {/* Render the MUI Icon component */}
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: "#4B5563",
        fontSize: { xs: "14px", sm: "15px", md: "16px" },
        fontFamily: "'Montserrat', sans-serif",
        lineHeight: 1.6,
        wordBreak: "break-word", // Prevents long emails from breaking small mobile layouts
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
      fontSize: { xs: "20px", sm: "24px", md: "28px" }, // More responsive font size
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
    // Safely retrieve form values
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement)?.value || "";
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLInputElement)?.value || "";

    // The current WhatsApp number in the code is a Sri Lankan number (+94), 
    // but the company is in QATAR (QARAR section). Ensure this is the correct one.
    const whatsappNumber = "+94768696704"; 
    
    // Construct the message with URL-encoded line breaks (%0A)
    const whatsappMessage = `Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AMobile: ${encodeURIComponent(mobile)}%0ASubject: ${encodeURIComponent(subject)}%0AMessage: ${encodeURIComponent(message)}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: { xs: 5, md: 8 }, // Responsive padding
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
          pt: { xs: 0, md: 0 }, // Removed top padding to let map sit flush if desired, or keep as needed
          pb: { xs: 6, md: 10 }, 
        }}
      >
        {/* 📍 Google Map Section */}
        <Box
          sx={{
            width: "100%",
            // Tiered map heights for perfect scaling
            height: { xs: "250px", sm: "350px", md: "450px", lg: "500px" }, 
            overflow: "hidden",
            mb: { xs: 4, md: 6 } // Space between map and content
          }}
        >
          {/* IMPORTANT: Replace src with a valid Google Maps embed link */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11540.909987823437!2d51.48831968853685!3d25.2854359747585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c478d10619a9%3A0x608e9a111a68e826!2sDoha%2C%20Qatar!5e0!3m2!1sen!2ssa!4v1678284567890"
            style={{ border: 0, width: "100%", height: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
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
            <Box sx={{ flexBasis: "50%", pr: { lg: 4 } }}>
              <SectionTitle>WELCOME TO Brainiacs Campus</SectionTitle>
              <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "14px", sm: "15px", md: "16px" },
                  lineHeight: 1.8,
                  mb: 5,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                **Established in 2020, Brainiacs Campus, the higher education arm of the Lyceum Education Group, has been instrumental in moulding the lives and educational journey.
              </Typography>
               <Typography
                variant="body1"
                sx={{
                  color: "#4B5563",
                  fontSize: { xs: "14px", sm: "15px", md: "16px" },
                  lineHeight: 1.8,
                  mb: 5,
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: "justify",
                }}
              >
                Located in Sammanthurai, we provide state-of-the-art facilities that embrace international standards where students can thrive for excellence closer to home.
              </Typography>

              {/* Contact Details */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0F172A",
                    fontWeight: 700,
                    fontSize: { xs: "18px", md: "20px" }, 
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
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Slightly elevated shadow
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
                    transform: 'translateY(-2px)', // Slight lift effect on hover
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.2s ease-in-out',
                  width: { xs: '100%', sm: '200px' }, // Fixes the window.innerWidth issue completely
                  padding: '12px 30px',
                  fontSize: '16px',
                  borderRadius: '6px', 
                  textTransform: 'none',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  display: 'block', // Centers button nicely on sm screens if margin is added
                  ml: { xs: 0, sm: 'auto' } // Pushes button to the right on desktop, full width on mobile
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