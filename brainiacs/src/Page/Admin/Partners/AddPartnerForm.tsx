import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  DeleteOutline, AddOutlined, DescriptionOutlined,
  LanguageOutlined, BusinessOutlined, 
  InsertPhotoOutlined, InfoOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreatePartner = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState<string[]>([""]); // Array for paragraphs
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- DESCRIPTION ARRAY HANDLERS ---
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

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    const validDescs = description.filter(d => d.trim() !== "");

    if (!name || !logoUrl || validDescs.length === 0) {
      alert("Please provide the Partner Name, Logo URL, and at least one Description paragraph.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          logoUrl,
          websiteUrl,
          description: description.filter(d => d.trim() !== ""), 
        }),
      });
      if (response.ok) onBack();
      else alert("Failed to save partner.");
    } catch (error) {
      console.error(error);
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
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal },
    },
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
          Back to Directory
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Register New Partner</Typography>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>Create a new profile for a corporate or educational partner.</Typography>
        </Box>

        <Stack spacing={4}>
          {/* NAME & WEBSITE */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>PARTNER NAME</InputLabel>
              <TextField 
                fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Google Cloud" 
                InputProps={{ startAdornment: <BusinessOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>WEBSITE URL (OPTIONAL)</InputLabel>
              <TextField 
                fullWidth value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://partner.com" 
                InputProps={{ startAdornment: <LanguageOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* LOGO URL */}
          <Box>
            <InputLabel sx={labelStyle}>LOGO URL</InputLabel>
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                    fullWidth value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} 
                    placeholder="https://example.com/logo.png" 
                    InputProps={{ startAdornment: <InsertPhotoOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                />
                {logoUrl && (
                    <Box 
                        component="img" 
                        src={logoUrl} 
                        sx={{ width: 50, height: 50, borderRadius: "8px", objectFit: "contain", border: `1px solid ${borderColor}` }}
                        onError={(e: any) => e.target.src = "https://placehold.co/100x100?text=Error"}
                    />
                )}
            </Stack>
          </Box>

          {/* DESCRIPTION ARRAY */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InputLabel sx={{ ...labelStyle, mb: 0 }}>PARTNER DESCRIPTION</InputLabel>
                <InfoOutlined sx={{ fontSize: 14, color: "#94A3B8" }} />
              </Stack>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Paragraph</Button>
            </Stack>
            <Stack spacing={2}>
              {description.map((text, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={3} value={text} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}: Describe the partnership...`}
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={description.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none", '&:hover': { bgcolor: "#002d35" } }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Partner"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Registration</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>Would you like to publish this partner to the directory?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Confirm & Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePartner;