import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Box,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";

interface NewsArticle {
  title: string;
  content: string;
  date: string;
  images: string[];
  note?: string;
}

const NewsView: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  const article: NewsArticle = {
    title: "Lyceum Spark 2025: Advancing Research & Innovation",
    date: "August 30, 2025",
    content: `We were thrilled to host Spark 2025 at the Lyceum campus, bringing together professionals, researchers, and thought leaders to explore cutting-edge trends and strategies. Attendees enjoyed insightful presentations, engaging discussions, and networking opportunities. Prof. Dr. Rer. Nat. Siegfried Zum delivered a keynote on System Thinking – Modeling and Simulation, offering fresh perspectives and deep expertise.`,
    images: [
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-1-1.webp",
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-2.webp",
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-3.webp",
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-4.webp",
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-5.webp",
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-6.webp",
    ],
    note: "Click on the images to enlarge them",
  };

  const recentNews = [
    {
      title: "Lyceum Tech Fest 2025",
      date: "July 15, 2025",
      description:
        "Celebrating technology, innovation, and creativity with hands-on workshops.",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-1-1.webp",
    },
    {
      title: "Alumni Meet 2025",
      date: "June 10, 2025",
      description:
        "A gathering of our distinguished alumni to share experiences and network.",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-2.webp",
    },
    {
      title: "Research Symposium 2025",
      date: "May 20, 2025",
      description:
        "Highlighting groundbreaking research conducted by our faculty and students.",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-6.webp",
    },
    {
      title: "Innovation Awards 2025",
      date: "April 12, 2025",
      description:
        "Recognizing outstanding innovation projects and academic excellence.",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/spark-2025-lyceum-campus-3.webp",
    },
  ];

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#fff",
  };

  const imageStyles: React.CSSProperties = {
    width: "100%",
    height: 180,
    objectFit: "cover",
  };

  const infoStyles: React.CSSProperties = {
    padding: "12px",
  };

  const readMoreStyles: React.CSSProperties = {
    marginTop: 8,
    fontWeight: 600,
    color: "#1E56A0",
  };

  const categories = [
    { name: "Student Life", count: 0 },
    { name: "Your Gateway to Success", count: 11 },
  ];

  const archives = [
    { month: "June 2024", count: 2 },
    { month: "May 2024", count: 3 },
    { month: "March 2024", count: 3 },
    { month: "December 2023", count: 2 },
    { month: "November 2023", count: 1 },
  ];

  return (
    <Box sx={{ fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      {/* ---------- MAIN CONTENT + SIDEBAR ---------- */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {/* ---------- MAIN ARTICLE ---------- */}
          <Box flex={3}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {article.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "gray",
                mb: 2,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {article.date}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                textAlign: "justify",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {article.content}
            </Typography>

            {article.note && (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "gray",
                  mb: 3,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                • {article.note}
              </Typography>
            )}

            {/* ---------- IMAGES ---------- */}
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              }}
              gap={2}
            >
              {article.images.map((img, index) => (
                <Card
                  key={index}
                  onClick={() => handleOpen(img)}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={img}
                    alt={`News image ${index + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              ))}
            </Box>
          </Box>

          {/* ---------- SIDEBAR ---------- */}
          <Box flex={1} minWidth={280}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                borderBottom: "2px solid #00cc99",
                display: "inline-block",
              }}
            >
              Recent Posts
            </Typography>
            <List>
              {[
                "ESOFT's Level 3 Diplomas!",
                "Financial Barriers to Obtaining World-Class Degrees Removed!",
                "World-recognised foreign degrees within reach!",
                "Launching Your Child’s Global Career Locally!",
              ].map((post, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30, color: "#0a5397" }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={post}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                borderBottom: "2px solid #00cc99",
                display: "inline-block",
              }}
            >
              Categories
            </Typography>
            <List>
              {categories.map((cat, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30, color: "#0a5397" }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${cat.name} (${cat.count})`}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                borderBottom: "2px solid #00cc99",
                display: "inline-block",
              }}
            >
              Archives
            </Typography>
            <List>
              {archives.map((arc, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30, color: "#0a5397" }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${arc.month} (${arc.count})`}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>

      {/* ---------- RECENT NEWS SECTION ---------- */}
      <Container maxWidth="lg" sx={{ mt: 8, pb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Recent News
        </Typography>

        {isMobileOrTablet ? (
          // ✅ 1-card slider for Mobile & Tablet
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              px: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {recentNews.map((event, index) => (
              <Box
                key={index}
                sx={{
                  flex: "0 0 100%", // ✅ One card at a time
                  scrollSnapAlign: "center",
                }}
              >
                <div
                  style={cardStyles}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-6px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  <img src={event.image} alt={event.title} style={imageStyles} />
                  <div style={infoStyles}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </h3>
                    <p style={{ color: "gray", margin: "4px 0" }}>
                      {event.date}
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: 14,
                        color: "#555",
                      }}
                    >
                      {event.description}
                    </p>
                    <span style={readMoreStyles}>Read More →</span>
                  </div>
                </div>
              </Box>
            ))}
          </Box>
        ) : (
          // ✅ Grid for Desktop
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            }}
            gap={3}
          >
            {recentNews.map((event, index) => (
              <Box key={index}>
                <div
                  style={cardStyles}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-6px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  <img src={event.image} alt={event.title} style={imageStyles} />
                  <div style={infoStyles}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </h3>
                    <p style={{ color: "gray", margin: "4px 0" }}>
                      {event.date}
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: 14,
                        color: "#555",
                      }}
                    >
                      {event.description}
                    </p>
                    <span style={readMoreStyles}>Read More →</span>
                  </div>
                </div>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* ---------- IMAGE DIALOG ---------- */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged news"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default NewsView;
