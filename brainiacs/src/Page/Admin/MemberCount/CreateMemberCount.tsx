import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Select, MenuItem, FormControl
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  BarChartOutlined,
  NumbersOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateMemberCount = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [title, setTitle] = useState("Current Students");
  const [count, setCount] = useState<number | string>("");
  const [suffix, setSuffix] = useState("+");
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    if (!title || count === "") {
      alert("Please fill in both the Title and Count.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  
  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/member-count/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, count: Number(count), suffix }),
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
             <BarChartOutlined sx={{ color: primaryTeal }} />
             <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Add Member Count</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Register a new demographic statistic for the campus dashboard.
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Box sx={{ maxWidth: "500px", display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* TITLE DROPDOWN */}
            <Box>
              <InputLabel sx={labelStyle}>STATISTIC TITLE</InputLabel>
              <FormControl fullWidth sx={inputStyle}>
                <Select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="Current Students" sx={{ fontFamily: primaryFont }}>Current Students</MenuItem>
                  <MenuItem value="Alumni" sx={{ fontFamily: primaryFont }}>Alumni</MenuItem>
                  <MenuItem value="Annual Enrollments" sx={{ fontFamily: primaryFont }}>Annual Enrollments</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Stack direction="row" spacing={2}>
              {/* COUNT FIELD */}
              <Box sx={{ flex: 2 }}>
                <InputLabel sx={labelStyle}>COUNT (NUMERIC)</InputLabel>
                <TextField 
                  fullWidth 
                  type="number"
                  value={count} 
                  onChange={(e) => setCount(e.target.value)} 
                  placeholder="e.g. 1700" 
                  InputProps={{ startAdornment: <NumbersOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                  sx={inputStyle}
                />
              </Box>

              {/* SUFFIX FIELD */}
              <Box sx={{ flex: 1 }}>
                <InputLabel sx={labelStyle}>SUFFIX</InputLabel>
                <TextField 
                  fullWidth 
                  value={suffix} 
                  onChange={(e) => setSuffix(e.target.value)} 
                  placeholder="e.g. +" 
                  sx={inputStyle}
                />
              </Box>
            </Stack>

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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Statistic"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm New Statistic</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Ready to add <strong>{count}{suffix} {title}</strong> to the database?
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

export default CreateMemberCount;