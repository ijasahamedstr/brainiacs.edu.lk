import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  PhotoSizeSelectActualOutlined,
  DeleteOutline, AddOutlined,
  PlaceOutlined, AccessTimeOutlined, TodayOutlined,
  BrokenImageOutlined
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddProps {
  onBack: () => void;
}

const CreateEvent = ({ onBack }: AddProps) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState<string[]>([""]);
  const [eventPlace, setEventPlace] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);       
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

  const handleSaveClick = () => {
    const validDescs = eventDescription.filter(d => d.trim() !== "");
    const validUrls = imageUrls.filter(u => u.trim() !== "");
    if (!eventName || !eventPlace || !startDate || !finishDate || validDescs.length === 0 || validUrls.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
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

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />} 
          sx={{ fontFamily: primaryFont, color: "#64748B", textTransform: 'none', fontWeight: 700 }}
        >
          Back to Events
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}` }}>
        <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 4 }}>
          Schedule New Event
        </Typography>

        <Stack spacing={4}>
          {/* IMAGE PREVIEW - HORIZONTAL SCROLL */}
          {imageUrls.some(u => u.trim() !== "") && (
            <Box>
              <InputLabel sx={labelStyle}>IMAGE PREVIEW</InputLabel>
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                {imageUrls.map((url, index) => (
                  url.trim() !== "" && (
                    <Box key={index} sx={{ minWidth: 150, height: 100, borderRadius: "12px", overflow: "hidden", border: `1px solid ${borderColor}`, position: 'relative', bgcolor: '#F8FAFC' }}>
                      <Box 
                        component="img" 
                        src={url} 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e: any) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                      <Box sx={{ display: 'none', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                        <BrokenImageOutlined fontSize="small" />
                      </Box>
                    </Box>
                  )
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <InputLabel sx={labelStyle}>EVENT NAME</InputLabel>
            <TextField fullWidth value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Annual Gala 2026" InputProps={{ startAdornment: <TitleOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
          </Box>

          <Box>
            <InputLabel sx={labelStyle}>LOCATION</InputLabel>
            <TextField fullWidth value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} placeholder="Main Auditorium" InputProps={{ startAdornment: <PlaceOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
          </Box>

          <Box>
            <InputLabel sx={labelStyle}>TIME</InputLabel>
            <TextField fullWidth value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="09:00 AM - 05:00 PM" InputProps={{ startAdornment: <AccessTimeOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
          </Box>

          <Box>
            <InputLabel sx={labelStyle}>START DATE</InputLabel>
            <TextField fullWidth type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
          </Box>

          <Box>
            <InputLabel sx={labelStyle}>FINISH DATE</InputLabel>
            <TextField fullWidth type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} InputProps={{ startAdornment: <TodayOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>EVENT DESCRIPTION</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddDescription} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add Paragraph</Button>
            </Stack>
            <Stack spacing={2}>
              {eventDescription.map((desc, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField fullWidth multiline rows={2} value={desc} onChange={(e) => handleDescChange(index, e.target.value)} placeholder="Write details here..." sx={inputStyle} />
                  <IconButton onClick={() => setEventDescription(eventDescription.filter((_, i) => i !== index))} color="error" disabled={eventDescription.length === 1}><DeleteOutline /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <InputLabel sx={labelStyle}>IMAGE URLS</InputLabel>
              <Button size="small" startIcon={<AddOutlined />} onClick={handleAddImageUrl} sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, textTransform: "none" }}>Add URL</Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={1}>
                  <TextField fullWidth value={url} onChange={(e) => handleUrlChange(index, e.target.value)} placeholder="https://image-link.com" InputProps={{ startAdornment: <PhotoSizeSelectActualOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }} sx={inputStyle} />
                  <IconButton onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))} color="error" disabled={imageUrls.length === 1}><DeleteOutline /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box sx={{ pt: 3, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Discard</Button>
            <Button variant="contained" onClick={handleSaveClick} disabled={loading} sx={{ fontFamily: primaryFont, bgcolor: primaryTeal, px: 5, borderRadius: "10px", fontWeight: 800 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Event"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800 }}>Confirm Publish</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont }}>Publish this event to the dashboard?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont }}>Cancel</Button>
          <Button onClick={confirmSave} variant="contained" sx={{ bgcolor: primaryTeal, borderRadius: "10px", fontFamily: primaryFont }}>Publish</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateEvent;