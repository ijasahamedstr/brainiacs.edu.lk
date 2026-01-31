import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
  Box, Typography, TextField, Button, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, 
  Paper, Stack, Divider, Stepper, Step, StepLabel,
  InputAdornment, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Alert, Collapse, MenuItem, Select, InputLabel, FormHelperText
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedUserIcon,
  Delete as DeleteIcon,
  Attachment as AttachmentIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  ErrorOutline as ErrorIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

// Configuration & Global Styles
const CAMPUS_NAME = "BRAINIACS Campus";
const THEME_COLOR = "#004d40"; 
const API_URL = `${import.meta.env.VITE_API_URL}/students/register`;

const GLOBAL_FONT = {
  fontFamily: "'Montserrat', sans-serif",
};

// Comprehensive Input Styling for all TextFields
const inputSx = {
  "& .MuiInputBase-root": GLOBAL_FONT,
  "& .MuiInputLabel-root": { ...GLOBAL_FONT, fontWeight: 500 },
  "& .MuiFormHelperText-root": GLOBAL_FONT,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderRadius: "10px" },
    "&.Mui-focused fieldset": { borderColor: THEME_COLOR },
  },
  mb: 2
};

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ["Inquiry Info", "Personal Identity", "Guardian/Emergency", "Academic Grid", "Uploads & Policy"];

  // --- EXTENDED FORM STATE ---
  const [formData, setFormData] = useState({
    programme: "",
    branch: "Colombo",
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

  // Table Data Structures
  const [olRows, setOlRows] = useState(Array(10).fill(null).map(() => ({ y1: "", s1: "", g1: "", y2: "", s2: "", g2: "" })));
  const [alRows, setAlRows] = useState(Array(4).fill(null).map(() => ({ subject: "", grade: "", year: "", attempt: "" })));
  const [otherQuals] = useState(Array(4).fill(null).map(() => ({ name: "", year: "", body: "", grade: "" })));

  // --- VALIDATION LOGIC ---
  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    if (activeStep === 0) {
      if (!formData.programme) newErrors.programme = "Programme selection is required";
    }
    if (activeStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is mandatory";
      if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
      if (formData.mobile.length < 9) newErrors.mobile = "Valid mobile number required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleTableChange = (setter: any, state: any, index: number, field: string, value: string) => {
    const updated = [...state];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

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
    setIsSubmitting(true);
    const data = new FormData();
    const payload = { ...formData, olRows, alRows, otherQuals };
    data.append("data", JSON.stringify(payload));
    selectedFiles.forEach(file => data.append("documents", file));

    try {
      const res = await fetch(API_URL, { method: "POST", body: data });
      if (res.ok) setActiveStep(5);
      else alert("Submission failed. Check network logs.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- REUSABLE COMPONENTS ---
  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <Box sx={{ bgcolor: THEME_COLOR, color: "white", p: 2, mb: 4, borderRadius: "12px", display: "flex", alignItems: "center", boxShadow: "0 6px 15px rgba(0,77,64,0.15)" }}>
      <Icon sx={{ mr: 2 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 800, ...GLOBAL_FONT, textTransform: 'uppercase' }}>{title}</Typography>
    </Box>
  );

  const CustomTableCell = ({ children, isHeader = false }: { children: any, isHeader?: boolean }) => (
    <TableCell sx={{ 
      border: `1px solid ${isHeader ? THEME_COLOR : "#eee"}`, 
      p: isHeader ? 1.5 : 0, 
      bgcolor: isHeader ? "#f8faf9" : "transparent",
      textAlign: "center",
      ...GLOBAL_FONT,
      fontWeight: isHeader ? 900 : 400,
      fontSize: isHeader ? "0.75rem" : "0.85rem"
    }}>
      {children}
    </TableCell>
  );

  // --- STEP RENDERERS ---

  const renderInquiry = () => (
    <Stack spacing={2}>
      <SectionHeader icon={BusinessIcon} title="Step 01: Application Intent" />
      <TextField select label="Preferred Campus Branch" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} sx={inputSx} fullWidth>
        {["Colombo", "Kandy", "Galle", "Jaffna", "Online"].map(c => <MenuItem key={c} value={c} sx={GLOBAL_FONT}>{c}</MenuItem>)}
      </TextField>
      <TextField 
        fullWidth 
        label="Academic Programme" 
        placeholder="e.g. BEng (Hons) Software Engineering" 
        value={formData.programme} 
        onChange={(e) => handleInputChange("programme", e.target.value)} 
        error={!!errors.programme}
        helperText={errors.programme}
        sx={inputSx} 
      />
      <Stack direction="row" spacing={2}>
        <TextField select fullWidth label="Intake Period" value={formData.intake} onChange={(e) => handleInputChange("intake", e.target.value)} sx={inputSx}>
          {["2026 February", "2026 June", "2026 October"].map(i => <MenuItem key={i} value={i} sx={GLOBAL_FONT}>{i}</MenuItem>)}
        </TextField>
      </Stack>
    </Stack>
  );

  const renderPersonal = () => (
    <Stack spacing={3}>
      <SectionHeader icon={PersonIcon} title="Step 02: Student Identity" />
      <TextField fullWidth label="Full Name (Capital Letters)" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} error={!!errors.fullName} sx={inputSx} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth label="Initials" value={formData.initials} onChange={(e) => handleInputChange("initials", e.target.value)} sx={inputSx} />
        <FormControl fullWidth sx={{ border: "1px solid #ddd", borderRadius: "10px", p: 1 }}>
          <FormLabel sx={{ ...GLOBAL_FONT, fontSize: "0.7rem", fontWeight: 700, color: THEME_COLOR }}>GENDER</FormLabel>
          <RadioGroup row value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
            <FormControlLabel value="male" control={<Radio size="small" />} label={<Typography sx={GLOBAL_FONT}>Male</Typography>} />
            <FormControlLabel value="female" control={<Radio size="small" />} label={<Typography sx={GLOBAL_FONT}>Female</Typography>} />
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
      <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} error={!!errors.email} sx={inputSx} />
    </Stack>
  );

  const renderGuardian = () => (
    <Stack spacing={3}>
      <SectionHeader icon={VerifiedUserIcon} title="Step 03: Emergency Contact" />
      <TextField fullWidth label="Guardian Full Name" value={formData.guardianName} onChange={(e) => handleInputChange("guardianName", e.target.value)} sx={inputSx} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth label="Relationship" value={formData.guardianRelationship} onChange={(e) => handleInputChange("guardianRelationship", e.target.value)} placeholder="e.g. Father, Mother" sx={inputSx} />
        <TextField fullWidth label="Guardian Contact" value={formData.guardianMobile} onChange={(e) => handleInputChange("guardianMobile", e.target.value)} sx={inputSx} />
      </Stack>
      <TextField fullWidth multiline rows={2} label="Residential Address" value={formData.guardianAddress} onChange={(e) => handleInputChange("guardianAddress", e.target.value)} sx={inputSx} />
    </Stack>
  );

  const renderAcademic = () => (
    <Box>
      <SectionHeader icon={SchoolIcon} title="Step 04: Academic History" />
      
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, ...GLOBAL_FONT, color: THEME_COLOR }}>GCE ORDINARY LEVEL (O/L)</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #ddd", borderRadius: "10px", mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <CustomTableCell isHeader>EXAM</CustomTableCell>
              {["Year", "Subject", "Grade", "Year", "Subject", "Grade"].map((h, i) => <CustomTableCell key={i} isHeader>{h}</CustomTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {olRows.map((row, i) => (
              <TableRow key={i}>
                {i === 0 && (
                  <TableCell rowSpan={10} sx={{ borderRight: "1px solid #ddd", width: 120 }}>
                    <FormGroup>
                      {["Local", "London"].map(l => (
                        <FormControlLabel key={l} control={<Checkbox size="small" checked={formData.olExamTypes.includes(l)} onChange={() => handleCheckboxGroup("olExamTypes", l)} />} label={<Typography sx={{ fontSize: '0.7rem', ...GLOBAL_FONT }}>{l}</Typography>} />
                      ))}
                    </FormGroup>
                  </TableCell>
                )}
                {["y1", "s1", "g1", "y2", "s2", "g2"].map(f => (
                  <CustomTableCell key={f}>
                    <input style={{ border: 'none', textAlign: 'center', width: '100%', padding: '10px 0', ...GLOBAL_FONT }} value={(row as any)[f]} onChange={(e) => handleTableChange(setOlRows, olRows, i, f, e.target.value)} />
                  </CustomTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, ...GLOBAL_FONT, color: THEME_COLOR }}>GCE ADVANCED LEVEL (A/L)</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="A/L Stream" fullWidth value={formData.alStream} onChange={(e) => handleInputChange("alStream", e.target.value)} sx={inputSx} />
      </Stack>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #ddd", borderRadius: "10px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Subject Name", "Grade", "Year", "Attempt"].map(h => <CustomTableCell key={h} isHeader>{h}</CustomTableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {alRows.map((row, i) => (
              <TableRow key={i}>
                {["subject", "grade", "year", "attempt"].map(f => (
                  <CustomTableCell key={f}>
                    <input style={{ border: 'none', textAlign: 'center', width: '100%', padding: '10px 0', ...GLOBAL_FONT }} value={(row as any)[f]} onChange={(e) => handleTableChange(setAlRows, alRows, i, f, e.target.value)} />
                  </CustomTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderFinal = () => (
    <Stack spacing={4}>
      <SectionHeader icon={CloudUploadIcon} title="Step 05: Verification" />
      
      <Box sx={{ p: 4, border: "2px dashed #ccc", borderRadius: "15px", textAlign: "center", bgcolor: "#fdfdfd" }}>
        <CloudUploadIcon sx={{ fontSize: 50, color: THEME_COLOR, mb: 2 }} />
        <Typography sx={{ ...GLOBAL_FONT, mb: 2, fontWeight: 600 }}>Drag and drop certificates or click to upload</Typography>
        <Button variant="contained" component="label" sx={{ ...GLOBAL_FONT, bgcolor: THEME_COLOR, borderRadius: "50px" }}>
          Choose Files
          <input type="file" hidden multiple onChange={handleFileChange} />
        </Button>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
          {selectedFiles.map((f, i) => <Chip key={i} label={f.name} onDelete={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} icon={<AttachmentIcon />} sx={GLOBAL_FONT} />)}
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ p: 3, bgcolor: "#f1f8e9", border: "1px solid #c5e1a5", borderRadius: "15px" }}>
        <Typography variant="h6" sx={{ ...GLOBAL_FONT, fontWeight: 800, color: "#2e7d32", mb: 1 }}>Student Declaration</Typography>
        <Typography variant="body2" sx={{ ...GLOBAL_FONT, lineHeight: 1.8, mb: 3 }}>
          I, the undersigned, hereby declare that the information provided is true and accurate. I understand that the campus 
          reserves the right to terminate my registration if any information is found to be false. I also accept the fee structure.
        </Typography>
        <Stack spacing={1}>
          <FormControlLabel control={<Checkbox checked={formData.termsAccepted} onChange={(e) => handleInputChange("termsAccepted", e.target.checked)} />} label={<Typography sx={{ ...GLOBAL_FONT, fontSize: '0.8rem', fontWeight: 700 }}>I agree to the General Terms and Conditions</Typography>} />
          <FormControlLabel control={<Checkbox checked={formData.privacyConsent} onChange={(e) => handleInputChange("privacyConsent", e.target.checked)} />} label={<Typography sx={{ ...GLOBAL_FONT, fontSize: '0.8rem', fontWeight: 700 }}>I consent to the Privacy Policy and Data Handling</Typography>} />
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5", py: 8, px: 2 }}>
      <Paper elevation={15} sx={{ maxWidth: 1100, mx: "auto", p: { xs: 4, md: 8 }, borderRadius: "30px" }}>
        
        {/* BRANDING */}
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: THEME_COLOR, ...GLOBAL_FONT, letterSpacing: -2 }}>{CAMPUS_NAME.split(' ')[0]}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#4caf50", ...GLOBAL_FONT, mt: -1 }}>ACADEMIC ENROLLMENT PORTAL</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: "#e0f2f1", borderRadius: "15px", mt: { xs: 2, md: 0 } }}>
            <Typography variant="caption" sx={{ ...GLOBAL_FONT, fontWeight: 800, display: "block", color: THEME_COLOR }}>REGISTRATION STATUS</Typography>
            <Typography variant="h6" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: THEME_COLOR }}>OPEN: INTAKE 2026</Typography>
          </Box>
        </Stack>

        {activeStep < 5 ? (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel sx={{ "& .MuiStepLabel-label": { ...GLOBAL_FONT, fontWeight: 700, fontSize: "0.75rem" } }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 6 }} />

            <Box sx={{ minHeight: 400 }}>
              {activeStep === 0 && renderInquiry()}
              {activeStep === 1 && renderPersonal()}
              {activeStep === 2 && renderGuardian()}
              {activeStep === 3 && renderAcademic()}
              {activeStep === 4 && renderFinal()}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 8, pt: 4, borderTop: "2px solid #f5f5f5" }}>
              <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<BackIcon />} sx={{ ...GLOBAL_FONT, fontWeight: 800, px: 4 }}>Back</Button>
              <Button 
                variant="contained" 
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} 
                disabled={isSubmitting || (activeStep === 4 && !formData.termsAccepted)}
                endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <NextIcon />}
                sx={{ bgcolor: THEME_COLOR, ...GLOBAL_FONT, fontWeight: 900, px: 6, py: 1.5, borderRadius: "50px", boxShadow: "0 10px 20px rgba(0,77,64,0.2)" }}
              >
                {activeStep === 4 ? "Submit Application" : "Save & Continue"}
              </Button>
            </Box>
          </>
        ) : (
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", py: 10 }}>
              <CheckCircleIcon sx={{ fontSize: 120, color: "#4caf50", mb: 4 }} />
              <Typography variant="h3" sx={{ ...GLOBAL_FONT, fontWeight: 900, color: THEME_COLOR, mb: 2 }}>Submission Success!</Typography>
              <Typography sx={{ ...GLOBAL_FONT, color: "#666", mb: 6, fontSize: "1.1rem" }}>
                Thank you, <strong>{formData.fullName}</strong>. Your registration for <strong>{formData.programme}</strong> has been logged. 
                Reference ID: #BRN-2026-{Math.floor(Math.random() * 9000) + 1000}.
              </Typography>
              <Button variant="outlined" onClick={() => window.location.reload()} sx={{ ...GLOBAL_FONT, borderRadius: "50px", px: 4 }}>Start New Entry</Button>
            </Box>
          </Fade>
        )}
      </Paper>
      
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 6, color: "#999", ...GLOBAL_FONT }}>
        © 2026 {CAMPUS_NAME} INTERNATIONAL. ENCRYPTED DATA TRANSMISSION PROTOCOL V4.2 <br/>
        SENSITIVE INFORMATION IS HANDLED ACCORDING TO GDPR AND LOCAL PRIVACY LAWS.
      </Typography>
    </Box>
  );
};

export default StudentRegistration;