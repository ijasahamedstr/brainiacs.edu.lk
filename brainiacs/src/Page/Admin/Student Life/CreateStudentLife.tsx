import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, InputAdornment, Snackbar, Alert
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  CollectionsOutlined, HideImageOutlined,
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

const CreateStudentLife = ({ onBack }: AddProps) => {
  // --- STATE ---
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([""]); 
  const [imageUrls, setImageUrls] = useState<string[]>([""]);       
  
  const [loading, setLoading] = useState(false);
  const [uploadingIndices, setUploadingIndices] = useState<number[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" as "success" | "error" });

  // --- IMGBB UPLOAD ENGINE ---
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

  // MULTI-UPLOAD: Handles individual row but supports multiple file selection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadingIndices(prev => [...prev, index]);
      
      try {
        const uploadedUrls: string[] = [];
        for (const file of files) {
          const compressedFile = await compressImage(file);
          const url = await uploadToImgBB(compressedFile);
          uploadedUrls.push(url);
        }
        
        setImageUrls(prev => {
          const updated = [...prev];
          updated[index] = uploadedUrls[0]; // Replace current index with first image
          if (uploadedUrls.length > 1) {
            return [...updated, ...uploadedUrls.slice(1)]; // Append the rest
          }
          return updated;
        });
        
        setSnackbar({ open: true, message: `Successfully uploaded ${files.length} asset(s)`, type: "success" });
      } catch (error) {
        console.error("Image upload failed:", error);
        setSnackbar({ open: true, message: "Failed to upload image(s).", type: "error" });
      } finally {
        setUploadingIndices(prev => prev.filter(i => i !== index));
        e.target.value = ""; // clear input
      }
    }
  };

  // MULTI-UPLOAD: Dedicated Bulk Upload feature
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsBulkUploading(true);
      try {
        const newUrls: string[] = [];
        for (const file of files) {
          const compressed = await compressImage(file);
          const url = await uploadToImgBB(compressed);
          newUrls.push(url);
        }
        setImageUrls(prev => {
          const filtered = prev.filter(u => u.trim() !== ""); // Remove empty rows before appending
          return [...filtered, ...newUrls].length ? [...filtered, ...newUrls] : [""];
        });
        setSnackbar({ open: true, message: `Successfully bulk uploaded ${files.length} asset(s)`, type: "success" });
      } catch (error) {
        console.error("Bulk upload failed:", error);
        setSnackbar({ open: true, message: "Failed to upload one or more images.", type: "error" });
      } finally {
        setIsBulkUploading(false);
        e.target.value = '';
      }
    }
  };

  // --- ARRAY HANDLERS ---
  const handleAddDescription = () => setDescriptions([...descriptions, ""]);
  const handleRemoveDescription = (index: number) => {
    const newDesc = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDesc.length ? newDesc : [""]);
  };
  const handleDescChange = (index: number, value: string) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };

  const handleAddImageUrl = () => setImageUrls([...imageUrls, ""]);
  const handleRemoveImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length ? newUrls : [""]);
  };
  const handleUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  // --- SAVE LOGIC ---
  const handleSaveClick = () => {
    const validDescs = descriptions.filter(d => d.trim() !== "");
    const validUrls = imageUrls.filter(u => u.trim() !== "");

    if (!name || validDescs.length === 0 || validUrls.length === 0) {
      setSnackbar({ open: true, message: "Please fill in Name, at least one Description, and one Image.", type: "error" });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-life`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          descriptions: descriptions.filter(d => d.trim() !== ""), 
          imageUrls: imageUrls.filter(u => u.trim() !== "") 
        }),
      });
      if (response.ok) onBack();
      else setSnackbar({ open: true, message: "Save failed. Please try again.", type: "error" });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Network Error.", type: "error" });
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
          Back to Dashboard
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>New Student Life Section</Typography>
          <Typography variant="body2" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>All text rendered in Montserrat.</Typography>
        </Box>

        <Stack spacing={4}>
          {/* TITLE */}
          <Box>
            <InputLabel sx={labelStyle}>SECTION TITLE</InputLabel>
            <TextField 
              fullWidth value={name} onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Student Clubs & Governance" 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>CONTENT PARAGRAPHS</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Para</Button>
            </Stack>
            <Stack spacing={2}>
              {descriptions.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder="Enter paragraph content..."
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8", fontSize: 20 }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveDescription(index)} color="error" disabled={descriptions.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* IMAGE URLS WITH MULTI-UPLOAD */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>IMAGE GALLERY (URL OR UPLOAD)</InputLabel>
              <Stack direction="row" spacing={1}>
                {/* NEW BULK UPLOAD BUTTON */}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  id="bulk-upload" 
                  style={{ display: "none" }}
                  onChange={handleBulkUpload}
                />
                <label htmlFor="bulk-upload">
                  <Button 
                    component="span" 
                    size="small" 
                    startIcon={isBulkUploading ? <CircularProgress size={16} /> : <CloudUploadOutlined />} 
                    disabled={isBulkUploading} 
                    sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}
                  >
                    Bulk Upload
                  </Button>
                </label>
                <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Link</Button>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    id={`student-life-upload-${index}`} 
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/photo.jpg or click to upload ->"
                    InputProps={{ 
                      startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8", fontSize: 20 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor={`student-life-upload-${index}`}>
                            <IconButton component="span" disabled={uploadingIndices.includes(index) || isBulkUploading} sx={{ color: primaryTeal }}>
                              {uploadingIndices.includes(index) ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                            </IconButton>
                          </label>
                        </InputAdornment>
                      )
                    }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveImageUrl(index)} color="error" disabled={imageUrls.length === 1}><DeleteOutline fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* --- GRID PREVIEW (6 IMAGES PER ROW) --- */}
          <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <CollectionsOutlined sx={{ fontSize: 18, color: primaryTeal }} />
              <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.65rem", color: primaryTeal, letterSpacing: 1 }}>ASSET PREVIEW (GRID VIEW)</Typography>
            </Stack>
            
            {imageUrls.filter(u => u.trim() !== "").length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, 
                gap: 2 
              }}>
                {imageUrls.map((url, i) => url.trim() && (
                  <Box key={i} sx={{ aspectRatio: '4/3', borderRadius: "10px", overflow: "hidden", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
                    <Box component="img" src={url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e: any) => e.target.src="https://placehold.co/400x300?text=Invalid"} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.5, py: 2 }}>
                <HideImageOutlined />
                <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600 }}>Awaiting image links...</Typography>
              </Stack>
            )}
          </Box>

          {/* FOOTER */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading || isBulkUploading || uploadingIndices.length > 0} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Entry"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} sx={{ borderRadius: "14px", fontFamily: primaryFont, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* DIALOG */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Creation</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>Add this section to Student Life?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, borderRadius: "10px" }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateStudentLife;