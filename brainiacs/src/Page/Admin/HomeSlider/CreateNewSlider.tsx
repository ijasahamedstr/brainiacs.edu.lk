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
  RemoveRedEyeOutlined,
  AddCircleOutline
} from "@mui/icons-material";

// Configuration from Environment Variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddSliderProps {
  onBack: () => void;
}

const CreateNewSlider = ({ onBack }: AddSliderProps) => {
  // 1. State for Form Data
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  
  // 2. State for Confirmation Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Triggered when user clicks "Save Slider"
  const handleSaveClick = () => {
    if (!name || !imageUrl) {
      alert("Please fill in the required fields (Banner Name and Image URL).");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // The actual API Handler executed after confirmation
  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl, redirectLink, status }),
      });

      if (response.ok) {
        onBack(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
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
    "& .MuiInputBase-input::placeholder": {
      fontSize: "0.8rem",
      opacity: 0.6
    }
  };

  return (
    <Box sx={{ pt: 0, mt: 0 }}>
      {/* --- HEADER NAVIGATION --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, pt: 0 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px !important" }} />}
          sx={{ 
            fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 700, 
            textTransform: 'none', borderRadius: "10px", p: 0,
            "&:hover": { bgcolor: "transparent", color: primaryTeal }
          }}
        >
          Back to Dashboard
        </Button>
      </Stack>

      {/* --- MAIN FORM CONTENT --- */}
      <Paper elevation={0} sx={{ 
        width: "100%", p: { xs: 3, md: 5 }, borderRadius: "24px", 
        border: `1px solid ${borderColor}`, bgcolor: "#FFF",
        boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
      }}>
        
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Slider Configuration
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Easily manage your banner content and visual assets in one place.
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* --- ROW 01: Name & URL --- */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                BANNER NAME
              </InputLabel>
              <TextField 
                fullWidth 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Annual Gala 2026"
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
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste URL link here..."
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhotoSizeSelectActualOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment>,
                }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* --- ROW 02: Redirect & Status --- */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", color: "#1E293B", mb: 1, ml: 0.5 }}>
                REDIRECT LINK
              </InputLabel>
              <TextField 
                fullWidth 
                value={redirectLink}
                onChange={(e) => setRedirectLink(e.target.value)}
                placeholder="https://domain.com/target-page"
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
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                sx={{ 
                  borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600, fontSize: "0.85rem",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: borderColor },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryTeal },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryTeal }
                }}
              >
                <MenuItem value="Active" sx={{ fontSize: "0.85rem", fontFamily: primaryFont }}>Active</MenuItem>
                <MenuItem value="Inactive" sx={{ fontSize: "0.85rem", fontFamily: primaryFont }}>Inactive</MenuItem>
              </Select>
            </Box>
          </Stack>

          {/* --- PREVIEW ZONE --- */}
          <Box sx={{ py: 1, textAlign: "left" }}>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.65rem", color: primaryTeal, mb: 1.5, letterSpacing: "1px" }}>
              LIVE RENDERING PREVIEW
            </InputLabel>
            <Box sx={{ 
              width: "100%", height: { xs: "180px", md: "320px" }, 
              borderRadius: "20px", bgcolor: "#F1F5F9", 
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", border: `1px solid ${borderColor}`,
            }}>
              {imageUrl ? (
                <Box 
                  component="img" 
                  src={imageUrl} 
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e: any) => { e.target.src = "https://placehold.co/1200x400?text=Invalid+Image+URL"; }} 
                />
              ) : (
                <Stack alignItems="center" spacing={1} sx={{ opacity: 0.3 }}>
                  <RemoveRedEyeOutlined sx={{ fontSize: 30 }} />
                  <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem" }}>
                    Awaiting Asset Link
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* --- ACTION FOOTER --- */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                onClick={onBack} 
                sx={{ px: 3, fontSize: "0.8rem", fontWeight: 700, fontFamily: primaryFont, color: "#94A3B8", textTransform: "none" }}
              >
                Discard
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveClick}
                disabled={loading}
                sx={{ 
                  bgcolor: primaryTeal, px: 5, py: 1.2, borderRadius: "10px", 
                  fontSize: "0.8rem", fontWeight: 800, fontFamily: primaryFont, textTransform: "none",
                  boxShadow: "0 6px 20px rgba(0,70,82,0.15)",
                  "&:hover": { bgcolor: "#00333d" }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Save Slider"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* --- CREATION CONFIRMATION DIALOG --- */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", padding: "8px", maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: primaryFont, fontWeight: 800 }}>
          <AddCircleOutline sx={{ color: primaryTeal, fontSize: "32px" }} />
          Create New Slider?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            You are about to add a new banner to the homepage. Please ensure the preview image and redirect link are correct before proceeding.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
            Review Again
          </Button>
          <Button 
            onClick={confirmSave} 
            variant="contained"
            sx={{ bgcolor: primaryTeal, borderRadius: "10px", px: 3, '&:hover': { bgcolor: "#00333d" } }}
          >
            Yes, Create Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateNewSlider;