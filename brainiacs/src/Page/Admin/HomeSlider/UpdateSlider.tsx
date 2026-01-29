import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  MenuItem, Select, InputLabel, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  TitleOutlined, 
  LinkOutlined, PhotoSizeSelectActualOutlined,
  SaveOutlined,
  InfoOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface Slider {
  _id: string;
  name: string;
  imageUrl: string;
  redirectLink?: string;
  status: "Active" | "Inactive";
}

interface UpdateProps {
  sliderData: Slider;
  onBack: () => void;
}

const UpdateSliderForm = ({ sliderData, onBack }: UpdateProps) => {
  const [formData, setFormData] = useState<Slider>(sliderData);
  const [loading, setLoading] = useState(false);
  
  // New State for Update Confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // 1. Open confirmation before API call
  const handleUpdateClick = () => {
    if (!formData.name || !formData.imageUrl) {
      alert("Please fill in the required fields.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // 2. The actual API Handler
  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders/${sliderData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <Box sx={{ pt: 0, mt: 0 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px !important" }} />}
          sx={{ 
            fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 700, 
            textTransform: 'none', borderRadius: "10px", p: 0,
            color: "#64748B",
            "&:hover": { bgcolor: "transparent", color: primaryTeal }
          }}
        >
          Back to Dashboard
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ 
        width: "100%", p: { xs: 3, md: 5 }, borderRadius: "24px", 
        border: `1px solid ${borderColor}`, bgcolor: "#FFF",
        boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
      }}>
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Update Slider
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Modifying assets for slider ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{sliderData._id}</span>
          </Typography>
        </Box>

        <Stack spacing={3}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                BANNER NAME
              </InputLabel>
              <TextField 
                fullWidth 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><TitleOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment>,
                }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                IMAGE SOURCE URL
              </InputLabel>
              <TextField 
                fullWidth 
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhotoSizeSelectActualOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment>,
                }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                REDIRECT LINK
              </InputLabel>
              <TextField 
                fullWidth 
                value={formData.redirectLink || ""}
                onChange={(e) => setFormData({ ...formData, redirectLink: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LinkOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment>,
                }}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                PUBLISH STATUS
              </InputLabel>
              <Select 
                fullWidth 
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                sx={{ 
                  borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600, fontSize: "0.85rem",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: borderColor },
                }}
              >
                <MenuItem value="Active" sx={{ fontFamily: primaryFont }}>Active</MenuItem>
                <MenuItem value="Inactive" sx={{ fontFamily: primaryFont }}>Inactive</MenuItem>
              </Select>
            </Box>
          </Stack>

          {/* PREVIEW */}
          <Box sx={{ py: 1, textAlign: "left" }}>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.65rem", color: primaryTeal, mb: 1.5, letterSpacing: "1px" }}>
              UPDATED RENDERING PREVIEW
            </InputLabel>
            <Box sx={{ 
              width: "100%", height: { xs: "180px", md: "320px" }, 
              borderRadius: "20px", bgcolor: "#F1F5F9", 
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", border: `1px solid ${borderColor}`,
            }}>
              <Box component="img" src={formData.imageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
                onError={(e: any) => { e.target.src = "https://placehold.co/1200x400?text=Invalid+Image+URL"; }} 
              />
            </Box>
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", textTransform: "none" }}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleUpdateClick}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} sx={{ color: '#FFF' }} /> : <SaveOutlined />}
                sx={{ bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontFamily: primaryFont, textTransform: "none" }}
              >
                {loading ? "Updating..." : "Update Slider"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* --- UPDATE CONFIRMATION DIALOG --- */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", padding: "8px", maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: primaryFont, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal, fontSize: "32px" }} />
          Confirm Changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Are you sure you want to save these changes? This will update the banner details across your live website.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
            Keep Editing
          </Button>
          <Button 
            onClick={confirmUpdate} 
            variant="contained"
            sx={{ bgcolor: primaryTeal, borderRadius: "10px", px: 3, '&:hover': { bgcolor: "#00333d" } }}
          >
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateSliderForm;