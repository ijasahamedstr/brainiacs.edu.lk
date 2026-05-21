import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  MenuItem, Select, InputLabel, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  ToggleButton, ToggleButtonGroup, Divider, Tooltip,
  IconButton
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
  EditOutlined
} from "@mui/icons-material";

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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
        const MAX_WIDTH = 1920; 
        const MAX_HEIGHT = 1080;
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

interface Slider {
  _id: string;
  name: string;
  imageUrl: string;
  mobileImageUrl: string;
  redirectLink?: string;
  status: "Active" | "Inactive";
}

interface UpdateProps {
  sliderData: Slider;
  onBack: () => void;
}

const UpdateSliderForm = ({ sliderData, onBack }: UpdateProps) => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState<Slider>({
    ...sliderData,
    mobileImageUrl: sliderData.mobileImageUrl || ""
  });

  const [loading, setLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Upload Loading States
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);

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

  // 2. OPTIMIZED HANDLERS
  const handleChange = (field: keyof Slider) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleUpdateClick = () => {
    if (!formData.name || !formData.imageUrl || !formData.mobileImageUrl) {
      alert("Please ensure Asset Identifier, Desktop Resource, and Mobile Resource are provided.");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // 3. FAST DATABASE SYNC (PUT REQUEST)
  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders/${sliderData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onBack(); 
      } else {
        const errorData = await response.json();
        alert(`Server Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Database connection failed. Please check your API status.");
    } finally {
      setLoading(false);
    }
  };

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
                        <EditOutlined sx={{ color: primaryTeal, fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: -0.5 }}>
                            Modify Media Asset
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                            Updating parameters for asset ID: <span style={{ color: primaryTeal }}>{sliderData._id.substring(0,8)}...</span>
                        </Typography>
                    </Box>
                </Box>

                <Stack spacing={4}>
                    <Box>
                        <Typography sx={sectionHeaderStyle}>
                            <TitleOutlined sx={{ fontSize: 16 }} /> IDENTITY & SCHEMA
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>ASSET IDENTIFIER</InputLabel>
                                <TextField 
                                    fullWidth value={formData.name} onChange={handleChange("name")}
                                    placeholder="e.g. Q3 Logistics Promo"
                                    sx={inputStyle}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>DEPLOYMENT STATUS</InputLabel>
                                <Select 
                                    fullWidth value={formData.status} 
                                    onChange={(e) => setFormData(p => ({...p, status: e.target.value as "Active" | "Inactive"}))}
                                    sx={{ borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700, fontSize: "0.85rem", bgcolor: "#F8FAFC", "& fieldset": { borderColor: "transparent" } }}
                                >
                                    <MenuItem value="Active" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Active (Live)</MenuItem>
                                    <MenuItem value="Inactive" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Inactive (Staged)</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

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
                            {/* DESKTOP UPLOAD */}
                            <Box>
                                <input type="file" accept="image/*" id="desktop-upload" style={{ display: "none" }}
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setIsUploadingDesktop(true);
                                            try {
                                                const compressed = await compressImage(e.target.files[0]);
                                                const url = await uploadToImgBB(compressed);
                                                setFormData(prev => ({ ...prev, imageUrl: url }));
                                            } catch (err) { alert("Upload failed"); } finally { setIsUploadingDesktop(false); }
                                        }
                                    }}
                                />
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>DESKTOP RESOURCE (1920x600 Target)</InputLabel>
                                <TextField 
                                    fullWidth value={formData.imageUrl} onChange={handleChange("imageUrl")}
                                    placeholder="Paste URL or upload ->"
                                    InputProps={{ 
                                        startAdornment: <InputAdornment position="start"><LinkOutlined sx={{ fontSize: 18 }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end">
                                            <label htmlFor="desktop-upload"><IconButton component="span" disabled={isUploadingDesktop}>{isUploadingDesktop ? <CircularProgress size={20}/> : <CloudUploadOutlined/>}</IconButton></label>
                                        </InputAdornment>
                                    }}
                                    sx={inputStyle}
                                />
                            </Box>

                            {/* MOBILE UPLOAD */}
                            <Box>
                                <input type="file" accept="image/*" id="mobile-upload" style={{ display: "none" }}
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setIsUploadingMobile(true);
                                            try {
                                                const compressed = await compressImage(e.target.files[0]);
                                                const url = await uploadToImgBB(compressed);
                                                setFormData(prev => ({ ...prev, mobileImageUrl: url }));
                                            } catch (err) { alert("Upload failed"); } finally { setIsUploadingMobile(false); }
                                        }
                                    }}
                                />
                                <InputLabel sx={{ mb: 1, ml: 1, fontWeight: 700, fontSize: "0.7rem", fontFamily: primaryFont }}>MOBILE RESOURCE (800x800 Target)</InputLabel>
                                <TextField 
                                    fullWidth value={formData.mobileImageUrl} onChange={handleChange("mobileImageUrl")}
                                    placeholder="Paste URL or upload ->"
                                    InputProps={{ 
                                        startAdornment: <InputAdornment position="start"><LinkOutlined sx={{ fontSize: 18 }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end">
                                            <label htmlFor="mobile-upload"><IconButton component="span" disabled={isUploadingMobile}>{isUploadingMobile ? <CircularProgress size={20}/> : <CloudUploadOutlined/>}</IconButton></label>
                                        </InputAdornment>
                                    }}
                                    sx={inputStyle}
                                />
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>

        {/* RIGHT COLUMN: PREVIEW */}
        <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${borderColor}`, bgcolor: "#FFF", position: 'sticky', top: 24 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "0.7rem", color: primaryTeal, letterSpacing: 1 }}>
                        MEDIA PREVIEW
                    </Typography>
                    <ToggleButtonGroup size="small" value={previewDevice} exclusive onChange={(_, v) => v && setPreviewDevice(v)}>
                        <ToggleButton value="desktop"><DesktopWindowsOutlined sx={{ fontSize: 16 }} /></ToggleButton>
                        <ToggleButton value="mobile"><SmartphoneOutlined sx={{ fontSize: 16 }} /></ToggleButton>
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
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "#64748B", gap: 1 }}>
                            <RemoveRedEyeOutlined sx={{ fontSize: 40, opacity: 0.2 }} />
                            <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "0.75rem", opacity: 0.5 }}>Awaiting Media Data...</Typography>
                        </Stack>
                    )}
                    
                    {previewDevice === "mobile" && (
                        <Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100px", height: "15px", bgcolor: "#1E293B", borderRadius: "0 0 10px 10px" }} />
                    )}
                </Box>
                <Button fullWidth variant="contained" onClick={handleUpdateClick} sx={{ mt: 3, bgcolor: primaryTeal, py: 1.8, borderRadius: "14px", fontWeight: 800 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Compile & Update Asset"}
                </Button>
            </Paper>
        </Box>
      </Stack>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "24px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "1.1rem", textAlign: "center", pt: 3, color: primaryTeal }}>
            Confirm Asset Deployment
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
                The asset <b>{formData.name || 'Untitled'}</b> will be updated and pushed to production.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 4, px: 4, gap: 2 }}>
            <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" sx={{ flex: 1, borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700, color: "#64748B", borderColor: borderColor }}>
                Abort
            </Button>
            <Button onClick={confirmUpdate} variant="contained" sx={{ flex: 1, borderRadius: "12px", bgcolor: primaryTeal, fontFamily: primaryFont, fontWeight: 800, py: 1.2, boxShadow: '0 8px 20px rgba(0,70,82,0.2)' }}>
                Confirm
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateSliderForm;