import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Box,
  Dialog,
  Skeleton,
  Alert,
  Button,
  Grid,
  Paper,
  Fade,
  IconButton,
  Divider
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface EventData {
  _id: string;
  eventName?: string;
  eventNames?: string;
  eventDescription?: string[];
  eventPlace?: string;
  eventTime?: string;
  startDate?: string;
  finishDate?: string;
  imageUrls?: string[];
}

const generateEventSlug = (name?: string) => {
  if (!name) return "";
  return encodeURIComponent(
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  );
};

const Event_view: React.FC = () => {
  const { eventslug } = useParams<{ eventslug: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Theme Constants
  const primaryFont = '"Montserrat", sans-serif';
  const brandBlue = "#0054f8";
  const brandBlueLight = "#e6f0ff";
  const darkNavy = "#0b1033";
  const textMuted = "#475569";
  const bgLight = "#f8fafc";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        const allEvents = res.data;

        const matchedEvent = allEvents.find((e: EventData) => {
          const nameToUse = e.eventName || e.eventNames || "";
          return generateEventSlug(nameToUse) === eventslug;
        });

        if (matchedEvent) {
          setEvent(matchedEvent);
          setError(null);
        } else {
          setError("Event not found. It might have been removed or the URL is incorrect.");
        }
      } catch (err: any) {
        console.error("Error fetching event:", err);
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        setError(`Failed to connect to the database. Reason: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (eventslug) {
      fetchEvent();
    }
  }, [eventslug]);

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "TBD";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ pt: { xs: 12, md: 20 }, pb: 4 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
        <Button 
          size="small"
          startIcon={<ArrowBackIcon fontSize="small" />} 
          onClick={() => navigate("/")} 
          sx={{ mt: 2, fontFamily: primaryFont, fontWeight: 700 }}
        >
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: bgLight, minHeight: "100vh", pt: { xs: 12, md: 20 }, pb: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        
        {/* Navigation & Title Section */}
        <Box sx={{ mb: 2 }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate(-1)}
            sx={{
              color: textMuted,
              fontWeight: 700,
              fontSize: "0.75rem",
              fontFamily: primaryFont,
              mb: 1,
              "&:hover": { color: brandBlue, bgcolor: "transparent" },
              transition: "0.2s",
            }}
          >
            Back to Events
          </Button>

          {loading ? (
            <Skeleton variant="text" width="60%" height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Fade in timeout={800}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: primaryFont,
                  fontWeight: 800,
                  color: darkNavy,
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.2px",
                }}
              >
                {event?.eventName || event?.eventNames || "Unnamed Event"}
              </Typography>
            </Fade>
          )}
        </Box>

        {/* Highlight Metadata Grid (Location, Time, Dates) */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {[
            { 
              icon: <LocationOnIcon sx={{ color: brandBlue, fontSize: 20 }} />, 
              label: "Location", 
              value: event?.eventPlace || "TBA" 
            },
            { 
              icon: <AccessTimeIcon sx={{ color: brandBlue, fontSize: 20 }} />, 
              label: "Time", 
              value: event?.eventTime || "TBA" 
            },
            { 
              icon: <EventAvailableIcon sx={{ color: brandBlue, fontSize: 20 }} />, 
              label: "Starts", 
              value: formatDate(event?.startDate) 
            },
            { 
              icon: <EventBusyIcon sx={{ color: brandBlue, fontSize: 20 }} />, 
              label: "Ends", 
              value: formatDate(event?.finishDate) 
            },
          ].map((info, idx) => (
            <Grid size={{ xs: 6, sm: 3 }} key={idx}>
              {loading ? (
                <Skeleton variant="rounded" height={70} sx={{ borderRadius: 2 }} />
              ) : (
                <Fade in timeout={800 + idx * 150}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      height: "100%",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 12px -5px rgba(0, 84, 248, 0.1)",
                        borderColor: brandBlueLight,
                      },
                    }}
                  >
                    <Box sx={{ p: 0.5, bgcolor: brandBlueLight, borderRadius: "8px", mb: 1, display: "flex" }}>
                      {info.icon}
                    </Box>
                    <Typography sx={{ color: textMuted, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: primaryFont }}>
                      {info.label}
                    </Typography>
                    <Typography sx={{ color: darkNavy, fontSize: "0.85rem", fontWeight: 700, fontFamily: primaryFont, mt: 0.2 }}>
                      {info.value}
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

        {/* Description Section */}
        <Box sx={{ mb: 4 }}>
          {loading ? (
            <Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </Box>
          ) : (
            <Fade in timeout={1000}>
              <Box>
                {event?.eventDescription?.map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      fontFamily: primaryFont,
                      color: textMuted,
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      mb: 1.5,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            </Fade>
          )}
        </Box>

        {/* Gallery Section */}
        <Box>
          {!loading && event?.imageUrls && event.imageUrls.length > 0 && (
            <Typography variant="h6" sx={{ fontFamily: primaryFont, fontWeight: 800, color: darkNavy, mb: 1.5 }}>
              Gallery
            </Typography>
          )}

          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: "12px", mb: 2 }} />
          ) : (
            event?.imageUrls && event.imageUrls.length > 0 && (
              <Fade in timeout={1200}>
                <Box>
                  {/* First Hero Image (Smaller Scale) */}
                  <Card
                    onClick={() => handleOpen(event.imageUrls![0])}
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px -5px rgba(0,0,0,0.1)",
                      position: "relative",
                      mb: 2,
                      "&:hover .img-zoom": { transform: "scale(1.02)" },
                      "&:hover .overlay": { opacity: 1 },
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      className="img-zoom"
                      component="img"
                      src={event.imageUrls[0]}
                      alt="Event main"
                      sx={{
                        width: "100%",
                        height: { xs: 200, md: 320 },
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease",
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: "rgba(11, 16, 51, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <ZoomInIcon sx={{ color: "white", fontSize: 40 }} />
                    </Box>
                  </Card>

                  {/* Remaining Grid Images (Smaller Scale) */}
                  {event.imageUrls.length > 1 && (
                    <Grid container spacing={1.5}>
                      {event.imageUrls.slice(1).map((img, index) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={index}>
                          <Card
                            onClick={() => handleOpen(img)}
                            sx={{
                              borderRadius: "10px",
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                              position: "relative",
                              cursor: "pointer",
                              "&:hover .img-zoom-small": { transform: "scale(1.03)" },
                              "&:hover .overlay-small": { opacity: 1 },
                            }}
                          >
                            <Box
                              className="img-zoom-small"
                              component="img"
                              src={img}
                              alt={`Event image ${index + 2}`}
                              sx={{
                                width: "100%",
                                height: 140,
                                objectFit: "cover",
                                display: "block",
                                transition: "transform 0.4s ease",
                              }}
                            />
                            <Box
                              className="overlay-small"
                              sx={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                bgcolor: "rgba(11, 16, 51, 0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.2s ease",
                              }}
                            >
                              <ZoomInIcon sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Fade>
            )
          )}
        </Box>

        {/* Lightbox Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          PaperProps={{
            sx: {
              borderRadius: "12px",
              overflow: "hidden",
              bgcolor: "transparent",
              boxShadow: "none",
            },
          }}
          BackdropProps={{
            sx: { bgcolor: "rgba(11, 16, 51, 0.9)" },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            {selectedImage && (
              <Box
                component="img"
                src={selectedImage}
                alt="Enlarged view"
                sx={{
                  width: "100%",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Event_view;