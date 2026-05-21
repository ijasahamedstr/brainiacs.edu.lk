import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, Avatar, Chip, InputAdornment
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined, DeleteOutline, 
  AddOutlined, DescriptionOutlined, CollectionsOutlined, 
  HideImageOutlined, PersonOutline, ImageOutlined,
  BadgeOutlined, PanoramaHorizontalOutlined,
  ShortTextOutlined, CloudUploadOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "37cd6333d9f4bd044c4a4dcc867276ae"; 
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateFaculty = ({ onBack }: AddProps) => {
  // --- STATE ---
  // Core Identity
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  
  // Leadership
  const [deanName, setDeanName] = useState("");
  const [deanImage, setDeanImage] = useState("");
  const [deanDescription, setDeanDescription] = useState(""); // [Added] Dean Description State

  // Content Arrays
  const [descriptions, setDescriptions] = useState<string[]>([""]); 
  const [imageUrls, setImageUrls] = useState<string[]>([""]);       
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Upload State
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingDean, setIsUploadingDean] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);

  // --- IMGBB UPLOAD HANDLER ---
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

  // --- ARRAY HANDLERS ---
  const handleAddDescription = () => setDescriptions([...descriptions, ""]);
  const handleRemoveDescription = (index: number) => {
    const newDesc = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDesc.length ? newDesc : [""]);
  };
  const handleDescChange = (index: number, value: string) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };

  const handleAddImageUrl = () => setImageUrls([...imageUrls, ""]);
  const handleRemoveImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length ? newUrls : [""]);
  };
  const handleUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    const validDescs = descriptions.filter(d => d.trim() !== "");
    // Basic validation
    if (!name || !deanName || !coverImage || validDescs.length === 0) {
      alert("Please fill in the Faculty Name, Dean Name, Cover Image, and at least one Description.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          coverImage,
          deanName,
          deanImage,
          deanDescription, // [Added] Include in payload
          descriptions: descriptions.filter(d => d.trim() !== ""), 
          imageUrls: imageUrls.filter(u => u.trim() !== "") 
        }),
      });
      if (response.ok) onBack();
      else alert("Save failed. Please check your network connection.");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      fontSize: "0.85rem",
      fontWeight: 500,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "& hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal },
    },
    "& .MuiInputBase-input::placeholder": { fontFamily: primaryFont, fontSize: "0.8rem" }
  };

  const labelStyle = {
    fontFamily: primaryFont,
    fontWeight: 700,
    fontSize: "0.7rem",
    color: "#1E293B",
    mb: 1,
    letterSpacing: "0.5px"
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />} 
          sx={{ fontFamily: primaryFont, color: "#64748B", textTransform: 'none', fontWeight: 700, fontSize: "0.8rem" }}
        >
          Back to List
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Create New Faculty</Typography>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Establish a new academic department, leadership profile, and gallery.
          </Typography>
        </Box>

        <Stack spacing={4}>
          
          {/* SECTION 1: CORE IDENTITY & IMAGERY */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>FACULTY NAME</InputLabel>
              <TextField 
                fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Faculty of Engineering" 
                InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>COVER IMAGE (URL)</InputLabel>
              
              <input 
                type="file" 
                accept="image/*" 
                id="cover-upload-input" 
                style={{ display: "none" }}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    setIsUploadingCover(true);
                    try {
                      const url = await uploadToImgBB(e.target.files[0]);
                      setCoverImage(url);
                    } catch (error) {
                      console.error("Cover upload failed:", error);
                      alert("Failed to upload cover image.");
                    } finally {
                      setIsUploadingCover(false);
                    }
                  }
                }}
              />

              <TextField 
                fullWidth value={coverImage} onChange={(e) => setCoverImage(e.target.value)} 
                placeholder="Paste URL or click to upload ->" 
                InputProps={{ 
                  startAdornment: <PanoramaHorizontalOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
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
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* SECTION 2: LEADERSHIP (DEAN) */}
          <Box sx={{ p: 3, bgcolor: "#F1F5F9", borderRadius: "16px", border: `1px dashed ${borderColor}` }}>
            <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 2, color: "#475569" }}>
              <PersonOutline sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
              Leadership Profile
            </Typography>
            
            {/* Name and Photo Row */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
              <Box sx={{ flex: 1 }}>
                <InputLabel sx={labelStyle}>DEAN'S NAME</InputLabel>
                <TextField 
                  fullWidth value={deanName} onChange={(e) => setDeanName(e.target.value)} 
                  placeholder="e.g. Dr. Sarah Smith" 
                  InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                  sx={inputStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel sx={labelStyle}>DEAN'S PHOTO (URL)</InputLabel>

                <input 
                  type="file" 
                  accept="image/*" 
                  id="dean-upload-input" 
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setIsUploadingDean(true);
                      try {
                        const url = await uploadToImgBB(e.target.files[0]);
                        setDeanImage(url);
                      } catch (error) {
                        console.error("Dean image upload failed:", error);
                        alert("Failed to upload dean image.");
                      } finally {
                        setIsUploadingDean(false);
                      }
                    }
                  }}
                />

                <TextField 
                  fullWidth value={deanImage} onChange={(e) => setDeanImage(e.target.value)} 
                  placeholder="Paste URL or click to upload ->" 
                  InputProps={{ 
                    startAdornment: <ImageOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <label htmlFor="dean-upload-input">
                          <IconButton component="span" disabled={isUploadingDean} sx={{ color: primaryTeal }}>
                            {isUploadingDean ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                          </IconButton>
                        </label>
                      </InputAdornment>
                    )
                  }}
                  sx={inputStyle}
                />
              </Box>
            </Stack>

            {/* [Added] Dean Description Row */}
            <Box>
              <InputLabel sx={labelStyle}>DEAN'S BIOGRAPHY / MESSAGE</InputLabel>
              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                value={deanDescription} 
                onChange={(e) => setDeanDescription(e.target.value)} 
                placeholder="Enter a short biography or welcome message from the Dean..." 
                InputProps={{ startAdornment: <ShortTextOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Box>

          {/* SECTION 3: DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>FACULTY DESCRIPTION BLOCKS</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Block</Button>
            </Stack>
            <Stack spacing={2}>
              {descriptions.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder="Enter paragraph content about the faculty..."
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={descriptions.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* SECTION 4: GALLERY */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>GALLERY IMAGES (URLS)</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Image</Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    id={`gallery-upload-input-${index}`} 
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadingGalleryIndex(index);
                        try {
                          const uploadedUrl = await uploadToImgBB(e.target.files[0]);
                          handleUrlChange(index, uploadedUrl);
                        } catch (error) {
                          console.error("Gallery upload failed:", error);
                          alert("Failed to upload gallery image.");
                        } finally {
                          setUploadingGalleryIndex(null);
                        }
                      }
                    }}
                  />

                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder={`Paste URL or upload image #${index + 1}`}
                    InputProps={{ 
                      startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor={`gallery-upload-input-${index}`}>
                            <IconButton component="span" disabled={uploadingGalleryIndex === index} sx={{ color: primaryTeal }}>
                              {uploadingGalleryIndex === index ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                            </IconButton>
                          </label>
                        </InputAdornment>
                      )
                    }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveImageUrl(index)} color="error" disabled={imageUrls.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* SECTION 5: LIVE ASSET PREVIEW */}
          <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.7rem", color: primaryTeal, letterSpacing: 1, mb: 3, textTransform: 'uppercase' }}>
              <CollectionsOutlined sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-top' }} />
              Visual Data Preview
            </Typography>
            
            {/* Top Row: Cover and Dean */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mb={4}>
              {/* Cover Preview */}
              <Box sx={{ flex: 1 }}>
                 <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600, display: 'block', mb: 1 }}>COVER HEADER</Typography>
                 <Box sx={{ width: '100%', height: 140, bgcolor: "#E2E8F0", borderRadius: "12px", overflow: "hidden", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {coverImage ? (
                        <Box component="img" src={coverImage} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e:any) => e.target.style.display='none'} />
                    ) : <Typography variant="caption" color="text.secondary">No Cover URL</Typography>}
                 </Box>
              </Box>

              {/* Dean Preview */}
              <Box sx={{ flex: 1 }}>
                 <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600, display: 'block', mb: 1 }}>LEADERSHIP CARD</Typography>
                 <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ p: 2, border: `1px solid ${borderColor}`, borderRadius: "12px", bgcolor: "#FFF", minHeight: 140 }}>
                    <Avatar src={deanImage} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.95rem" }}>{deanName || "Dean Name"}</Typography>
                        <Chip label="Dean" size="small" sx={{ height: 20, fontSize: "0.6rem", bgcolor: primaryTeal, color: "white", mb: 1 }} />
                        
                        {/* [Added] Description Preview */}
                        <Typography variant="body2" sx={{ fontFamily: primaryFont, fontSize: "0.75rem", color: "#64748B", fontStyle: 'italic', display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                           {deanDescription || "Dean's biography will appear here..."}
                        </Typography>
                    </Box>
                 </Stack>
              </Box>
            </Stack>

            {/* Bottom Row: Gallery */}
            <Box>
              <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600, display: 'block', mb: 1 }}>GALLERY STRIP</Typography>
              <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: "10px" } }}>
                {imageUrls.filter(u => u.trim() !== "").length > 0 ? (
                  imageUrls.map((url, i) => url.trim() && (
                    <Box key={i} sx={{ minWidth: 100, height: 80, borderRadius: "8px", overflow: "hidden", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
                      <Box component="img" src={url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  ))
                ) : (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.5 }}>
                    <HideImageOutlined />
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600 }}>No gallery images added</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Faculty"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Creation</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
                Are you sure you want to publish <b>{name}</b>?
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateFaculty;