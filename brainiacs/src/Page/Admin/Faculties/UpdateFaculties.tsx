import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, Avatar, Chip
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined, SaveOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  InfoOutlined, PanoramaHorizontalOutlined,
  BadgeOutlined, ImageOutlined, CollectionsOutlined,
  ShortTextOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// --- INTERFACES ---
interface Faculty {
  _id: string;
  name: string;
  descriptions: string[];
  imageUrls: string[];
  coverImage: string;
  deanName: string;
  deanImage: string;
  deanDescription?: string; // [Added] Optional field
}

interface UpdateProps {
  itemData: Faculty;
  onBack: () => void;
}

const UpdateFaculty = ({ itemData, onBack }: UpdateProps) => {
  // --- STATE ---
  // Initialize state with existing data
  const [name, setName] = useState(itemData.name);
  const [coverImage, setCoverImage] = useState(itemData.coverImage || "");
  
  // Leadership State
  const [deanName, setDeanName] = useState(itemData.deanName || "");
  const [deanImage, setDeanImage] = useState(itemData.deanImage || "");
  const [deanDescription, setDeanDescription] = useState(itemData.deanDescription || ""); // [Added] State
  
  // Arrays
  const [descriptions, setDescriptions] = useState<string[]>(itemData.descriptions);
  const [imageUrls, setImageUrls] = useState<string[]>(itemData.imageUrls);
  
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- ARRAY HANDLERS (Descriptions) ---
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

  // --- ARRAY HANDLERS (Images) ---
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

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    const validDescs = descriptions.filter(d => d.trim() !== "");
    
    // Basic validation
    if (!name || !coverImage || !deanName || validDescs.length === 0) {
      alert("Please ensure Name, Cover Image, Dean Name, and at least one Description are filled.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculties/${itemData._id}`, {
        method: "PUT",
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

      if (response.ok) {
        onBack(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": { fontFamily: primaryFont }
  };

  const labelStyle = {
    fontFamily: primaryFont,
    fontWeight: 700,
    fontSize: "0.7rem",
    color: "#1E293B",
    mb: 1
  };

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />}
          sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B", textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}` }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Edit Faculty Details
          </Typography>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B" }}>
            Updating Record ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          
          {/* SECTION 1: CORE INFO */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>FACULTY NAME</InputLabel>
              <TextField 
                fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>COVER IMAGE URL</InputLabel>
              <TextField 
                fullWidth value={coverImage} onChange={(e) => setCoverImage(e.target.value)} 
                InputProps={{ startAdornment: <PanoramaHorizontalOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* SECTION 2: LEADERSHIP */}
          <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: `1px dashed ${borderColor}` }}>
            <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", mb: 2, display: 'block' }}>LEADERSHIP DETAILS</Typography>
            
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
              <Box sx={{ flex: 1 }}>
                <InputLabel sx={labelStyle}>DEAN'S NAME</InputLabel>
                <TextField 
                  fullWidth value={deanName} onChange={(e) => setDeanName(e.target.value)} 
                  InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel sx={labelStyle}>DEAN'S PHOTO URL</InputLabel>
                <TextField 
                  fullWidth value={deanImage} onChange={(e) => setDeanImage(e.target.value)} 
                  InputProps={{ startAdornment: <ImageOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>
            </Stack>

            {/* [Added] Dean Description Input */}
            <Box>
              <InputLabel sx={labelStyle}>DEAN'S BIOGRAPHY / MESSAGE</InputLabel>
              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                value={deanDescription} 
                onChange={(e) => setDeanDescription(e.target.value)} 
                placeholder="Update the Dean's biography..." 
                InputProps={{ startAdornment: <ShortTextOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Box>

          {/* SECTION 3: DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>CONTENT PARAGRAPHS</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700 }}>Add Para</Button>
            </Stack>
            <Stack spacing={2}>
              {descriptions.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={descriptions.length === 1}>
                    <DeleteOutline />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* SECTION 4: GALLERY */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>GALLERY IMAGES (URLS)</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700 }}>Add Image</Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveImageUrl(index)} color="error" disabled={imageUrls.length === 1}>
                    <DeleteOutline />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* SECTION 5: LIVE PREVIEW */}
          <Box sx={{ p: 3, bgcolor: "#F1F5F9", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CollectionsOutlined sx={{ fontSize: 16 }} /> VISUAL PREVIEW
            </Typography>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
               {/* Cover & Dean */}
               <Box sx={{ flex: 1 }}>
                  <Box sx={{ height: 100, width: '100%', bgcolor: '#E2E8F0', borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
                     <Box component="img" src={coverImage} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e:any) => e.target.style.display='none'} />
                  </Box>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ p: 2, border: `1px solid ${borderColor}`, borderRadius: "12px", bgcolor: "#FFF" }}>
                     <Avatar src={deanImage} sx={{ width: 48, height: 48 }} />
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" sx={{ fontFamily: primaryFont, fontWeight: 700 }}>{deanName || "Dean Name"}</Typography>
                       <Chip label="Dean" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: primaryTeal, color: 'white', mb: 1 }} />
                       
                       {/* [Added] Description Preview */}
                       <Typography variant="body2" sx={{ fontFamily: primaryFont, fontSize: "0.75rem", color: "#64748B", fontStyle: 'italic', display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                          {deanDescription || "Dean's biography will appear here..."}
                       </Typography>
                     </Box>
                  </Stack>
               </Box>

               {/* Gallery Strip */}
               <Box sx={{ flex: 2, overflowX: 'auto' }}>
                  <Stack direction="row" spacing={1}>
                    {imageUrls.map((url, i) => url && (
                      <Box key={i} component="img" src={url} sx={{ height: 80, width: 100, borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0', bgcolor: 'white' }} />
                    ))}
                  </Stack>
               </Box>
            </Stack>
          </Box>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700 }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateClick}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
              sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 4, borderRadius: "10px", fontWeight: 800 }}
            >
              Update Faculty
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont }}>
            Are you sure you want to update <b>{name}</b>? These changes will be reflected on the public website immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Keep Editing</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, fontWeight: 700 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateFaculty;