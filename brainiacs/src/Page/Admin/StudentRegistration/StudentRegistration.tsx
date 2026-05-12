import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, Pagination, Dialog, DialogContent, 
  DialogActions, Tooltip, Checkbox, Chip, Divider,
  ToggleButtonGroup, ToggleButton, 
  Snackbar, Alert, Breadcrumbs, Link, ThemeProvider, createTheme,
  Card, CardContent
} from "@mui/material";
import { 
  DeleteOutline, SearchOutlined, VisibilityOutlined, 
  FileDownloadOutlined, RefreshOutlined, SchoolOutlined,
  EmailOutlined, PhoneIphoneOutlined, HomeOutlined, PersonOutline,
  BadgeOutlined, PublicOutlined, EscalatorWarningOutlined, 
  NavigateNext, HistoryToggleOffOutlined,
  GridViewOutlined, ViewListOutlined, CheckCircleOutline, CloseOutlined,
  WarningAmberRounded, InfoOutlined, AssignmentIndOutlined
} from "@mui/icons-material";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "STUDENT_REGISTRY_VAULT";
const PRIMARY_TEAL = "#004652";

// Create a strict Montserrat theme override
const montserratTheme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    allVariants: { fontFamily: "'Montserrat', sans-serif" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
    MuiTableCell: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
  }
});

// --- INTERFACES ---
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
  // 1. STATE MANAGEMENT (HYDRATED INSTANTLY FROM CACHE)
  const [data, setData] = useState<Student[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [viewingItem, setViewingRequest] = useState<Student | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // View & Selection States
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selected, setSelected] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const rowsPerPage = viewMode === "grid" ? 8 : 8; 

  // 2. SILENT BACKGROUND FETCH LOGIC (NO LOADING SPINNERS)
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const result = await response.json();
      
      if (result.success) {
        const fetchedData: Student[] = result.data;
        const newDataString = JSON.stringify(fetchedData);
        const currentCache = localStorage.getItem(CACHE_KEY);

        if (currentCache !== newDataString) {
          setData(fetchedData);
          localStorage.setItem(CACHE_KEY, newDataString);
        }
        setSyncStatus("online");
      }
    } catch (error) {
      setSyncStatus("offline");
    }
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(() => fetchData(), 3000); // Silent polling every 3 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  // 3. OPTIMISTIC ACTION HANDLERS
  const triggerSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async () => {
    const targetId = deleteDialog.id;
    if (!targetId) return;

    const targetName = data.find(s => s._id === targetId)?.fullName || "Unknown Student";
    const updated = data.filter(s => s._id !== targetId);
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    setDeleteDialog({ open: false, id: null });
    setSelected(prev => prev.filter(id => id !== targetId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Registration purged successfully", "success");
      setHistory(prev => [`Deleted Record: ${targetName}`, ...prev].slice(0, 8));
    } catch {
      fetchData(); // Revert
      triggerSnackbar("Deletion failed on server. Restoring.", "error");
    }
  };

  const handleBulkDelete = async () => {
    const updated = data.filter(s => !selected.includes(s._id));
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    
    const count = selected.length;
    const deletedIds = [...selected];
    setSelected([]);
    triggerSnackbar(`Purging ${count} registration records...`, "success");
    setHistory(prev => [`Bulk deleted ${count} students`, ...prev].slice(0, 8));

    deletedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/students/${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Failed to delete", id);
        }
    });
  };

  // 4. LOGIC HELPERS
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? paginatedData.map(n => n._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    return data.filter((s) => 
      s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nic?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const renderAcademicTable = (title: string, rows: AcademicRow[], isOL: boolean = false) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: PRIMARY_TEAL, fontSize: '0.9rem', textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "12px", border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Subject</TableCell>
              {isOL ? (
                <>
                  <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Attempt 1 (Yr/Index/Grd)</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Attempt 2 (Yr/Index/Grd)</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Grade</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748B' }}>Attempt</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ fontWeight: 600 }}>{row.subject || "-"}</TableCell>
                {isOL ? (
                  <>
                    <TableCell>{row.y1 || "-"}/{row.s1 || "-"}/{row.g1 || "-"}</TableCell>
                    <TableCell>{row.y2 || "-"}/{row.s2 || "-"}/{row.g2 || "-"}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ fontWeight: 700, color: PRIMARY_TEAL }}>{row.grade || "-"}</TableCell>
                    <TableCell>{row.year || "-"}</TableCell>
                    <TableCell>{row.attempt || "-"}</TableCell>
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
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* --- BREADCRUMBS & TOP NAVIGATION --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>ACADEMIC AFFAIRS</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Student Registry
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: syncStatus === 'online' ? '#10B981' : '#EF4444' }} />
               <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: "#64748B", letterSpacing: 0.5 }}>
                 {syncStatus === 'online' ? 'LIVE DATABASE SYNC' : 'OFFLINE MODE'}
               </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button 
              size="medium" variant="outlined" onClick={fetchData}
              startIcon={<RefreshOutlined fontSize="small" />}
              sx={{ color: PRIMARY_TEAL, borderColor: PRIMARY_TEAL, borderRadius: "8px", px: 2, fontWeight: 700 }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* --- UTILITY CONTROL BAR --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <TextField
                fullWidth size="small" variant="standard"
                placeholder="Search by student name, email or NIC..."
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <SearchOutlined sx={{ mr: 1, color: PRIMARY_TEAL, fontSize: '1.2rem' }} />,
                  sx: { fontWeight: 600, fontSize: '0.85rem' }
                }}
              />
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: 1, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <ToggleButtonGroup
                    value={viewMode} exclusive
                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                >
                    <ToggleButton value="table" sx={{ px: 2, "&.Mui-selected": { bgcolor: PRIMARY_TEAL, color: 'white' } }}>
                        <ViewListOutlined fontSize="small" sx={{ mr: 1 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>TABLE</Typography>
                    </ToggleButton>
                    <ToggleButton value="grid" sx={{ px: 2, "&.Mui-selected": { bgcolor: PRIMARY_TEAL, color: 'white' } }}>
                        <GridViewOutlined fontSize="small" sx={{ mr: 1 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>GRID</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>
          </Box>
        </Stack>

        {/* --- VIEW MODE SWITCHER --- */}
        <Box sx={{ position: 'relative', minHeight: '400px' }}>
            <AnimatePresence mode="wait">
                {viewMode === "table" ? (
                    <motion.div key="table-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                        <Table size="medium" sx={{ minWidth: 1000 }}>
                            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                <Checkbox size="small" indeterminate={selected.length > 0 && selected.length < paginatedData.length} checked={paginatedData.length > 0 && selected.length === paginatedData.length} onChange={handleSelectAll} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>STUDENT IDENTITY</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>PROGRAMME / INTAKE</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>CONTACT INFO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", pr: 4, letterSpacing: 0.5 }}>CONTROLS</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((s) => (
                                <TableRow key={s._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                    <Checkbox size="small" checked={selected.includes(s._id)} onChange={() => handleSelectOne(s._id)} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: PRIMARY_TEAL, fontWeight: 800, borderRadius: '10px' }}>{s.fullName[0]}</Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem" }}>{s.fullName}</Typography>
                                                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>NIC: {s.nic || "N/A"}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#475569" }}>{s.programme}</Typography>
                                        <Chip label={s.intake} size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#F0F5F6', color: PRIMARY_TEAL }} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.2}>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIphoneOutlined sx={{ fontSize: 14 }} /> {s.mobile}
                                          </Typography>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailOutlined sx={{ fontSize: 14 }} /> {s.email}
                                          </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="View Profile">
                                            <IconButton onClick={() => setViewingRequest(s)} size="small" sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9' }}>
                                              <VisibilityOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: s._id })} size="small" sx={{ color: "#EF4444", bgcolor: '#FEF2F2' }}>
                                              <DeleteOutline fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </motion.div>
                ) : (
                    <motion.div key="grid-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {paginatedData.map((s) => (
                                <Box key={s._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                        <Box sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#F8FAFC', position: 'relative' }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox size="small" checked={selected.includes(s._id)} onChange={() => handleSelectOne(s._id)} />
                                            </Box>
                                            <Avatar sx={{ width: 64, height: 64, bgcolor: PRIMARY_TEAL, fontSize: '1.5rem', fontWeight: 800, mb: 2 }}>{s.fullName[0]}</Avatar>
                                            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E293B', textAlign: 'center', lineHeight: 1.2 }}>{s.fullName}</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: PRIMARY_TEAL, mt: 1 }}>{s.programme}</Typography>
                                        </Box>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack spacing={1}>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EmailOutlined sx={{ fontSize: 14 }} /> {s.email}
                                                </Typography>
                                            </Stack>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8' }}>{s.intake}</Typography>
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => setViewingRequest(s)} sx={{ color: PRIMARY_TEAL }}><VisibilityOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: s._id })} sx={{ color: "#EF4444" }}><DeleteOutline fontSize="small" /></IconButton>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>

        {/* --- FOOTER & PAGINATION --- */}
        <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: "#64748B" }}>
                    TOTAL REGISTERED: {filteredData.length}
                </Typography>
                <AnimatePresence>
                    {selected.length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <Button 
                                size="small" variant="contained" color="error" 
                                onClick={handleBulkDelete}
                                startIcon={<DeleteOutline sx={{ fontSize: '1rem' }} />} 
                                sx={{ fontWeight: 700, fontSize: '0.7rem', px: 2, borderRadius: '6px' }}
                            >
                                DELETE SELECTED ({selected.length})
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Stack>
            <Pagination 
                count={Math.ceil(filteredData.length / rowsPerPage)} 
                page={page} onChange={(_, v) => setPage(v)} size="medium"
                sx={{ "& .Mui-selected": { bgcolor: `${PRIMARY_TEAL} !important`, color: "#FFF", fontWeight: 800 } }}
            />
        </Paper>

        {/* --- RECENT ACTIVITY LOG --- */}
        <Box sx={{ mt: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <HistoryToggleOffOutlined sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: PRIMARY_TEAL, letterSpacing: 0.5 }}>RECENT ACTIVITY</Typography>
            </Stack>
            {history.length === 0 ? (
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic' }}>No administrative actions recorded in this session.</Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {history.map((log, idx) => (
                  <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutline sx={{ fontSize: 16, color: '#10B981' }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>{log}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* --- FULL PROFILE DIALOG --- */}
        <Dialog 
          open={Boolean(viewingItem)} 
          onClose={() => setViewingRequest(null)} 
          maxWidth="md" fullWidth 
          PaperProps={{ sx: { borderRadius: "24px", overflow: 'hidden' } }}
        >
          {viewingItem && (
            <Box>
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography sx={{ fontWeight: 900, color: PRIMARY_TEAL, fontSize: "1.2rem", letterSpacing: -0.5 }}>Student Enrollment Profile</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>REFERENCE ID: {viewingItem._id}</Typography>
                </Box>
                <IconButton onClick={() => setViewingRequest(null)} size="small" sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0' }}><CloseOutlined fontSize="small" /></IconButton>
              </Box>

              <DialogContent sx={{ p: 0, maxHeight: '75vh', overflowY: 'auto' }}>
                <Box sx={{ p: 4 }}>
                  {/* Intent & Academic Header */}
                  <Stack direction={{xs: 'column', md: 'row'}} spacing={4} mb={4}>
                      <Box flex={1}>
                          <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL, mb: 1, display: 'block' }}>Application Intent</Typography>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: '#F1F5F9', border: 'none' }}>
                              <Stack spacing={1}>
                                  <Box display="flex" gap={1.5} alignItems="center">
                                      <SchoolOutlined sx={{ color: PRIMARY_TEAL }} />
                                      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{viewingItem.programme}</Typography>
                                  </Box>
                                  <Box display="flex" gap={1.5} alignItems="center">
                                      <AssignmentIndOutlined sx={{ color: PRIMARY_TEAL }} />
                                      <Typography sx={{ fontWeight: 700, color: '#475569' }}>Intake: {viewingItem.intake || "Not Specified"}</Typography>
                                  </Box>
                              </Stack>
                          </Paper>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL, mb: 1, display: 'block' }}>Verification Status</Typography>
                        <Stack spacing={1}>
                            <Chip 
                              label={viewingItem.termsAccepted ? "Terms Accepted" : "Terms Pending"} 
                              color={viewingItem.termsAccepted ? "success" : "error"}
                              icon={<CheckCircleOutline />}
                              sx={{ fontWeight: 800 }}
                            />
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>Registered: {new Date(viewingItem.createdAt).toLocaleString()}</Typography>
                        </Stack>
                      </Box>
                  </Stack>

                  {/* Personal Info */}
                  <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL }}>Identity & Contact</Typography>
                  <GridContainer>
                      <InfoBlock icon={<PersonOutline />} label="Full Name" value={viewingItem.fullName} />
                      <InfoBlock icon={<BadgeOutlined />} label="NIC / Passport" value={viewingItem.nic || "N/A"} />
                      <InfoBlock icon={<PublicOutlined />} label="Nationality" value={viewingItem.nationality} />
                      <InfoBlock icon={<PhoneIphoneOutlined />} label="Mobile / WhatsApp" value={`${viewingItem.mobile} / ${viewingItem.whatsapp || "N/A"}`} />
                      <InfoBlock icon={<EmailOutlined />} label="Personal Email" value={viewingItem.email} />
                      <InfoBlock icon={<HomeOutlined />} label="Residential Area" value={`${viewingItem.permanentAddress}, ${viewingItem.postalCity}`} />
                  </GridContainer>

                  <Divider sx={{ my: 4 }} />

                  {/* Guardian */}
                  <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL }}>Guardian Information</Typography>
                  <GridContainer>
                      <InfoBlock icon={<EscalatorWarningOutlined />} label="Guardian Name" value={viewingItem.guardianName || "N/A"} />
                      <InfoBlock icon={<InfoOutlined />} label="Relationship" value={viewingItem.guardianRelationship || "N/A"} />
                      <InfoBlock icon={<PhoneIphoneOutlined />} label="Guardian Mobile" value={viewingItem.guardianMobile || "N/A"} />
                  </GridContainer>

                  <Divider sx={{ my: 4 }} />

                  {/* Academics */}
                  {renderAcademicTable("Ordinary Level (O/L)", viewingItem.olRows, true)}
                  {renderAcademicTable(`Advanced Level (A/L) - ${viewingItem.alStream}`, viewingItem.alRows, false)}
                  
                  {viewingItem.otherQuals && viewingItem.otherQuals.length > 0 && 
                    renderAcademicTable("Other Qualifications", viewingItem.otherQuals, false)
                  }

                  <Divider sx={{ my: 4 }} />

                  {/* Documents */}
                  <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL, mb: 2, display: 'block' }}>Submitted Documents</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {viewingItem.documents.map((doc, i) => (
                      <Button 
                        key={i} variant="contained" size="small" startIcon={<FileDownloadOutlined />}
                        href={`${API_BASE_URL}/${doc.filePath}`} target="_blank"
                        sx={{ bgcolor: "#F1F5F9", color: PRIMARY_TEAL, mb: 1, border: '1px solid #E2E8F0', boxShadow: 'none', '&:hover': { bgcolor: '#E2E8F0' } }}
                      >
                        {doc.fileName.split('-').pop()}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC' }}>
                <Button onClick={() => setViewingRequest(null)} fullWidth variant="contained" sx={{ bgcolor: PRIMARY_TEAL, py: 1.2, borderRadius: "10px" }}>Dismiss Profile</Button>
              </DialogActions>
            </Box>
          )}
        </Dialog>

        {/* --- DELETE CONFIRMATION --- */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: '380px' } }}>
          <Box textAlign="center" p={3}>
            <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <WarningAmberRounded sx={{ color: "#EF4444", fontSize: 36 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Confirm Data Purge</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently remove this student registration? This action cannot be reversed.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="large" onClick={() => setDeleteDialog({ open: false, id: null })} fullWidth variant="outlined" sx={{ color: "#64748B", borderColor: '#CBD5E1' }}>Abort</Button>
              <Button size="large" onClick={handleDelete} fullWidth variant="contained" sx={{ bgcolor: "#EF4444", "&:hover": { bgcolor: '#DC2626' } }}>Purge Record</Button>
            </Stack>
          </Box>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "8px", fontWeight: 700 }}>{snackbar.message}</Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
};

// --- HELPER SUB-COMPONENTS ---

const GridContainer = ({children}: {children: React.ReactNode}) => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 2, mb: 2 }}>
        {children}
    </Box>
);

const InfoBlock = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: '#F1F5F9', color: PRIMARY_TEAL, width: 32, height: 32 }}>{icon}</Avatar>
        <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>{label}</Typography>
            <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{value}</Typography>
        </Box>
    </Stack>
);

export default StudentRegistrationManager;