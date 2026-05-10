import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined, SaveOutlined,
  DeleteOutline, AddOutlined, DescriptionOutlined,
  InfoOutlined, PlaceOutlined, AccessTimeOutlined,
  TodayOutlined, BrokenImageOutlined
} from "@mui/icons-material";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

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
  const [eventName, setEventName] = useState(itemData.eventName);
  const [eventDescription, setEventDescription] = useState<string[]>(itemData.eventDescription);
  const [eventPlace, setEventPlace] = useState(itemData.eventPlace);
  const [eventTime, setEventTime] = useState(itemData.eventTime);
  const [startDate, setStartDate] = useState(formatDate(itemData.startDate));
  const [finishDate, setFinishDate] = useState(formatDate(itemData.finishDate));
  const [imageUrls, setImageUrls] = useState<string[]>(itemData.imageUrls);
  
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // --- HANDLERS ---
  const handleAddDescription = () => setEventDescription([...eventDescription, ""]);
  const handleDescChange = (index: number, value: string) => {
    const updated = [...eventDescription];
    updated[index] = value;
    setEventDescription(updated);
  };

  const handleAddImageUrl = () => setImageUrls([...imageUrls, ""]);
  const handleUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  // --- UPDATE LOGIC ---
  const handleUpdateClick = () => {
    if (!eventName || !eventPlace || !startDate || !finishDate) {
      alert("Please fill in all required event details.");
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

      if (response.ok) onBack(); 
      else alert("Update failed.");
    } catch (error) {
      console.error(error);
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
          
          {/* IMAGE PREVIEW - HORIZONTAL SCROLL (NEW) */}
          {imageUrls.some(u => u.trim() !== "") && (
            <Box>
              <InputLabel sx={labelStyle}>CURRENT IMAGE PREVIEW</InputLabel>
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
                {imageUrls.map((url, index) => (
                  url.trim() !== "" && (
                    <Box 
                      key={index} 
                      sx={{ 
                        minWidth: 160, 
                        height: 110, 
                        borderRadius: "12px", 
                        overflow: "hidden", 
                        border: `1px solid ${borderColor}`, 
                        position: 'relative', 
                        bgcolor: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box 
                        component="img" 
                        src={url} 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e: any) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'flex'; 
                        }}
                      />
                      <Box sx={{ display: 'none', flexDirection: 'column', alignItems: 'center', color: '#94A3B8' }}>
                        <BrokenImageOutlined fontSize="small" />
                        <Typography sx={{ fontSize: '0.6rem', fontFamily: primaryFont }}>Invalid URL</Typography>
                      </Box>
                    </Box>
                  )
                ))}
              </Stack>
            </Box>
          )}

          {/* EVENT NAME */}
          <Box>
            <InputLabel sx={labelStyle}>EVENT NAME</InputLabel>
            <TextField 
              fullWidth value={eventName} onChange={(e) => setEventName(e.target.value)} 
              InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* PLACE */}
          <Box>
            <InputLabel sx={labelStyle}>LOCATION / PLACE</InputLabel>
            <TextField 
              fullWidth value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} 
              InputProps={{ startAdornment: <PlaceOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* TIME */}
          <Box>
            <InputLabel sx={labelStyle}>TIME</InputLabel>
            <TextField 
              fullWidth value={eventTime} onChange={(e) => setEventTime(e.target.value)} 
              InputProps={{ startAdornment: <AccessTimeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* START DATE */}
          <Box>
            <InputLabel sx={labelStyle}>START DATE</InputLabel>
            <TextField 
              fullWidth type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
              InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

          {/* FINISH DATE */}
          <Box>
            <InputLabel sx={labelStyle}>FINISH DATE</InputLabel>
            <TextField 
              fullWidth type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} 
              InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
              sx={inputStyle}
            />
          </Box>

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
                    onClick={() => setEventDescription(eventDescription.filter((_, i) => i !== index))} 
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

          {/* IMAGE URLS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>IMAGE GALLERY URLS</InputLabel>
              <Button 
                size="small" 
                startIcon={<AddOutlined />} 
                onClick={handleAddImageUrl} 
                sx={{ fontFamily: primaryFont, color: primaryTeal, fontWeight: 700, textTransform: 'none' }}
              >
                Add Image URL
              </Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <TextField 
                    fullWidth value={url} 
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                    sx={inputStyle}
                  />
                  <IconButton onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))} color="error" disabled={imageUrls.length === 1}>
                    <DeleteOutline />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* ACTIONS */}
          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700 }}>Cancel</Button>
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
                '&:hover': { bgcolor: '#00333d' }
              }}
            >
              Update Record
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <InfoOutlined sx={{ color: primaryTeal }} /> Confirm Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont }}>
            Are you sure you want to update this event? The changes will be visible on the public calendar immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Keep Editing</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, fontWeight: 700 }}>Update Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateEvent;