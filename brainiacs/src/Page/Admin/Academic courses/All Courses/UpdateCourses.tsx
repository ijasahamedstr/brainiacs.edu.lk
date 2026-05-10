import { useState, useCallback,  } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, IconButton, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Tabs, Tab, Alert, Collapse, Fade, Tooltip,
  Avatar, Badge,  Switch, FormControlLabel, 
 LinearProgress
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddOutlined, 
  SaveOutlined, CheckCircleOutline, SettingsBackupRestoreOutlined,
  EditNoteOutlined, MenuBookOutlined,
  LinkOutlined, HistoryEduOutlined, WorkspacePremiumOutlined,
  PlaylistAddOutlined, PostAddOutlined,
  GavelOutlined, 
  LanguageOutlined,
} from "@mui/icons-material";

// --- SYSTEM CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const secondaryTeal = "#006D7E";
const successGreen = "#10B981";
const errorRed = "#EF4444";
const montserrat = '"Montserrat", sans-serif'; 
const borderColor = "#E2E8F0";

// --- DATA CONTRACTS ---
interface ModuleRow {
  id: string;
  code: string;
  name: string;
  credits: string;
  isElective: boolean;
}

interface SemesterData {
  id: string;
  semesterName: string;
  moduleRows: ModuleRow[];
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
  entryRequirement: string;
  progression: string;
  scholarships: string;
  semesters: SemesterData[];
  careerPathways: string[];
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  featured: boolean;
  lastUpdatedBy?: string;
}

interface ValidationErrors {
  courseName?: string;
  courseCategory?: string;
  coverImage?: string;
}

const UpdateCourse = ({ itemData, onBack }: { itemData: CourseData, onBack: () => void }) => {
  // --- CORE STATE ---
  const [formData, setFormData] = useState<CourseData>(itemData);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // --- UI STATE ---
  const [pathwayInput, setPathwayInput] = useState("");
//   const [galleryInput, setGalleryInput] = useState("");
  const [saveProgress, setSaveProgress] = useState(0);

  // --- STYLING MACROS ---
  const montserratStyle = { fontFamily: montserrat };
  
  const inputGlobalStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      fontFamily: montserrat,
      bgcolor: "#FFF",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& fieldset": { borderColor: "#CBD5E1" },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": { ...montserratStyle, fontSize: "0.95rem", py: 1.8 },
    "& .MuiFormHelperText-root": { fontWeight: 700, ml: 1 }
  };

  const sectionLabel = (icon: React.ReactNode, text: string, subtitle: string) => (
    <Stack direction="row" spacing={3} alignItems="flex-start" mb={5}>
      <Box sx={{ p: 1.8, bgcolor: "rgba(0, 70, 82, 0.08)", borderRadius: "18px", color: primaryTeal, boxShadow: "0 8px 16px -4px rgba(0, 70, 82, 0.1)" }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal, letterSpacing: "-0.5px" }}>
          {text}
        </Typography>
        <Typography sx={{ ...montserratStyle, fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );

  // --- BUSINESS LOGIC ---
  const handleFieldChange = useCallback((field: keyof CourseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error if user starts typing
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

    try {
      setSaveProgress(50);
      const response = await fetch(`${API_BASE_URL}/api/courses/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lastUpdatedBy: "Admin_System_2026" })
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

  // --- RENDER HELPERS ---
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean'],
    ],
  };

  return (
    <Box sx={{ pb: 15, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* 1. MASTER CONTROL BAR */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 1200, 
        bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${borderColor}`, py: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: "1400px", mx: "auto", px: 4 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <IconButton onClick={onBack} sx={{ bgcolor: "#FFF", border: `1px solid ${borderColor}`, "&:hover": { bgcolor: primaryTeal, color: "#FFF" } }}>
              <ArrowBackIosNewOutlined fontSize="small" />
            </IconButton>
            <Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, color: primaryTeal, fontSize: "1.2rem" }}>Update Program Architect</Typography>
              <Typography sx={{ ...montserratStyle, fontSize: "0.7rem", color: "#64748B", fontWeight: 800 }}>ID REFERENCE: {formData._id}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {isDirty && (
              <Button startIcon={<SettingsBackupRestoreOutlined />} onClick={() => setFormData(itemData)} sx={{ color: "#94A3B8", fontWeight: 700 }}>
                Reset Changes
              </Button>
            )}
            <Button 
              variant="contained" 
              onClick={syncToDatabase}
              disabled={loading || !isDirty}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
              sx={{ 
                bgcolor: primaryTeal, px: 5, py: 1.5, borderRadius: "14px", 
                fontWeight: 900, textTransform: "none", letterSpacing: "0.5px",
                boxShadow: "0 12px 24px -6px rgba(0, 70, 82, 0.4)"
              }}
            >
              {loading ? `Syncing ${saveProgress}%` : "Overwrite & Publish"}
            </Button>
          </Stack>
        </Stack>
        {loading && <LinearProgress variant="determinate" value={saveProgress} sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, bgcolor: "transparent", "& .MuiLinearProgress-bar": { bgcolor: successGreen } }} />}
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 4, mt: 6 }}>
        <Collapse in={showSuccess}>
          <Alert icon={<CheckCircleOutline />} severity="success" sx={{ mb: 6, borderRadius: "24px", fontWeight: 700, boxShadow: "0 10px 40px rgba(16, 185, 129, 0.15)" }}>
            Success! The Curriculum for "{formData.courseName}" has been successfully synchronized and published to the live server.
          </Alert>
        </Collapse>

        <Stack spacing={8}>
          {/* SECTION 1: MASTER IDENTITY */}
          <Paper sx={{ p: 6, borderRadius: "35px", border: `1px solid ${borderColor}` }} elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {sectionLabel(<EditNoteOutlined fontSize="large" />, "Global Identity", "Core Identification & Visuals")}
              <Stack direction="row" spacing={4}>
                <FormControlLabel control={<Switch checked={formData.isPublished} onChange={(e) => handleFieldChange("isPublished", e.target.checked)} color="success" />} label={<Typography sx={{ fontWeight: 800, fontSize: "0.75rem" }}>LIVE STATUS</Typography>} />
                <FormControlLabel control={<Switch checked={formData.featured} onChange={(e) => handleFieldChange("featured", e.target.checked)} />} label={<Typography sx={{ fontWeight: 800, fontSize: "0.75rem" }}>FEATURED</Typography>} />
              </Stack>
            </Stack>

            <Stack spacing={4}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                <Box flex={2}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem", color: "#475569" }}>OFFICIAL COURSE TITLE</InputLabel>
                  <TextField 
                    fullWidth value={formData.courseName} 
                    onChange={(e) => handleFieldChange("courseName", e.target.value)} 
                    sx={inputGlobalStyle} 
                    error={!!errors.courseName}
                    helperText={errors.courseName}
                  />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem", color: "#475569" }}>CLASSIFICATION</InputLabel>
                  <TextField 
                    fullWidth value={formData.courseCategory} 
                    onChange={(e) => handleFieldChange("courseCategory", e.target.value)} 
                    sx={inputGlobalStyle} 
                    error={!!errors.courseCategory}
                    helperText={errors.courseCategory}
                  />
                </Box>
              </Stack>

              <Divider />

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: primaryTeal, letterSpacing: "1px" }}>DESCRIPTION ARCHITECTURE</Typography>
                  <Button startIcon={<AddOutlined />} onClick={() => handleFieldChange("courseDescription", [...formData.courseDescription, ""])} sx={{ fontWeight: 800, color: secondaryTeal }}>Append Block</Button>
                </Stack>
                <Stack spacing={3}>
                  {formData.courseDescription.map((block, i) => (
                    <Fade in key={i}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <TextField 
                          fullWidth multiline rows={3} 
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
                          onClick={() => handleFieldChange("courseDescription", formData.courseDescription.filter((_, idx) => idx !== i))} 
                          sx={{ mt: 1, border: "1px solid #FEE2E2", color: errorRed }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Stack>
                    </Fade>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 2: ACADEMIC TIMELINES */}
          <Paper sx={{ p: 6, borderRadius: "35px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<HistoryEduOutlined fontSize="large" />, "Academic Timeline", "Duration, Intake & Certification")}
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              <Box flex={1}>
                <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>PROGRAM DURATION</InputLabel>
                <TextField fullWidth value={formData.duration} onChange={(e) => handleFieldChange("duration", e.target.value)} sx={inputGlobalStyle} placeholder="e.g. 3 Years Full-Time" />
              </Box>
              <Box flex={1}>
                <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>INTAKE WINDOWS</InputLabel>
                <TextField fullWidth value={formData.intake} onChange={(e) => handleFieldChange("intake", e.target.value)} sx={inputGlobalStyle} placeholder="Jan, Sept, May" />
              </Box>
              <Box flex={1}>
                <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>AWARDING INSTITUTION</InputLabel>
                <TextField fullWidth value={formData.awardingBody} onChange={(e) => handleFieldChange("awardingBody", e.target.value)} sx={inputGlobalStyle} />
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 3: SYLLABUS ENGINE */}
          <Paper sx={{ p: 6, borderRadius: "35px", border: `1px solid ${borderColor}` }} elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
              {sectionLabel(<MenuBookOutlined fontSize="large" />, "Syllabus Registry", "Curriculum Module Management")}
              <Button 
                variant="outlined" 
                startIcon={<PostAddOutlined />} 
                onClick={() => {
                  const newSem: SemesterData = {
                    id: `sem-${Date.now()}`,
                    semesterName: `Semester ${formData.semesters.length + 1}`,
                    moduleRows: [{ id: `m-${Date.now()}`, code: "", name: "", credits: "", isElective: false }]
                  };
                  handleFieldChange("semesters", [...formData.semesters, newSem]);
                  setActiveTab(formData.semesters.length);
                }}
                sx={{ borderRadius: "12px", border: `2px solid ${primaryTeal}`, color: primaryTeal, fontWeight: 900 }}
              >
                New Semester
              </Button>
            </Stack>

            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)} 
              variant="scrollable"
              sx={{ 
                mb: 4, borderBottom: `1px solid ${borderColor}`,
                "& .MuiTab-root": { fontWeight: 800, minWidth: 160, fontFamily: montserrat, fontSize: "0.85rem" },
                "& .Mui-selected": { color: primaryTeal }
              }}
            >
              {formData.semesters.map((sem) => <Tab key={sem.id} label={sem.semesterName} />)}
            </Tabs>

            {formData.semesters.length > 0 && (
              <Box>
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "24px", overflow: "hidden" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 900, color: "#64748B", fontSize: "0.7rem", py: 3 }}>CODE</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: "#64748B", fontSize: "0.7rem" }}>MODULE DESCRIPTION</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: "#64748B", fontSize: "0.7rem" }}>CREDITS</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: "#64748B", fontSize: "0.7rem" }}>ELECTIVE</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 900, color: "#64748B", fontSize: "0.7rem" }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.semesters[activeTab].moduleRows.map((row, rIdx) => (
                        <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#FBFCFD" } }}>
                          <TableCell width="140px">
                            <TextField size="small" fullWidth value={row.code} onChange={(e) => handleUpdateModule(activeTab, rIdx, "code", e.target.value)} sx={inputGlobalStyle} />
                          </TableCell>
                          <TableCell>
                            <TextField size="small" fullWidth value={row.name} onChange={(e) => handleUpdateModule(activeTab, rIdx, "name", e.target.value)} sx={inputGlobalStyle} />
                          </TableCell>
                          <TableCell width="100px">
                            <TextField size="small" fullWidth value={row.credits} onChange={(e) => handleUpdateModule(activeTab, rIdx, "credits", e.target.value)} sx={inputGlobalStyle} />
                          </TableCell>
                          <TableCell width="80px" align="center">
                            <Switch size="small" checked={row.isElective} onChange={(e) => handleUpdateModule(activeTab, rIdx, "isElective", e.target.checked)} color="info" />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="error" 
                              onClick={() => {
                                const upSems = [...formData.semesters];
                                upSems[activeTab].moduleRows.splice(rIdx, 1);
                                handleFieldChange("semesters", upSems);
                              }}
                              disabled={formData.semesters[activeTab].moduleRows.length === 1}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Box sx={{ p: 3, bgcolor: "#F8FAFC", textAlign: "center" }}>
                    <Button 
                      startIcon={<PlaylistAddOutlined />} 
                      onClick={() => {
                        const upSems = [...formData.semesters];
                        upSems[activeTab].moduleRows.push({ id: `mod-${Date.now()}`, code: "", name: "", credits: "", isElective: false });
                        handleFieldChange("semesters", upSems);
                      }}
                      sx={{ color: primaryTeal, fontWeight: 900, fontSize: "0.85rem" }}
                    >
                      Inject New Module to {formData.semesters[activeTab].semesterName}
                    </Button>
                  </Box>
                </TableContainer>
              </Box>
            )}
          </Paper>

          {/* SECTION 4: ADMISSIONS & PROGRESSION */}
          <Paper sx={{ p: 6, borderRadius: "35px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<WorkspacePremiumOutlined fontSize="large" />, "Standards & Outcomes", "Entry Criteria & Career Success")}
            <Stack spacing={6}>
              <Box>
                <InputLabel sx={{ fontWeight: 800, mb: 2, fontSize: "0.75rem", color: primaryTeal }}>ENTRY REQUIREMENTS (MINIMUM STANDARDS)</InputLabel>
                <Box sx={{ "& .ql-container": { borderRadius: "0 0 20px 20px", minHeight: "200px", fontFamily: montserrat }, "& .ql-toolbar": { borderRadius: "20px 20px 0 0", bgcolor: "#F8FAFC" } }}>
                  <ReactQuill theme="snow" value={formData.entryRequirement} onChange={(v) => handleFieldChange("entryRequirement", v)} modules={quillModules} />
                </Box>
              </Box>
              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>ACADEMIC PROGRESSION PATHWAY</InputLabel>
                  <TextField fullWidth multiline rows={5} value={formData.progression} onChange={(e) => handleFieldChange("progression", e.target.value)} sx={inputGlobalStyle} />
                </Box>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>SCHOLARSHIP AVAILABILITY</InputLabel>
                  <TextField fullWidth multiline rows={5} value={formData.scholarships} onChange={(e) => handleFieldChange("scholarships", e.target.value)} sx={inputGlobalStyle} />
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* SECTION 5: MEDIA & SEO SEARCH MATRIX */}
          <Paper sx={{ p: 6, borderRadius: "35px", border: `1px solid ${borderColor}` }} elevation={0}>
            {sectionLabel(<LanguageOutlined fontSize="large" />, "Search & Discover", "SEO Meta Matrix & Gallery Assets")}
            <Stack spacing={6}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems="center">
                <Badge badgeContent={<Tooltip title="Validated"><CheckCircleOutline sx={{ bgcolor: successGreen, color: "#FFF", borderRadius: "50%", p: 0.2 }} /></Tooltip>} overlap="circular">
                  <Avatar src={formData.coverImage} variant="rounded" sx={{ width: 180, height: 120, border: `4px solid ${primaryTeal}`, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }} />
                </Badge>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem" }}>FEATURED THUMBNAIL URL</InputLabel>
                  <TextField 
                    fullWidth value={formData.coverImage} 
                    onChange={(e) => handleFieldChange("coverImage", e.target.value)} 
                    sx={inputGlobalStyle} 
                    InputProps={{ startAdornment: <LinkOutlined sx={{ mr: 1, color: "#94A3B8" }} /> }}
                    error={!!errors.coverImage}
                    helperText={errors.coverImage}
                  />
                </Box>
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem", color: primaryTeal }}>CAREER PATHWAYS (TAGS)</InputLabel>
                  <Stack direction="row" spacing={2} mb={2}>
                    <TextField 
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
                    <Button variant="contained" onClick={() => { if(pathwayInput) { handleFieldChange("careerPathways", [...formData.careerPathways, pathwayInput]); setPathwayInput(""); } }} sx={{ bgcolor: primaryTeal, px: 3, borderRadius: "14px" }}>Add</Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {formData.careerPathways.map((tag, i) => (
                      <Chip key={i} label={tag} onDelete={() => handleFieldChange("careerPathways", formData.careerPathways.filter((_, idx) => idx !== i))} sx={{ fontWeight: 700, bgcolor: "#E2E8F0" }} />
                    ))}
                  </Stack>
                </Box>

                <Box flex={1}>
                  <InputLabel sx={{ fontWeight: 800, mb: 1.5, fontSize: "0.75rem", color: primaryTeal }}>SEO SEARCH OPTIMIZATION</InputLabel>
                  <Stack spacing={3}>
                    <TextField 
                      fullWidth label="Search Engine Title" 
                      value={formData.metaTitle} 
                      onChange={(e) => handleFieldChange("metaTitle", e.target.value)} 
                      sx={inputGlobalStyle} 
                    />
                    <TextField 
                      fullWidth multiline rows={3} label="Search Engine Description" 
                      value={formData.metaDescription} 
                      onChange={(e) => handleFieldChange("metaDescription", e.target.value)} 
                      sx={inputGlobalStyle} 
                    />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Paper>
          
          {/* SECTION 6: SYSTEM AUDIT & PUBLISHING */}
          <Box sx={{ textAlign: "center", pt: 5, pb: 10 }}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: "rgba(16, 185, 129, 0.05)", border: `1px dashed ${successGreen}`, borderRadius: "20px", mb: 5 }}>
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <GavelOutlined sx={{ color: successGreen }} />
                <Typography sx={{ fontWeight: 700, color: successGreen, fontSize: "0.9rem" }}>
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
                py: 3, borderRadius: "28px", bgcolor: primaryTeal, fontWeight: 900, fontSize: "1.3rem",
                fontFamily: montserrat, letterSpacing: "1px", boxShadow: "0 25px 50px -12px rgba(0, 70, 82, 0.4)",
                "&:hover": { bgcolor: "#00323a", transform: "translateY(-4px)" },
                "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" }
              }}
            >
              {loading ? "INITIALIZING SERVER SYNC..." : "CONFIRM OVERWRITE & PUBLISH LIVE"}
            </Button>
            
            {!isDirty && (
              <Typography sx={{ mt: 3, fontWeight: 700, color: "#94A3B8", fontSize: "0.85rem" }}>
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