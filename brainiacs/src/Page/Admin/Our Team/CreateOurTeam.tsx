import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Avatar
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PhotoSizeSelectActualOutlined, WorkOutline,
  BadgeOutlined, DescriptionOutlined,
  GroupsOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateTeamMember = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // Designation/Title
  const [detailedBio, setDetailedBio] = useState("");       // Staff Bio
  const [imageUrl, setImageUrl] = useState("");       
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    if (!name || !jobDescription || !detailedBio || !imageUrl) {
      alert("Please fill in all fields (Name, Designation, Bio, and Image URL).");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      // ENDPOINT UPDATED TO /api/team
      const response = await fetch(`${API_BASE_URL}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          jobDescription, 
          detailedBio, 
          imageUrl 
        }),
      });
      if (response.ok) onBack();
      else alert("Save failed.");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
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
             <GroupsOutlined sx={{ color: primaryTeal }} />
             <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Add Team Member</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Register a new staff profile for the "Our Team" directory.
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
             {/* PREVIEW AVATAR */}
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
                <InputLabel sx={labelStyle}>PHOTO PREVIEW</InputLabel>
                <Avatar 
                  src={imageUrl} 
                  variant="rounded"
                  sx={{ width: 160, height: 160, borderRadius: "20px", border: `2px dashed ${borderColor}`, bgcolor: "#F8FAFC" }}
                >
                  <PhotoSizeSelectActualOutlined sx={{ fontSize: 40, color: "#CBD5E1" }} />
                </Avatar>
             </Box>

             <Stack spacing={3} sx={{ flexGrow: 1 }}>
                {/* NAME */}
                <Box>
                  <InputLabel sx={labelStyle}>FULL NAME</InputLabel>
                  <TextField 
                    fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Sarah Jenkins" 
                    InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* DESIGNATION */}
                <Box>
                  <InputLabel sx={labelStyle}>JOB TITLE / DESIGNATION</InputLabel>
                  <TextField 
                    fullWidth value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                    placeholder="e.g. Creative Lead" 
                    InputProps={{ startAdornment: <WorkOutline sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* BIO */}
                <Box>
                  <InputLabel sx={labelStyle}>STAFF BIOGRAPHY</InputLabel>
                  <TextField 
                    fullWidth multiline rows={4} value={detailedBio} 
                    onChange={(e) => setDetailedBio(e.target.value)} 
                    placeholder="Briefly describe the member's background and expertise..." 
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* IMAGE URL */}
                <Box>
                  <InputLabel sx={labelStyle}>HEADSHOT IMAGE URL</InputLabel>
                  <TextField 
                    fullWidth value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://cloud-storage.com/staff/sarah.png"
                    InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>
             </Stack>
          </Stack>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveClick} 
              disabled={loading} 
              sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none", '&:hover': { bgcolor: '#002d35' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Team Member"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm New Member</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Ready to add {name || 'this member'} to the staff directory?
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

export default CreateTeamMember;