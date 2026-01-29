import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, SaveOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  InfoOutlined, BusinessOutlined, LanguageOutlined,
  InsertPhotoOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// Interface matching your Partner Schema
interface Partner {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description: string[];
}

interface UpdateProps {
  itemData: Partner;
  onBack: () => void;
}

const UpdatePartner = ({ itemData, onBack }: UpdateProps) => {
  // --- STATE ---
  const [name, setName] = useState(itemData.name);
  const [logoUrl, setLogoUrl] = useState(itemData.logoUrl);
  const [websiteUrl, setWebsiteUrl] = useState(itemData.websiteUrl || "");
  const [description, setDescription] = useState<string[]>(itemData.description);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- ARRAY HANDLERS (Description Paragraphs) ---
  const handleAddDescription = () => setDescription([...description, ""]);
  
  const handleRemoveDescription = (index: number) => {
    const newDesc = description.filter((_, i) => i !== index);
    setDescription(newDesc.length ? newDesc : [""]);
  };

  const handleDescChange = (index: number, value: string) => {
    const updated = [...description];
    updated[index] = value;
    setDescription(updated);
  };

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    // Validation: Name, Logo, and at least one non-empty description block
    if (!name || !logoUrl || description.some(d => !d.trim())) {
      alert("Please ensure the partner name, logo, and all description blocks are filled out.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/partners/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          logoUrl, 
          websiteUrl, 
          description: description.filter(d => d.trim() !== "") 
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
          Back to Directory
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Update Partner Profile
          </Typography>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B" }}>
            Registry ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* NAME & WEBSITE */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>PARTNER NAME</InputLabel>
              <TextField 
                fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                InputProps={{ startAdornment: <BusinessOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>WEBSITE URL</InputLabel>
              <TextField 
                fullWidth value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://partner-link.com"
                InputProps={{ startAdornment: <LanguageOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* LOGO URL & PREVIEW */}
          <Box>
            <InputLabel sx={labelStyle}>LOGO URL</InputLabel>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField 
                fullWidth value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} 
                InputProps={{ startAdornment: <InsertPhotoOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
              <Box 
                component="img" 
                src={logoUrl} 
                sx={{ width: 56, height: 56, borderRadius: "12px", border: `1px solid ${borderColor}`, objectFit: "contain", p: 0.5, bgcolor: "#F8FAFC" }}
                onError={(e: any) => e.target.src = "https://placehold.co/100x100?text=Logo"}
              />
            </Stack>
          </Box>

          {/* DESCRIPTION ARRAY */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>PARTNER BIOGRAPHY (PARAGRAPHS)</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700 }}>Add Para</Button>
            </Stack>
            <Stack spacing={2}>
              {description.map((text, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={text} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={description.length === 1}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700, textTransform: "none" }}>Discard Changes</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateClick}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
              sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 4, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}
            >
              Update Partner
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont }}>
            Are you sure you want to save these changes? This will update the partner's information across the public platform.
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

export default UpdatePartner;