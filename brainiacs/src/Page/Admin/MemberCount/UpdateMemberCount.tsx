import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  FormControl, Select, MenuItem
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, SaveOutlined,
  InfoOutlined, BarChartOutlined, NumbersOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// Updated Interface matching Stat Model
interface MemberCountData {
  _id: string;
  title: string;
  count: number;
  suffix: string;
  createdAt?: string; 
}

interface UpdateProps {
  itemData: MemberCountData;
  onBack: () => void;
}

const UpdateMemberCount = ({ itemData, onBack }: UpdateProps) => {
  // --- STATE ---
  const [title, setTitle] = useState(itemData.title);
  const [count, setCount] = useState<number | string>(itemData.count);
  const [suffix, setSuffix] = useState(itemData.suffix);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    if (!title || count === "") {
      alert("Please ensure both Title and Count are filled out.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/member-count/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, count: Number(count), suffix }),
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
      "&:-webkit-autofill": { WebkitBoxShadow: "0 0 0 100px #FFF inset" },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": { fontFamily: primaryFont, fontSize: "0.9rem" },
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BarChartOutlined sx={{ color: primaryTeal, fontSize: 30 }} />
            <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
              Edit Statistic
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B", mt: 1 }}>
            Record ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id}</span>
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
                  sx={inputStyle}
                />
              </Box>
            </Stack>

          </Box>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-start", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700, textTransform: "none" }}>Discard</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateClick}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
              sx={{ 
                fontFamily: primaryFont, 
                bgcolor: primaryTeal, 
                px: 4, 
                borderRadius: "10px", 
                fontWeight: 800, 
                textTransform: "none",
                '&:hover': { bgcolor: "#00353d" }
              }}
            >
              Update Record
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, color: "#475569" }}>
            Are you sure you want to update this record to <strong>{count}{suffix} {title}</strong>? This will reflect in the database immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B" }}>Keep Editing</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, fontWeight: 700, borderRadius: "8px" }}>Confirm & Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateMemberCount;