import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  Avatar, InputAdornment, IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  PhotoSizeSelectActualOutlined, WorkOutline,
  PersonAddOutlined, BadgeOutlined, DescriptionOutlined,
  CloudUploadOutlined
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

interface AddProps {
  onBack: () => void;
}

const CreateGovernance = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // Designation/Title
  const [detailedBio, setDetailedBio] = useState("");       // Second Description Field
  const [imageUrl, setImageUrl] = useState("");       
  
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

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    if (!name || !jobDescription || !detailedBio || !imageUrl) {
      alert("Please provide the Name, Designation, Bio, and Profile Image URL.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/board-governance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          jobDescription, 
          detailedBio, // Sending the second description
          imageUrl 
        }),
      });
      if (response.ok) onBack();
      else alert("Save failed.");
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
          Back to List
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
             <PersonAddOutlined sx={{ color: primaryTeal }} />
             <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Add Board Member</Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>Create a new profile with dual descriptions for the Board of Governance.</Typography>
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
                  <InputLabel sx={labelStyle}>MEMBER FULL NAME</InputLabel>
                  <TextField 
                    fullWidth value={name} onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Dr. Jonathan Smith" 
                    InputProps={{ startAdornment: <BadgeOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* DESIGNATION (Primary Description) */}
                <Box>
                  <InputLabel sx={labelStyle}>DESIGNATION / JOB TITLE</InputLabel>
                  <TextField 
                    fullWidth value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} 
                    placeholder="e.g. Executive Director" 
                    InputProps={{ startAdornment: <WorkOutline sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* DETAILED BIO (Secondary Description) */}
                <Box>
                  <InputLabel sx={labelStyle}>DETAILED BIOGRAPHY / RESPONSIBILITIES</InputLabel>
                  <TextField 
                    fullWidth multiline rows={4} value={detailedBio} 
                    onChange={(e) => setDetailedBio(e.target.value)} 
                    placeholder="Provide a detailed background of the member..." 
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                </Box>

                {/* IMAGE URL WITH UPLOAD */}
                <Box>
                  <InputLabel sx={labelStyle}>PROFILE PHOTO URL</InputLabel>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="gov-headshot-upload" 
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
                      startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor="gov-headshot-upload">
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
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Record</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>Would you like to add {name || 'this member'} to the governance board?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Confirm & Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateGovernance;