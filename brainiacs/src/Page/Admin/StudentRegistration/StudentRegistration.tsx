import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon
} from "@mui/material";
import { 
  DeleteOutline, SearchOutlined, VisibilityOutlined, 
  FileDownloadOutlined, RefreshOutlined, SchoolOutlined,
  EmailOutlined, PhoneIphoneOutlined, HomeOutlined, PersonOutline,
  BadgeOutlined, PublicOutlined, EscalatorWarningOutlined, DescriptionOutlined
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// --- Interfaces based on Mongoose Schema ---
interface AcademicRow {
  subject?: string;
  grade?: string;
  year?: string;
  attempt?: string;
  y1?: string; s1?: string; g1?: string;
  y2?: string; s2?: string; g2?: string;
}

interface DocumentMetadata {
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedAt: string;
}

interface Student {
  _id: string;
  programme: string;
  intake?: string;
  fullName: string;
  initials: string;
  gender: string;
  dob: string;
  nationality: string;
  nic?: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  permanentAddress?: string;
  postalCity?: string;
  guardianName?: string;
  guardianMobile?: string;
  guardianAddress?: string;
  guardianRelationship?: string;
  guardianEmail?: string;
  olRows: AcademicRow[];
  alRows: AcademicRow[];
  otherQuals: AcademicRow[];
  olExamTypes: string[];
  alExamTypes: string[];
  alStream?: string;
  surveySource: string[];
  documents: DocumentMetadata[];
  termsAccepted: boolean;
  privacyConsent: boolean;
  createdAt: string;
}

const StudentRegistrationManager = () => {
  const [data, setData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingItem, setViewingItem] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`);
      const result = await response.json();
      if (response.ok && result.success) setData(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${itemToDelete}`, { method: "DELETE" });
      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== itemToDelete));
        setDeleteDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const filteredData = useMemo(() => {
    return data.filter((s) => 
      s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // Helper for Academic Tables inside Pop-up
  const renderAcademicTable = (title: string, rows: AcademicRow[], isOL: boolean = false) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 1, color: primaryTeal }}>
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "12px" }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Subject</TableCell>
              {isOL ? (
                <>
                  <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Attempt 1 (Yr/Index/Grd)</TableCell>
                  <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Attempt 2 (Yr/Index/Grd)</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Grade</TableCell>
                  <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Year</TableCell>
                  <TableCell sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Attempt</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ fontFamily: primaryFont }}>{row.subject || "-"}</TableCell>
                {isOL ? (
                  <>
                    <TableCell sx={{ fontFamily: primaryFont }}>{row.y1 || "-"}/{row.s1 || "-"}/{row.g1 || "-"}</TableCell>
                    <TableCell sx={{ fontFamily: primaryFont }}>{row.y2 || "-"}/{row.s2 || "-"}/{row.g2 || "-"}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ fontFamily: primaryFont }}>{row.grade || "-"}</TableCell>
                    <TableCell sx={{ fontFamily: primaryFont }}>{row.year || "-"}</TableCell>
                    <TableCell sx={{ fontFamily: primaryFont }}>{row.attempt || "-"}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh", fontFamily: primaryFont }}>
      
      {/* 1. HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Student Registry</Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B" }}>Official Enrollment Management Dashboard</Typography>
        </Box>
        <Button variant="outlined" onClick={fetchData} startIcon={<RefreshOutlined />} sx={{ borderRadius: "10px", fontFamily: primaryFont, color: primaryTeal, borderColor: primaryTeal, fontWeight: 700 }}>
          Refresh
        </Button>
      </Stack>

      {/* 2. SEARCH BAR */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0" }}>
        <TextField
          fullWidth size="small" placeholder="Search by name or email..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: primaryFont }
          }}
        />
      </Paper>

      {/* 3. MAIN TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>STUDENT</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>PROGRAMME</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>CONTACT</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress sx={{ color: primaryTeal }} /></TableCell></TableRow>
              ) : paginatedData.map((s) => (
                <TableRow component={motion.tr} layout key={s._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: primaryTeal, fontWeight: 700 }}>{s.fullName[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal }}>{s.fullName}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>{s.nic || "No NIC"}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", fontWeight: 600 }}>{s.programme}</Typography>
                    <Chip label={s.intake} size="small" sx={{ fontFamily: primaryFont, height: 20, fontSize: '0.65rem' }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem" }}>{s.mobile}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont }}>{s.email}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => setViewingItem(s)} sx={{ color: primaryTeal }}><VisibilityOutlined fontSize="small" /></IconButton>
                      <IconButton onClick={() => { setItemToDelete(s._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E" }}><DeleteOutline fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={Math.ceil(filteredData.length / rowsPerPage)} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      </TableContainer>

      {/* --- 4. VIEW POP-UP (FULL DATA) --- */}
      <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "24px" } }}>
        {viewingItem && (
          <>
            <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, p: 3 }}>
              Full Registration Profile
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: primaryFont }}>ID: {viewingItem._id}</Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                
                {/* Intent Section */}
                <Typography variant="overline" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>Application Intent</Typography>
                <List dense sx={{ mb: 2 }}>
                  <ListItem><ListItemIcon><SchoolOutlined /></ListItemIcon><ListItemText primary="Programme" secondary={viewingItem.programme} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><BadgeOutlined /></ListItemIcon><ListItemText primary="Intake" secondary={viewingItem.intake} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Identity Section */}
                <Typography variant="overline" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>Student Identity</Typography>
                <List dense sx={{ mb: 2 }}>
                  <ListItem><ListItemIcon><PersonOutline /></ListItemIcon><ListItemText primary="Full Name" secondary={viewingItem.fullName} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><PersonOutline /></ListItemIcon><ListItemText primary="Initials" secondary={viewingItem.initials} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><PublicOutlined /></ListItemIcon><ListItemText primary="Nationality / Gender / DOB" secondary={`${viewingItem.nationality} | ${viewingItem.gender} | ${viewingItem.dob}`} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><BadgeOutlined /></ListItemIcon><ListItemText primary="NIC Number" secondary={viewingItem.nic} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Contact & Address */}
                <Typography variant="overline" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>Contact & Address</Typography>
                <List dense sx={{ mb: 2 }}>
                  <ListItem><ListItemIcon><PhoneIphoneOutlined /></ListItemIcon><ListItemText primary="Mobile / WhatsApp" secondary={`${viewingItem.mobile} / ${viewingItem.whatsapp || 'N/A'}`} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><EmailOutlined /></ListItemIcon><ListItemText primary="Email Address" secondary={viewingItem.email} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><HomeOutlined /></ListItemIcon><ListItemText primary="Permanent Address" secondary={`${viewingItem.permanentAddress}, ${viewingItem.postalCity}`} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Guardian Section */}
                <Typography variant="overline" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>Guardian Details</Typography>
                <List dense sx={{ mb: 2 }}>
                  <ListItem><ListItemIcon><EscalatorWarningOutlined /></ListItemIcon><ListItemText primary="Name / Relationship" secondary={`${viewingItem.guardianName} (${viewingItem.guardianRelationship})`} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><PhoneIphoneOutlined /></ListItemIcon><ListItemText primary="Guardian Contact" secondary={`${viewingItem.guardianMobile} / ${viewingItem.guardianEmail || 'No Email'}`} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                  <ListItem><ListItemIcon><HomeOutlined /></ListItemIcon><ListItemText primary="Guardian Address" secondary={viewingItem.guardianAddress} primaryTypographyProps={{fontFamily: primaryFont, fontWeight: 700}} secondaryTypographyProps={{fontFamily: primaryFont}} /></ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                {/* Academic Records */}
                {renderAcademicTable("Ordinary Level (O/L) Results", viewingItem.olRows, true)}
                <Typography variant="caption" sx={{ fontFamily: primaryFont, display: 'block', mb: 2 }}>Exam Types: {viewingItem.olExamTypes.join(", ")}</Typography>
                
                {renderAcademicTable(`Advanced Level (A/L) Results - ${viewingItem.alStream}`, viewingItem.alRows, false)}
                <Typography variant="caption" sx={{ fontFamily: primaryFont, display: 'block', mb: 2 }}>Exam Types: {viewingItem.alExamTypes.join(", ")}</Typography>

                {viewingItem.otherQuals.length > 0 && renderAcademicTable("Other Qualifications", viewingItem.otherQuals, false)}

                <Divider sx={{ my: 3 }} />

                {/* Documents & Legal */}
                <Typography variant="overline" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>Verification & Documents</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 3 }}>
                  {viewingItem.documents.map((doc, i) => (
                    <Button key={i} variant="contained" size="small" startIcon={<FileDownloadOutlined />}
                      href={`${API_BASE_URL}/${doc.filePath}`} target="_blank"
                      sx={{ bgcolor: "#F1F5F9", color: "#475569", fontFamily: primaryFont, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#E2E8F0' } }}>
                      {doc.fileName.split('-').pop()}
                    </Button>
                  ))}
                </Stack>
                
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="body2" sx={{ fontFamily: primaryFont, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionOutlined fontSize="small" /> 
                    Survey Source: {viewingItem.surveySource.join(", ") || "None"}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: primaryFont, mt: 1, color: viewingItem.termsAccepted ? "green" : "red", fontWeight: 700 }}>
                    {viewingItem.termsAccepted ? "✓ Terms & Conditions Accepted" : "✗ Terms Not Accepted"}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
                    Registered On: {new Date(viewingItem.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ bgcolor: primaryTeal, fontFamily: primaryFont, fontWeight: 700, py: 1.5, borderRadius: "12px" }}>
                Close Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 5. DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily: primaryFont }}>Permanently remove this student record?</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ fontFamily: primaryFont, borderRadius: "8px" }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentRegistrationManager;