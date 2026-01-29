import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  LinkOutlined, DeleteOutline, AddOutlined, 
  DescriptionOutlined, ImageOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const AddPartnerForm = ({ onBack }: AddProps) => {
  // --- STATE (Aligned with Partner Schema) ---
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([""]); 
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

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    const validDescs = descriptions.filter(d => d.trim() !== "");

    if (!name || !logoUrl || validDescs.length === 0) {
      alert("Please fill in Name, Logo URL, and at least one Description.");
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
          description: descriptions.filter(d => d.trim() !== ""), 
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
    <Box sx={{ fontFamily: primaryFont }}>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />} 
          sx={{ fontFamily: primaryFont, color: "#64748B", textTransform: 'none', fontWeight: 700, fontSize: "0.8rem" }}
        >
          Back to Partners
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>New Partner Entry</Typography>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>Partner branding and information details.</Typography>
        </Box>

        <Stack spacing={4}>
          {/* PARTNER NAME */}
          <Box>
            <InputLabel sx={labelStyle}>PARTNER NAME</InputLabel>
            <TextField 
              fullWidth value={name} onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Global Tech Solutions" 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* LOGO & WEBSITE ROW */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box flex={1}>
              <InputLabel sx={labelStyle}>LOGO URL</InputLabel>
              <TextField 
                fullWidth value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://example.com/logo.png"
                InputProps={{ startAdornment: <ImageOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
            <Box flex={1}>
              <InputLabel sx={labelStyle}>WEBSITE URL</InputLabel>
              <TextField 
                fullWidth value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://partner-website.com"
                InputProps={{ startAdornment: <LinkOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* DESCRIPTIONS (ARRAY OF STRINGS) */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>DESCRIPTION PARAGRAPHS</InputLabel>
              <Button 
                size="small" 
                startIcon={<AddOutlined />} 
                onClick={handleAddDescription} 
                sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}
              >
                Add Paragraph
              </Button>
            </Stack>
            <Stack spacing={2}>
              {descriptions.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder="Enter details about this partner..."
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={descriptions.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Partner"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* DIALOGS */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Partner</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Ready to add <strong>{name}</strong> to the partners list?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px", textTransform: "none" }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPartnerForm;