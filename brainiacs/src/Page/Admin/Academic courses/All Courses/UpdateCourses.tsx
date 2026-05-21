import { useState, useCallback } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, IconButton, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Tabs, Tab, Alert, Collapse, Fade, Tooltip,
  Avatar, Badge, Switch, FormControlLabel, Checkbox,
  LinearProgress, InputAdornment
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddOutlined, 
  SaveOutlined, CheckCircleOutline, SettingsBackupRestoreOutlined,
  EditNoteOutlined, MenuBookOutlined,
  LinkOutlined, HistoryEduOutlined, WorkspacePremiumOutlined,
  PlaylistAddOutlined, PostAddOutlined,
  GavelOutlined, LanguageOutlined, CloudUploadOutlined
} from "@mui/icons-material";

// --- SYSTEM CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "37cd6333d9f4bd044c4a4dcc867276ae";
const primaryTeal = "#004652";
const secondaryTeal = "#006D7E";
const successGreen = "#10B981";
const errorRed = "#EF4444";
const montserrat = '"Montserrat", sans-serif'; 
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

// --- DATA CONTRACTS ---
interface ModuleRow {
  id?: string;
  code: string;
  name: string;
  credits: string;
  isElective?: boolean;
}

interface SemesterData {
  id?: string;
  semesterName: string;
  moduleRows: ModuleRow[];
}

interface EntryRequirementData {
  category: string;
  descriptions: string[];
}

interface CourseData {
  _id: string;
  courseName: string;
  courseCategory: string;
  duration: string;
  intake: string;
  awardingBody: string;
  courseDescription: string[];
  images: string[];
  coverImage: string;
  isCampusOffering?: boolean; 
  entryRequirements: EntryRequirementData[]; 
  progression: string;
  scholarships: string;
  semesters: SemesterData[];
  careerPathways: string[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  featured?: boolean;
  lastUpdatedBy?: string;
}

interface ValidationErrors {
  courseName?: string;
  courseCategory?: string;
  coverImage?: string;
}

const UpdateCourse = ({ itemData, onBack }: { itemData: CourseData, onBack: () => void }) => {
  // Initialize Entry Requirements if missing from old data
  const initialRequirements = itemData.entryRequirements && itemData.entryRequirements.length > 0 
    ? itemData.entryRequirements 
    : [{ category: "", descriptions: [""] }];

  // --- CORE STATE ---
  const [formData, setFormData] = useState<CourseData>(itemData);
  const [entryRequirements, setEntryRequirements] = useState<EntryRequirementData[]>(initialRequirements);
  const [isCampusOffering, setIsCampusOffering] = useState(itemData.isCampusOffering || false);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // --- UI STATE ---
  const [pathwayInput, setPathwayInput] = useState("");
  const [saveProgress, setSaveProgress] = useState(0);
  const [isUploadingCover, setIsUploadingCover] = useState(false); // Image upload loading state

  // --- IMGBB UPLOAD HANDLER ---
  const uploadToImgBB = async (file: File) => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (json.success) {
      return json.data.url;
    } else {
      throw new Error(json.error?.message || "Failed to upload image");
    }
  };

  // --- STYLING MACROS ---
  const montserratStyle = { fontFamily: montserrat };
  
  const inputGlobalStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px", 
      fontFamily: montserrat,
      bgcolor: "#FFF",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& fieldset": { borderColor: "#CBD5E1" },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": { ...montserratStyle, fontSize: "0.8rem", py: 1.2 }, 
    "& .MuiFormHelperText-root": { fontWeight: 700, ml: 1, fontSize: "0.65rem" }
  };

  const sectionLabel = (icon: React.ReactNode, text: string, subtitle: string) => (
    <Stack direction="row" spacing={2.5} alignItems="flex-start" mb={4}>
      <Box sx={{ p: 1.2, bgcolor: "rgba(0, 70, 82, 0.08)", borderRadius: "12px", color: primaryTeal, boxShadow: "0 8px 16px -4px rgba(0, 70, 82, 0.1)" }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal, letterSpacing: "-0.3px" }}>
          {text}
        </Typography>
        <Typography sx={{ ...montserratStyle, fontSize: "0.65rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );

  // --- BUSINESS LOGIC ---
  const handleFieldChange = useCallback((field: keyof CourseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.courseName.trim()) newErrors.courseName = "Course Name is mandatory for synchronization.";
    if (!formData.courseCategory.trim()) newErrors.courseCategory = "Category classification is required.";
    if (!formData.coverImage.trim()) newErrors.coverImage = "A primary display image URL is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateModule = (sIdx: number, rIdx: number, field: keyof ModuleRow, val: any) => {
    const updatedSems = [...formData.semesters];
    const updatedRows = [...updatedSems[sIdx].moduleRows];
    updatedRows[rIdx] = { ...updatedRows[rIdx], [field]: val };
    updatedSems[sIdx] = { ...updatedSems[sIdx], moduleRows: updatedRows };
    handleFieldChange("semesters", updatedSems);
  };

  const syncToDatabase = async () => {
    if (!validate()) return;
    setLoading(true);
    setSaveProgress(20);

    const cleanedEntryRequirements = entryRequirements
      .filter(req => req.category.trim() || req.descriptions.some(d => d.trim()))
      .map(req => ({
        category: req.category,
        descriptions: req.descriptions.filter(d => d.trim())
      }));

    const finalPayload = {
        ...formData,
        isCampusOffering, 
        entryRequirements: cleanedEntryRequirements, 
        lastUpdatedBy: "Admin_System_2026"
    };

    try {
      setSaveProgress(50);
      const response = await fetch(`${API_BASE_URL}/api/course/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
      });

      if (response.ok) {
        setSaveProgress(100);
        setShowSuccess(true);
        setIsDirty(false);
        setTimeout(onBack, 2500);
      } else {
        throw new Error("Server responded with failure code.");
      }
    } catch (err) {
      console.error("Critical Failure during Overwrite:", err);
      setSaveProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 15, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* 1. MASTER CONTROL BAR */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 1200, 
        bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${borderColor}`, py: 1.5
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: "1400px", mx: "auto", px: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton size="small" onClick={onBack} sx={{ bgcolor: "#FFF", border: `1px solid ${borderColor}`, "&:hover": { bgcolor: primaryTeal, color: "#FFF" } }}>
              <ArrowBackIosNewOutlined fontSize="small" sx={{ fontSize: "1rem" }} />
            </IconButton>
            <Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, color: primaryTeal, fontSize: "1.05rem" }}>Update Program Architect</Typography>
              <Typography sx={{ ...montserratStyle, fontSize: "0.65rem", color: "#64748B", fontWeight: 800 }}>ID REFERENCE: {formData._id}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {isDirty && (
              <Button size="small" startIcon={<SettingsBackupRestoreOutlined fontSize="small" />} onClick={() => { setFormData(itemData); setIsDirty(false); }} sx={{ color: "#94A3B8", fontWeight: 700, fontSize: "0.75rem" }}>
                Reset Changes
              </Button>
            )}
            <Button 
              size="small"
              variant="contained" 
              onClick={syncToDatabase}
              disabled={loading || !isDirty}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveOutlined fontSize="small" />}
              sx={{ 
                bgcolor: primaryTeal, px: 3, py: 1, borderRadius: "8px", 
                fontWeight: 800, fontSize: "0.8rem", textTransform: "none",
                boxShadow: "0 8px 16px -4px rgba(0, 70, 82, 0.3)"
              }}
            >
              {loading ? `Syncing ${saveProgress}%` : "Overwrite & Publish"}
            </Button>
          </Stack>
        </Stack>
        {loading && <LinearProgress variant="determinate" value={saveProgress} sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, bgcolor: "transparent", "& .MuiLinearProgress-bar": { bgcolor: successGreen } }} />}
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 4, mt: 5 }}>
        <Collapse in={showSuccess}>
          <Alert icon={<CheckCircleOutline fontSize="small" />} severity="success" sx={{ mb: 4, borderRadius: "16px", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 10px 40px rgba(16, 185, 129, 0.15)" }}>
            Success! The Curriculum for "{formData.courseName}" has been successfully synchronized.
          </Alert>
        </Collapse>

        <Stack spacing={6}>
          {/* SECTION 1: MASTER IDENTITY */}
          <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${borderColor}` }} elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {sectionLabel(<EditNoteOutlined />, "Global Identity", "Core Identification & Visuals")}
              <Stack direction="row" spacing={3}>
                <FormControlLabel control={<Switch size="small" checked={formData.isPublished || false} onChange={(e) => handleFieldChange("isPublished", e.target.checked)} color="success" />} label={<Typography sx={{ fontWeight: 800, fontSize: "0.7rem" }}>LIVE STATUS</Typography>} />
                <FormControlLabel control={<Switch size="small" checked={formData.featured || false} onChange={(e) => handleFieldChange("featured", e.target.checked)} />} label={<Typography sx={{ fontWeight: 800, fontSize: "0.7rem" }}>FEATURED</Typography>} />
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box flex={2}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem", color: "#475569" }}>OFFICIAL COURSE TITLE</InputLabel>
                  <TextField 
                    fullWidth size="small" value={formData.courseName} 
                    onChange={(e) => handleFieldChange("courseName", e.target.value)} 
                    sx={inputGlobalStyle} 
                    error={!!errors.courseName}
                    helperText={errors.courseName}
                  />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem", color: "#475569" }}>CLASSIFICATION</InputLabel>
                  <TextField 
                    fullWidth size="small" value={formData.courseCategory} 
                    onChange={(e) => handleFieldChange("courseCategory", e.target.value)} 
                    sx={inputGlobalStyle} 
                    error={!!errors.courseCategory}
                    helperText={errors.courseCategory}
                  />
                </Box>
              </Stack>

              <Divider />

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography sx={{ fontWeight: 900, fontSize: "0.8rem", color: primaryTeal }}>DESCRIPTION ARCHITECTURE</Typography>
                  <Button size="small" startIcon={<AddOutlined fontSize="small" />} onClick={() => handleFieldChange("courseDescription", [...formData.courseDescription, ""])} sx={{ fontWeight: 800, fontSize: "0.7rem", color: secondaryTeal }}>Append Block</Button>
                </Stack>
                <Stack spacing={2}>
                  {formData.courseDescription.map((block, i) => (
                    <Fade in key={i}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <TextField 
                          fullWidth multiline rows={3} size="small"
                          value={block} 
                          placeholder={`Content for paragraph ${i + 1}...`}
                          onChange={(e) => {
                            const updated = [...formData.courseDescription];
                            updated[i] = e.target.value;
                            handleFieldChange("courseDescription", updated);
                          }} 
                          sx={inputGlobalStyle} 
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleFieldChange("courseDescription", formData.courseDescription.filter((_, idx) => idx !== i))} 
                          sx={{ mt: 0.5, border: "1px solid #FEE2E2", color: errorRed }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Fade>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 2: ACADEMIC TIMELINES */}
          <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<HistoryEduOutlined />, "Academic Timeline", "Duration, Intake & Certification")}
            <Stack spacing={3}>
                
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isCampusOffering}
                      onChange={(e) => { setIsCampusOffering(e.target.checked); setIsDirty(true); }}
                      sx={{ color: "#CBD5E1", '&.Mui-checked': { color: primaryTeal } }}
                    />
                  }
                  label={
                    <Typography sx={{ ...montserratStyle, fontSize: "0.75rem", color: "#334155", fontWeight: 700 }}>
                      Available as Campus Offering
                    </Typography>
                  }
                />
              </Box>

              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>PROGRAM DURATION</InputLabel>
                  <TextField size="small" fullWidth value={formData.duration} onChange={(e) => handleFieldChange("duration", e.target.value)} sx={inputGlobalStyle} placeholder="e.g. 3 Years Full-Time" />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>INTAKE WINDOWS</InputLabel>
                  <TextField size="small" fullWidth value={formData.intake} onChange={(e) => handleFieldChange("intake", e.target.value)} sx={inputGlobalStyle} placeholder="Jan, Sept, May" />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>AWARDING INSTITUTION</InputLabel>
                  <TextField size="small" fullWidth value={formData.awardingBody} onChange={(e) => handleFieldChange("awardingBody", e.target.value)} sx={inputGlobalStyle} />
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* SECTION 3: SYLLABUS ENGINE */}
          <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${borderColor}` }} elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              {sectionLabel(<MenuBookOutlined />, "Syllabus Registry", "Curriculum Module Management")}
              <Button 
                size="small"
                variant="outlined" 
                startIcon={<PostAddOutlined fontSize="small" />} 
                onClick={() => {
                  const newSem: SemesterData = {
                    id: `sem-${Date.now()}`,
                    semesterName: `Semester ${formData.semesters.length + 1}`,
                    moduleRows: [{ id: `m-${Date.now()}`, code: "", name: "", credits: "", isElective: false }]
                  };
                  handleFieldChange("semesters", [...formData.semesters, newSem]);
                  setActiveTab(formData.semesters.length);
                }}
                sx={{ borderRadius: "8px", border: `1px solid ${primaryTeal}`, color: primaryTeal, fontWeight: 800, fontSize: "0.7rem" }}
              >
                New Semester
              </Button>
            </Stack>

            {formData.semesters.length > 0 ? (
                <>
                    <Tabs 
                    value={activeTab} 
                    onChange={(_, v) => setActiveTab(v)} 
                    variant="scrollable"
                    sx={{ 
                        mb: 3, borderBottom: `1px solid ${borderColor}`, minHeight: "36px",
                        "& .MuiTab-root": { fontWeight: 800, minWidth: 120, minHeight: "36px", fontFamily: montserrat, fontSize: "0.75rem", color: "#94A3B8" },
                        "& .Mui-selected": { color: primaryTeal }
                    }}
                    >
                    {formData.semesters.map((sem) => <Tab key={sem.id || sem.semesterName} label={sem.semesterName} />)}
                    </Tabs>

                    <Box>
                        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "16px", overflow: "hidden" }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: "#475569", fontSize: "0.65rem", py: 2 }}>CODE</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "#475569", fontSize: "0.65rem" }}>MODULE DESCRIPTION</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "#475569", fontSize: "0.65rem" }}>CREDITS</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: "#475569", fontSize: "0.65rem" }}>ELECTIVE</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", fontSize: "0.65rem" }}>ACTION</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {formData.semesters[activeTab].moduleRows.map((row, rIdx) => (
                                <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#FBFCFD" } }}>
                                <TableCell width="120px" sx={{ py: 1.5 }}>
                                    <TextField size="small" fullWidth value={row.code} onChange={(e) => handleUpdateModule(activeTab, rIdx, "code", e.target.value)} sx={inputGlobalStyle} />
                                </TableCell>
                                <TableCell>
                                    <TextField size="small" fullWidth value={row.name} onChange={(e) => handleUpdateModule(activeTab, rIdx, "name", e.target.value)} sx={inputGlobalStyle} />
                                </TableCell>
                                <TableCell width="90px">
                                    <TextField size="small" fullWidth value={row.credits} onChange={(e) => handleUpdateModule(activeTab, rIdx, "credits", e.target.value)} sx={inputGlobalStyle} />
                                </TableCell>
                                <TableCell width="70px" align="center">
                                    <Switch size="small" checked={row.isElective || false} onChange={(e) => handleUpdateModule(activeTab, rIdx, "isElective", e.target.checked)} color="info" />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton 
                                    size="small"
                                    color="error" 
                                    onClick={() => {
                                        const upSems = [...formData.semesters];
                                        upSems[activeTab].moduleRows.splice(rIdx, 1);
                                        handleFieldChange("semesters", upSems);
                                    }}
                                    disabled={formData.semesters[activeTab].moduleRows.length === 1}
                                    >
                                    <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <Box sx={{ p: 2, bgcolor: "#F8FAFC", textAlign: "center" }}>
                            <Button 
                            size="small"
                            startIcon={<PlaylistAddOutlined fontSize="small" />} 
                            onClick={() => {
                                const upSems = [...formData.semesters];
                                upSems[activeTab].moduleRows.push({ id: `mod-${Date.now()}`, code: "", name: "", credits: "", isElective: false });
                                handleFieldChange("semesters", upSems);
                            }}
                            sx={{ color: primaryTeal, fontWeight: 800, fontSize: "0.75rem", textTransform: "none" }}
                            >
                            Inject New Module
                            </Button>
                        </Box>
                        </TableContainer>
                    </Box>
                </>
            ) : (
                <Typography textAlign="center" color="text.secondary" sx={{ fontSize: "0.8rem" }}>No semesters configured. Click 'New Semester' to begin.</Typography>
            )}
          </Paper>

          {/* SECTION 4: ADMISSIONS & PROGRESSION */}
          <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<WorkspacePremiumOutlined />, "Standards & Outcomes", "Entry Criteria & Career Success")}
            <Stack spacing={4}>
              
              {/* STRUCTURED ENTRY REQUIREMENTS */}
              <Box>
                <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.7rem", color: primaryTeal }}>STRUCTURED ENTRY REQUIREMENTS</InputLabel>
                <Stack spacing={2}>
                  {entryRequirements.map((reqBlock, reqIndex) => (
                    <Paper key={reqIndex} variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: borderColor, bgcolor: "#F8FAFC" }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField 
                            fullWidth
                            size="small"
                            placeholder="e.g. Cambridge/EdExcel O/Level:"
                            value={reqBlock.category}
                            onChange={(e) => {
                              const upd = [...entryRequirements];
                              upd[reqIndex].category = e.target.value;
                              setEntryRequirements(upd);
                              setIsDirty(true);
                            }}
                            sx={{ ...inputGlobalStyle, "& .MuiInputBase-input": { fontWeight: 700, color: primaryTeal } }}
                          />
                          <IconButton 
                            size="small"
                            onClick={() => { setEntryRequirements(entryRequirements.filter((_, idx) => idx !== reqIndex)); setIsDirty(true); }} 
                            disabled={entryRequirements.length === 1}
                            sx={{ color: "#F87171", border: "1px solid #FEE2E2", bgcolor: "#FFF" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Stack spacing={1} pl={3} borderLeft={`2px solid ${borderColor}`}>
                          {reqBlock.descriptions.map((desc, descIndex) => (
                            <Stack direction="row" spacing={1} alignItems="flex-start" key={descIndex}>
                              <Typography sx={{ mt: 1, color: "#94A3B8", fontSize: "1rem", lineHeight: 1 }}>•</Typography>
                              <TextField 
                                fullWidth 
                                multiline
                                size="small"
                                value={desc} 
                                onChange={(e) => {
                                  const upd = [...entryRequirements];
                                  upd[reqIndex].descriptions[descIndex] = e.target.value;
                                  setEntryRequirements(upd);
                                  setIsDirty(true);
                                }}
                                sx={inputGlobalStyle} 
                                placeholder="e.g. Minimum of 4 'C' grades..." 
                              />
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  const upd = [...entryRequirements];
                                  upd[reqIndex].descriptions = upd[reqIndex].descriptions.filter((_, idx) => idx !== descIndex);
                                  setEntryRequirements(upd);
                                  setIsDirty(true);
                                }} 
                                disabled={reqBlock.descriptions.length === 1}
                                sx={{ color: "#94A3B8", mt: 0.5 }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Stack>
                          ))}
                          
                          <Button 
                            size="small"
                            startIcon={<AddOutlined fontSize="small" />} 
                            onClick={() => {
                              const upd = [...entryRequirements];
                              upd[reqIndex].descriptions.push("");
                              setEntryRequirements(upd);
                              setIsDirty(true);
                            }} 
                            sx={{ ...montserratStyle, fontSize: "0.65rem", fontWeight: 700, textTransform: "none", color: secondaryTeal, width: "fit-content" }}
                          >
                            Add Bullet Point
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                  
                  <Button 
                    size="small"
                    variant="outlined"
                    startIcon={<PlaylistAddOutlined fontSize="small" />} 
                    onClick={() => { setEntryRequirements([...entryRequirements, { category: "", descriptions: [""] }]); setIsDirty(true); }} 
                    sx={{ ...montserratStyle, fontSize: "0.7rem", fontWeight: 800, textTransform: "none", color: primaryTeal, borderColor: primaryTeal, borderStyle: "dashed" }}
                  >
                    Add Requirement Category Block
                  </Button>
                </Stack>
              </Box>

              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>ACADEMIC PROGRESSION PATHWAY</InputLabel>
                  <TextField size="small" fullWidth multiline rows={4} value={formData.progression} onChange={(e) => handleFieldChange("progression", e.target.value)} sx={inputGlobalStyle} />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>SCHOLARSHIP AVAILABILITY</InputLabel>
                  <TextField size="small" fullWidth multiline rows={4} value={formData.scholarships} onChange={(e) => handleFieldChange("scholarships", e.target.value)} sx={inputGlobalStyle} />
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* SECTION 5: MEDIA & SEO SEARCH MATRIX */}
          <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<LanguageOutlined />, "Search & Discover", "SEO Meta Matrix & Gallery Assets")}
            <Stack spacing={4}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
                <Badge badgeContent={<Tooltip title="Validated"><CheckCircleOutline sx={{ bgcolor: successGreen, color: "#FFF", borderRadius: "50%", p: 0.2, fontSize: 16 }} /></Tooltip>} overlap="circular">
                  <Avatar src={formData.coverImage} variant="rounded" sx={{ width: 140, height: 95, border: `3px solid ${primaryTeal}`, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                </Badge>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem" }}>FEATURED THUMBNAIL URL</InputLabel>

                  <input 
                    type="file" 
                    accept="image/*" 
                    id="update-course-cover-upload" 
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setIsUploadingCover(true);
                        try {
                          const compressedFile = await compressImage(e.target.files[0]);
                          const url = await uploadToImgBB(compressedFile);
                          handleFieldChange("coverImage", url);
                        } catch (error) {
                          console.error("Cover upload failed:", error);
                          alert("Failed to upload cover image.");
                        } finally {
                          setIsUploadingCover(false);
                        }
                      }
                    }}
                  />

                  <TextField 
                    size="small"
                    fullWidth value={formData.coverImage} 
                    onChange={(e) => handleFieldChange("coverImage", e.target.value)} 
                    sx={inputGlobalStyle} 
                    InputProps={{ 
                      startAdornment: <LinkOutlined fontSize="small" sx={{ mr: 1, color: "#94A3B8" }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <label htmlFor="update-course-cover-upload">
                            <IconButton component="span" disabled={isUploadingCover} sx={{ color: primaryTeal }}>
                              {isUploadingCover ? <CircularProgress size={20} color="inherit" /> : <CloudUploadOutlined fontSize="small" />}
                            </IconButton>
                          </label>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.coverImage}
                    helperText={errors.coverImage}
                  />
                </Box>
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem", color: primaryTeal }}>CAREER PATHWAYS (TAGS)</InputLabel>
                  <Stack direction="row" spacing={1.5} mb={2}>
                    <TextField 
                      size="small"
                      fullWidth value={pathwayInput} 
                      onChange={(e) => setPathwayInput(e.target.value)} 
                      placeholder="Add tag (e.g. Data Scientist)" 
                      sx={inputGlobalStyle} 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && pathwayInput.trim()) {
                          handleFieldChange("careerPathways", [...formData.careerPathways, pathwayInput.trim()]);
                          setPathwayInput("");
                        }
                      }}
                    />
                    <Button size="small" variant="contained" onClick={() => { if(pathwayInput) { handleFieldChange("careerPathways", [...formData.careerPathways, pathwayInput]); setPathwayInput(""); } }} sx={{ bgcolor: primaryTeal, px: 2, borderRadius: "10px", fontSize: "0.7rem" }}>Add</Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {formData.careerPathways.map((tag, i) => (
                      <Chip key={i} label={tag} size="small" onDelete={() => handleFieldChange("careerPathways", formData.careerPathways.filter((_, idx) => idx !== i))} sx={{ fontWeight: 700, fontSize: "0.65rem", bgcolor: "#E2E8F0" }} />
                    ))}
                  </Stack>
                </Box>

                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1, fontSize: "0.7rem", color: primaryTeal }}>SEO SEARCH OPTIMIZATION</InputLabel>
                  <Stack spacing={2}>
                    <TextField 
                      size="small"
                      fullWidth label="Search Engine Title" 
                      value={formData.metaTitle || ""} 
                      onChange={(e) => handleFieldChange("metaTitle", e.target.value)} 
                      sx={inputGlobalStyle} 
                    />
                    <TextField 
                      size="small"
                      fullWidth multiline rows={2} label="Search Engine Description" 
                      value={formData.metaDescription || ""} 
                      onChange={(e) => handleFieldChange("metaDescription", e.target.value)} 
                      sx={inputGlobalStyle} 
                    />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Paper>
          
          {/* SECTION 6: SYSTEM AUDIT & PUBLISHING */}
          <Box sx={{ textAlign: "center", pt: 2, pb: 8 }}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: "rgba(16, 185, 129, 0.05)", border: `1px dashed ${successGreen}`, borderRadius: "16px", mb: 4 }}>
              <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                <GavelOutlined sx={{ color: successGreen, fontSize: "1.2rem" }} />
                <Typography sx={{ fontWeight: 700, color: successGreen, fontSize: "0.8rem" }}>
                  By publishing, you are overwriting the existing curriculum records for this program. This action is tracked in the system audit logs.
                </Typography>
              </Stack>
            </Paper>
            
            <Button 
              fullWidth 
              variant="contained" 
              disabled={loading || !isDirty} 
              onClick={syncToDatabase}
              sx={{ 
                py: 2, borderRadius: "20px", bgcolor: primaryTeal, fontWeight: 900, fontSize: "1rem",
                fontFamily: montserrat, letterSpacing: "1px", boxShadow: "0 15px 30px -10px rgba(0, 70, 82, 0.4)",
                "&:hover": { bgcolor: "#00323a", transform: "translateY(-2px)" },
                "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" }
              }}
            >
              {loading ? "INITIALIZING SERVER SYNC..." : "CONFIRM OVERWRITE & PUBLISH LIVE"}
            </Button>
            
            {!isDirty && (
              <Typography sx={{ mt: 2, fontWeight: 700, color: "#94A3B8", fontSize: "0.75rem" }}>
                System Idle: No modifications detected in current session.
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default UpdateCourse;