import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Avatar, Divider
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, SaveOutlined,
  PhotoSizeSelectActualOutlined, WorkOutline,
  BadgeOutlined, InfoOutlined, ManageAccountsOutlined,
  DescriptionOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// Updated Interface for Team Members
interface TeamMember {
  _id: string;
  name: string;
  jobDescription: string;
  detailedBio: string;
  imageUrl: string;
}

interface UpdateProps {
  itemData: TeamMember;
  onBack: () => void;
}

const UpdateTeamMember = ({ itemData, onBack }: UpdateProps) => {
  // --- STATE ---
  const [name, setName] = useState(itemData.name);
  const [jobDescription, setJobDescription] = useState(itemData.jobDescription);
  const [detailedBio, setDetailedBio] = useState(itemData.detailedBio || "");
  const [imageUrl, setImageUrl] = useState(itemData.imageUrl);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    if (!name || !jobDescription || !detailedBio || !imageUrl) {
      alert("Please ensure all fields (Name, Designation, Bio, and Image URL) are filled out.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      // ENDPOINT UPDATED TO /api/team
      const response = await fetch(`${API_BASE_URL}/api/team/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name, 
            jobDescription, 
            detailedBio, 
            imageUrl 
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
    "& .MuiInputBase-input": {
      fontFamily: primaryFont,
      fontSize: "0.9rem"
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
            <ManageAccountsOutlined sx={{ color: primaryTeal, fontSize: 30 }} />
            <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
              Edit Team Member Profile
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B", mt: 1 }}>
            Staff Registry ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems="flex-start">
            
            {/* PROFILE PREVIEW SECTION */}
            <Box sx={{ width: { xs: "100%", md: 220 }, textAlign: "center" }}>
              <InputLabel sx={labelStyle}>PROFILE PREVIEW</InputLabel>
              <Avatar 
                src={imageUrl} 
                variant="rounded" 
                sx={{ 
                  width: 180, 
                  height: 180, 
                  mx: "auto", 
                  borderRadius: "20px", 
                  border: `4px solid ${primaryTeal}15`,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                }} 
              />
              <Typography variant="caption" sx={{ display: "block", mt: 2, fontFamily: primaryFont, color: "#94A3B8" }}>
                Live updates enabled
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

            {/* FORM FIELDS */}
            <Stack spacing={3} sx={{ flexGrow: 1 }}>
              <Box>
                <InputLabel sx={labelStyle}>FULL NAME</InputLabel>
                <TextField 
                  fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                  placeholder="Full Name"
                  InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>JOB TITLE / DESIGNATION</InputLabel>
                <TextField 
                  fullWidth value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                  placeholder="e.g. Lead Developer"
                  InputProps={{ startAdornment: <WorkOutline sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>PROFESSIONAL BIO</InputLabel>
                <TextField 
                  fullWidth multiline rows={4} value={detailedBio} 
                  onChange={(e) => setDetailedBio(e.target.value)} 
                  placeholder="Update staff biography..."
                  InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>IMAGE URL</InputLabel>
                <TextField 
                  fullWidth value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Link to profile image"
                  InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>
            </Stack>
          </Stack>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
              Update Team Profile
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
            Are you sure you want to update <strong>{name}</strong>'s profile? This will update the website's team directory immediately.
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

export default UpdateTeamMember;