import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, MenuItem, Select, FormControl, Chip, Avatar, GlobalStyles,Divider
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PhotoSizeSelectActualOutlined,
  DeleteOutline,
  CloudUploadOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

interface NewsItem {
  _id: string;
  heading: string;
  slug: string;
  author: string;
  status: 'draft' | 'published';
  descriptionImage: string;
  descriptions: string[];
  imageUrls: string[];
  tags: string[];
}

interface UpdateProps {
  itemData: NewsItem;
  onBack: () => void;
}

const UpdateNews = ({ itemData, onBack }: UpdateProps) => {
  const [heading, setHeading] = useState(itemData.heading || "");
  const [slug, setSlug] = useState(itemData.slug || "");
  const [author, setAuthor] = useState(itemData.author || "Admin");
  const [status, setStatus] = useState<'draft' | 'published'>(itemData.status || 'published');
  const [descriptionImage, setDescriptionImage] = useState(itemData.descriptionImage || "");
  const [richContent, setRichContent] = useState(itemData.descriptions?.join("<br/>") || "");
  const [imageUrls, setImageUrls] = useState<string[]>(itemData.imageUrls || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>(itemData.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const generateSlug = (text: string) => {
    const formatted = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(formatted);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const descriptionArray = [richContent]; 
      const response = await fetch(`${API_BASE_URL}/api/news/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          heading, slug, author, status, 
          descriptionImage, descriptions: descriptionArray, imageUrls, tags,
          wordCount: richContent.replace(/<[^>]*>/g, '').split(/\s+/).length 
        }),
      });
      if (response.ok) onBack();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
    },
    "& .MuiInputLabel-root": { fontFamily: primaryFont, fontWeight: 700 }
  };

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", width: "100%", pb: 15 }}>
      <GlobalStyles styles={{ 
        body: { fontFamily: primaryFont },
        ".ql-container": { fontFamily: `${primaryFont} !important`, fontSize: "16px" },
        ".ql-editor": { fontFamily: `${primaryFont} !important`, minHeight: "400px" },
        ".MuiMenuItem-root": { fontFamily: primaryFont }
      }} />

      {/* TOP NAVIGATION BAR */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 0, borderBottom: `1px solid ${borderColor}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" maxWidth="1200px" mx="auto">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={onBack} sx={{ bgcolor: "#F1F5F9" }}><ArrowBackIosNewOutlined sx={{ fontSize: 18 }} /></IconButton>
            <Box>
              <Typography sx={{ fontWeight: 900, fontFamily: primaryFont, color: primaryTeal, fontSize: "1.1rem" }}>Editorial Editor</Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontFamily: primaryFont }}>Editing: {itemData.heading.substring(0, 30)}...</Typography>
            </Box>
          </Stack>
          <Chip label={status.toUpperCase()} color={status === 'published' ? 'success' : 'default'} size="small" sx={{ fontWeight: 700 }} />
        </Stack>
      </Paper>

      {/* MAIN FORM CONTENT */}
      <Box sx={{ mx: "auto", p: { xs: 2, md: 4 } }}>
        <Stack spacing={4}>
          
          {/* Metadata Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1 }}>
              Core Information
            </Typography>
            <Stack spacing={3}>
              <TextField 
                fullWidth label="Article Headline" variant="outlined" value={heading}
                onChange={(e) => { setHeading(e.target.value); generateSlug(e.target.value); }}
                sx={inputStyle}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="URL Slug" value={slug} onChange={(e) => setSlug(e.target.value)} sx={inputStyle} />
                <TextField fullWidth label="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} sx={inputStyle} />
              </Stack>
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Publication Status</InputLabel>
                <Select label="Publication Status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <MenuItem value="draft">Draft (Hidden from Public)</MenuItem>
                  <MenuItem value="published">Published (Live on Site)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Featured Image Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, fontFamily: primaryFont }}>Featured Cover</Typography>
            <TextField fullWidth placeholder="Enter Cover Image URL..." value={descriptionImage} onChange={(e) => setDescriptionImage(e.target.value)} sx={{ ...inputStyle, mb: 2 }} />
            <Box sx={{ width: '100%', height: 350, borderRadius: "12px", bgcolor: "#F1F5F9", overflow: 'hidden', border: `1px solid ${borderColor}`, display: 'flex', position: 'relative' }}>
              {descriptionImage ? (
                <img src={descriptionImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                  <PhotoSizeSelectActualOutlined sx={{ color: "#CBD5E1", fontSize: 60 }} />
                  <Typography sx={{ fontFamily: primaryFont, color: "#94A3B8", mt: 1, fontWeight: 600 }}>No Cover Image Provided</Typography>
                </Stack>
              )}
            </Box>
          </Paper>

          {/* Editor Section */}
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", mb: 1.5, color: "#475569", fontFamily: primaryFont, ml: 1 }}>ARTICLE BODY CONTENT</Typography>
            <Box sx={{ 
              "& .ql-container": { borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px", bgcolor: "#FFF", border: `1px solid ${borderColor} !important` },
              "& .ql-toolbar": { borderTopLeftRadius: "16px", borderTopRightRadius: "16px", bgcolor: "#F8FAFC", border: `1px solid ${borderColor} !important` }
            }}>
              <ReactQuill theme="snow" value={richContent} onChange={setRichContent} modules={quillModules} />
            </Box>
          </Box>

          {/* Gallery & Tags */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: primaryFont }}>Assets & Taxonomy</Typography>
            
            <InputLabel sx={{ mb: 1, fontFamily: primaryFont, fontWeight: 700, fontSize: '0.8rem', color: primaryTeal }}>GALLERY IMAGES</InputLabel>
            <Stack direction="row" spacing={1} mb={3}>
              <TextField fullWidth placeholder="Add image URL to gallery..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} sx={inputStyle} />
              <Button variant="contained" onClick={() => { if(newImageUrl) { setImageUrls([...imageUrls, newImageUrl]); setNewImageUrl(""); } }} sx={{ borderRadius: "10px", bgcolor: primaryTeal, px: 3, fontFamily: primaryFont }}>Add</Button>
            </Stack>

            <Stack direction="row" spacing={2} mb={4} flexWrap="wrap" useFlexGap>
              {imageUrls.map((url, i) => (
                <Box key={i} sx={{ position: 'relative', width: 100, height: 100 }}>
                  <Avatar src={url} variant="rounded" sx={{ width: '100%', height: '100%', border: `1px solid ${borderColor}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <IconButton 
                    size="small" 
                    onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} 
                    sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, boxShadow: 2 }}
                  >
                    <DeleteOutline sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            <InputLabel sx={{ mb: 1, fontFamily: primaryFont, fontWeight: 700, fontSize: '0.8rem', color: primaryTeal }}>KEYWORDS / TAGS</InputLabel>
            <TextField fullWidth placeholder="Press Enter to add tags..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} sx={inputStyle} />
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
              {tags.map(tag => (
                <Chip key={tag} label={`#${tag}`} onDelete={() => setTags(tags.filter(t => t !== tag))} sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "#E2E8F0", color: "#475569" }} />
              ))}
            </Stack>
          </Paper>

        </Stack>
      </Box>

      {/* STICKY BOTTOM ACTIONS BAR */}
      <Paper 
        elevation={24} 
        sx={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, p: 2.5, 
          bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${borderColor}`, zIndex: 1000 
        }}
      >
        <Stack direction="row" spacing={3} justifyContent="flex-end" maxWidth="1200px" mx="auto" alignItems="center">
          <Button onClick={onBack} sx={{ color: "#64748B", fontWeight: 700, fontFamily: primaryFont, textTransform: 'none' }}>
            Cancel & Exit
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setConfirmDialogOpen(true)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadOutlined />}
            sx={{ 
              bgcolor: primaryTeal, px: 8, py: 1.5, borderRadius: "12px", 
              fontWeight: 800, fontFamily: primaryFont, textTransform: 'none',
              boxShadow: `0 10px 15px -3px ${primaryTeal}40`,
              '&:hover': { bgcolor: "#002d35", transform: 'translateY(-2px)' },
              transition: 'all 0.2s'
            }}
          >
            {loading ? "Saving Changes..." : "Publish Updates"}
          </Button>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, fontFamily: primaryFont, fontSize: "1.5rem" }}>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, color: "#475569" }}>
            You are about to push these changes to the live database. This action will immediately update the content for all readers.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B" }} onClick={() => setConfirmDialogOpen(false)}>Go Back</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ bgcolor: primaryTeal, px: 4, borderRadius: "10px", fontFamily: primaryFont, fontWeight: 800 }}>Confirm & Sync</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateNews;