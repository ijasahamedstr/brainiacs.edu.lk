import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  CollectionsOutlined, HideImageOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateStudentLife = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([""]); 
  const [imageUrls, setImageUrls] = useState<string[]>([""]);       
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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
    const validUrls = imageUrls.filter(u => u.trim() !== "");

    if (!name || validDescs.length === 0 || validUrls.length === 0) {
      alert("Please fill in Name, at least one Description, and one Image URL.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-life`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          descriptions: descriptions.filter(d => d.trim() !== ""), 
          imageUrls: imageUrls.filter(u => u.trim() !== "") 
        }),
      });
      if (response.ok) onBack();
      else alert("Save failed.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      fontSize: "0.85rem",
      fontWeight: 500,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "&:hover fieldset": { borderColor: primaryTeal },
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
          Back to Dashboard
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>New Student Life Section</Typography>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>All text rendered in Montserrat.</Typography>
        </Box>

        <Stack spacing={4}>
          {/* TITLE */}
          <Box>
            <InputLabel sx={labelStyle}>SECTION TITLE</InputLabel>
            <TextField 
              fullWidth value={name} onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Student Clubs & Governance" 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>CONTENT PARAGRAPHS</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Para</Button>
            </Stack>
            <Stack spacing={2}>
              {descriptions.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder="Enter paragraph content..."
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={descriptions.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* IMAGE URLS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>IMAGE GALLERY (URLS)</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add URL</Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveImageUrl(index)} color="error" disabled={imageUrls.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* --- HORIZONTAL PREVIEW (NO GRID) --- */}
          <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <CollectionsOutlined sx={{ fontSize: 18, color: primaryTeal }} />
              <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.65rem", color: primaryTeal, letterSpacing: 1 }}>ASSET PREVIEW</Typography>
            </Stack>
            
            <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: "10px" } }}>
              {imageUrls.filter(u => u.trim() !== "").length > 0 ? (
                imageUrls.map((url, i) => url.trim() && (
                  <Box key={i} sx={{ minWidth: 160, height: 100, borderRadius: "12px", overflow: "hidden", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
                    <Box component="img" src={url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e: any) => e.target.src="https://placehold.co/200x150?text=Invalid"} />
                  </Box>
                ))
              ) : (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.5, py: 2 }}>
                  <HideImageOutlined />
                  <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600 }}>Awaiting image links...</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Entry"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Creation</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>Add this section to Student Life?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateStudentLife;