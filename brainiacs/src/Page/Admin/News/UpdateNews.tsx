import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, MenuItem, Select, FormControl, Chip, GlobalStyles, Divider,
  InputAdornment, Snackbar, Alert
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PhotoSizeSelectActualOutlined,
  DeleteOutline, AddOutlined,
  CloudUploadOutlined,
  CollectionsOutlined, HideImageOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "37cd6333d9f4bd044c4a4dcc867276ae";
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

// --- CLIENT-SIDE IMAGE COMPRESSION ---
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; 
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file); 
              }
            },
            "image/jpeg",
            0.75 
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
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
  // --- STATE ---
  const [heading, setHeading] = useState(itemData.heading || "");
  const [slug, setSlug] = useState(itemData.slug || "");
  const [author, setAuthor] = useState(itemData.author || "Admin");
  const [status, setStatus] = useState<'draft' | 'published'>(itemData.status || 'published');
  const [descriptionImage, setDescriptionImage] = useState(itemData.descriptionImage || "");
  const [richContent, setRichContent] = useState(itemData.descriptions?.join("<br/>") || "");
  const [imageUrls, setImageUrls] = useState<string[]>(itemData.imageUrls?.length ? itemData.imageUrls : [""]);
  const [tags, setTags] = useState<string[]>(itemData.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  // --- SYSTEM STATE ---
  const [loading, setLoading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingGalleryIndices, setUploadingGalleryIndices] = useState<number[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" as "success" | "error" });

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

  // --- IMGBB UPLOAD ENGINE ---
  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  };

  // SINGLE UPLOAD: Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingCover(true);
      try {
        const compressedFile = await compressImage(e.target.files[0]);
        const url = await uploadToImgBB(compressedFile);
        setDescriptionImage(url);
        setSnackbar({ open: true, message: "Cover image uploaded successfully", type: "success" });
      } catch (error) {
        console.error("Image upload failed:", error);
        setSnackbar({ open: true, message: "Failed to upload cover image.", type: "error" });
      } finally {
        setIsUploadingCover(false);
      }
    }
  };

  // MULTI-UPLOAD: Individual Gallery Row
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadingGalleryIndices(prev => [...prev, index]);
      
      try {
        const uploadedUrls: string[] = [];
        for (const file of files) {
          const compressedFile = await compressImage(file);
          const url = await uploadToImgBB(compressedFile);
          uploadedUrls.push(url);
        }
        
        setImageUrls(prev => {
          const updated = [...prev];
          updated[index] = uploadedUrls[0]; 
          if (uploadedUrls.length > 1) {
            return [...updated, ...uploadedUrls.slice(1)]; 
          }
          return updated;
        });
        
        setSnackbar({ open: true, message: `Successfully uploaded ${files.length} asset(s)`, type: "success" });
      } catch (error) {
        console.error("Gallery image upload failed:", error);
        setSnackbar({ open: true, message: "Failed to upload gallery image(s).", type: "error" });
      } finally {
        setUploadingGalleryIndices(prev => prev.filter(i => i !== index));
        e.target.value = ""; 
      }
    }
  };

  // MULTI-UPLOAD: Bulk Upload Button
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsBulkUploading(true);
      try {
        const newUrls: string[] = [];
        for (const file of files) {
          const compressed = await compressImage(file);
          const url = await uploadToImgBB(compressed);
          newUrls.push(url);
        }
        setImageUrls(prev => {
          const filtered = prev.filter(u => u.trim() !== ""); 
          return [...filtered, ...newUrls].length ? [...filtered, ...newUrls] : [""];
        });
        setSnackbar({ open: true, message: `Successfully bulk uploaded ${files.length} asset(s)`, type: "success" });
      } catch (error) {
        console.error("Bulk upload failed:", error);
        setSnackbar({ open: true, message: "Failed to upload one or more images.", type: "error" });
      } finally {
        setIsBulkUploading(false);
        e.target.value = '';
      }
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
          descriptionImage, descriptions: descriptionArray, 
          imageUrls: imageUrls.filter(u => u.trim() !== ""), 
          tags,
          wordCount: richContent.replace(/<[^>]*>/g, '').split(/\s+/).length 
        }),
      });
      if (response.ok) {
        onBack();
      } else {
        setSnackbar({ open: true, message: "Update failed on server.", type: "error" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      setSnackbar({ open: true, message: "Network connection error.", type: "error" });
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
            <input 
              type="file" 
              accept="image/*" 
              id="cover-upload-input" 
              style={{ display: "none" }}
              onChange={handleCoverUpload}
            />
            <TextField 
              fullWidth 
              placeholder="Enter Cover Image URL or click to upload..." 
              value={descriptionImage} 
              onChange={(e) => setDescriptionImage(e.target.value)} 
              sx={{ ...inputStyle, mb: 2 }} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <label htmlFor="cover-upload-input">
                      <IconButton component="span" disabled={isUploadingCover} sx={{ color: primaryTeal }}>
                        {isUploadingCover ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                      </IconButton>
                    </label>
                  </InputAdornment>
                )
              }}
            />
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

          {/* Gallery Management Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: primaryFont }}>Assets & Taxonomy</Typography>
            
            <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center">
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: '0.8rem', color: primaryTeal, mb: 0 }}>GALLERY IMAGES</InputLabel>
              <Stack direction="row" spacing={1}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  id="bulk-upload-gallery" 
                  style={{ display: "none" }}
                  onChange={handleBulkUpload}
                />
                <label htmlFor="bulk-upload-gallery">
                  <Button 
                    component="span" 
                    size="small" 
                    startIcon={isBulkUploading ? <CircularProgress size={16} /> : <CloudUploadOutlined />} 
                    disabled={isBulkUploading} 
                    sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}
                  >
                    Bulk Upload
                  </Button>
                </label>
                <Button size="small" startIcon={<AddOutlined />} onClick={() => setImageUrls([...imageUrls, ""])} sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700, textTransform: "none" }}>Add Link</Button>
              </Stack>
            </Stack>

            <Stack spacing={2} mb={4}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    id={`gallery-row-upload-${index}`} 
                    style={{ display: "none" }}
                    onChange={(e) => handleGalleryUpload(e, index)}
                  />
                  <TextField 
                    fullWidth size="small" value={url} 
                    onChange={(e) => {
                      const up = [...imageUrls];
                      up[index] = e.target.value;
                      setImageUrls(up);
                    }}
                    placeholder="https://example.com/photo.jpg or click to upload ->"
                    InputProps={{ 
                      startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor={`gallery-row-upload-${index}`}>
                            <IconButton component="span" disabled={uploadingGalleryIndices.includes(index) || isBulkUploading} sx={{ color: primaryTeal }}>
                              {uploadingGalleryIndices.includes(index) ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                            </IconButton>
                          </label>
                        </InputAdornment>
                      )
                    }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))} color="error" disabled={imageUrls.length === 1}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            {/* --- GRID PREVIEW (6 IMAGES PER ROW) --- */}
            <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <CollectionsOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.65rem", color: primaryTeal, letterSpacing: 1 }}>ASSET PREVIEW (GRID VIEW)</Typography>
              </Stack>
              
              {imageUrls.filter(u => u.trim() !== "").length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
                  {imageUrls.map((url, i) => url.trim() && (
                    <Box key={i} sx={{ aspectRatio: '4/3', borderRadius: "8px", overflow: "hidden", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
                      <Box component="img" src={url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e: any) => e.target.src="https://placehold.co/400x300?text=Invalid"} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.5, py: 2 }}>
                  <HideImageOutlined />
                  <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600 }}>Awaiting image links...</Typography>
                </Stack>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Tags Section */}
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
            disabled={loading || isBulkUploading || uploadingGalleryIndices.length > 0 || isUploadingCover}
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

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} sx={{ borderRadius: "14px", fontFamily: primaryFont, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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