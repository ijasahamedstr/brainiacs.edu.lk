import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  MenuItem, Select, InputLabel, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  ToggleButton, ToggleButtonGroup, Divider, Tooltip, Zoom
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, 
  TitleOutlined, 
  LinkOutlined, 
  RemoveRedEyeOutlined,
  SmartphoneOutlined,
  DesktopWindowsOutlined,
  CloudUploadOutlined,
  InfoOutlined,
  ErrorOutline
} from "@mui/icons-material";

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface AddSliderProps {
  onBack: () => void;
}

const CreateNewSlider = ({ onBack }: AddSliderProps) => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    mobileImageUrl: "",
    redirectLink: "",
    status: "Active"
  });

  const [loading, setLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [urlError, setUrlError] = useState(false);

  // 2. OPTIMIZED HANDLERS
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (field === "imageUrl" || field === "mobileImageUrl") setUrlError(false);
  };

  const handleSaveClick = () => {
    if (!formData.name || !formData.imageUrl) {
      alert("Please enter an Asset Identifier and at least the Desktop Resource URL.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // 3. FAST DATABASE SYNC
  const confirmSave = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            createdAt: new Date().toISOString()
        }),
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

  // 4. SHARED UI STYLES
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: primaryFont,
      fontSize: "0.85rem",
      fontWeight: 600,
      bgcolor: "#F8FAFC",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: borderColor },
      "&.Mui-focused fieldset": { borderColor: primaryTeal, borderWidth: "2px", bgcolor: "#FFF" },
    },
    "& .MuiInputLabel-root": {
        fontFamily: primaryFont,
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#64748B"
    }
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
                        <CloudUploadOutlined sx={{ color: primaryTeal, fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: -0.5 }}>
                            Initialize New Media Asset
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                            Configure visual parameters and routing rules.
                        </Typography>
                    </Box>
                </Box>

                <Stack spacing={4}>
                    {/* SECTION: GENERAL INFO */}
                    <Box>
                        <Typography sx={sectionHeaderStyle}>
                            <TitleOutlined sx={{ fontSize: 16 }} /> IDENTITY & SCHEMA
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>ASSET IDENTIFIER</InputLabel>
                                <TextField 
                                    fullWidth value={formData.name} onChange={handleChange("name")}
                                    placeholder="e.g. Q3 Logistics Promo - Desktop"
                                    sx={inputStyle}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>DEPLOYMENT STATUS</InputLabel>
                                <Select 
                                    fullWidth value={formData.status} 
                                    onChange={(e) => setFormData(p => ({...p, status: e.target.value as string}))}
                                    sx={{ borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700, fontSize: "0.85rem", bgcolor: "#F8FAFC", "& fieldset": { borderColor: "transparent" } }}
                                >
                                    <MenuItem value="Active" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Active (Live)</MenuItem>
                                    <MenuItem value="Inactive" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Inactive (Staged)</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* SECTION: ASSETS */}
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}>
                            <Typography sx={{ ...sectionHeaderStyle, mb: 0 }}>
                                <DesktopWindowsOutlined sx={{ fontSize: 16 }} /> CROSS-DEVICE MEDIA
                            </Typography>
                            <Tooltip title="Provide highly optimized URLs for rapid CDN delivery.">
                                <InfoOutlined sx={{ fontSize: 14, color: "#94A3B8", cursor: "help" }} />
                            </Tooltip>
                        </Stack>

                        <Stack spacing={3}>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>DESKTOP RESOURCE (1920x600 Target)</InputLabel>
                                <TextField 
                                    fullWidth value={formData.imageUrl} onChange={handleChange("imageUrl")}
                                    placeholder="https://cdn.example.com/desktop-banner.jpg"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><LinkOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                                    sx={inputStyle}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>MOBILE RESOURCE (800x800 Target)</InputLabel>
                                <TextField 
                                    fullWidth value={formData.mobileImageUrl} onChange={handleChange("mobileImageUrl")}
                                    placeholder="https://cdn.example.com/mobile-banner.jpg"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><LinkOutlined sx={{ fontSize: 18 }} /></InputAdornment> }}
                                    sx={inputStyle}
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* SECTION: ROUTING */}
                    <Box>
                        <Typography sx={sectionHeaderStyle}>
                            <LinkOutlined sx={{ fontSize: 16 }} /> ROUTING & DESTINATION
                        </Typography>
                        <Box>
                            <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>TARGET URL ON CLICK</InputLabel>
                            <TextField 
                                fullWidth value={formData.redirectLink} onChange={handleChange("redirectLink")}
                                placeholder="https://example.com/promotions"
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "0.7rem", color: primaryTeal, letterSpacing: 1 }}>
                            MEDIA PREVIEW
                        </Typography>
                        <ToggleButtonGroup
                            value={previewDevice}
                            exclusive
                            onChange={(_, v) => v && setPreviewDevice(v)}
                            size="small"
                            sx={{ bgcolor: "#F1F5F9", borderRadius: "8px", p: 0.5 }}
                        >
                            <ToggleButton value="desktop" sx={{ border: "none", borderRadius: "6px !important", py: 0.5, px: 1.5 }}><DesktopWindowsOutlined sx={{ fontSize: 16 }} /></ToggleButton>
                            <ToggleButton value="mobile" sx={{ border: "none", borderRadius: "6px !important", py: 0.5, px: 1.5 }}><SmartphoneOutlined sx={{ fontSize: 16 }} /></ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>

                    <Box sx={{ 
                        width: "100%", 
                        height: previewDevice === "mobile" ? "450px" : "220px",
                        maxWidth: previewDevice === "mobile" ? "280px" : "100%",
                        mx: "auto", borderRadius: previewDevice === "mobile" ? "24px" : "12px", 
                        bgcolor: "#000", overflow: "hidden", 
                        position: "relative", border: previewDevice === "mobile" ? "6px solid #1E293B" : "1px solid #E2E8F0",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}>
                        {(previewDevice === "mobile" ? (formData.mobileImageUrl || formData.imageUrl) : formData.imageUrl) ? (
                            <Box 
                                component="img"
                                src={previewDevice === "mobile" ? (formData.mobileImageUrl || formData.imageUrl) : formData.imageUrl}
                                onError={() => setUrlError(true)}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "#64748B", gap: 1 }}>
                                <RemoveRedEyeOutlined sx={{ fontSize: 40, opacity: 0.2 }} />
                                <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.75rem", opacity: 0.5 }}>Awaiting Media Data...</Typography>
                            </Stack>
                        )}
                        
                        {/* Device Notch Simulation for Mobile */}
                        {previewDevice === "mobile" && (
                            <Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100px", height: "15px", bgcolor: "#1E293B", borderRadius: "0 0 10px 10px" }} />
                        )}
                    </Box>

                    {urlError && (
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, p: 1.5, bgcolor: '#FEF2F2', borderRadius: '8px', color: "#EF4444" }}>
                            <ErrorOutline sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>Render Failure: Invalid source URL provided.</Typography>
                        </Stack>
                    )}
                </Paper>

                {/* DEPLOYMENT ACTIONS */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#F8FAFC" }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, mb: 3, lineHeight: 1.5 }}>
                        Verify visual assets across breakpoints before pushing to the live environment.
                    </Typography>
                    
                    <Button 
                        fullWidth
                        variant="contained" 
                        onClick={handleSaveClick}
                        disabled={loading}
                        sx={{ 
                            bgcolor: primaryTeal, py: 1.8, borderRadius: "14px",
                            fontFamily: primaryFont, fontWeight: 800, fontSize: '0.85rem',
                            boxShadow: "0 10px 25px rgba(0,70,82,0.15)",
                            "&:hover": { bgcolor: "#002d35", transform: "translateY(-2px)" },
                            transition: "all 0.2s"
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#FFF" }} /> : "Compile & Deploy Asset"}
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
            Confirm Asset Deployment
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
            The visual asset <b>{formData.name || 'Untitled'}</b> will be processed and pushed to the live production environment.
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

export default CreateNewSlider;