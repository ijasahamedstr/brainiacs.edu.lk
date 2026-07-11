import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Tooltip, Zoom, Avatar, IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PersonAddAlt1Outlined, 
  PersonOutlineOutlined,
  SchoolOutlined,
  ClassOutlined,
  InfoOutlined,
  DescriptionOutlined,
  FormatQuoteOutlined,
  CloudUploadOutlined,
  PhotoSizeSelectActualOutlined
} from "@mui/icons-material";

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY"; // Ensure this is in your .env
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddStudentProps {
  onBack: () => void;
}

const CreateAskOurStudent = ({ onBack }: AddStudentProps) => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    batch: "",
    description: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // 2. OPTIMIZED HANDLERS
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveClick = () => {
    if (!formData.name || !formData.course || !formData.batch || !formData.description || !formData.image) {
      alert("Please ensure all student record fields are provided.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // 3. IMGBB UPLOAD ENGINE
  const uploadToImgBB = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        
        // If you have a compressImage utility function, uncomment the line below:
        // const compressedFile = await compressImage(file);
        
        const url = await uploadToImgBB(file);
        
        // Update the single image string in our formData
        setFormData(prev => ({ ...prev, image: url }));
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 4. FAST DATABASE SYNC
  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/AskOurStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onBack(); 
      } else {
        const error = await response.json();
        alert(`Server Error: ${error.message}`);
      }
    } catch (err) {
      alert("Database connection failed. Please check your API status.");
    } finally {
      setLoading(false);
    }
  };

  // 5. SHARED UI STYLES
  const inputStyle = {
    "& .MuiInputBase-input": {
      color: "#000000 !important",
      WebkitTextFillColor: "#000000 !important", 
    },
    "& textarea.MuiInputBase-input": {
      color: "#000000 !important", 
      WebkitTextFillColor: "#000000 !important",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      fontSize: "0.85rem",
      fontWeight: 500,
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "&:-webkit-autofill": { WebkitBoxShadow: "0 0 0 1000px white inset" },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal },
    },
    "& .MuiInputBase-input::placeholder": { 
      fontFamily: primaryFont, 
      fontSize: "0.8rem" 
    }
  };

  const labelStyle = {
    fontFamily: primaryFont,
    fontWeight: 700,
    fontSize: "0.7rem",
    color: "#1E293B",
    mb: 1,
    letterSpacing: "0.5px"
  };

  const sectionHeaderStyle = {
    fontFamily: primaryFont, 
    fontSize: "0.7rem", 
    fontWeight: 900, 
    color: primaryTeal, 
    letterSpacing: 1.2, 
    mb: 2.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 5 }}>
      {/* HEADERBAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />}
          sx={{ 
            fontFamily: primaryFont, fontSize: "0.8rem", fontWeight: 700, 
            textTransform: 'none', color: "#64748B",
            "&:hover": { bgcolor: "rgba(0,70,82,0.05)", color: primaryTeal }
          }}
        >
          Back to Architecture
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        
        {/* LEFT COLUMN: CONFIGURATION FORM */}
        <Box sx={{ flex: 1.2 }}>
            <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 5 }, borderRadius: "24px", 
                border: `1px solid ${borderColor}`, bgcolor: "#FFF",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)"
            }}>
                
                {/* TITLE SECTION */}
                <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: "rgba(0,70,82,0.08)", p: 1.5, borderRadius: "12px", border: '1px solid rgba(0,70,82,0.1)' }}>
                        <PersonAddAlt1Outlined sx={{ color: primaryTeal, fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: -0.5 }}>
                            Initialize New Student Record
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                            Configure student details and testimonial content.
                        </Typography>
                    </Box>
                </Box>

                <Stack spacing={4}>
                    {/* SECTION: GENERAL INFO */}
                    <Box>
                        <Typography sx={sectionHeaderStyle}>
                            <PersonOutlineOutlined sx={{ fontSize: 16 }} /> STUDENT IDENTITY
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                            <Box>
                                <InputLabel sx={labelStyle}>FULL NAME</InputLabel>
                                <TextField 
                                    fullWidth value={formData.name} onChange={handleChange("name")}
                                    placeholder="e.g. John Doe"
                                    sx={inputStyle}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={labelStyle}>COURSE ENROLLED</InputLabel>
                                <TextField 
                                    fullWidth value={formData.course} onChange={handleChange("course")}
                                    placeholder="e.g. Full Stack Web Development"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><SchoolOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment> }}
                                    sx={inputStyle}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={labelStyle}>POSITION</InputLabel>
                                <TextField 
                                    fullWidth value={formData.batch} onChange={handleChange("batch")}
                                    placeholder="Position"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><ClassOutlined sx={{ fontSize: 18, color: "#94A3B8" }} /></InputAdornment> }}
                                    sx={inputStyle}
                                />
                            </Box>

                            {/* UPDATED: PROFILE IMAGE UPLOAD BLOCK */}
                            <Box>
                                <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 1 }}>
                                    <InputLabel sx={{ ...labelStyle, mb: 0 }}>PROFILE IMAGE (URL OR UPLOAD)</InputLabel>
                                    <Tooltip title="Provide a direct URL or click the cloud icon to upload an image.">
                                        <InfoOutlined sx={{ fontSize: 14, color: "#94A3B8", cursor: "help" }} />
                                    </Tooltip>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        id="profile-upload" 
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                    <TextField 
                                        fullWidth 
                                        value={formData.image} 
                                        onChange={handleChange("image")} 
                                        placeholder="https://link.com or click to upload ->" 
                                        InputProps={{ 
                                            startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} />,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <label htmlFor="profile-upload">
                                                        <IconButton component="span" disabled={isUploading} sx={{ color: primaryTeal }}>
                                                            {isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                                                        </IconButton>
                                                    </label>
                                                </InputAdornment>
                                            )
                                        }} 
                                        sx={inputStyle} 
                                    />
                                </Stack>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* SECTION: TESTIMONIAL CONTENT */}
                    <Box>
                        <Typography sx={sectionHeaderStyle}>
                            <DescriptionOutlined sx={{ fontSize: 16 }} /> TESTIMONIAL CONTENT
                        </Typography>
                        <Box>
                            <InputLabel sx={labelStyle}>STUDENT DESCRIPTION / QUOTE</InputLabel>
                            <TextField 
                                fullWidth value={formData.description} onChange={handleChange("description")}
                                placeholder="Enter the student's testimonial or success story here..."
                                multiline rows={4}
                                sx={inputStyle}
                            />
                        </Box>
                    </Box>
                </Stack>
            </Paper>
        </Box>

        {/* RIGHT COLUMN: LIVE PREVIEW & DEPLOYMENT */}
        <Box sx={{ flex: 1 }}>
            <Stack spacing={3} sx={{ position: 'sticky', top: '24px' }}>
                
                {/* INTELLIGENT PREVIEW */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "0.7rem", color: primaryTeal, letterSpacing: 1, mb: 3 }}>
                        TESTIMONIAL PREVIEW
                    </Typography>

                    <Box sx={{ 
                        p: 3, borderRadius: "16px", border: "1px solid #E2E8F0", 
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", position: "relative",
                        bgcolor: "#F8FAFC"
                    }}>
                        <FormatQuoteOutlined sx={{ position: 'absolute', top: 16, right: 16, color: '#E2E8F0', fontSize: '3rem', transform: 'rotate(180deg)' }} />
                        
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Avatar 
                                src={formData.image} 
                                sx={{ width: 64, height: 64, borderRadius: "12px", border: `2px solid ${primaryTeal}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                            />
                            <Box>
                                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "1rem", lineHeight: 1.2 }}>
                                    {formData.name || "Student Name"}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600, mt: 0.5 }}>
                                    {formData.course || "Course Name"} • {formData.batch || "Position"}
                                </Typography>
                            </Box>
                        </Stack>

                        <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#475569", fontStyle: "italic", lineHeight: 1.6 }}>
                            "{formData.description || "The student's testimonial description will appear here as a quote block."}"
                        </Typography>
                    </Box>
                </Paper>

                {/* DEPLOYMENT ACTIONS */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#F8FAFC" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, mb: 3, lineHeight: 1.5 }}>
                        Review the student information and testimonial before publishing to the live system.
                    </Typography>
                    
                    <Button 
                        fullWidth
                        variant="contained" 
                        onClick={handleSaveClick}
                        disabled={loading || isUploading}
                        sx={{ 
                            bgcolor: primaryTeal, py: 1.8, borderRadius: "14px",
                            fontFamily: primaryFont, fontWeight: 800, fontSize: '0.85rem',
                            boxShadow: "0 10px 25px rgba(0,70,82,0.15)",
                            "&:hover": { bgcolor: "#002d35", transform: "translateY(-2px)" },
                            transition: "all 0.2s"
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#FFF" }} /> : "Compile & Deploy Record"}
                    </Button>
                    <Button 
                        fullWidth
                        onClick={onBack} 
                        sx={{ mt: 1.5, py: 1.5, borderRadius: "14px", fontFamily: primaryFont, fontWeight: 700, color: "#64748B", "&:hover": { bgcolor: "#F1F5F9" } }}
                    >
                        Discard Configuration
                    </Button>
                </Paper>
            </Stack>
        </Box>
      </Stack>

      {/* CONFIRMATION OVERLAY */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{ sx: { borderRadius: "24px", p: 1, maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "1.1rem", textAlign: "center", pt: 3, color: primaryTeal }}>
            Confirm Record Deployment
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
            The student record for <b>{formData.name || 'this student'}</b> will be processed and pushed to the live production environment.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 4, px: 4, gap: 2 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700, color: "#64748B", borderColor: borderColor }}>
            Abort
          </Button>
          <Button 
            onClick={confirmSave} 
            variant="contained" 
            sx={{ flex: 1, borderRadius: "12px", bgcolor: primaryTeal, fontFamily: primaryFont, fontWeight: 800, py: 1.2, boxShadow: '0 8px 20px rgba(0,70,82,0.2)' }}
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateAskOurStudent;