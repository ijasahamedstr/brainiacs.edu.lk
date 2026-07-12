import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  CalendarMonthOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateIntakePeriod = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [intakeYear, setIntakeYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    if (!intakeYear.trim()) {
      alert("Please enter a valid Intake Period.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      // Endpoint mapped to POST /api/Intake
      const response = await fetch(`${API_BASE_URL}/api/Intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeYear }),
      });
      if (response.ok) {
        onBack();
      } else {
        const errorData = await response.json();
        alert(`Save failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving to the server.");
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
          Back to Directory
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
             <CalendarMonthOutlined sx={{ color: primaryTeal }} />
             <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Add Intake Period</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Register a new academic intake period for the system.
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Box sx={{ maxWidth: "500px" }}>
            {/* INTAKE PERIOD TEXT FIELD (Dropdown removed) */}
            <InputLabel sx={labelStyle}>INTAKE PERIOD</InputLabel>
            <TextField 
              fullWidth 
              value={intakeYear} 
              onChange={(e) => setIntakeYear(e.target.value)} 
              placeholder="e.g. 2026 February" 
              InputProps={{ startAdornment: <CalendarMonthOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* FOOTER ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-start", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveClick} 
              disabled={loading} 
              sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none", '&:hover': { bgcolor: '#002d35' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Intake Period"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm New Intake</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Ready to add the <strong>{intakeYear}</strong> intake period to the database?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Confirm & Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateIntakePeriod;