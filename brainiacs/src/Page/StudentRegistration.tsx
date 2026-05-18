import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Box, Typography, TextField, Button, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, 
  Paper, Stack, Stepper, Step, StepLabel, LinearProgress,
  InputAdornment, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, MenuItem, useTheme, useMediaQuery, IconButton
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedUserIcon,
  Attachment as AttachmentIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon
} from "@mui/icons-material";

// Configuration & Global Styles
const THEME_COLOR = "#004d40"; 
const API_URL = `${import.meta.env.VITE_API_URL}/api/students`;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const CAMPUS_NAME = "BRAINIACS";

const GLOBAL_FONT = {
  fontFamily: "'Montserrat', sans-serif",
};

// Comprehensive Input Styling
const inputSx = {
  "& .MuiInputBase-root": GLOBAL_FONT,
  "& .MuiInputLabel-root": { ...GLOBAL_FONT, fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' } },
  "& .MuiFormHelperText-root": GLOBAL_FONT,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderRadius: "12px" },
    "&.Mui-focused fieldset": { borderColor: THEME_COLOR },
  },
  mb: { xs: 2, sm: 2.5 }
};

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ["Inquiry Info", "Personal Identity", "Guardian/Emergency", "Academic Grid", "Uploads & Policy"];

  const [formData, setFormData] = useState({
    programme: "",
    intake: "2026 February",
    fullName: "",
    initials: "",
    gender: "male",
    dob: "",
    nationality: "Sri Lankan",
    nic: "",
    mobile: "",
    whatsapp: "",
    email: "",
    permanentAddress: "",
    postalCity: "",
    guardianName: "",
    guardianMobile: "",
    guardianAddress: "",
    guardianRelationship: "",
    guardianEmail: "",
    olExamTypes: [] as string[],
    alExamTypes: [] as string[],
    alStream: "",
    surveySource: [] as string[],
    termsAccepted: false,
    privacyConsent: false
  });

  // Start with 10 O/L rows and 4 A/L rows by default
  const [olRows, setOlRows] = useState(Array(10).fill(null).map(() => ({ y1: "", s1: "", g1: "", y2: "", s2: "", g2: "" })));
  const [alRows, setAlRows] = useState(Array(4).fill(null).map(() => ({ subject: "", grade: "", year: "", attempt: "" })));
  const [otherQuals] = useState(Array(4).fill(null).map(() => ({ name: "", year: "", body: "", grade: "" })));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prev) => prev - 1);
  };

  const handleTableChange = (setter: any, state: any, index: number, field: string, value: string) => {
    const updated = [...state];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  // --- Dynamic Table Handlers ---
  const handleAddOlRow = () => setOlRows([...olRows, { y1: "", s1: "", g1: "", y2: "", s2: "", g2: "" }]);
  const handleAddAlRow = () => setAlRows([...alRows, { subject: "", grade: "", year: "", attempt: "" }]);

  const handleRemoveOlRow = (index: number) => {
    if (olRows.length > 1) setOlRows(olRows.filter((_, i) => i !== index));
  };
  const handleRemoveAlRow = (index: number) => {
    if (alRows.length > 1) setAlRows(alRows.filter((_, i) => i !== index));
  };
  // ------------------------------

  const handleCheckboxGroup = (field: "surveySource" | "olExamTypes" | "alExamTypes", value: string) => {
    const current = formData[field] as string[];
    const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async () => {
    if (!IMGBB_API_KEY) {
      alert("Configuration Error: ImgBB API Key is missing.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Upload files to ImgBB and collect the generated URLs
      const uploadedImageUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const imgFormData = new FormData();
        imgFormData.append("image", file);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: imgFormData,
        });
        
        const imgbbData = await imgbbRes.json();
        
        if (imgbbData.success) {
          uploadedImageUrls.push(imgbbData.data.url);
        } else {
          console.error("Failed to upload file to ImgBB:", file.name);
        }
      }

      // 2. Prepare the final payload for your local backend
      const sendableFormData = new FormData();
      const payload = { 
        ...formData, 
        olRows, 
        alRows, 
        otherQuals,
        certificateUrls: uploadedImageUrls 
      };
      
      sendableFormData.append("data", JSON.stringify(payload));
      
      // 3. Send the structured data to your backend
      const res = await fetch(API_URL, { 
        method: "POST", 
        body: sendableFormData 
      });
      
      if (res.ok) {
        setActiveStep(5);
      } else {
        alert("Submission failed. Check network.");
      }
    } catch (e) {
      console.error("An error occurred during submission:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <Box sx={{ 
      bgcolor: THEME_COLOR, color: "white", 
      p: { xs: 2, sm: 2.5 }, 
      mb: { xs: 3, sm: 4 }, 
      borderRadius: "12px", 
      display: "flex", 
      alignItems: "center", 
      boxShadow: "0 8px 20px rgba(0,77,64,0.2)" 
    }}>
      <Icon sx={{ mr: 2, fontSize: { xs: "1.2rem", sm: "1.6rem" } }} />
      <Typography variant="subtitle1" sx={{ 
        fontWeight: 800, ...GLOBAL_FONT, 
        textTransform: 'uppercase', 
        fontSize: { xs: "0.85rem", sm: "1rem" },
        letterSpacing: '1px'
      }}>{title}</Typography>
    </Box>
  );

  const CustomTableCell = ({ children, isHeader = false }: { children: any, isHeader?: boolean }) => (
    <TableCell sx={{ 
      border: `1px solid ${isHeader ? THEME_COLOR : "#eee"}`, 
      p: isHeader ? { xs: 1, sm: 1.5 } : 0, 
      bgcolor: isHeader ? "#f8faf9" : "transparent",
      textAlign: "center",
      ...GLOBAL_FONT,
      fontWeight: isHeader ? 900 : 400,
      fontSize: isHeader ? "0.7rem" : "0.85rem",
      minWidth: isHeader ? { xs: 80, sm: 100 } : 'auto',
    }}>
      {children}
    </TableCell>
  );

  const renderInquiry = () => (
    <Stack spacing={{ xs: 3, sm: 4 }}>
      <SectionHeader icon={BusinessIcon} title="Application Intent" />
      <TextField fullWidth label="Academic Programme" placeholder="e.g. BEng (Hons) Software Engineering" value={formData.programme} onChange={(e) => handleInputChange("programme", e.target.value)} sx={inputSx} />
      <TextField select fullWidth label="Intake Period" value={formData.intake} onChange={(e) => handleInputChange("intake", e.target.value)} sx={inputSx}>
        {["2026 February", "2026 June", "2026 October"].map(i => <MenuItem key={i} value={i} sx={GLOBAL_FONT}>{i}</MenuItem>)}
      </TextField>
    </Stack>
  );

  const renderPersonal = () => (
    <Stack spacing={{ xs: 2.5, sm: 3.5 }}>
      <SectionHeader icon={PersonIcon} title="Student Identity" />
      <TextField fullWidth label="Full Name (Capital Letters)" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} sx={inputSx} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth label="Initials" value={formData.initials} onChange={(e) => handleInputChange("initials", e.target.value)} sx={inputSx} />
        <FormControl fullWidth sx={{ border: "1px solid #ddd", borderRadius: "10px", p: 1.5, mb: 2 }}>
          <FormLabel sx={{ ...GLOBAL_FONT, fontSize: "0.7rem", fontWeight: 700, color: THEME_COLOR, mb: 1 }}>GENDER</FormLabel>
          <RadioGroup row value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
            <FormControlLabel value="male" control={<Radio size="small" />} label={<Typography sx={{...GLOBAL_FONT, fontSize: '0.9rem'}}>Male</Typography>} />
            <FormControlLabel value="female" control={<Radio size="small" />} label={<Typography sx={{...GLOBAL_FONT, fontSize: '0.9rem'}}>Female</Typography>} />
          </RadioGroup>
        </FormControl>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth type="date" label="DOB" value={formData.dob} onChange={(e) => handleInputChange("dob", e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
        <TextField fullWidth label="NIC Number" value={formData.nic} onChange={(e) => handleInputChange("nic", e.target.value)} sx={inputSx} />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth label="Mobile Phone" value={formData.mobile} onChange={(e) => handleInputChange("mobile", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">+94</InputAdornment> }} sx={inputSx} />
        <TextField fullWidth label="WhatsApp (Optional)" value={formData.whatsapp} onChange={(e) => handleInputChange("whatsapp", e.target.value)} sx={inputSx} />
      </Stack>
      <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} sx={inputSx} />
    </Stack>
  );

  const renderPageGuardian = () => (
    <Stack spacing={{ xs: 2.5, sm: 3.5 }}>
      <SectionHeader icon={VerifiedUserIcon} title="Emergency Contact" />
      <TextField fullWidth label="Guardian Full Name" value={formData.guardianName} onChange={(e) => handleInputChange("guardianName", e.target.value)} sx={inputSx} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth label="Relationship" value={formData.guardianRelationship} onChange={(e) => handleInputChange("guardianRelationship", e.target.value)} sx={inputSx} />
        <TextField fullWidth label="Guardian Contact" value={formData.guardianMobile} onChange={(e) => handleInputChange("guardianMobile", e.target.value)} sx={inputSx} />
      </Stack>
      <TextField fullWidth multiline rows={3} label="Residential Address" value={formData.guardianAddress} onChange={(e) => handleInputChange("guardianAddress", e.target.value)} sx={inputSx} />
    </Stack>
  );

  const renderAcademic = () => (
    <Box>
      <SectionHeader icon={SchoolIcon} title="Academic History" />
      
      {/* O/L SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, ...GLOBAL_FONT, color: THEME_COLOR }}>
          GCE ORDINARY LEVEL (O/L)
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAddOlRow} sx={{ ...GLOBAL_FONT, fontWeight: 700, color: THEME_COLOR }}>
          Add Row
        </Button>
      </Stack>
      
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #ddd", borderRadius: "10px", mb: 5, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow>
              <CustomTableCell isHeader>EXAM</CustomTableCell>
              {["Year", "Subject", "Grade", "Year", "Subject", "Grade", "Action"].map((h, i) => <CustomTableCell key={i} isHeader>{h}</CustomTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {olRows.map((row, i) => (
              <TableRow key={i}>
                {i === 0 && (
                  <TableCell rowSpan={Math.max(1, olRows.length)} sx={{ borderRight: "1px solid #ddd", width: 120 }}>
                    <FormGroup>
                      {["Local", "Foreigner"].map(l => (
                        <FormControlLabel key={l} control={<Checkbox size="small" checked={formData.olExamTypes.includes(l)} onChange={() => handleCheckboxGroup("olExamTypes", l)} />} label={<Typography sx={{ fontSize: '0.65rem', ...GLOBAL_FONT, fontWeight: 600 }}>{l}</Typography>} />
                      ))}
                    </FormGroup>
                  </TableCell>
                )}
                {["y1", "s1", "g1", "y2", "s2", "g2"].map(f => (
                  <CustomTableCell key={f}>
                    <input style={{ border: 'none', textAlign: 'center', width: '100%', padding: '12px 0', ...GLOBAL_FONT, outline: 'none' }} value={(row as any)[f]} onChange={(e) => handleTableChange(setOlRows, olRows, i, f, e.target.value)} />
                  </CustomTableCell>
                ))}
                <CustomTableCell>
                  <IconButton size="small" color="error" onClick={() => handleRemoveOlRow(i)} disabled={olRows.length === 1}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* A/L SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, ...GLOBAL_FONT, color: THEME_COLOR }}>
          GCE ADVANCED LEVEL (A/L)
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAddAlRow} sx={{ ...GLOBAL_FONT, fontWeight: 700, color: THEME_COLOR }}>
          Add Row
        </Button>
      </Stack>

      <TextField label="A/L Stream" fullWidth value={formData.alStream} onChange={(e) => handleInputChange("alStream", e.target.value)} sx={{ ...inputSx, mb: 3 }} />
      
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #ddd", borderRadius: "10px", overflowX: "auto", mb: 2 }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {["Subject Name", "Grade", "Year", "Attempt", "Action"].map(h => <CustomTableCell key={h} isHeader>{h}</CustomTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {alRows.map((row, i) => (
              <TableRow key={i}>
                {["subject", "grade", "year", "attempt"].map(f => (
                  <CustomTableCell key={f}>
                    <input style={{ border: 'none', textAlign: 'center', width: '100%', padding: '12px 0', ...GLOBAL_FONT, outline: 'none' }} value={(row as any)[f]} onChange={(e) => handleTableChange(setAlRows, alRows, i, f, e.target.value)} />
                  </CustomTableCell>
                ))}
                <CustomTableCell>
                  <IconButton size="small" color="error" onClick={() => handleRemoveAlRow(i)} disabled={alRows.length === 1}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderFinal = () => (
    <Stack spacing={{ xs: 4, sm: 5 }}>
      <SectionHeader icon={CloudUploadIcon} title="Upload Documents" />
      <Box sx={{ 
        p: { xs: 3, sm: 6 }, 
        border: "2px dashed #004d4040", 
        borderRadius: "20px", 
        textAlign: "center", 
        bgcolor: "#004d4005",
        transition: '0.3s',
        '&:hover': { bgcolor: '#004d4008', borderColor: THEME_COLOR }
      }}>
        <CloudUploadIcon sx={{ fontSize: { xs: 45, sm: 60 }, color: THEME_COLOR, mb: 2 }} />
        <Typography sx={{ ...GLOBAL_FONT, mb: 3, fontWeight: 700, fontSize: { xs: "0.9rem", sm: "1.1rem" } }}>Drag & drop or browse certificates</Typography>
        <Button variant="contained" component="label" sx={{ ...GLOBAL_FONT, bgcolor: THEME_COLOR, borderRadius: "50px", px: 4, py: 1.2 }}>
          Choose Files
          <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
        </Button>
        <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center" sx={{ mt: 4 }}>
          {selectedFiles.map((f, i) => (
            <Chip key={i} label={f.name} onDelete={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} icon={<AttachmentIcon />} sx={{ ...GLOBAL_FONT, bgcolor: 'white', border: '1px solid #ddd' }} />
          ))}
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: "#f1f8e9", border: "1px solid #c5e1a5", borderRadius: "20px" }}>
        <Typography variant="h6" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: "#2e7d32", mb: 2 }}>Student Declaration</Typography>
        <Typography variant="body2" sx={{ ...GLOBAL_FONT, lineHeight: 1.8, mb: 4, color: '#333', fontSize: '0.85rem' }}>
          I hereby declare that all information submitted is correct. {CAMPUS_NAME} International reserves the right to cancel enrollment if discrepancies are found.
        </Typography>
        <Stack spacing={1.5}>
          <FormControlLabel control={<Checkbox checked={formData.termsAccepted} onChange={(e) => handleInputChange("termsAccepted", e.target.checked)} />} label={<Typography sx={{ ...GLOBAL_FONT, fontSize: '0.8rem', fontWeight: 700 }}>Accept General Terms</Typography>} />
          <FormControlLabel control={<Checkbox checked={formData.privacyConsent} onChange={(e) => handleInputChange("privacyConsent", e.target.checked)} />} label={<Typography sx={{ ...GLOBAL_FONT, fontSize: '0.8rem', fontWeight: 700 }}>Consent to Data Privacy Policy</Typography>} />
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "#f4f7f6", 
      paddingTop: "144px", 
      pb: { xs: 6, md: 10 }, 
      px: { xs: 1.5, sm: 3 } 
    }}>
      <Paper elevation={20} sx={{ 
        maxWidth: 1100, 
        mx: "auto", 
        p: { xs: 2.5, sm: 5, md: 8, lg: 10 }, 
        borderRadius: { xs: "24px", md: "40px" },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '8px',
          bgcolor: THEME_COLOR
        }
      }}>
        
        {/* BRANDING */}
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "center", md: "flex-end" }} sx={{ mb: { xs: 6, md: 10 } }} spacing={4}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" sx={{ height: { xs: 50, md: 70 }, width: 'auto', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: THEME_COLOR, ...GLOBAL_FONT, letterSpacing: '-0.5px' }}>ENROLLMENT PORTAL</Typography>
          </Box>
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            bgcolor: "#e0f2f1", 
            borderRadius: "18px", 
            minWidth: { xs: '100%', md: 250 }, 
            textAlign: "center",
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="caption" sx={{ ...GLOBAL_FONT, fontWeight: 800, color: THEME_COLOR, letterSpacing: 1 }}>CURRENT INTAKE</Typography>
            <Typography variant="h6" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: THEME_COLOR }}>OPEN: 2026 FEB</Typography>
          </Box>
        </Stack>

        {activeStep < 5 ? (
          <>
            {/* PROGRESS BAR LOGIC */}
            {isMobile ? (
              <Box sx={{ mb: 5, textAlign: "center", px: 2 }}>
                <Typography variant="caption" sx={{ ...GLOBAL_FONT, fontWeight: 800, color: "#888", letterSpacing: 1, display: 'block', mb: 0.5 }}>
                  STEP {activeStep + 1} OF {steps.length}
                </Typography>
                <Typography variant="h6" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: THEME_COLOR, mb: 2 }}>
                  {steps[activeStep]}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={((activeStep + 1) / steps.length) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: '#e0f2f1',
                    '& .MuiLinearProgress-bar': { bgcolor: THEME_COLOR, borderRadius: 4 }
                  }} 
                />
              </Box>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto', mb: { xs: 6, md: 10 }, scrollbarWidth: 'none' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel sx={{ "& .MuiStepLabel-label": { ...GLOBAL_FONT, fontWeight: 700, fontSize: "0.75rem" } }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}

            <Box sx={{ minHeight: { xs: 400, md: 500 } }}>
              {activeStep === 0 && renderInquiry()}
              {activeStep === 1 && renderPersonal()}
              {activeStep === 2 && renderPageGuardian()}
              {activeStep === 3 && renderAcademic()}
              {activeStep === 4 && renderFinal()}
            </Box>

            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column-reverse", sm: "row" }, 
              gap: 2, 
              justifyContent: "space-between", 
              mt: { xs: 6, md: 10 }, 
              pt: 5, 
              borderTop: "2px solid #f0f0f0" 
            }}>
              <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<BackIcon />} sx={{ ...GLOBAL_FONT, fontWeight: 800, px: 5, py: 1.5 }}>Back</Button>
              <Button 
                variant="contained" 
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} 
                disabled={isSubmitting || (activeStep === 4 && !formData.termsAccepted)}
                endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <NextIcon />}
                sx={{ 
                  bgcolor: THEME_COLOR, 
                  ...GLOBAL_FONT, 
                  fontWeight: 900, 
                  px: { xs: 4, sm: 8 }, 
                  py: 2, 
                  borderRadius: "50px", 
                  boxShadow: "0 12px 24px rgba(0,77,64,0.3)",
                  '&:hover': { bgcolor: '#00332a' }
                }}
              >
                {activeStep === 4 ? "Submit Now" : "Continue"}
              </Button>
            </Box>
          </>
        ) : (
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", py: { xs: 8, md: 15 } }}>
              <CheckCircleIcon sx={{ fontSize: { xs: 100, md: 150 }, color: "#4caf50", mb: 4 }} />
              <Typography variant="h3" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: THEME_COLOR, mb: 3 }}>Submitted!</Typography>
              <Typography sx={{ ...GLOBAL_FONT, color: "#555", mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 2 }}>
                Thank you, <strong>{formData.fullName}</strong>. Your academic application for <strong>{formData.programme}</strong> is now being processed by the admissions committee.
              </Typography>
              <Button variant="outlined" size="large" onClick={() => window.location.reload()} sx={{ ...GLOBAL_FONT, borderRadius: "50px", px: 6, py: 2, borderWidth: 2, fontWeight: 800 }}>Close Portal</Button>
            </Box>
          </Fade>
        )}
      </Paper>
      
      <Box sx={{ textAlign: "center", mt: 8, px: 4 }}>
        <Typography variant="caption" sx={{ color: "#777", ...GLOBAL_FONT, fontSize: '0.7rem', display: 'block', lineHeight: 2 }}>
          © 2026 {CAMPUS_NAME} INTERNATIONAL EDUCATION GROUP • SECURE SSL ENCRYPTION <br/>
          GOVERNED BY INTERNATIONAL PRIVACY STANDARDS & LOCAL DATA PROTECTION ACTS.
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentRegistration;