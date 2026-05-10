import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Avatar, MenuItem
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PhotoSizeSelectActualOutlined, SchoolOutlined,
  PersonAddOutlined, BadgeOutlined, DescriptionOutlined,
  AccountTreeOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// Example Departments - You can customize this list
const DEPARTMENTS = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Mathematics",
  "Social Sciences",
  "Natural Sciences",
  "Arts & Humanities"
];

interface AddProps {
  onBack: () => void;
}

const CreateAcademicStaff = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");      // New Department Field
  const [jobDescription, setJobDescription] = useState(""); // Academic Title (e.g. Professor)
  const [detailedBio, setDetailedBio] = useState("");       // Academic Bio
  const [imageUrl, setImageUrl] = useState("");       
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    if (!name || !department || !jobDescription || !detailedBio || !imageUrl) {
      alert("Please fill in all fields, including the Department and Profile Image.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/academic-staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          department,
          jobDescription, 
          detailedBio, 
          imageUrl 
        }),
      });
      if (response.ok) onBack();
      else alert("Failed to save academic staff profile.");
    } catch (error) {
      console.error(error);
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
             <PersonAddOutlined sx={{ color: primaryTeal }} />
             <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Add Academic Staff</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>Create a new faculty profile for the university directory.</Typography>
        </Box>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
             {/* PREVIEW AVATAR */}
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
                <InputLabel sx={labelStyle}>PROFILE PREVIEW</InputLabel>
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
                    placeholder="e.g. Prof. Alan Turing" 
                    InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* DEPARTMENT */}
                    <Box sx={{ flex: 1 }}>
                        <InputLabel sx={labelStyle}>DEPARTMENT</InputLabel>
                        <TextField 
                            select
                            fullWidth value={department} onChange={(e) => setDepartment(e.target.value)} 
                            placeholder="Select Department"
                            InputProps={{ startAdornment: <AccountTreeOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                            sx={inputStyle}
                        >
                            {DEPARTMENTS.map((dept) => (
                                <MenuItem key={dept} value={dept} sx={{ fontFamily: primaryFont, fontSize: '0.85rem' }}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* ACADEMIC TITLE (Designation) */}
                    <Box sx={{ flex: 1 }}>
                        <InputLabel sx={labelStyle}>ACADEMIC TITLE</InputLabel>
                        <TextField 
                            fullWidth value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                            placeholder="e.g. Senior Lecturer" 
                            InputProps={{ startAdornment: <SchoolOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                            sx={inputStyle}
                        />
                    </Box>
                </Stack>

                {/* DETAILED BIO */}
                <Box>
                  <InputLabel sx={labelStyle}>ACADEMIC BIOGRAPHY & RESEARCH INTERESTS</InputLabel>
                  <TextField 
                    fullWidth multiline rows={4} value={detailedBio} 
                    onChange={(e) => setDetailedBio(e.target.value)} 
                    placeholder="Describe research interests, publications, and background..." 
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* IMAGE URL */}
                <Box>
                  <InputLabel sx={labelStyle}>HEADSHOT URL</InputLabel>
                  <TextField 
                    fullWidth value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste link to faculty photo"
                    InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>
             </Stack>
          </Stack>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Profile"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Addition</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>Would you like to add {name || 'this staff member'} to the Academic Staff directory?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Confirm & Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateAcademicStaff;