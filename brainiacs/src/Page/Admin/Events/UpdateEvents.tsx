import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, InputAdornment, Snackbar, Alert
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined, SaveOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  InfoOutlined, PlaceOutlined, AccessTimeOutlined,
  TodayOutlined, CloudUploadOutlined, 
  CollectionsOutlined, HideImageOutlined
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

interface EventData {
  _id: string;
  eventName: string;
  eventDescription: string[];
  eventPlace: string;
  eventTime: string;
  startDate: string | Date;
  finishDate: string | Date;
  imageUrls: string[];
}

interface UpdateProps {
  itemData: EventData;
  onBack: () => void;
}

const UpdateEvent = ({ itemData, onBack }: UpdateProps) => {
  // Helper to format date for input field (YYYY-MM-DD)
  const formatDate = (date: string | Date) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  // --- STATE ---
  const [eventName, setEventName] = useState(itemData.eventName || "");
  const [eventDescription, setEventDescription] = useState<string[]>(itemData.eventDescription?.length ? itemData.eventDescription : [""]);
  const [eventPlace, setEventPlace] = useState(itemData.eventPlace || "");
  const [eventTime, setEventTime] = useState(itemData.eventTime || "");
  const [startDate, setStartDate] = useState(formatDate(itemData.startDate));
  const [finishDate, setFinishDate] = useState(formatDate(itemData.finishDate));
  const [imageUrls, setImageUrls] = useState<string[]>(itemData.imageUrls?.length ? itemData.imageUrls : [""]);
  
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

  // --- HANDLERS ---
  const handleAddDescription = () => setEventDescription([...eventDescription, ""]);
  const handleRemoveDescription = (index: number) => {
    const newDesc = eventDescription.filter((_, i) => i !== index);
    setEventDescription(newDesc.length ? newDesc : [""]);
  };
  const handleDescChange = (index: number, value: string) => {
    const updated = [...eventDescription];
    updated[index] = value;
    setEventDescription(updated);
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

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    const validDescs = eventDescription.filter(d => d.trim() !== "");
    const validUrls = imageUrls.filter(u => u.trim() !== "");

    if (!eventName || !eventPlace || !startDate || !finishDate || validDescs.length === 0 || validUrls.length === 0) {
      setSnackbar({ open: true, message: "Please fill in all required event details.", type: "error" });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventName, 
          eventDescription: eventDescription.filter(d => d.trim() !== ""), 
          eventPlace, 
          eventTime, 
          startDate, 
          finishDate, 
          imageUrls: imageUrls.filter(u => u.trim() !== "") 
        }),
      });

      if (response.ok) {
        onBack(); 
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: `Error: ${errorData.message}`, type: "error" });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Could not connect to the server.", type: "error" });
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
    "& .MuiInputBase-input": { fontFamily: primaryFont, fontSize: "0.85rem" }
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
          sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B", textTransform: 'none' }}
        >
          Back to Events
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}` }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 0.5 }}>
            Update Event Details
          </Typography>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", color: "#64748B" }}>
            Record ID: <span style={{ color: primaryTeal, fontWeight: 700 }}>{itemData._id}</span>
          </Typography>
        </Box>

        <Stack spacing={4}>
          
          {/* EVENT NAME */}
          <Box>
            <InputLabel sx={labelStyle}>EVENT NAME</InputLabel>
            <TextField 
              fullWidth value={eventName} onChange={(e) => setEventName(e.target.value)} 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* PLACE */}
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>LOCATION / PLACE</InputLabel>
              <TextField 
                fullWidth value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} 
                InputProps={{ startAdornment: <PlaceOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>

            {/* TIME */}
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>TIME</InputLabel>
              <TextField 
                fullWidth value={eventTime} onChange={(e) => setEventTime(e.target.value)} 
                InputProps={{ startAdornment: <AccessTimeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* START DATE */}
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>START DATE</InputLabel>
              <TextField 
                fullWidth type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>

            {/* FINISH DATE */}
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={labelStyle}>FINISH DATE</InputLabel>
              <TextField 
                fullWidth type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} 
                InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          {/* DESCRIPTIONS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>EVENT DESCRIPTION (PARAGRAPHS)</InputLabel>
              <Button 
                size="small" 
                startIcon={<AddOutlined />} 
                onClick={handleAddDescription} 
                sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700, textTransform: 'none' }}
              >
                Add Paragraph
              </Button>
            </Stack>
            <Stack spacing={2}>
              {eventDescription.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                  <TextField 
                    fullWidth multiline rows={2} value={desc} 
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    InputProps={{ startAdornment: <DescriptionOutlined sx={{ mr: 1, mt: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton 
                    onClick={() => handleRemoveDescription(index)} 
                    color="error" 
                    disabled={eventDescription.length === 1}
                    sx={{ mt: 1 }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* IMAGE URLS WITH MULTI-UPLOAD */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>IMAGE GALLERY (URL OR UPLOAD)</InputLabel>
              <Stack direction="row" spacing={1}>
                {/* BULK UPLOAD BUTTON */}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  id="bulk-upload-update-event" 
                  style={{ display: "none" }}
                  onChange={handleBulkUpload}
                />
                <label htmlFor="bulk-upload-update-event">
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
                <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700, textTransform: "none" }}>Add Link</Button>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    id={`event-update-upload-${index}`} 
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/photo.jpg or click to upload ->"
                    InputProps={{ 
                      startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor={`event-update-upload-${index}`}>
                            <IconButton component="span" disabled={uploadingIndices.includes(index) || isBulkUploading} sx={{ color: primaryTeal }}>
                              {uploadingIndices.includes(index) ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                            </IconButton>
                          </label>
                        </InputAdornment>
                      )
                    }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => handleRemoveImageUrl(index)} color="error" disabled={imageUrls.length === 1}>
                    <DeleteOutline />
                  </IconButton>
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

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700, textTransform: "none" }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateClick}
              disabled={loading || isBulkUploading || uploadingIndices.length > 0}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
              sx={{ 
                fontFamily: primaryFont, 
                bgcolor: primaryTeal, 
                px: 4, 
                borderRadius: "10px", 
                fontWeight: 800,
                textTransform: "none",
                '&:hover': { bgcolor: '#00333d' }
              }}
            >
              Update Record
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

      {/* CONFIRMATION DIALOG */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800, color: primaryTeal }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            Are you sure you want to update this event? The changes will be visible on the public calendar immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Keep Editing</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, fontWeight: 700, borderRadius: "10px" }}>Update Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateEvent;