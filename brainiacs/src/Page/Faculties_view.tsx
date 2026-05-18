import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  Box, 
  Dialog, 
  Skeleton, 
  Alert,
  Divider,
  Avatar,
  Paper
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Updated Interface matching your new Mongoose Schema exactly
interface FacultyData {
  _id: string;
  name: string;
  descriptions: string[];
  imageUrls: string[];
  coverImage: string;
  deanName: string;
  deanImage: string;
  deanDescription?: string;
}

// Helper function to generate the slug to match the URL
const generateSlug = (name: string) => {
  return encodeURIComponent(
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  );
};

const Faculties_view: React.FC = () => {
  const { name } = useParams<{ name: string }>(); 
  
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fontStyle = { fontFamily: '"Montserrat", sans-serif' };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        
        const res = await axios.get(`${API_BASE_URL}/api/faculties`);
        const allFaculties = res.data;

        // Find the faculty where the generated slug matches the URL param
        const matchedFaculty = allFaculties.find((f: FacultyData) => {
            const dbSlug = generateSlug(f.name);
            return dbSlug === name || dbSlug.includes(name || "");
        });

        if (matchedFaculty) {
          setFaculty(matchedFaculty);
          setError(null);
        } else {
          setError("Faculty not found. It might have been removed or the URL is incorrect.");
        }
        
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setError("Failed to connect to the campus database.");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchFaculty();
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2, mt: 10 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: { xs: 5, md: 8 } }}>
      {/* --- Cover Image Section --- */}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height="40vh" sx={{ mb: 4 }} />
      ) : (
        faculty?.coverImage && (
          <Box 
            sx={{ 
              width: '100%', 
              height: { xs: '30vh', md: '45vh' }, 
              backgroundImage: `url(${faculty.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              mb: 5
            }}
          >
            {/* Dark gradient overlay for better text readability if you add text over it */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' }} />
          </Box>
        )
      )}

      <Container maxWidth="lg">
        {/* --- Faculty Title --- */}
        {loading ? (
          <Skeleton variant="text" width="50%" height={60} sx={{ mb: 3 }} />
        ) : (
          <Typography
            variant="h3"
            sx={{
              ...fontStyle,
              fontWeight: 800,
              mb: 4,
              color: "#1a1a1a",
              mt: faculty?.coverImage ? 0 : 12 // Add margin if no cover image exists to clear navbar
            }}
          >
            {faculty?.name}
          </Typography>
        )}

        {/* --- Descriptions --- */}
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="90%" height={24} sx={{ mb: 2 }} />
            </>
          ) : (
            faculty?.descriptions?.map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  ...fontStyle,
                  color: "#444",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  mb: 2,
                  fontSize: '1.05rem'
                }}
              >
                {paragraph}
              </Typography>
            ))
          )}
        </Box>

        {/* --- Dean Profile Section --- */}
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 4, mb: 6 }} />
        ) : (
          faculty?.deanName && (
            <Paper elevation={0} sx={{ bgcolor: '#f8f9fa', borderRadius: 4, p: { xs: 3, md: 5 }, mb: 6, border: '1px solid #eaeaea' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 4 }}>
                <Avatar 
                  src={faculty.deanImage} 
                  alt={faculty.deanName}
                  sx={{ width: 150, height: 150, border: '4px solid #fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                />
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" sx={{ color: '#4caf50', fontWeight: 800, letterSpacing: 1.5 }}>
                    Message from the Dean
                  </Typography>
                  <Typography variant="h5" sx={{ ...fontStyle, fontWeight: 700, color: '#111', mt: 1, mb: 2 }}>
                    {faculty.deanName}
                  </Typography>
                  {faculty.deanDescription && (
                    <Typography variant="body1" sx={{ ...fontStyle, color: '#555', lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{faculty.deanDescription}"
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          )
        )}

        {/* --- Image Gallery --- */}
        {!loading && faculty?.imageUrls && faculty.imageUrls.length > 0 && (
          <>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h5" sx={{ ...fontStyle, fontWeight: 700, mb: 1, color: '#111' }}>
              Faculty Gallery
            </Typography>
            <Typography variant="body2" sx={{ ...fontStyle, fontStyle: "italic", color: "gray", mb: 4 }}>
              • Click on any image to view it in full screen
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2}>
              {faculty.imageUrls.map((img, index) => (
                <Card
                  key={index}
                  onClick={() => handleOpen(img)}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 calc(48% - 16px)", md: "1 1 calc(32% - 16px)" },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="260"
                    image={img}
                    alt={`${faculty.name} gallery image ${index + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              ))}
            </Box>
          </>
        )}

        {/* Image Dialog / Lightbox */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          PaperProps={{ sx: { borderRadius: 2, overflow: "hidden", bgcolor: 'transparent', boxShadow: 'none' } }}
        >
          {selectedImage && (
            <img src={selectedImage} alt="Enlarged faculty gallery" style={{ width: "100%", height: "auto", display: "block", borderRadius: '8px' }} />
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Faculties_view;