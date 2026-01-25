import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Divider
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, BadgeOutlined, SchoolOutlined, 
  LocalPhoneOutlined, EmailOutlined, WhatsApp, DoneAllOutlined, SaveOutlined,
  CalendarMonthOutlined, AccessTimeOutlined
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

// Admin Configuration
const ADMIN_WHATSAPP_NUMBER = "94768696704";

interface Guidance {
  _id: string;
  firstName: string;
  lastName: string;
  qualification: string;
  programme: string;
  email: string;
  contact: string;
}

interface UpdateProps {
  data: Guidance;
  onBack: () => void;
}

const UpdateGuidance = ({ data, onBack }: UpdateProps) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState<"SAVE" | "WHATSAPP">("SAVE");

  // --- CORE LOGIC: UPDATE DATABASE & OPTIONAL WHATSAPP ---
  const handleProcessInquiry = async (isWhatsApp: boolean) => {
    setConfirmOpen(false);
    setLoading(true);

    // Capture current Date and Time separately
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    }); 
    const timeStr = now.toLocaleTimeString([], { 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });

    try {
      // 1. Update Database Status to "Closed"
      const response = await fetch(`${API_BASE_URL}/api/guidance/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            status: "Closed", 
            adminReply: replyMessage,
            closedAt: now.toISOString() // Store ISO string in DB for accuracy
        }),
      });

      if (response.ok) {
        if (isWhatsApp) {
          // 2. Trigger WhatsApp with separate Date and Time lines
          const messageHeader = `🔔 *Brainiacs Campus Inquiry*`;
          const studentInfo = `👤 *Student:* ${data.firstName} ${data.lastName}\n📚 *Program:* ${data.programme}\n📞 *Contact:* ${data.contact}`;
          const replyContent = `📝 *Admin Reply:* ${replyMessage}`;
          const timeDetails = `📅 *Date:* ${dateStr}\n🕒 *Time:* ${timeStr}`;
          
          const fullMessage = `${messageHeader}\n\n${studentInfo}\n\n${replyContent}\n\n${timeDetails}\n\n✅ _Processed via Campus Admin Console_`;
          
          window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`, '_blank');
        }
        
        onBack(); // Return to dashboard after success
      } else {
        alert("Failed to close inquiry in system.");
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  const readOnlyStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      bgcolor: "#F8FAFC",
      "& fieldset": { borderColor: borderColor },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#1E293B",
      fontWeight: 600
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Button onClick={onBack} startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: 14 }} />} sx={{ fontFamily: primaryFont, fontWeight: 700, textTransform: 'none', color: "#64748B" }}>
          Return to Dashboard
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
            <Box>
                <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, mb: 1 }}>
                    Finalize Student Inquiry
                </Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontSize: "0.85rem" }}>
                    Select an action to update the database record and optionally notify Admin.
                </Typography>
            </Box>
            <DoneAllOutlined sx={{ fontSize: 40, color: "#10B981", opacity: 0.5 }} />
        </Stack>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", mb: 1 }}>STUDENT NAME</InputLabel>
              <TextField fullWidth disabled value={`${data.firstName} ${data.lastName}`} sx={readOnlyStyle} 
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{color: primaryTeal}} /></InputAdornment> }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", mb: 1 }}>INTERESTED PROGRAMME</InputLabel>
              <TextField fullWidth disabled value={data.programme} sx={readOnlyStyle}
                InputProps={{ startAdornment: <InputAdornment position="start"><SchoolOutlined sx={{color: primaryTeal}} /></InputAdornment> }} />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", mb: 1 }}>CONTACT DETAILS</InputLabel>
              <TextField fullWidth disabled value={data.contact} sx={readOnlyStyle}
                InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneOutlined sx={{color: primaryTeal}} /></InputAdornment> }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.7rem", mb: 1 }}>EMAIL ADDRESS</InputLabel>
              <TextField fullWidth disabled value={data.email} sx={readOnlyStyle}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{color: primaryTeal}} /></InputAdornment> }} />
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }}> <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#94A3B8" }}>ADMIN ACTION</Typography> </Divider>

          <Box>
            <InputLabel sx={{ fontFamily: primaryFont, fontWeight: 800, fontSize: "0.75rem", mb: 1.5, color: primaryTeal }}>
                ADMIN PROCESSING NOTE / REPLY
            </InputLabel>
            <TextField 
              fullWidth multiline rows={4} 
              placeholder="Ex: Student contacted via phone. Registration confirmed..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              sx={{ 
                "& .MuiOutlinedInput-root": { borderRadius: "16px", fontFamily: primaryFont, bgcolor: "#FDFDFD" },
                "& fieldset": { borderColor: primaryTeal, borderWidth: "1.5px" }
              }} 
            />
          </Box>

          <Box sx={{ pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onBack} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700 }}>Cancel</Button>
            
            <Button 
              variant="outlined"
              disabled={loading || !replyMessage}
              onClick={() => { setMode("SAVE"); setConfirmOpen(true); }}
              startIcon={<SaveOutlined />}
              sx={{ 
                borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700,
                color: primaryTeal, borderColor: primaryTeal, px: 3
              }}
            >
              Close Inquiry
            </Button>

            <Button 
              variant="contained" 
              onClick={() => { setMode("WHATSAPP"); setConfirmOpen(true); }} 
              disabled={loading || !replyMessage}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WhatsApp />}
              sx={{ 
                bgcolor: "#25D366", 
                px: 3, py: 1.5, borderRadius: "12px", fontFamily: primaryFont, fontWeight: 800,
                "&:hover": { bgcolor: "#128C7E" }
              }}
            >
              Close & Notify WhatsApp
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* CONFIRMATION POPUP */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {mode === "WHATSAPP" ? <WhatsApp sx={{color: "#25D366"}} /> : <SaveOutlined sx={{color: primaryTeal}} />} 
          {mode === "WHATSAPP" ? "Send WhatsApp Report?" : "Close Inquiry?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            {mode === "WHATSAPP" 
                ? "This will update the database and send a report including the closure date and time to Admin."
                : "This will mark the inquiry as closed in the database only."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8" }}>Review</Button>
          <Button 
            onClick={() => handleProcessInquiry(mode === "WHATSAPP")} 
            variant="contained" 
            sx={{ bgcolor: primaryTeal, borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateGuidance;