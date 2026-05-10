import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  InputLabel, CircularProgress, IconButton, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Tabs, Tab, Alert, Collapse, InputAdornment, Fade
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddOutlined, 
  AutoAwesomeOutlined, PostAddOutlined,
  PlaylistAddOutlined, InfoOutlined, MenuBookOutlined, 
  SchoolOutlined,  LandscapeOutlined,
  SaveOutlined, CheckCircleOutline, RestartAltOutlined,
  HelpOutline,
} from "@mui/icons-material";

// --- CONSTANTS & STYLES ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryTeal = "#004652";
const secondaryTeal = "#006D7E";
const primaryFont = '"Montserrat", sans-serif'; 
const borderColor = "#E2E8F0";

// --- INTERFACES ---
interface ModuleRow {
  id: string;
  code: string;
  name: string;
  credits: string;
}

interface SemesterData {
  id: string;
  semesterName: string;
  moduleRows: ModuleRow[];
}

interface FormErrors {
  courseName?: string;
  courseCategory?: string;
  coverImage?: string;
}

const CreateCourse = ({ onBack }: { onBack: () => void }) => {
  // --- CORE FORM STATE ---
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [intake, setIntake] = useState("");
  const [awardingBody, setAwardingBody] = useState("");
  
  // --- ARRAY & RICH TEXT STATE ---
  const [courseDescription, setCourseDescription] = useState<string[]>([""]); 
  const [images, setImages] = useState<string[]>([""]);
  const [coverImage, setCoverImage] = useState("");
  const [entryRequirement, setEntryRequirement] = useState(""); 
  const [progression, setProgression] = useState("");
  const [scholarships, setScholarships] = useState("");

  // --- MODULE SYSTEM STATE ---
  const [activeTab, setActiveTab] = useState(0);
  const [semesters, setSemesters] = useState<SemesterData[]>([
    { 
      id: "sem-1",
      semesterName: "Semester 1", 
      moduleRows: [{ id: "mod-1", code: "", name: "", credits: "" }] 
    }
  ]);

  // --- UI & UX STATE ---
  const [pathwayInput, setPathwayInput] = useState("");
  const [careerPathways, setCareerPathways] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // --- REUSABLE STYLE OBJECTS ---
  const montserratStyle = { fontFamily: primaryFont };

  const inputProps = {
    style: montserratStyle,
    autoComplete: "off",
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px", 
      fontFamily: primaryFont, 
      fontSize: "0.88rem",
      bgcolor: "#FFF", 
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#CBD5E1" },
      "&:hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": montserratStyle,
    "& .MuiFormHelperText-root": { fontFamily: primaryFont, fontWeight: 500 }
  };

  const labelStyle = {
    fontFamily: primaryFont, 
    fontWeight: 800, 
    fontSize: "0.72rem", 
    color: "#334155", 
    mb: 1.2, 
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  };

  const sectionCardStyle = {
    p: { xs: 3, md: 5 },
    borderRadius: "24px",
    border: `1px solid ${borderColor}`,
    bgcolor: "#FFFFFF",
    transition: "transform 0.3s ease",
    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.05)" }
  };

  // --- LOGIC HANDLERS ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!courseName.trim()) newErrors.courseName = "Course Name is mandatory.";
    if (!courseCategory.trim()) newErrors.courseCategory = "Please select a category.";
    if (!coverImage.trim()) newErrors.coverImage = "Main cover image is required for display.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSemester = () => {
    const newId = `sem-${semesters.length + 1}`;
    setSemesters([...semesters, { 
      id: newId,
      semesterName: `Semester ${semesters.length + 1}`, 
      moduleRows: [{ id: `mod-${Date.now()}`, code: "", name: "", credits: "" }] 
    }]);
    setActiveTab(semesters.length);
  };

  const handleUpdateModuleRow = (semIdx: number, rowIdx: number, field: keyof ModuleRow, value: string) => {
    const updated = [...semesters];
    updated[semIdx].moduleRows[rowIdx][field] = value;
    setSemesters(updated);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const payload = {
      courseName,
      courseDescription: courseDescription.filter(d => d.trim()),
      duration,
      courseCategory,
      intake,
      entryRequirement,
      progression,
      awardingBody,
      scholarships,
      semesters, 
      careerPathways,
      coverImage,
      images: images.filter(i => i.trim()),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => onBack(), 2000);
      }
    } catch (err) { 
      console.error("Critical Save Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleReset = () => {
    if(window.confirm("Are you sure? This will clear all unsaved data.")) {
      setCourseName("");
      setCourseDescription([""]);
      setSemesters([{ id: "sem-1", semesterName: "Semester 1", moduleRows: [{ id: "mod-1", code: "", name: "", credits: "" }] }]);
    }
  };

  // --- AUTO-SAVE LOGIC (SIMULATED) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (courseName.length > 5) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [courseName, courseDescription, semesters]);

  return (
    <Box sx={{ bgcolor: "#F8FAFC",}}>
      {/* STICKY HEADER ACTIONS */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 1000, 
        bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${borderColor}`, py: 2, mb: 4
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: "1200px", mx: "auto", px: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={onBack} sx={{ bgcolor: "#FFF", border: `1px solid ${borderColor}` }}>
              <ArrowBackIosNewOutlined fontSize="small" />
            </IconButton>
            <Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 800, color: primaryTeal, fontSize: "1.1rem" }}>
                Course Editor
              </Typography>
              {lastSaved && (
                <Typography sx={{ ...montserratStyle, fontSize: "0.65rem", color: "#64748B" }}>
                  Autosaved at {lastSaved}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<RestartAltOutlined />} 
              onClick={handleReset}
              sx={{ ...montserratStyle, textTransform: "none", borderRadius: "10px", borderColor: "#CBD5E1", color: "#64748B" }}
            >
              Reset Form
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveOutlined />} 
              onClick={handleSave}
              disabled={loading}
              sx={{ ...montserratStyle, textTransform: "none", borderRadius: "10px", bgcolor: primaryTeal, px: 4 }}
            >
              {loading ? "Publishing..." : "Save & Publish"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Collapse in={showSuccess}>
          <Alert icon={<CheckCircleOutline />} severity="success" sx={{ mb: 4, borderRadius: "14px", fontFamily: primaryFont, fontWeight: 600 }}>
            Course Published Successfully! Redirecting to dashboard...
          </Alert>
        </Collapse>

        <Stack spacing={5}>
          {/* SECTION 1: MASTER IDENTITY */}
          <Paper sx={sectionCardStyle} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <Box sx={{ p: 1, bgcolor: "rgba(0, 70, 82, 0.1)", borderRadius: "10px" }}>
                <InfoOutlined sx={{ color: primaryTeal }} />
              </Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal }}>
                General Information
              </Typography>
            </Stack>
            
            <Stack spacing={4}>
              <Box>
                <InputLabel sx={labelStyle}>Official Course Name <HelpOutline sx={{ fontSize: 14 }} /></InputLabel>
                <TextField 
                  fullWidth 
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.courseName}
                  helperText={errors.courseName}
                  placeholder="e.g. Master of Science in Artificial Intelligence"
                  InputProps={{ 
                    ...inputProps,
                    startAdornment: <InputAdornment position="start"><SchoolOutlined sx={{ color: "#94A3B8" }} /></InputAdornment>
                  }}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Program Category</InputLabel>
                <TextField 
                  fullWidth 
                  value={courseCategory} 
                  onChange={(e) => setCourseCategory(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.courseCategory}
                  placeholder="e.g. Technology & Engineering"
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <InputLabel sx={labelStyle}>Program Description</InputLabel>
                  <Typography sx={{ ...montserratStyle, fontSize: "0.7rem", color: "#94A3B8" }}>
                    Break long text into multiple paragraphs
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {courseDescription.map((desc, i) => (
                    <Fade in={true} key={i}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={3} 
                          value={desc} 
                          onChange={(e) => {
                            const updated = [...courseDescription]; 
                            updated[i] = e.target.value; 
                            setCourseDescription(updated);
                          }} 
                          sx={inputStyle} 
                          placeholder={`Enter paragraph content here...`} 
                        />
                        <IconButton 
                          onClick={() => setCourseDescription(courseDescription.filter((_, idx) => idx !== i))} 
                          disabled={courseDescription.length === 1}
                          sx={{ color: "#F87171", border: "1px solid #FEE2E2", mt: 1 }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Fade>
                  ))}
                  <Button 
                    startIcon={<AddOutlined />} 
                    onClick={() => setCourseDescription([...courseDescription, ""])} 
                    sx={{ ...montserratStyle, fontWeight: 800, textTransform: "none", color: primaryTeal, width: "fit-content" }}
                  >
                    Add Paragraph
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 2: ACADEMIC SPECS */}
          <Paper sx={sectionCardStyle} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <Box sx={{ p: 1, bgcolor: "rgba(0, 70, 82, 0.1)", borderRadius: "10px" }}>
                <AutoAwesomeOutlined sx={{ color: primaryTeal }} />
              </Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal }}>
                Academic Specifications
              </Typography>
            </Stack>

            <Stack spacing={4}>
              <Box>
                <InputLabel sx={labelStyle}>Duration</InputLabel>
                <TextField fullWidth value={duration} onChange={(e) => setDuration(e.target.value)} sx={inputStyle} placeholder="e.g. 3 Years (Full Time)" />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Intake Schedule</InputLabel>
                <TextField fullWidth value={intake} onChange={(e) => setIntake(e.target.value)} sx={inputStyle} placeholder="e.g. February, July, October" />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Awarding Body</InputLabel>
                <TextField fullWidth value={awardingBody} onChange={(e) => setAwardingBody(e.target.value)} sx={inputStyle} placeholder="e.g. University of London" />
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 3: CURRICULUM BUILDER */}
          <Paper sx={sectionCardStyle} elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: "rgba(0, 70, 82, 0.1)", borderRadius: "10px" }}>
                  <MenuBookOutlined sx={{ color: primaryTeal }} />
                </Box>
                <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal }}>
                  Module Structure
                </Typography>
              </Stack>
              <Button 
                variant="outlined"
                startIcon={<AddOutlined />} 
                onClick={handleAddSemester} 
                sx={{ ...montserratStyle, textTransform: "none", borderRadius: "10px", color: primaryTeal, borderColor: primaryTeal }}
              >
                Add Semester
              </Button>
            </Stack>

            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)} 
              variant="scrollable"
              sx={{ 
                mb: 4, borderBottom: `1px solid ${borderColor}`,
                "& .MuiTab-root": { fontFamily: primaryFont, fontWeight: 700, minWidth: 140, color: "#94A3B8" },
                "& .Mui-selected": { color: `${primaryTeal} !important` },
                "& .MuiTabs-indicator": { bgcolor: primaryTeal, height: 3 }
              }}
            >
              {semesters.map((sem) => <Tab key={sem.id} label={sem.semesterName} />)}
            </Tabs>

            {semesters.map((sem, semIdx) => (
              <Box key={sem.id} hidden={activeTab !== semIdx}>
                {activeTab === semIdx && (
                  <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "16px" }}>
                    <Table>
                      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#475569", fontWeight: 800, fontFamily: primaryFont, py: 2.5 }}>Module Code</TableCell>
                          <TableCell sx={{ color: "#475569", fontWeight: 800, fontFamily: primaryFont }}>Module Title</TableCell>
                          <TableCell sx={{ color: "#475569", fontWeight: 800, fontFamily: primaryFont }}>Credits</TableCell>
                          <TableCell align="center" sx={{ color: "#475569", fontWeight: 800, fontFamily: primaryFont }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.moduleRows.map((row, rowIdx) => (
                          <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#FBFCFD" } }}>
                            <TableCell sx={{ py: 2 }}>
                              <TextField fullWidth size="small" value={row.code} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'code', e.target.value)} sx={inputStyle} placeholder="CS101" />
                            </TableCell>
                            <TableCell>
                              <TextField fullWidth size="small" value={row.name} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'name', e.target.value)} sx={inputStyle} placeholder="Intro to AI" />
                            </TableCell>
                            <TableCell width="120px">
                              <TextField fullWidth size="small" value={row.credits} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'credits', e.target.value)} sx={inputStyle} placeholder="4.0" />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                onClick={() => {
                                  const upd = [...semesters]; 
                                  upd[semIdx].moduleRows.splice(rowIdx, 1); 
                                  setSemesters(upd);
                                }} 
                                disabled={sem.moduleRows.length === 1}
                                sx={{ color: "#94A3B8", "&:hover": { color: "#F87171" } }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Box sx={{ p: 2, bgcolor: "#FDFDFD" }}>
                      <Button 
                        fullWidth 
                        startIcon={<PostAddOutlined />} 
                        onClick={() => {
                          const upd = [...semesters]; 
                          upd[semIdx].moduleRows.push({ id: `mod-${Date.now()}`, code: "", name: "", credits: "" }); 
                          setSemesters(upd);
                        }} 
                        sx={{ ...montserratStyle, py: 1.5, color: secondaryTeal, fontWeight: 700, textTransform: "none" }}
                      >
                        Insert New Module Row
                      </Button>
                    </Box>
                  </TableContainer>
                )}
              </Box>
            ))}
          </Paper>

          {/* SECTION 4: DETAILED CRITERIA */}
          <Paper sx={sectionCardStyle} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <Box sx={{ p: 1, bgcolor: "rgba(0, 70, 82, 0.1)", borderRadius: "10px" }}>
                <SchoolOutlined sx={{ color: primaryTeal }} />
              </Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal }}>
                Admission & Careers
              </Typography>
            </Stack>

            <Stack spacing={5}>
              <Box sx={{ 
                "& .ql-editor": { minHeight: "220px", fontFamily: primaryFont, fontSize: "0.9rem" },
                "& .ql-container": { borderRadius: "0 0 16px 16px", borderColor: borderColor },
                "& .ql-toolbar": { borderRadius: "16px 16px 0 0", borderColor: borderColor, bgcolor: "#F8FAFC" }
              }}>
                <InputLabel sx={labelStyle}>Entry Requirements (Rich Text Content)</InputLabel>
                <ReactQuill theme="snow" value={entryRequirement} onChange={setEntryRequirement} />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Career Progression Prospects</InputLabel>
                <TextField 
                  fullWidth multiline rows={4} 
                  value={progression} 
                  onChange={(e) => setProgression(e.target.value)} 
                  sx={inputStyle} 
                  placeholder="Describe employment opportunities and higher education pathways..."
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Scholarships & Financial Aid</InputLabel>
                <TextField 
                  fullWidth multiline rows={4} 
                  value={scholarships} 
                  onChange={(e) => setScholarships(e.target.value)} 
                  sx={inputStyle} 
                  placeholder="Details regarding merit-based and financial-need scholarships..."
                />
              </Box>
            </Stack>
          </Paper>

          {/* SECTION 5: TAGGING & MEDIA */}
          <Paper sx={sectionCardStyle} elevation={0}>
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <Box sx={{ p: 1, bgcolor: "rgba(0, 70, 82, 0.1)", borderRadius: "10px" }}>
                <LandscapeOutlined sx={{ color: primaryTeal }} />
              </Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.4rem", color: primaryTeal }}>
                Media & Taxonomies
              </Typography>
            </Stack>

            <Stack spacing={4}>
              <Box>
                <InputLabel sx={labelStyle}>Popular Career Pathways (Tags)</InputLabel>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    value={pathwayInput} 
                    onChange={(e) => setPathwayInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && (pathwayInput && setCareerPathways([...careerPathways, pathwayInput]), setPathwayInput(""))}
                    placeholder="e.g. Data Scientist, UX Designer" 
                    sx={inputStyle} 
                  />
                  <Button 
                    onClick={() => { if(pathwayInput){ setCareerPathways([...careerPathways, pathwayInput]); setPathwayInput(""); } }} 
                    variant="contained" 
                    sx={{ ...montserratStyle, bgcolor: primaryTeal, px: 4, borderRadius: "12px", textTransform: "none" }}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {careerPathways.map((tag, i) => (
                    <Chip 
                      key={i} 
                      label={tag} 
                      onDelete={() => setCareerPathways(careerPathways.filter((_, idx) => idx !== i))} 
                      sx={{ ...montserratStyle, fontWeight: 700, bgcolor: "#E2E8F0", borderRadius: "8px" }} 
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <InputLabel sx={labelStyle}>Primary Cover Image Link</InputLabel>
                <TextField 
                  fullWidth 
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.coverImage}
                  helperText={errors.coverImage}
                  placeholder="https://images.unsplash.com/photo-example"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LandscapeOutlined sx={{ color: "#94A3B8" }} /></InputAdornment>
                  }}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Gallery Media Collection</InputLabel>
                <Stack spacing={2}>
                  {images.map((img, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="center">
                      <TextField 
                        fullWidth 
                        size="small" 
                        value={img} 
                        onChange={(e) => { 
                          const upd = [...images]; 
                          upd[i] = e.target.value; 
                          setImages(upd); 
                        }} 
                        sx={inputStyle} 
                        placeholder={`Image URL #${i + 1}`}
                      />
                      <IconButton onClick={() => setImages(images.filter((_, idx) => idx !== i))} sx={{ color: "#94A3B8" }}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button 
                    startIcon={<PlaylistAddOutlined />} 
                    onClick={() => setImages([...images, ""])} 
                    sx={{ ...montserratStyle, color: primaryTeal, fontWeight: 800, textTransform: "none", width: "fit-content" }}
                  >
                    Append to Gallery
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* FINAL PUBLISH SECTION */}
          <Box sx={{ textAlign: "center", pt: 6 }}>
            <Typography sx={{ ...montserratStyle, mb: 3, color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>
              Please review all sections before clicking Publish. Fields marked with icons are mandatory.
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleSave} 
              disabled={loading}
              sx={{ 
                bgcolor: primaryTeal, 
                py: 2.8, 
                borderRadius: "24px", 
                fontWeight: 900, 
                fontFamily: primaryFont,
                fontSize: "1.2rem",
                letterSpacing: "0.5px",
                boxShadow: "0 20px 40px -10px rgba(0, 70, 82, 0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { bgcolor: "#00323a", transform: "scale(1.01)", boxShadow: "0 25px 50px -12px rgba(0, 70, 82, 0.5)" },
                "&:active": { transform: "scale(0.98)" }
              }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : "FINALIZE & PUBLISH PROGRAM"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateCourse;