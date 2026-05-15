import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Dialog, 
  CircularProgress,
  Alert
} from "@mui/material";

interface StudentLifeEvent {
  _id: string;
  name: string;
  descriptions: string[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

const Studentlifeview: React.FC = () => {
  // Grab the event name from the URL params
  const { eventName } = useParams<{ eventName: string }>();
  
  const [event, setEvent] = useState<StudentLifeEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch data dynamically
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/api/student-life`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        
        const data = await response.json();
        const events: StudentLifeEvent[] = data.data || data;
        
        // Find the specific event that matches the URL param
        const foundEvent = events.find(
          (e) => e.name.replace(/\s+/g, "-").toLowerCase() === eventName
        );

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventName) {
      fetchEvent();
    }
  }, [eventName]);

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", pb: 10 }}>
      
      {/* 🔵 Blue Header (Matched to Studentlife & Partners) */}
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: { xs: 4, md: 8 },
          textAlign: "center",
          px: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 2
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: "1px",
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 1
          }}
        >
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#cce4ff",
            fontFamily: '"Montserrat", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: { xs: "0.85rem", md: "1rem" },
            fontWeight: 500
          }}
        >
     </Typography>
      </Box>

      {/* Injecting Modern Animations */}
      <style>
        {`
          @keyframes popIn {
            0% { opacity: 0; transform: translateY(50px) scale(0.95); }
            70% { transform: translateY(-5px) scale(1.01); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          .animated-img-card {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.06);
            background: #fff;
            cursor: pointer;
            animation: popIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: block;
          }

          .animated-img-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 16px 32px rgba(30, 86, 160, 0.15);
          }

          .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.6s ease;
          }

          .animated-img-card:hover .gallery-image {
            transform: scale(1.05);
          }
        `}
      </style>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        
        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#1E56A0" }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <Alert severity="error" sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: "1.1rem" }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Loaded Event Content */}
        {!isLoading && !error && event && (
          <>
            {/* Event Descriptions */}
            <Box sx={{ maxWidth: "900px", margin: "0 auto", mb: 5 }}>
              {event.descriptions && event.descriptions.map((desc, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{ 
                    fontFamily: '"Montserrat", sans-serif', 
                    color: "#444", 
                    lineHeight: 1.8, 
                    textAlign: "justify", 
                    mb: 2,
                    fontSize: { xs: "1rem", md: "1.05rem" }
                  }}
                >
                  {desc}
                </Typography>
              ))}
            </Box>

            {/* Note */}
            {event.imageUrls && event.imageUrls.length > 0 && (
              <Typography
                variant="body2"
                align="center"
                sx={{ 
                  fontFamily: '"Montserrat", sans-serif', 
                  fontStyle: "italic", 
                  color: "#888", 
                  mb: 4 
                }}
              >
                • Click on the desired image to get a larger preview
              </Typography>
            )}

            {/* First Large Image */}
            {event.imageUrls && event.imageUrls.length > 0 && (
              <Box
                className="animated-img-card"
                onClick={() => handleOpen(event.imageUrls[0])}
                sx={{ mb: 4, height: { xs: "250px", sm: "400px", md: "500px" } }}
                style={{ animationDelay: "0s" }}
              >
                <img
                  src={event.imageUrls[0]}
                  alt={`${event.name} main event`}
                  className="gallery-image"
                />
              </Box>
            )}

            {/* Remaining Images Grid */}
            {event.imageUrls && event.imageUrls.length > 1 && (
              <Box display="flex" flexWrap="wrap" gap={3}>
                {event.imageUrls.slice(1).map((img, index) => (
                  <Box
                    key={index}
                    className="animated-img-card"
                    onClick={() => handleOpen(img)}
                    sx={{
                      flex: "1 1 calc(33.333% - 24px)",
                      minWidth: "250px",
                      height: "220px"
                    }}
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }} // Staggered pop-in
                  >
                    <img
                      src={img}
                      alt={`${event.name} image ${index + 2}`}
                      className="gallery-image"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Image Modal/Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="lg"
          PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              overflow: 'hidden',
              borderRadius: '8px'
            },
          }}
        >
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Enlarged event" 
              style={{ 
                width: "100%", 
                maxHeight: "90vh", 
                objectFit: "contain", 
                display: "block" 
              }} 
            />
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Studentlifeview;