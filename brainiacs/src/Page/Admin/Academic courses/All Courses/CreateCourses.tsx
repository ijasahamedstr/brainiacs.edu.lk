import { useState, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, TextField, 
  InputLabel, CircularProgress, IconButton, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Tabs, Tab, Alert, Collapse, InputAdornment, Fade, Paper, MenuItem,
  Checkbox, FormControlLabel 
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddOutlined, 
  AutoAwesomeOutlined, PostAddOutlined,
  PlaylistAddOutlined, InfoOutlined, MenuBookOutlined, 
  SchoolOutlined, LandscapeOutlined,
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

interface CategoryOption {
  id: string;
  label: string;
}

const CreateCourse = ({ onBack }: { onBack: () => void }) => {
  // --- CORE FORM STATE ---
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [intake, setIntake] = useState("");
  const [awardingBody, setAwardingBody] = useState("");
  const [isCampusOffering, setIsCampusOffering] = useState(false);
  
  // --- ARRAY & TEXT STATE ---
  const [courseDescription, setCourseDescription] = useState<string[]>([""]); 
  const [images, setImages] = useState<string[]>([""]);
  const [coverImage, setCoverImage] = useState("");
  
  // UPDATED: Nested state for structured entry requirements
  const [entryRequirements, setEntryRequirements] = useState([
    { category: "", descriptions: [""] }
  ]); 
  
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

  // --- CATEGORY DROPDOWN STATE ---
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // --- REUSABLE STYLE OBJECTS ---
  const montserratStyle = { fontFamily: primaryFont };

  const inputProps = {
    style: montserratStyle,
    autoComplete: "off",
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px", 
      fontFamily: primaryFont, 
      fontSize: "0.8rem", 
      bgcolor: "#FFF", 
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#CBD5E1" },
      "& hover fieldset": { borderColor: primaryTeal },
      "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: primaryTeal },
    },
    "& .MuiInputBase-input": montserratStyle,
    "& .MuiFormHelperText-root": { fontFamily: primaryFont, fontWeight: 500, fontSize: "0.7rem" }
  };

  const labelStyle = {
    fontFamily: primaryFont, 
    fontWeight: 800, 
    fontSize: "0.68rem", 
    color: "#334155", 
    mb: 0.8, 
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  };

  // --- FETCH CATEGORIES FROM API ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/course-categories`);
        const data = await response.json();
        
        let flatOptions: CategoryOption[] = [];

        const flattenCategories = (nodes: any[], parentPath: string = "") => {
          nodes.forEach((node) => {
            const currentPath = parentPath ? `${parentPath} > ${node.title}` : node.title;
            flatOptions.push({ id: node.id, label: currentPath });
            
            if (node.children && node.children.length > 0) {
              flattenCategories(node.children, currentPath);
            }
          });
        };

        if (Array.isArray(data)) {
          data.forEach(section => {
            if (section.categories) flattenCategories(section.categories, section.sectionTitle || "");
          });
        } else if (data && data.categories) {
          flattenCategories(data.categories, data.sectionTitle || "");
        }

        setCategoryOptions(flatOptions);
      } catch (error) {
        console.error("Failed to fetch course categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

    // Clean up empty bullets and categories before saving
    const cleanedEntryRequirements = entryRequirements
      .filter(req => req.category.trim() || req.descriptions.some(d => d.trim()))
      .map(req => ({
        category: req.category,
        descriptions: req.descriptions.filter(d => d.trim())
      }));

    const payload = {
      courseName,
      courseDescription: courseDescription.filter(d => d.trim()),
      duration,
      courseCategory,
      intake,
      isCampusOffering, 
      entryRequirements: cleanedEntryRequirements, 
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
      const res = await fetch(`${API_BASE_URL}/api/course`, {
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
      setCourseCategory("");
      setIsCampusOffering(false); 
      setCourseDescription([""]);
      setEntryRequirements([{ category: "", descriptions: [""] }]);
      setProgression("");
      setScholarships("");
      setSemesters([{ id: "sem-1", semesterName: "Semester 1", moduleRows: [{ id: "mod-1", code: "", name: "", credits: "" }] }]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (courseName.length > 5) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [courseName, courseDescription, semesters, isCampusOffering, entryRequirements]);

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* STICKY HEADER ACTIONS */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 1000, 
        bgcolor: "rgba(248, 250, 252, 0.9)", backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${borderColor}`, py: 1.5, mb: 4
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: "1000px", mx: "auto", px: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton onClick={onBack} size="small" sx={{ bgcolor: "#FFF", border: `1px solid ${borderColor}` }}>
              <ArrowBackIosNewOutlined fontSize="small" sx={{ fontSize: "1rem" }} />
            </IconButton>
            <Box>
              <Typography sx={{ ...montserratStyle, fontWeight: 800, color: primaryTeal, fontSize: "1rem" }}>
                Course Editor
              </Typography>
              {lastSaved && (
                <Typography sx={{ ...montserratStyle, fontSize: "0.6rem", color: "#64748B" }}>
                  Autosaved at {lastSaved}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button 
              size="small"
              variant="outlined" 
              startIcon={<RestartAltOutlined fontSize="small" />} 
              onClick={handleReset}
              sx={{ ...montserratStyle, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", borderColor: "#CBD5E1", color: "#64748B" }}
            >
              Reset
            </Button>
            <Button 
              size="small"
              variant="contained" 
              startIcon={<SaveOutlined fontSize="small" />} 
              onClick={handleSave}
              disabled={loading}
              sx={{ ...montserratStyle, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", bgcolor: primaryTeal, px: 2 }}
            >
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: "1000px", mx: "auto", px: { xs: 2, md: 3 }, pb: 8 }}>
        <Collapse in={showSuccess}>
          <Alert icon={<CheckCircleOutline fontSize="small" />} severity="success" sx={{ mb: 4, borderRadius: "10px", fontFamily: primaryFont, fontWeight: 600, fontSize: "0.8rem" }}>
            Course Published Successfully! Redirecting...
          </Alert>
        </Collapse>

        <Stack spacing={5}>
          
          {/* SECTION 1: MASTER IDENTITY */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
              <InfoOutlined fontSize="small" sx={{ color: primaryTeal }} />
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal }}>
                General Information
              </Typography>
            </Stack>
            
            <Stack spacing={2.5}>
              <Box>
                <InputLabel sx={labelStyle}>Official Course Name <HelpOutline sx={{ fontSize: 12 }} /></InputLabel>
                <TextField 
                  fullWidth 
                  size="small"
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.courseName}
                  helperText={errors.courseName}
                  placeholder="e.g. Master of Science in Artificial Intelligence"
                  InputProps={{ 
                    ...inputProps,
                    startAdornment: <InputAdornment position="start"><SchoolOutlined sx={{ color: "#94A3B8", fontSize: "1.1rem" }} /></InputAdornment>
                  }}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Program Category</InputLabel>
                <TextField 
                  select
                  fullWidth 
                  size="small"
                  value={courseCategory} 
                  onChange={(e) => setCourseCategory(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.courseCategory}
                  helperText={errors.courseCategory}
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <MenuItem disabled sx={{ ...montserratStyle, fontSize: "0.8rem" }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} /> Loading categories...
                    </MenuItem>
                  ) : categoryOptions.length === 0 ? (
                    <MenuItem disabled sx={{ ...montserratStyle, fontSize: "0.8rem" }}>
                      No categories found
                    </MenuItem>
                  ) : (
                    categoryOptions.map((option) => (
                      <MenuItem key={option.id} value={option.label} sx={{ ...montserratStyle, fontSize: "0.8rem" }}>
                        {option.label}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <InputLabel sx={labelStyle}>Program Description</InputLabel>
                  <Typography sx={{ ...montserratStyle, fontSize: "0.65rem", color: "#94A3B8" }}>
                    Break long text into multiple paragraphs
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {courseDescription.map((desc, i) => (
                    <Fade in={true} key={i}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <TextField 
                          fullWidth 
                          multiline 
                          size="small"
                          rows={2} 
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
                          size="small"
                          onClick={() => setCourseDescription(courseDescription.filter((_, idx) => idx !== i))} 
                          disabled={courseDescription.length === 1}
                          sx={{ color: "#F87171", border: "1px solid #FEE2E2", mt: 0.5, bgcolor: "#FFF" }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Fade>
                  ))}
                  <Button 
                    size="small"
                    startIcon={<AddOutlined fontSize="small" />} 
                    onClick={() => setCourseDescription([...courseDescription, ""])} 
                    sx={{ ...montserratStyle, fontSize: "0.75rem", fontWeight: 800, textTransform: "none", color: primaryTeal, width: "fit-content" }}
                  >
                    Add Paragraph
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: borderColor }} />

          {/* SECTION 2: ACADEMIC SPECS */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
              <AutoAwesomeOutlined fontSize="small" sx={{ color: primaryTeal }} />
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal }}>
                Academic Specifications
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCampusOffering}
                      onChange={(e) => setIsCampusOffering(e.target.checked)}
                      sx={{
                        color: "#CBD5E1",
                        '&.Mui-checked': { color: primaryTeal },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ ...montserratStyle, fontSize: "0.85rem", color: "#334155", fontWeight: 700 }}>
                      Available as Campus Offering
                    </Typography>
                  }
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Duration</InputLabel>
                <TextField fullWidth size="small" value={duration} onChange={(e) => setDuration(e.target.value)} sx={inputStyle} placeholder="e.g. 3 Years (Full Time)" />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Intake Schedule</InputLabel>
                <TextField fullWidth size="small" value={intake} onChange={(e) => setIntake(e.target.value)} sx={inputStyle} placeholder="e.g. February, July, October" />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Awarding Body</InputLabel>
                <TextField fullWidth size="small" value={awardingBody} onChange={(e) => setAwardingBody(e.target.value)} sx={inputStyle} placeholder="e.g. University of London" />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: borderColor }} />

          {/* SECTION 3: CURRICULUM BUILDER */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MenuBookOutlined fontSize="small" sx={{ color: primaryTeal }} />
                <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal }}>
                  Module Structure
                </Typography>
              </Stack>
              <Button 
                size="small"
                variant="outlined"
                startIcon={<AddOutlined fontSize="small" />} 
                onClick={handleAddSemester} 
                sx={{ ...montserratStyle, fontSize: "0.75rem", textTransform: "none", borderRadius: "8px", color: primaryTeal, borderColor: primaryTeal }}
              >
                Semester
              </Button>
            </Stack>

            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)} 
              variant="scrollable"
              sx={{ 
                mb: 3, borderBottom: `1px solid ${borderColor}`, minHeight: "36px",
                "& .MuiTab-root": { fontFamily: primaryFont, fontWeight: 700, fontSize: "0.8rem", minHeight: "36px", minWidth: 100, color: "#94A3B8" },
                "& .Mui-selected": { color: `${primaryTeal} !important` },
                "& .MuiTabs-indicator": { bgcolor: primaryTeal, height: 2 }
              }}
            >
              {semesters.map((sem) => <Tab key={sem.id} label={sem.semesterName} />)}
            </Tabs>

            {semesters.map((sem, semIdx) => (
              <Box key={sem.id} hidden={activeTab !== semIdx}>
                {activeTab === semIdx && (
                  <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "12px", bgcolor: "#FFF" }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#F8FAFC", borderBottom: `1px solid ${borderColor}` }}>
                        <TableRow>
                          <TableCell sx={{ color: "#475569", fontSize: "0.75rem", fontWeight: 800, fontFamily: primaryFont, py: 1.5 }}>Module Code</TableCell>
                          <TableCell sx={{ color: "#475569", fontSize: "0.75rem", fontWeight: 800, fontFamily: primaryFont }}>Module Title</TableCell>
                          <TableCell sx={{ color: "#475569", fontSize: "0.75rem", fontWeight: 800, fontFamily: primaryFont }}>Credits</TableCell>
                          <TableCell align="center" sx={{ color: "#475569", fontSize: "0.75rem", fontWeight: 800, fontFamily: primaryFont }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.moduleRows.map((row, rowIdx) => (
                          <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#FBFCFD" } }}>
                            <TableCell sx={{ py: 1.5 }}>
                              <TextField fullWidth size="small" value={row.code} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'code', e.target.value)} sx={inputStyle} placeholder="CS101" />
                            </TableCell>
                            <TableCell>
                              <TextField fullWidth size="small" value={row.name} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'name', e.target.value)} sx={inputStyle} placeholder="Intro to AI" />
                            </TableCell>
                            <TableCell width="100px">
                              <TextField fullWidth size="small" value={row.credits} onChange={(e) => handleUpdateModuleRow(semIdx, rowIdx, 'credits', e.target.value)} sx={inputStyle} placeholder="4.0" />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small"
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
                    <Box sx={{ p: 1.5, borderTop: `1px solid ${borderColor}` }}>
                      <Button 
                        fullWidth 
                        size="small"
                        startIcon={<PostAddOutlined fontSize="small" />} 
                        onClick={() => {
                          const upd = [...semesters]; 
                          upd[semIdx].moduleRows.push({ id: `mod-${Date.now()}`, code: "", name: "", credits: "" }); 
                          setSemesters(upd);
                        }} 
                        sx={{ ...montserratStyle, fontSize: "0.75rem", color: secondaryTeal, fontWeight: 700, textTransform: "none" }}
                      >
                        Insert New Row
                      </Button>
                    </Box>
                  </TableContainer>
                )}
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: borderColor }} />

          {/* SECTION 4: DETAILED CRITERIA */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
              <SchoolOutlined fontSize="small" sx={{ color: primaryTeal }} />
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal }}>
                Admission & Careers
              </Typography>
            </Stack>

            <Stack spacing={4}>
              
              {/* UPDATED: Nested Entry Requirements Builder */}
              <Box>
                <InputLabel sx={{ ...labelStyle, mb: 1.5 }}>Structured Entry Requirements</InputLabel>
                <Stack spacing={2.5}>
                  {entryRequirements.map((reqBlock, reqIndex) => (
                    <Paper key={reqIndex} variant="outlined" sx={{ p: {xs: 1.5, sm: 2.5}, borderRadius: "12px", borderColor: borderColor, bgcolor: "#FFF" }}>
                      <Stack spacing={2}>
                        
                        {/* 1. Category Title Row */}
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
                            }}
                            sx={{ ...inputStyle, "& .MuiInputBase-input": { fontWeight: 700, color: primaryTeal } }}
                          />
                          <IconButton 
                            size="small"
                            onClick={() => setEntryRequirements(entryRequirements.filter((_, idx) => idx !== reqIndex))} 
                            disabled={entryRequirements.length === 1}
                            sx={{ color: "#F87171", border: "1px solid #FEE2E2", bgcolor: "#FFF" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Stack>

                        {/* 2. Bullets Container */}
                        <Stack spacing={1.5} pl={{xs: 1, sm: 4}} borderLeft={`2px solid ${borderColor}`}>
                          {reqBlock.descriptions.map((desc, descIndex) => (
                            <Stack direction="row" spacing={1.5} alignItems="flex-start" key={descIndex}>
                              <Typography sx={{ mt: 1, color: "#94A3B8", fontSize: "1.2rem", lineHeight: 1 }}>•</Typography>
                              <TextField 
                                fullWidth 
                                multiline
                                size="small"
                                value={desc} 
                                onChange={(e) => {
                                  const upd = [...entryRequirements];
                                  upd[reqIndex].descriptions[descIndex] = e.target.value;
                                  setEntryRequirements(upd);
                                }}
                                sx={inputStyle} 
                                placeholder="e.g. Minimum of 4 'C' grades..." 
                              />
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  const upd = [...entryRequirements];
                                  upd[reqIndex].descriptions = upd[reqIndex].descriptions.filter((_, idx) => idx !== descIndex);
                                  setEntryRequirements(upd);
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
                            }} 
                            sx={{ ...montserratStyle, fontSize: "0.7rem", fontWeight: 700, textTransform: "none", color: secondaryTeal, width: "fit-content" }}
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
                    onClick={() => setEntryRequirements([...entryRequirements, { category: "", descriptions: [""] }])} 
                    sx={{ ...montserratStyle, fontSize: "0.75rem", fontWeight: 800, textTransform: "none", color: primaryTeal, borderColor: primaryTeal, borderStyle: "dashed" }}
                  >
                    Add Requirement Category Block
                  </Button>
                </Stack>
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Career Progression Prospects</InputLabel>
                <TextField 
                  fullWidth multiline rows={4} size="small"
                  value={progression} 
                  onChange={(e) => setProgression(e.target.value)} 
                  sx={inputStyle} 
                  placeholder="Describe employment opportunities or further education pathways..."
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Scholarships & Financial Aid</InputLabel>
                <TextField 
                  fullWidth multiline rows={3} size="small"
                  value={scholarships} 
                  onChange={(e) => setScholarships(e.target.value)} 
                  sx={inputStyle} 
                  placeholder="Details regarding scholarships..."
                />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: borderColor }} />

          {/* SECTION 5: TAGGING & MEDIA */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
              <LandscapeOutlined fontSize="small" sx={{ color: primaryTeal }} />
              <Typography sx={{ ...montserratStyle, fontWeight: 900, fontSize: "1.1rem", color: primaryTeal }}>
                Media & Taxonomies
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <Box>
                <InputLabel sx={labelStyle}>Popular Career Pathways (Tags)</InputLabel>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
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
                    size="small"
                    onClick={() => { if(pathwayInput){ setCareerPathways([...careerPathways, pathwayInput]); setPathwayInput(""); } }} 
                    variant="contained" 
                    sx={{ ...montserratStyle, fontSize: "0.75rem", bgcolor: primaryTeal, px: 3, borderRadius: "8px", textTransform: "none" }}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {careerPathways.map((tag, i) => (
                    <Chip 
                      key={i} 
                      size="small"
                      label={tag} 
                      onDelete={() => setCareerPathways(careerPathways.filter((_, idx) => idx !== i))} 
                      sx={{ ...montserratStyle, fontSize: "0.7rem", fontWeight: 700, bgcolor: "#E2E8F0", borderRadius: "6px" }} 
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Primary Cover Image Link</InputLabel>
                <TextField 
                  fullWidth 
                  size="small"
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)} 
                  sx={inputStyle} 
                  error={!!errors.coverImage}
                  helperText={errors.coverImage}
                  placeholder="https://images.unsplash.com/photo-example"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LandscapeOutlined sx={{ color: "#94A3B8", fontSize: "1.1rem" }} /></InputAdornment>
                  }}
                />
              </Box>

              <Box>
                <InputLabel sx={labelStyle}>Gallery Media Collection</InputLabel>
                <Stack spacing={1.5}>
                  {images.map((img, i) => (
                    <Stack key={i} direction="row" spacing={1.5} alignItems="center">
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
                      <IconButton size="small" onClick={() => setImages(images.filter((_, idx) => idx !== i))} sx={{ color: "#94A3B8" }}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button 
                    size="small"
                    startIcon={<PlaylistAddOutlined fontSize="small" />} 
                    onClick={() => setImages([...images, ""])} 
                    sx={{ ...montserratStyle, fontSize: "0.75rem", color: primaryTeal, fontWeight: 800, textTransform: "none", width: "fit-content" }}
                  >
                    Append to Gallery
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* FINAL PUBLISH SECTION */}
          <Box sx={{ textAlign: "center", pt: 4 }}>
            <Typography sx={{ ...montserratStyle, mb: 2, color: "#64748B", fontSize: "0.75rem", fontWeight: 600 }}>
              Please review all sections before clicking Publish. Fields marked with icons are mandatory.
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleSave} 
              disabled={loading}
              sx={{ 
                bgcolor: primaryTeal, 
                py: 2, 
                borderRadius: "16px", 
                fontWeight: 800, 
                fontFamily: primaryFont,
                fontSize: "1rem",
                letterSpacing: "0.5px",
                boxShadow: "0 10px 20px -8px rgba(0, 70, 82, 0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { bgcolor: "#00323a", transform: "scale(1.01)" },
                "&:active": { transform: "scale(0.98)" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "FINALIZE & PUBLISH"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateCourse;