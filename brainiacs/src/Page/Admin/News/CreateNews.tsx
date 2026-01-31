import { useState, useMemo, useEffect } from "react";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, Divider, Tooltip, Zoom, Alert, Snackbar,
  Chip, FormHelperText, InputAdornment
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, TitleOutlined, 
  DeleteOutline, AddOutlined, DescriptionOutlined,
  CollectionsOutlined, ImageOutlined, AddPhotoAlternateOutlined,
  PreviewOutlined,
  CheckCircleOutline,
  HistoryOutlined,
  StorageOutlined, SpeedOutlined,
  TagOutlined, PublicOutlined, SearchOutlined,
  DragIndicatorOutlined
} from "@mui/icons-material";

/**
 * ENTERPRISE NEWS CONTENT MANAGEMENT SYSTEM (CMS)
 * Design: Original Single-Column Dashboard (Old Design)
 * Editor: Advanced Rich Text with Clipboard Handling
 * Font: Montserrat 
 */

// --- QUILL ENGINE CONFIGURATION ---
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['montserrat', 'roboto', 'serif', 'monospace'];
Quill.register(Font, true);

const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const primaryFont = "'Montserrat', sans-serif";
const borderColor = "#E2E8F0";

interface CreateNewsProps {
  onBack: () => void;
}

const CreateNews = ({ onBack }: CreateNewsProps) => {
  // --- 1. COMPREHENSIVE DATA STATE ---
  const [heading, setHeading] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionImage, setDescriptionImage] = useState(""); 
  const [descriptions, setDescriptions] = useState<string[]>([""]); 
  const [imageUrls, setImageUrls] = useState<string[]>([""]);       
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  
  // --- 2. SYSTEM & UI STATE ---
  const [loading, setLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"visual" | "html">("visual");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" as "success" | "error" });
  const [wordCount, setWordCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // --- 3. RICH TEXT MODULES (User Requested) ---
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': Font.whitelist }],
        [{ 'size': Size.whitelist }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    history: { delay: 1000, maxStack: 50, userOnly: true },
    clipboard: { matchVisual: false },
  }), []);

  // --- 4. AUTO-SAVE ENGINE ---
  useEffect(() => {
    const savedData = localStorage.getItem("news_v3_full_draft");
    if (savedData) {
      const p = JSON.parse(savedData);
      setHeading(p.heading || "");
      setDescriptionImage(p.descriptionImage || "");
      setDescriptions(p.descriptions || [""]);
      setImageUrls(p.imageUrls || [""]);
      setTags(p.tags || []);
      setSnackbar({ open: true, message: "Draft recovered from session", type: "success" });
    }
  }, []);

  useEffect(() => {
    const saver = setTimeout(() => {
      if (heading || descriptions[0]) {
        setIsAutoSaving(true);
        const draft = { heading, descriptionImage, descriptions, imageUrls, tags };
        localStorage.setItem("news_v3_full_draft", JSON.stringify(draft));
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 3000);
    return () => clearTimeout(saver);
  }, [heading, descriptionImage, descriptions, imageUrls, tags]);

  // --- 5. ANALYTICS & SLUG GENERATION ---
  useEffect(() => {
    const text = descriptions.join(" ").replace(/<[^>]*>/g, ' ');
    setWordCount(text.split(/\s+/).filter(w => w.length > 0).length);
  }, [descriptions]);

  useEffect(() => {
    setSlug(heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  }, [heading]);

  // --- 6. HANDLERS ---
  const handleAddDescription = () => setDescriptions(prev => [...prev, ""]);
  
  const handleRemoveDescription = (idx: number) => {
    const filtered = descriptions.filter((_, i) => i !== idx);
    setDescriptions(filtered.length ? filtered : [""]);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!heading.trim()) errs.heading = "Headline is required for SEO";
    if (!descriptionImage.trim()) errs.image = "Featured Image is required for social sharing";
    if (descriptions.some(d => !d || d === "<p><br></p>")) errs.content = "Empty sections are not allowed";
    
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublishClick = () => {
    if (validateForm()) setConfirmDialogOpen(true);
    else setSnackbar({ open: true, message: "Please correct errors", type: "error" });
  };

  const finalSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const body = { 
        heading, 
        slug,
        descriptionImage, 
        descriptions: descriptions.filter(d => d.trim() !== ""), 
        imageUrls: imageUrls.filter(u => u.trim() !== ""),
        tags,
        updatedAt: new Date().toISOString()
      };
      
      const res = await fetch(`${API_BASE_URL}/api/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        localStorage.removeItem("news_v3_full_draft");
        onBack();
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Network Error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- 7. STYLES (Original Dashboard Theme) ---
  const sharedInput = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      fontFamily: primaryFont,
      fontSize: "0.9rem",
      bgcolor: "#FFF",
      "& fieldset": { borderColor: borderColor },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderColor: primaryTeal, borderWidth: "2px" },
    },
    "& .MuiInputLabel-root": { fontFamily: primaryFont, fontWeight: 700 }
  };

  const sectionLabel = {
    fontFamily: primaryFont,
    fontWeight: 900,
    fontSize: "0.7rem",
    color: "#1E293B",
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const editorBox = {
    "& .ql-toolbar": { borderTopLeftRadius: "14px", borderTopRightRadius: "14px", bgcolor: "#F8FAFC", fontFamily: primaryFont, p: 2 },
    "& .ql-container": { borderBottomLeftRadius: "14px", borderBottomRightRadius: "14px", minHeight: "260px", fontFamily: primaryFont },
    "& .ql-editor": { minHeight: "260px", fontSize: "1rem", lineHeight: 1.8 ,fontFamily: primaryFont}
  };

  // --- 8. RENDER ---
  return (
    <Box>
      {/* HEADER CONTROLS */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Button 
          onClick={onBack} 
          startIcon={<ArrowBackIosNewOutlined />} 
          sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B", textTransform: 'none', fontSize: "0.9rem" }}
        >
          Exit Editor
        </Button>
        <Stack direction="row" spacing={3} alignItems="center">
          {isAutoSaving && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={12} sx={{ color: primaryTeal }} />
              <Typography sx={{ fontSize: "0.7rem", fontFamily: primaryFont, color: "#94A3B8" }}>Cloud Syncing...</Typography>
            </Stack>
          )}
          <Button variant="outlined" startIcon={<PreviewOutlined />} sx={{ borderRadius: "10px", fontFamily: primaryFont, textTransform: "none" }}>Live Preview</Button>
          <IconButton color="primary"><HistoryOutlined /></IconButton>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: "35px", border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
        {/* TOP TITLE SECTION */}
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <PublicOutlined sx={{ color: primaryTeal, fontSize: 30 }} />
            <Typography variant="h3" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#0F172A", letterSpacing: "-1px" }}>
              Publisher Pro
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: primaryFont, color: "#94A3B8", fontSize: "1rem" }}>
            Create, Edit, and Distribute global news stories.
          </Typography>
        </Box>

        <Stack spacing={7}>
          {/* ARTICLE TITLE & SLUG */}
          <Box>
            <InputLabel sx={sectionLabel}><TitleOutlined fontSize="small" /> ARTICLE IDENTITY</InputLabel>
            <TextField 
              fullWidth value={heading} onChange={(e) => setHeading(e.target.value)} 
              placeholder="Headline of the news article..." 
              error={!!validationErrors.heading}
              sx={sharedInput}
              helperText={validationErrors.heading}
            />
            <Stack direction="row" spacing={1} mt={2} alignItems="center">
              <Chip label="SLUG" size="small" sx={{ fontWeight: 800, fontSize: "0.6rem", bgcolor: "#F1F5F9" }} />
              <Typography sx={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#64748B" }}>{slug || 'auto-generated-url'}</Typography>
            </Stack>
          </Box>

          {/* MEDIA CONFIG */}
          <Box>
            <InputLabel sx={sectionLabel}><ImageOutlined fontSize="small" /> COVER ASSET</InputLabel>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
              <Box sx={{ flexGrow: 1 }}>
                <TextField 
                  fullWidth value={descriptionImage} onChange={(e) => setDescriptionImage(e.target.value)} 
                  placeholder="Paste URL for high-resolution cover..." 
                  sx={sharedInput}
                />
                <FormHelperText sx={{ fontFamily: primaryFont, mt: 1 }}>Supports JPG, PNG, and WebP formats.</FormHelperText>
              </Box>
              {descriptionImage && (
                <Box 
                  component="img" 
                  src={descriptionImage} 
                  sx={{ width: 220, height: 120, borderRadius: "18px", objectFit: "cover", border: `1px solid ${borderColor}`, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }} 
                />
              )}
            </Stack>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* ADVANCED RICH TEXT EDITOR BLOCKS */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <InputLabel sx={sectionLabel}><DescriptionOutlined fontSize="small" /> RICH TEXT CONTENT</InputLabel>
              <Stack direction="row" spacing={1} bgcolor="#F1F5F9" p={0.6} borderRadius="12px">
                <Button 
                  size="small" 
                  onClick={() => setEditMode("visual")} 
                  variant={editMode === "visual" ? "contained" : "text"}
                  sx={{ borderRadius: "10px", textTransform: "none", fontFamily: primaryFont, fontWeight: 700, bgcolor: editMode === "visual" ? "#FFF" : "transparent", color: editMode === "visual" ? primaryTeal : "#64748B", "&:hover": { bgcolor: "#FFF" } }}
                >
                  Visual
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setEditMode("html")} 
                  variant={editMode === "html" ? "contained" : "text"}
                  sx={{ borderRadius: "10px", textTransform: "none", fontFamily: primaryFont, fontWeight: 700, bgcolor: editMode === "html" ? "#FFF" : "transparent", color: editMode === "html" ? primaryTeal : "#64748B", "&:hover": { bgcolor: "#FFF" } }}
                >
                  Code
                </Button>
              </Stack>
            </Stack>
            
            <Stack spacing={5}>
              {descriptions.map((desc, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                   <Stack direction="row" spacing={2} sx={{ position: "absolute", left: -40, top: 10, color: "#CBD5E1" }}>
                      <DragIndicatorOutlined fontSize="small" />
                   </Stack>
                   <Box sx={editorBox}>
                    {editMode === "visual" ? (
                      <ReactQuill 
                        theme="snow" 
                        value={desc} 
                        onChange={(val) => {
                          const up = [...descriptions];
                          up[index] = val;
                          setDescriptions(up);
                        }} 
                        modules={modules}
                        placeholder="Start typing your story with formatting..."
                      />
                    ) : (
                      <TextField 
                        fullWidth multiline rows={12} value={desc}
                        onChange={(e) => {
                          const up = [...descriptions];
                          up[index] = e.target.value;
                          setDescriptions(up);
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { fontFamily: "monospace", bgcolor: "#1E293B", color: "#38BDF8", borderRadius: "14px" } }}
                      />
                    )}
                  </Box>
                  <Tooltip title="Delete Block">
                    <IconButton 
                      onClick={() => handleRemoveDescription(index)} 
                      color="error" 
                      disabled={descriptions.length === 1}
                      sx={{ position: "absolute", top: 10, right: -50, bgcolor: "#FFF", border: `1px solid ${borderColor}` }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Stack>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<AddOutlined />} 
              onClick={handleAddDescription} 
              sx={{ 
                mt: 4, py: 2, 
                borderRadius: "16px", 
                borderStyle: "dashed", 
                borderWidth: "2px", 
                fontFamily: primaryFont, 
                fontWeight: 800, 
                color: primaryTeal,
                borderColor: primaryTeal
              }}
            >
              Add New Paragraph Block
            </Button>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* SEARCH & DISCOVERY (TAGS) */}
          <Box>
            <InputLabel sx={sectionLabel}><TagOutlined fontSize="small" /> DISCOVERY TAGS</InputLabel>
            <TextField 
              fullWidth 
              value={currentTag} 
              onKeyDown={handleAddTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Type tag and press Enter..." 
              sx={sharedInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
              {tags.map((tag, i) => (
                <Chip 
                  key={i} 
                  label={tag} 
                  onDelete={() => setTags(tags.filter(t => t !== tag))} 
                  sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "#F1F5F9", color: "#475569", borderRadius: "8px" }}
                />
              ))}
            </Stack>
          </Box>

          {/* GALLERY MANAGEMENT */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={3} alignItems="center">
              <InputLabel sx={sectionLabel}><CollectionsOutlined fontSize="small" /> PHOTO GALLERY SET</InputLabel>
              <Button size="small" variant="text" startIcon={<AddPhotoAlternateOutlined />} onClick={() => setImageUrls([...imageUrls, ""])} sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
                Append Photo
              </Button>
            </Stack>
            <Stack spacing={2}>
              {imageUrls.map((url, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center">
                  <TextField 
                    fullWidth size="small" value={url} 
                    onChange={(e) => {
                      const up = [...imageUrls];
                      up[index] = e.target.value;
                      setImageUrls(up);
                    }}
                    placeholder="https://..."
                    sx={sharedInput}
                  />
                  <IconButton onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))} disabled={imageUrls.length === 1}><DeleteOutline /></IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* METRICS & ANALYTICS BAR */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: "20px", bgcolor: "#F8FAFC", border: `1px solid ${borderColor}` }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={6} justifyContent="center">
              <Stack direction="row" spacing={2} alignItems="center">
                 <SpeedOutlined sx={{ color: primaryTeal }} />
                 <Box>
                   <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8" }}>READ SPEED</Typography>
                   <Typography sx={{ fontSize: "1rem", fontWeight: 700, fontFamily: primaryFont }}>{Math.ceil(wordCount / 200)} Minutes</Typography>
                 </Box>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" spacing={2} alignItems="center">
                 <StorageOutlined sx={{ color: primaryTeal }} />
                 <Box>
                   <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8" }}>TOTAL WORDS</Typography>
                   <Typography sx={{ fontSize: "1rem", fontWeight: 700, fontFamily: primaryFont }}>{wordCount} Words</Typography>
                 </Box>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" spacing={2} alignItems="center">
                 <CheckCircleOutline sx={{ color: primaryTeal }} />
                 <Box>
                   <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8" }}>SEO SCORE</Typography>
                   <Typography sx={{ fontSize: "1rem", fontWeight: 700, fontFamily: primaryFont }}>{wordCount > 300 ? "Excellent" : "Needs More Text"}</Typography>
                 </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* ACTION BUTTONS */}
          <Box sx={{ pt: 6, display: "flex", justifyContent: "center", gap: 3 }}>
            <Button 
              variant="contained" 
              onClick={handlePublishClick} 
              disabled={loading} 
              sx={{ 
                bgcolor: primaryTeal, 
                px: 12, py: 2, 
                borderRadius: "18px", 
                fontFamily: primaryFont, 
                fontWeight: 900, 
                fontSize: "1.1rem",
                textTransform: 'none',
                boxShadow: "0 20px 40px rgba(0,70,82,0.25)",
                "&:hover": { bgcolor: "#00353d", transform: "translateY(-3px)" },
                transition: "all 0.3s"
              }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : "Publish to Feed"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* NOTIFICATIONS & DIALOGS */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} sx={{ borderRadius: "14px", fontFamily: primaryFont, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)} 
        TransitionComponent={Zoom}
        PaperProps={{ sx: { borderRadius: "30px", p: 3, maxWidth: "500px" } }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <Box sx={{ bgcolor: `${primaryTeal}10`, width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <PublicOutlined sx={{ fontSize: 40, color: primaryTeal }} />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 900 }}>Push Live?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, textAlign: "center", color: "#64748B", fontSize: "0.95rem" }}>
            This article will be distributed to all connected news feeds and social aggregators. This action is recorded in the audit log.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 4 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700, textTransform: "none" }}>Wait, let me check</Button>
          <Button onClick={finalSubmit} variant="contained" sx={{ bgcolor: primaryTeal, px: 6, py: 1.5, borderRadius: "14px", fontFamily: primaryFont, fontWeight: 800, textTransform: "none" }}>Confirm & Publish</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateNews;