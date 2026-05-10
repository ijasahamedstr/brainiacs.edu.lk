import React, { useState } from "react";
import { Container, Typography, Card, CardMedia, Box, Dialog } from "@mui/material";

const Event_view: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const event = {
    title: "Spark",
    place: "London Conference Center",
    startDate: "August 30, 2025",
    endDate: "August 30, 2025",
    time: "09:00 AM - 05:00 PM",
    description: `We were excited to unite professionals, researchers, and thought leaders to explore cutting-edge trends, breakthroughs, and strategies. The event featured insightful presentations, engaging discussions, and valuable networking opportunities. A highlight of the day was Prof. Dr. Rer. Nat. Siegfried Zum’s keynote on System Thinking – Modeling and Simulation, offering deep expertise and fresh perspectives.`,
    note: "Click on the desired image to get a larger preview",
  };

  const images = [
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-1-1.webp",
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-2.webp",
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-3.webp",
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-4.webp",
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-5.webp",
    "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-6.webp",
  ];

  const fontStyle = { fontFamily: '"Montserrat", sans-serif' };

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Event Title with Added Top Spacing */}
      <Typography
        variant="h4"
        sx={{ 
          ...fontStyle, 
          fontWeight: "bold", 
          mt: 10, // Added Margin Top
          pt: 2, // Added Padding Top
          mb: 2, 
          color: "#1a1a1a" 
        }}
      >
        {event.title}
      </Typography>

      {/* Event Description */}
      <Typography
        variant="body1"
        sx={{ 
          ...fontStyle, 
          color: "#333", 
          lineHeight: 1.8, 
          textAlign: "justify", 
          mb: 2 
        }}
      >
        {event.description}
      </Typography>

      {/* Event Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
          <strong>Place:</strong> {event.place}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
          <strong>Event Time:</strong> {event.time}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
          <strong>Start Date:</strong> {event.startDate}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
          <strong>Finish Date:</strong> {event.endDate}
        </Typography>
      </Box>

      {/* Note */}
      <Typography
        variant="body2"
        sx={{ ...fontStyle, fontStyle: "italic", color: "gray", mb: 3 }}
      >
        • {event.note}
      </Typography>

      {/* First Large Image */}
      <Card
        onClick={() => handleOpen(images[0])}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease, boxShadow 0.3s ease",
          mb: 4,
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            cursor: "pointer",
          },
        }}
      >
        <CardMedia 
          component="img" 
          height="450" 
          image={images[0]} 
          alt="Main event image" 
          sx={{ objectFit: "cover" }} 
        />
      </Card>

      {/* Remaining Images */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {images.slice(1).map((img, index) => (
          <Card
            key={index}
            onClick={() => handleOpen(img)}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(48% - 16px)", md: "1 1 calc(32% - 16px)" },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                cursor: "pointer",
              },
            }}
          >
            <CardMedia 
              component="img" 
              height="220" 
              image={img} 
              alt={`Event image ${index + 2}`} 
              sx={{ objectFit: "cover" }} 
            />
          </Card>
        ))}
      </Box>

      {/* Image Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 2, overflow: "hidden" }
        }}
      >
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Enlarged event" 
            style={{ width: "100%", height: "auto", display: "block" }} 
          />
        )}
      </Dialog>
    </Container>
  );
};

export default Event_view;