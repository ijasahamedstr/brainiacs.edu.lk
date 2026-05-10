import React, { useState } from "react";
import { Container, Typography, Card, CardMedia, Box, Dialog } from "@mui/material";

const Studentlifeview: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const event = {
    title: "Spark",
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
      {/* Event Title */}
      <Typography
        variant="h4"
        sx={{ ...fontStyle, fontWeight: "bold", mb: 2, color: "#1a1a1a" }}
      >
        {event.title}
      </Typography>

      {/* Event Description */}
      <Typography
        variant="body1"
        sx={{ ...fontStyle, color: "#333", lineHeight: 1.8, textAlign: "justify", mb: 2 }}
      >
        {event.description}
      </Typography>

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
            transform: "scale(1.03)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            cursor: "pointer",
          },
        }}
      >
        <CardMedia component="img" height="400" image={images[0]} alt="Main event image" sx={{ objectFit: "cover" }} />
      </Card>

      {/* Remaining Images */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {images.slice(1).map((img, index) => (
          <Card
            key={index}
            onClick={() => handleOpen(img)}
            sx={{
              flex: "1 1 calc(33% - 16px)",
              minWidth: 200,
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
            <CardMedia component="img" height="180" image={img} alt={`Event image ${index + 2}`} sx={{ objectFit: "cover" }} />
          </Card>
        ))}
      </Box>

      {/* Image Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        {selectedImage && (
          <img src={selectedImage} alt="Enlarged event" style={{ width: "100%", height: "auto" }} />
        )}
      </Dialog>
    </Container>
  );
};

export default Studentlifeview;
