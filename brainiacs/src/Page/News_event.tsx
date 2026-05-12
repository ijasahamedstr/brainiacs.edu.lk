import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Skeleton,
  Alert,
  Fade,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  DialogTitle,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

/**
 * ENVIRONMENT CONFIGURATION
 */
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- Interfaces for Type Safety ---
interface NewsArticle {
  _id: string;
  heading: string;
  descriptionImage: string;
  descriptions: string[];
  createdAt: string;
}

interface CampusEvent {
  _id: string;
  eventName: string;
  eventPlace: string;
  eventTime?: string;
  startDate?: string;
  finishDate?: string;
  eventDescription?: string[];
  imageUrls?: string[];
  createdAt: string;
}

const NewsEvent: React.FC = () => {
  // --- State Hooks ---
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Modal States ---
  const [viewingItem, setViewingItem] = useState<NewsArticle | null>(null);
  const [viewingEventItem, setViewingEventItem] = useState<CampusEvent | null>(null);
  const [showAllNews, setShowAllNews] = useState<boolean>(false);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);

  // --- Branding & Styling Constants ---
  const primaryFont = '"Montserrat", sans-serif';
  const brandBlue = "#0054f8";
  const brandBlueLight = "#e6f0ff";
  const darkNavy = "#0b1033";
  const textMuted = "#475569";
  const bgLight = "#f8fafc";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, eventsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/news`),
        axios.get(`${API_BASE_URL}/api/events`),
      ]);

      const sortedNews = (newsRes.data || []).sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const sortedEvents = (eventsRes.data || []).sort((a: any, b: any) => {
        const dateA = a.startDate
          ? new Date(a.startDate).getTime()
          : new Date(a.createdAt).getTime();
        const dateB = b.startDate
          ? new Date(b.startDate).getTime()
          : new Date(b.createdAt).getTime();
        return dateA - dateB;
      });

      setNews(sortedNews);
      setEvents(sortedEvents);
      setError(null);
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Unable to synchronize with the campus database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const featuredArticle = useMemo(() => news[0], [news]);
  const upcomingFeed = useMemo(() => events.slice(0, 5), [events]);

  const formatDateBlock = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { month: "TBD", day: "-" };
    return {
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      day: d.getDate(),
      fullDate: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const EventCard = ({ item }: { item: CampusEvent }) => {
    const displayDate = item.startDate || item.createdAt;
    const dateData = formatDateBlock(displayDate);

    return (
      <Box
        onClick={() => setViewingEventItem(item)}
        sx={{
          display: "flex",
          alignItems: "center",
          p: { xs: 1.5, sm: 2 },
          borderRadius: "14px",
          bgcolor: "#F1F5F9",
          border: "1px solid #eef2f6",
          borderLeft: `4px solid #eef2f6`,
          boxShadow: "0 2px 8px -4px rgba(0,0,0,0.05)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderLeftColor: brandBlue,
            boxShadow: "0 10px 25px -8px rgba(11, 16, 51, 0.12)",
            transform: "translateY(-2px)",
            "& .date-box": { 
              background: `linear-gradient(135deg, ${brandBlue} 0%, #003bb3 100%)`, 
              color: "white",
              boxShadow: "0 4px 10px rgba(0, 84, 248, 0.3)"
            },
            "& .arrow-icon": {
              transform: "translateX(4px)",
              color: brandBlue
            }
          },
        }}
      >
        <Box
          className="date-box"
          sx={{
            minWidth: { xs: 45, sm: 55 },
            height: { xs: 45, sm: 55 },
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${brandBlueLight} 0%, #dbeafe 100%)`,
            color: brandBlue,
            mr: { xs: 1.5, sm: 2 },
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.5rem", sm: "0.55rem" },
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontFamily: primaryFont,
            }}
          >
            {dateData.month}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: primaryFont,
              mt: 0.2,
            }}
          >
            {dateData.day}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: darkNavy,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              lineHeight: 1.3,
              fontFamily: primaryFont,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 0.5
            }}
          >
            {item.eventName}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                fontWeight: 600,
                color: textMuted,
                fontFamily: primaryFont,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <PlaceIcon sx={{ fontSize: "1em", color: "#94a3b8" }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "120px" }}>
                {item.eventPlace}
              </span>
            </Typography>
            {item.eventTime && (
              <Typography
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  fontWeight: 600,
                  color: textMuted,
                  fontFamily: primaryFont,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: "1em", color: "#94a3b8" }} />
                <span>{item.eventTime}</span>
              </Typography>
            )}
          </Box>
        </Box>
        <ArrowForwardIcon
          className="arrow-icon"
          sx={{ fontSize: { xs: 14, sm: 18 }, color: "#cbd5e0", ml: 1, transition: "0.2s ease", flexShrink: 0 }}
        />
      </Box>
    );
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "white", py: { xs: 4, sm: 6, md: 8 }, display: "flex", justifyContent: "center" }}>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1440px",
          px: { xs: 2, sm: 3, md: 5, lg: 6 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
            alignItems: "stretch",
          }}
        >
          {/* LEFT COLUMN: Featured News */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: { xs: 2, md: 3 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontFamily: primaryFont,
                  color: darkNavy,
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  letterSpacing: "-0.5px",
                }}
              >
                Latest News
              </Typography>

              {!loading && news.length > 1 && (
                <Typography
                  onClick={() => setShowAllNews(true)}
                  sx={{
                    color: brandBlue,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontFamily: primaryFont,
                    fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  View All <ArrowForwardIcon sx={{ fontSize: "1em" }} />
                </Typography>
              )}
            </Box>

            {loading ? (
              <Skeleton variant="rectangular" sx={{ height: { xs: 350, md: 400 }, borderRadius: "20px" }} />
            ) : featuredArticle && (
              <Fade in timeout={800}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 20px 40px -10px rgba(0, 84, 248, 0.1)",
                    },
                  }}
                  onClick={() => setViewingItem(featuredArticle)}
                >
                  <Box
                    component="img"
                    src={featuredArticle.descriptionImage}
                    sx={{
                      width: "100%",
                      height: { xs: 180, sm: 220, md: 280 },
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <Box sx={{ p: { xs: 2.5, md: 3.5 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        label="Featured Story"
                        size="small"
                        sx={{
                          bgcolor: brandBlueLight,
                          color: brandBlue,
                          fontWeight: 800,
                          fontFamily: primaryFont,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          fontSize: "clamp(0.55rem, 1vw, 0.65rem)",
                          height: "auto",
                          py: 0.5,
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        mb: 1.5,
                        color: darkNavy,
                        fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                        fontFamily: primaryFont,
                        lineHeight: 1.3,
                      }}
                    >
                      {featuredArticle.heading}
                    </Typography>

                    <Box
                      sx={{
                        color: textMuted,
                        mb: { xs: 2, md: 3 },
                        fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)",
                        fontFamily: primaryFont,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                        "& *": {
                          display: "inline !important",
                          margin: "0 !important",
                          color: "inherit !important",
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: featuredArticle.descriptions[0] }}
                    />

                    <Box sx={{ mt: "auto" }}>
                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: "1.1em" }} />}
                        sx={{
                          color: brandBlue,
                          p: 0,
                          fontWeight: 800,
                          fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)",
                          fontFamily: primaryFont,
                          textTransform: "none",
                          "&:hover": { bgcolor: "transparent", color: "#0041c2", gap: 0.5 },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Read Full Story
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>

          {/* RIGHT COLUMN: Event Feed */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: { xs: 2, md: 3 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontFamily: primaryFont,
                  color: darkNavy,
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  letterSpacing: "-0.5px",
                }}
              >
                Upcoming Events
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: "14px" }} />
                  ))
                : upcomingFeed.map((item) => <EventCard key={item._id} item={item} />)}
            </Stack>

            {!loading && events.length > 5 && (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => setShowAllEvents(true)}
                sx={{
                  mt: 3,
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: 700,
                  fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)",
                  fontFamily: primaryFont,
                  color: darkNavy,
                  borderColor: "#cbd5e0",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: darkNavy },
                }}
              >
                Explore All Events
              </Button>
            )}
          </Box>
        </Box>

        {/* --- MODALS SECTION --- */}

        {/* 1. SINGLE NEWS ARTICLE MODAL */}
        <Dialog
          open={Boolean(viewingItem)}
          onClose={() => setViewingItem(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: "16px", md: "24px" },
              overflow: "hidden",
              m: { xs: 2, md: 4 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
              maxHeight: "85vh", 
              bgcolor: "white"
            },
          }}
        >
          {viewingItem && (
            <>
              {/* Added extra pt (padding-top) here to give more space above the image */}
              <Box sx={{ flexShrink: 0, px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 5 }, pb: { xs: 1, md: 1 } }}>
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={viewingItem.descriptionImage}
                    sx={{
                      width: "100%",
                      height: { xs: 180, sm: 240, md: 280 },
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "20px",
                      boxShadow: "0 16px 40px -12px rgba(11, 16, 51, 0.15)", 
                    }}
                  />
                  <IconButton
                    onClick={() => setViewingItem(null)}
                    sx={{
                      position: "absolute",
                      top: { xs: 12, md: 16 }, // Adjusted to stay properly inside the image wrapper
                      right: { xs: 12, md: 16 },
                      bgcolor: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&:hover": { bgcolor: "white", transform: "scale(1.05)" },
                      transition: "all 0.2s",
                    }}
                  >
                    <CloseIcon sx={{ color: darkNavy, fontSize: { xs: "1rem", md: "1.1rem" } }} />
                  </IconButton>
                </Box>
              </Box>

              <DialogContent sx={{ p: 0, bgcolor: "transparent" }}>
                <Box sx={{ px: { xs: 2.5, sm: 3, md: 4 }, pt: 1, pb: { md: 1 } }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontFamily: primaryFont,
                      color: darkNavy,
                      mb: 1.5,
                      fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                      lineHeight: 1.2,
                    }}
                  >
                    {viewingItem.heading}
                  </Typography>
                  <Typography
                    sx={{
                      color: textMuted,
                      fontWeight: 600,
                      fontSize: "clamp(0.7rem, 1.2vw, 0.8rem)",
                      fontFamily: primaryFont,
                    }}
                  >
                    Published • {formatDateBlock(viewingItem.createdAt).fullDate}
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, pt: { xs: 1, md: 1 } }}>
                  {viewingItem.descriptions.map((para, i) => (
                    <Box
                      key={i}
                      sx={{
                        fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                        color: "#334155",
                        lineHeight: 1.7,
                        mb: { xs: 2, md: 3 },
                        fontFamily: primaryFont,
                        "& p": { margin: 0, mb: 2 },
                        "& strong": { color: darkNavy, fontWeight: 800 },
                        "& a": {
                          color: brandBlue,
                          textDecoration: "none",
                          borderBottom: `1px solid ${brandBlueLight}`,
                          transition: "0.2s",
                          "&:hover": { borderBottomColor: brandBlue },
                        },
                        "& ul, & ol": { pl: { xs: 2, md: 3 }, mb: 2 },
                        "& li": { mb: 1 },
                      }}
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  ))}
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* 2. SINGLE EVENT MODAL */}
        <Dialog
          open={Boolean(viewingEventItem)}
          onClose={() => setViewingEventItem(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: "16px", md: "24px" },
              overflow: "hidden",
              m: { xs: 2, md: 4 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
              maxHeight: "85vh", 
              bgcolor: "white"
            },
          }}
        >
          {viewingEventItem && (
            <>
              {viewingEventItem.imageUrls && viewingEventItem.imageUrls.length > 0 ? (
                /* Added extra pt (padding-top) here to give more space above the image */
                <Box sx={{ flexShrink: 0, px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 5 }, pb: { xs: 1, md: 1 } }}>
                  <Box sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={viewingEventItem.imageUrls[0]}
                      sx={{
                        width: "100%",
                        height: { xs: 180, sm: 240, md: 280 },
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "20px",
                        boxShadow: "0 16px 40px -12px rgba(11, 16, 51, 0.15)",
                      }}
                    />
                    <IconButton
                      onClick={() => setViewingEventItem(null)}
                      sx={{
                        position: "absolute",
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        bgcolor: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "white", transform: "scale(1.05)" },
                        transition: "all 0.2s",
                      }}
                    >
                      <CloseIcon sx={{ color: darkNavy, fontSize: { xs: "1rem", md: "1.1rem" } }} />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "flex-end", px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 5 }, pb: 0 }}>
                  <IconButton onClick={() => setViewingEventItem(null)} sx={{ bgcolor: bgLight }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <DialogContent sx={{ p: 0, bgcolor: "transparent" }}>
                <Box sx={{ px: { xs: 2.5, sm: 3, md: 4 }, pt: 1, pb: { md: 1 } }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontFamily: primaryFont,
                      color: darkNavy,
                      mb: { xs: 2, md: 3 },
                      fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                      lineHeight: 1.2,
                    }}
                  >
                    {viewingEventItem.eventName}
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, md: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: { xs: 1.5, md: 2 }, bgcolor: brandBlueLight, borderRadius: "10px" }}>
                      <CalendarTodayIcon sx={{ color: brandBlue, fontSize: { xs: "1rem", md: "1.2rem" } }} />
                      <Box>
                        <Typography sx={{ fontSize: "clamp(0.6rem, 1vw, 0.7rem)", color: brandBlue, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: primaryFont }}>
                          Date & Time
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: darkNavy, fontFamily: primaryFont, fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)" }}>
                          {formatDateBlock(viewingEventItem.startDate || viewingEventItem.createdAt).fullDate}
                          {viewingEventItem.eventTime && ` • ${viewingEventItem.eventTime}`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: { xs: 1.5, md: 2 }, bgcolor: "#f1f5f9", borderRadius: "10px" }}>
                      <PlaceIcon sx={{ color: textMuted, fontSize: { xs: "1rem", md: "1.2rem" } }} />
                      <Box>
                        <Typography sx={{ fontSize: "clamp(0.6rem, 1vw, 0.7rem)", color: textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: primaryFont }}>
                          Location
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: darkNavy, fontFamily: primaryFont, fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)" }}>
                          {viewingEventItem.eventPlace}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, pt: { md: 1 } }}>
                  {viewingEventItem.eventDescription && viewingEventItem.eventDescription.length > 0 ? (
                    viewingEventItem.eventDescription.map((para, i) => (
                      <Typography
                        key={i}
                        sx={{
                          fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                          color: "#334155",
                          lineHeight: 1.7,
                          mb: { xs: 2, md: 2.5 },
                          fontFamily: primaryFont,
                        }}
                      >
                        {para}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ color: textMuted, fontStyle: "italic", fontFamily: primaryFont, fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)" }}>
                      No additional description provided for this event.
                    </Typography>
                  )}
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* 3. VIEW ALL NEWS MODAL */}
        <Dialog
          open={showAllNews}
          onClose={() => setShowAllNews(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: "12px", md: "16px" },
              m: { xs: 1, sm: 2, md: 4 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' },
              maxHeight: "85vh",
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 4 }, pb: { xs: 2, sm: 2.5, md: 3 }, flexShrink: 0 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontFamily: primaryFont, color: darkNavy, fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)" }}>
              All News & Stories
            </Typography>
            <IconButton onClick={() => setShowAllNews(false)} sx={{ bgcolor: bgLight }}>
              <CloseIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, bgcolor: bgLight }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                gap: { xs: 2, md: 2.5 },
              }}
            >
              {news.map((item) => (
                <Box
                  key={item._id}
                  onClick={() => setViewingItem(item)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 20px -5px rgba(0,0,0,0.1)" },
                  }}
                >
                  <Box component="img" src={item.descriptionImage} sx={{ width: "100%", height: { xs: 120, md: 140 }, objectFit: "cover" }} />
                  <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 800, color: darkNavy, fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)", fontFamily: primaryFont, mb: 1, lineHeight: 1.3 }}>
                      {item.heading}
                    </Typography>
                    <Typography sx={{ color: textMuted, fontSize: "clamp(0.65rem, 1vw, 0.75rem)", fontFamily: primaryFont, mt: "auto", pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
                      {formatDateBlock(item.createdAt).fullDate}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </DialogContent>
        </Dialog>

        {/* 4. EXPLORE ALL EVENTS MODAL */}
        <Dialog
          open={showAllEvents}
          onClose={() => setShowAllEvents(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: "12px", md: "16px" },
              m: { xs: 1, sm: 2, md: 4 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' },
              maxHeight: "85vh", 
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, sm: 4, md: 4 }, pb: { xs: 2, sm: 2.5, md: 3 }, flexShrink: 0 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontFamily: primaryFont, color: darkNavy, fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)" }}>
              Campus Events Directory
            </Typography>
            <IconButton onClick={() => setShowAllEvents(false)} sx={{ bgcolor: bgLight }}>
              <CloseIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, bgcolor: bgLight }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {events.map((item) => (
                <EventCard key={item._id} item={item} />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default NewsEvent;