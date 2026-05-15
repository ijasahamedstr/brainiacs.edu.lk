import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardMedia, Box, Dialog, Skeleton, Alert } from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface matching your Mongoose Schema
interface EventData {
  _id: string;
  eventName: string;
  eventDescription: string[];
  eventPlace: string;
  eventTime: string;
  startDate: string;
  finishDate: string;
  imageUrls: string[];
}

// 1. Helper function to generate the slug (must match the one in NewsEvent exactly)
const generateEventSlug = (name: string) => {
  return encodeURIComponent(
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  );
};

const Event_view: React.FC = () => {
  const { name } = useParams<{ name: string }>(); 
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fontStyle = { fontFamily: '"Montserrat", sans-serif' };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // 2. Fetch ALL events from the generic endpoint instead of searching by specific name
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        const allEvents = res.data;

        // 3. Find the event whose generated slug matches the 'name' parameter in the URL
        const matchedEvent = allEvents.find(
          (e: EventData) => generateEventSlug(e.eventName) === name
        );

        if (matchedEvent) {
          setEvent(matchedEvent);
          setError(null);
        } else {
          setError("Event not found. It might have been removed or the URL is incorrect.");
        }
        
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to connect to the campus database.");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchEvent();
    }
  }, [name]);

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Event Title */}
      {loading ? (
        <Skeleton variant="text" width="60%" height={60} sx={{ mt: 10, mb: 2 }} />
      ) : (
        <Typography
          variant="h4"
          sx={{
            ...fontStyle,
            fontWeight: "bold",
            mt: 10,
            pt: 2,
            mb: 2,
            color: "#1a1a1a",
          }}
        >
          {event?.eventName}
        </Typography>
      )}

      {/* Event Details */}
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <Skeleton variant="rectangular" width="40%" height={100} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
              <strong>Place:</strong> {event?.eventPlace}
            </Typography>
            <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
              <strong>Event Time:</strong> {event?.eventTime}
            </Typography>
            <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
              <strong>Start Date:</strong> {formatDate(event?.startDate || "")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 0.5, ...fontStyle }}>
              <strong>Finish Date:</strong> {formatDate(event?.finishDate || "")}
            </Typography>
          </>
        )}
      </Box>

      {/* Event Description */}
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="90%" height={24} />
          </>
        ) : (
          event?.eventDescription?.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                ...fontStyle,
                color: "#333",
                lineHeight: 1.8,
                textAlign: "justify",
                mb: 2,
              }}
            >
              {paragraph}
            </Typography>
          ))
        )}
      </Box>

      {/* Note */}
      {!loading && event?.imageUrls && event.imageUrls.length > 0 && (
        <Typography
          variant="body2"
          sx={{ ...fontStyle, fontStyle: "italic", color: "gray", mb: 3 }}
        >
          • Click on the desired image to get a larger preview
        </Typography>
      )}

      {/* Images */}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 2, mb: 4 }} />
      ) : (
        event?.imageUrls && event.imageUrls.length > 0 && (
          <>
            {/* First Large Image */}
            <Card
              onClick={() => handleOpen(event.imageUrls[0])}
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
                image={event.imageUrls[0]}
                alt={`${event.eventName} main image`}
                sx={{ objectFit: "cover" }}
              />
            </Card>

            {/* Remaining Images */}
            {event.imageUrls.length > 1 && (
              <Box display="flex" flexWrap="wrap" gap={2}>
                {event.imageUrls.slice(1).map((img, index) => (
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
                      alt={`${event.eventName} image ${index + 2}`}
                      sx={{ objectFit: "cover" }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </>
        )
      )}

      {/* Image Dialog / Lightbox */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 2, overflow: "hidden" },
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