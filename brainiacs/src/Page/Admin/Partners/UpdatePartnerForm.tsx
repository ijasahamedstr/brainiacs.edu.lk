import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  LanguageOutlined, SaveOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  InfoOutlined, LinkOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface PartnerData {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description: string[];
}

interface UpdateProps {
  partnerData: PartnerData;
  onBack: () => void;
}

const UpdatePartner = ({ partnerData, onBack }: UpdateProps) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: partnerData.name,
    logoUrl: partnerData.logoUrl,
    websiteUrl: partnerData.websiteUrl || "",
  });
  const [descriptions, setDescriptions] = useState<string[]>(partnerData.description || [""]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- ARRAY HANDLERS (Description Paragraphs) ---
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

  // --- VALIDATION & SUBMISSION ---
  const handleUpdateClick = () => {
    const hasEmptyDesc = descriptions.some(d => !d.trim());
    if (!formData.name || !formData.logoUrl || hasEmptyDesc) {
      alert("Please fill in the Name, Logo URL, and all Description paragraphs.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    
    const payload = {
      ...formData,
      description: descriptions // Sending the array of strings
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/partners/${partnerData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      fontSize: "0.85rem",
      fontWeight: 500,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal, borderWidth: "1.5px" },
    },
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />}
          sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B", textTransform: 'none' }}
        >
          Back to Partners
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}` }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Update Partner Details
          </Typography>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B" }}>
            Editing: <span style={{ color: primaryTeal, fontWeight: 700 }}>{partnerData.name}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* BASIC INFO */}
          <Box>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1 }}>PARTNER NAME</InputLabel>
            <TextField 
              fullWidth 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1 }}>LOGO URL</InputLabel>
            <TextField 
              fullWidth 
              value={formData.logoUrl} 
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} 
              InputProps={{ startAdornment: <LinkOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          <Box>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1 }}>WEBSITE URL (OPTIONAL)</InputLabel>
            <TextField 
              fullWidth 
              value={formData.websiteUrl} 
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} 
              InputProps={{ startAdornment: <LanguageOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* DYNAMIC DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B" }}>PARTNER DESCRIPTION (PARAGRAPHS)</InputLabel>
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
              Update Partner
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
            Are you sure you want to update this partner's information?
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