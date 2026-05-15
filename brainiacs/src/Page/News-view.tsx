import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  CircularProgress,
  Alert
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";

// Fixed Interface: Added tags and category for dynamic sidebar generation
interface NewsArticle {
  _id: string;
  heading: string;
  slug: string;
  descriptionImage: string;
  descriptions: string[];
  imageUrls: string[];
  createdAt: string;
  author?: string; 
  tags?: string[];      // Array of tags from your database
  category?: string;    // Fallback if you use a single category string instead of tags
}

const NewsView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  
  // Dynamic Sidebar States
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [archives, setArchives] = useState<{month: string, count: number}[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const theme = useTheme();
  // Triggers the mobile/tablet horizontal slider for screens below desktop (1200px)
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const baseUrl = API_BASE_URL?.replace(/\/$/, "") || "";
        const response = await fetch(`${baseUrl}/api/news`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch news details");
        }
        
        const data = await response.json();
        const allNews: NewsArticle[] = data.data || data;
        
        // 1. Find current article
        const currentArticle = allNews.find(n => n.slug === slug);
        if (currentArticle) {
          setArticle(currentArticle);
        } else {
          setError("News article not found.");
        }

        // 2. Get recent news (excluding current)
        const otherNews = allNews.filter(n => n.slug !== slug).slice(0, 4);
        setRecentNews(otherNews);

        // 3. GENERATE DYNAMIC CATEGORIES/TAGS
        const categoryCounts: Record<string, number> = {};
        allNews.forEach(news => {
          if (news.tags && Array.isArray(news.tags)) {
            news.tags.forEach(tag => {
              categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
            });
          } else if (news.category) {
            categoryCounts[news.category] = (categoryCounts[news.category] || 0) + 1;
          }
        });
        
        const dynamicCategories = Object.keys(categoryCounts)
          .map(name => ({ name, count: categoryCounts[name] }))
          .sort((a, b) => b.count - a.count); // Sort by highest count first
        
        setCategories(dynamicCategories);

        // 4. GENERATE DYNAMIC ARCHIVES (Group by Month & Year)
        const archiveCounts: Record<string, number> = {};
        allNews.forEach(news => {
          if (news.createdAt) {
            const date = new Date(news.createdAt);
            // Formats to "June 2024", "July 2024", etc.
            const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            archiveCounts[monthYear] = (archiveCounts[monthYear] || 0) + 1;
          }
        });

        const dynamicArchives = Object.keys(archiveCounts)
          .map(month => ({ month, count: archiveCounts[month] }))
          .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()); // Sort chronologically (newest first)
        
        setArchives(dynamicArchives);

      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [slug]);

  const handleOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#1E56A0" }} />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box sx={{ py: 10, textAlign: "center", minHeight: "60vh" }}>
        <Alert severity="error" sx={{ display: "inline-flex" }}>{error || "Article not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: '"Montserrat", sans-serif', color: "#1a1a1a", backgroundColor: "#fafafa", minHeight: "100vh", pb: 8 }}>
       <Box
          sx={{
            backgroundColor: "#1E56A0",
            py: { xs: 4, sm: 5, md: 6 }, 
            px: { xs: 2, md: 0 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              fontFamily: '"Montserrat", sans-serif',
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } 
            }}
          >
            Our Partners
          </Typography>
        </Box>
        
      {/* Dynamic Global Styles for the Animated Cards */}
      <style>
        {`
          .animated-card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            height: 100%; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: left;
            text-decoration: none;
            color: inherit;
          }

          .animated-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 40px rgba(30, 86, 160, 0.15);
          }

          .card-image-wrapper {
            overflow: hidden;
            width: 100%;
            height: 180px;
          }

          .news-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .animated-card:hover .news-image {
            transform: scale(1.08);
          }

          .news-info {
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
          }

          .news-title {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #1a1a1a;
            font-family: 'Montserrat', sans-serif;
            line-height: 1.3;
            transition: color 0.3s ease;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .animated-card:hover .news-title {
            color: #1E56A0;
          }
        `}
      </style>

      {/* Main Content + Sidebar in an LG Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 0 } }}> 
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={{ xs: 4, md: 5 }}> 
          
          {/* ---------- MAIN ARTICLE ---------- */}
          <Box flex={3} sx={{ minWidth: 0 }}> 
            {/* Main Cover Image */}
            <Box 
              component="img" 
              src={article.descriptionImage} 
              alt={article.heading}
              sx={{ 
                width: "100%", 
                height: { xs: "220px", sm: "320px", md: "400px" }, 
                objectFit: "cover", 
                borderRadius: "12px", 
                mb: { xs: 2, md: 4 }, 
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)" 
              }}
            />

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: '"Montserrat", sans-serif', fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" }, color: "#1E56A0", wordWrap: "break-word" }}>
              {article.heading}
            </Typography>

            <Typography variant="body2" sx={{ color: "gray", mb: 3, fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>
              {formatDate(article.createdAt)} • By {article.author || "Admin"}
            </Typography>

            <Box sx={{ fontFamily: '"Montserrat", sans-serif', color: "#333", fontSize: { xs: "1rem", md: "1.05rem" }, lineHeight: 1.8, mb: 4, textAlign: "justify", overflowWrap: "break-word" }}>
              {article.descriptions && article.descriptions.map((desc, i) => (
                <div 
                  key={i} 
                  dangerouslySetInnerHTML={{ __html: desc }} 
                  style={{ marginBottom: "16px" }} 
                />
              ))}
            </Box>

            {/* Note & Gallery */}
            {article.imageUrls && article.imageUrls.length > 0 && (
              <>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray", mt: 4, mb: 2, fontFamily: '"Montserrat", sans-serif' }}>
                  • Click on the images to enlarge them
                </Typography>

                <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={2}>
                  {article.imageUrls.map((img, index) => (
                    <Card
                      key={index}
                      onClick={() => handleOpen(img)}
                      sx={{
                        borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease", cursor: "pointer",
                        "&:hover": { transform: "scale(1.03)", boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
                      }}
                    >
                      <CardMedia component="img" height={200} image={img} alt={`Gallery image ${index + 1}`} sx={{ objectFit: "cover" }} />
                    </Card>
                  ))}
                </Box>
              </>
            )}
          </Box>

          {/* ---------- SIDEBAR ---------- */}
          <Box flex={1} sx={{ minWidth: { md: 280, lg: 300 }, maxWidth: { xs: "100%", md: "350px" } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, borderBottom: "3px solid #00cc99", display: "inline-block", fontFamily: '"Montserrat", sans-serif' }}>
              Recent Posts
            </Typography>
            <List sx={{ pt: 0 }}>
              {recentNews.length > 0 ? (
                recentNews.map((post, i) => (
                  <ListItem 
                    key={i} 
                    disablePadding 
                    component={Link}
                    to={`/news/${post.slug}`}
                    sx={{ 
                      mb: 1.5, 
                      alignItems: "flex-start",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover .MuiTypography-root": { color: "#1E56A0" } 
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, mt: 0.5, color: "#1E56A0" }}>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={post.heading} 
                      primaryTypographyProps={{ 
                        fontSize: 14, 
                        fontFamily: '"Montserrat", sans-serif', 
                        fontWeight: 600, 
                        lineHeight: 1.4,
                        sx: { transition: "color 0.2s ease" }
                      }} 
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                  No recent posts available.
                </Typography>
              )}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, borderBottom: "3px solid #00cc99", display: "inline-block", fontFamily: '"Montserrat", sans-serif' }}>
              Categories
            </Typography>
            <List sx={{ pt: 0 }}>
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: "#1E56A0" }}>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${cat.name} (${cat.count})`} primaryTypographyProps={{ fontSize: 14, fontFamily: '"Montserrat", sans-serif', fontWeight: 500 }} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                  No categories found.
                </Typography>
              )}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, borderBottom: "3px solid #00cc99", display: "inline-block", fontFamily: '"Montserrat", sans-serif' }}>
              Archives
            </Typography>
            <List sx={{ pt: 0 }}>
              {archives.length > 0 ? (
                archives.map((arc, i) => (
                  <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: "#1E56A0" }}>
                      <CheckCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${arc.month} (${arc.count})`} primaryTypographyProps={{ fontSize: 14, fontFamily: '"Montserrat", sans-serif', fontWeight: 500 }} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                  No archives available.
                </Typography>
              )}
            </List>
          </Box>
        </Box>
      </Container>

      {/* ---------- RECENT NEWS SECTION ---------- */}
      {recentNews.length > 0 && (
        <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 }, pb: 4, px: { xs: 0, sm: 3, lg: 0 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: "center", fontFamily: '"Montserrat", sans-serif', color: "#1E56A0", fontSize: { xs: "1.75rem", md: "2.125rem" } }}>
            More Recent News
          </Typography>

          {isMobileOrTablet ? (
            <Box sx={{ 
              display: "flex", 
              overflowX: "auto", 
              gap: { xs: 2, sm: 3 }, 
              scrollSnapType: "x mandatory", 
              scrollBehavior: "smooth", 
              px: { xs: 2, sm: 0 }, 
              pb: 3, 
              "&::-webkit-scrollbar": { display: "none" } 
            }}>
              {recentNews.map((event, index) => (
                <Box key={index} sx={{ 
                  flex: { 
                    xs: "0 0 88%", 
                    sm: "0 0 60%", 
                    md: "0 0 45%"  
                  }, 
                  scrollSnapAlign: "center" 
                }}>
                  <Link to={`/news/${event.slug}`} style={{ textDecoration: "none" }}>
                    <div className="animated-card">
                      <div className="card-image-wrapper">
                        <img src={event.descriptionImage || "https://via.placeholder.com/600x400?text=No+Image"} alt={event.heading} className="news-image" />
                      </div>
                      <div className="news-info">
                        <h3 className="news-title">{event.heading}</h3>
                        <p style={{ color: "gray", fontSize: "0.85rem", margin: "4px 0", fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>{formatDate(event.createdAt)}</p>
                        <span style={{ marginTop: "12px", fontSize: "0.9rem", color: "#1E56A0", fontWeight: 700 }}>Read More →</span>
                      </div>
                    </div>
                  </Link>
                </Box>
              ))}
            </Box>
          ) : (
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={3}>
              {recentNews.map((event, index) => (
                <Box key={index}>
                  <Link to={`/news/${event.slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
                    <div className="animated-card">
                      <div className="card-image-wrapper">
                        <img src={event.descriptionImage || "https://via.placeholder.com/600x400?text=No+Image"} alt={event.heading} className="news-image" />
                      </div>
                      <div className="news-info">
                        <h3 className="news-title">{event.heading}</h3>
                        <p style={{ color: "gray", fontSize: "0.85rem", margin: "4px 0", fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>{formatDate(event.createdAt)}</p>
                        <span style={{ marginTop: "12px", fontSize: "0.9rem", color: "#1E56A0", fontWeight: 700 }}>Read More →</span>
                      </div>
                    </div>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      )}

      {/* Image Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
        {selectedImage && <img src={selectedImage} alt="Enlarged news gallery item" style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }} />}
      </Dialog>
    </Box>
  );
};

export default NewsView;