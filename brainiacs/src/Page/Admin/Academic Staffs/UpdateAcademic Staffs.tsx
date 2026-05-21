import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Avatar, Divider, MenuItem, InputAdornment, IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, SaveOutlined,
  PhotoSizeSelectActualOutlined, SchoolOutlined,
  BadgeOutlined, InfoOutlined, ManageAccountsOutlined,
  DescriptionOutlined, AccountTreeOutlined, CloudUploadOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "37cd6333d9f4bd044c4a4dcc867276ae";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// --- CLIENT-SIDE IMAGE COMPRESSION ---
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200; 
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file); 
              }
            },
            "image/jpeg",
            0.75 
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Standard University Departments
const DEPARTMENTS = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Mathematics",
  "Social Sciences",
  "Natural Sciences",
  "Arts & Humanities"
];

interface AcademicStaff {
  _id: string;
  name: string;
  department: string;
  jobDescription: string; // Academic Title
  detailedBio: string;
  imageUrl: string;
}

interface UpdateProps {
  itemData: AcademicStaff;
  onBack: () => void;
}

const UpdateAcademicStaff = ({ itemData, onBack }: UpdateProps) => {
  // --- STATE ---
  const [name, setName] = useState(itemData.name);
  const [department, setDepartment] = useState(itemData.department || "");
  const [jobDescription, setJobDescription] = useState(itemData.jobDescription);
  const [detailedBio, setDetailedBio] = useState(itemData.detailedBio || "");
  const [imageUrl, setImageUrl] = useState(itemData.imageUrl);
  
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- IMGBB UPLOAD HANDLER ---
  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  };

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    if (!name || !department || !jobDescription || !detailedBio || !imageUrl) {
      alert("Please ensure all faculty fields are filled out.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      // API updated to academic-staff endpoint
      const response = await fetch(`${API_BASE_URL}/api/academic-staff/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name, 
            department,
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
              Update Faculty Profile
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B", mt: 1 }}>
            Staff Employee ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id.toUpperCase()}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems="flex-start">
            
            {/* PROFILE PREVIEW */}
            <Box sx={{ width: { xs: "100%", md: 220 }, textAlign: "center" }}>
              <InputLabel sx={labelStyle}>PROFILE PHOTO</InputLabel>
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
                Live Preview
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

            {/* FORM FIELDS */}
            <Stack spacing={3} sx={{ flexGrow: 1 }}>
              <Box>
                <InputLabel sx={labelStyle}>FULL NAME</InputLabel>
                <TextField 
                  fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                  InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>DEPARTMENT</InputLabel>
                  <TextField 
                    select
                    fullWidth value={department} onChange={(e) => setDepartment(e.target.value)} 
                    InputProps={{ startAdornment: <AccountTreeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept} sx={{ fontFamily: primaryFont, fontSize: '0.85rem' }}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>ACADEMIC TITLE</InputLabel>
                  <TextField 
                    fullWidth value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                    InputProps={{ startAdornment: <SchoolOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                </Box>
              </Stack>

              <Box>
                <InputLabel sx={labelStyle}>ACADEMIC BIOGRAPHY</InputLabel>
                <TextField 
                  fullWidth multiline rows={5} value={detailedBio} 
                  onChange={(e) => setDetailedBio(e.target.value)} 
                  InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8" }} /> }}
                  sx={inputStyle}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>IMAGE URL</InputLabel>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  id="update-staff-headshot-upload" 
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setIsUploadingImage(true);
                      try {
                        const compressedFile = await compressImage(e.target.files[0]);
                        const url = await uploadToImgBB(compressedFile);
                        setImageUrl(url);
                      } catch (error) {
                        console.error("Image upload failed:", error);
                        alert("Failed to upload image.");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />

                <TextField 
                  fullWidth value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste link or click to upload ->"
                  InputProps={{ 
                    startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <label htmlFor="update-staff-headshot-upload">
                          <IconButton component="span" disabled={isUploadingImage} sx={{ color: primaryTeal }}>
                            {isUploadingImage ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                          </IconButton>
                        </label>
                      </InputAdornment>
                    )
                  }}
                  sx={inputStyle}
                />
              </Box>
            </Stack>
          </Stack>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700, textTransform: "none" }}>Discard Changes</Button>
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
              Update Faculty Profile
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Faculty Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, color: "#475569" }}>
            Are you sure you want to save the changes for <strong>{name}</strong>? This will update the official university staff directory.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B" }}>Keep Editing</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, fontWeight: 700, borderRadius: "8px" }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateAcademicStaff;