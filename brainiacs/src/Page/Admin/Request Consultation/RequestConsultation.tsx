import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, // ✅ Added Avatar import
  Button, TextField, MenuItem, InputAdornment, 
  Pagination, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Chip, Breadcrumbs, Link, ThemeProvider, createTheme, Snackbar, Alert
} from "@mui/material";
import { 
  SearchOutlined, EmailOutlined, ContactPhoneOutlined, SchoolOutlined, 
  CalendarMonthOutlined, VisibilityOutlined, CloseOutlined, SearchOffOutlined, 
  EditOutlined, BadgeOutlined, WorkspacePremiumOutlined, CheckCircleOutline,
  HourglassEmptyOutlined, InfoOutlined, NavigateNext, HistoryToggleOffOutlined
} from "@mui/icons-material";
import UpdateGuidance from "./UpdateGuidance";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "GUIDANCE_CONSULTATION_VAULT";
const PRIMARY_TEAL = "#004652";
const ACCENT_GOLD = "#CC9D2F";

// Create a strict Montserrat theme override
const montserratTheme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    allVariants: { fontFamily: "'Montserrat', sans-serif" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiTableCell: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
  }
});

interface Guidance {
  _id: string;
  firstName: string;
  lastName: string;
  qualification: string;
  programme: string;
  email: string;
  contact: string;
  status: 'Pending' | 'Closed';
  adminReply?: string;
  createdAt: string;
}

const RequestConsultation = () => {
  // 1. STATE MANAGEMENT (HYDRATED INSTANTLY FROM CACHE)
  const [requests, setRequests] = useState<Guidance[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [viewingRequest, setViewingRequest] = useState<Guidance | null>(null);
  const [editingRequest, setEditingRequest] = useState<Guidance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const rowsPerPage = 8;

  // 2. SILENT BACKGROUND FETCH LOGIC (NO LOADING SPINNERS)
  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guidance`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const fetchedData: Guidance[] = await response.json();
      
      const newDataString = JSON.stringify(fetchedData);
      const currentCache = localStorage.getItem(CACHE_KEY);

      if (currentCache !== newDataString) {
        setRequests(fetchedData);
        localStorage.setItem(CACHE_KEY, newDataString);
      }
      setSyncStatus("online");
    } catch (error) {
      setSyncStatus("offline");
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => fetchRequests(), 3000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  // 3. LOGIC HELPERS
  const filteredData = useMemo(() => {
    return requests.filter((r) => {
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
      const matchText = fullName.includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProg = programmeFilter === "All" || r.programme === programmeFilter;
      return matchText && matchProg;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, programmeFilter, requests]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const programmes = useMemo(() => {
    const progs = Array.from(new Set(requests.map(r => r.programme)));
    return ["All", ...progs];
  }, [requests]);

  const triggerSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ FIXED: Corrected type and callback logic for onBack
  if (editingRequest) {
    return (
      <ThemeProvider theme={montserratTheme}>
        <UpdateGuidance 
          data={editingRequest} 
          onBack={(wasUpdated?: boolean) => { 
            if(wasUpdated) {
                setHistory(prev => [`Processed Inquiry: ${editingRequest.firstName}`, ...prev].slice(0, 8));
                triggerSnackbar("Consultation updated successfully", "success");
            }
            setEditingRequest(null); 
            fetchRequests(); 
          }} 
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>STUDENT AFFAIRS</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Consultation Records
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: syncStatus === 'online' ? '#10B981' : '#EF4444' }} />
               <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: "#64748B", letterSpacing: 0.5 }}>
                 {syncStatus === 'online' ? 'LIVE SYNC ACTIVE' : 'OFFLINE MODE'}
               </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <TextField
                fullWidth size="small" variant="standard"
                placeholder="Search student by name or email..."
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
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "12px", border: "1px solid #E2E8F0", height: '100%' }}>
              <TextField
                select fullWidth size="small" variant="standard"
                label="Filter by Programme"
                value={programmeFilter}
                onChange={(e) => {setProgrammeFilter(e.target.value); setPage(1);}}
                InputProps={{ disableUnderline: true, sx: { fontWeight: 700, fontSize: '0.8rem', color: PRIMARY_TEAL } }}
                InputLabelProps={{ sx: { fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' } }}
              >
                {programmes.map((prog) => (
                  <MenuItem key={prog} value={prog} sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{prog}</MenuItem>
                ))}
              </TextField>
            </Paper>
          </Box>
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <Table size="medium">
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>STUDENT & STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>PROGRAMME</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>CONTACT INFO</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>REQUESTED DATE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", pr: 4, letterSpacing: 0.5 }}>CONTROLS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((req) => (
                  <TableRow 
                    key={req._id} component={motion.tr} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem" }}>
                        {req.firstName} {req.lastName}
                      </Typography>
                      <Chip 
                        size="small"
                        label={req.status || 'Pending'}
                        icon={req.status === 'Closed' ? <CheckCircleOutline sx={{ fontSize: '1rem !important' }} /> : <HourglassEmptyOutlined sx={{ fontSize: '1rem !important' }} />}
                        sx={{ 
                          mt: 0.5, height: 20, fontSize: '0.6rem',
                          bgcolor: req.status === 'Closed' ? '#ECFDF5' : '#FFF7ED',
                          color: req.status === 'Closed' ? '#10B981' : '#F97316'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SchoolOutlined sx={{ fontSize: 16, color: PRIMARY_TEAL }} />
                        <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#475569" }}>{req.programme}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailOutlined sx={{ fontSize: 14 }} /> {req.email}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ContactPhoneOutlined sx={{ fontSize: 14 }} /> {req.contact}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B" }}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Quick View">
                          <IconButton onClick={() => setViewingRequest(req)} size="small" sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9' }}>
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Process Inquiry">
                          <IconButton onClick={() => setEditingRequest(req)} size="small" sx={{ color: req.status === 'Closed' ? "#64748B" : ACCENT_GOLD, bgcolor: '#F1F5F9' }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          
          {paginatedData.length === 0 && (
             <Box sx={{ p: 8, textAlign: 'center', opacity: 0.5 }}>
                <SearchOffOutlined sx={{ fontSize: 48, mb: 1, color: "#94A3B8" }} />
                <Typography sx={{ fontWeight: 700, color: "#475569" }}>No consultation inquiries found</Typography>
             </Box>
          )}

          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", bgcolor: "#F8FAFC" }}>
            <Typography sx={{ color: "#64748B", fontWeight: 700, fontSize: "0.75rem" }}>
              TOTAL INQUIRIES: {filteredData.length}
            </Typography>
            <Pagination 
              count={Math.ceil(filteredData.length / rowsPerPage)} 
              page={page} 
              onChange={(_, v) => setPage(v)} 
              size="small"
              sx={{ '& .Mui-selected': { bgcolor: `${PRIMARY_TEAL} !important`, color: "#FFF" } }} 
            />
          </Box>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <HistoryToggleOffOutlined sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: PRIMARY_TEAL, letterSpacing: 0.5 }}>RECENT ACTIVITY</Typography>
            </Stack>
            {history.length === 0 ? (
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic' }}>No processing actions recorded in this session.</Typography>
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

        <Dialog 
          open={Boolean(viewingRequest)} 
          onClose={() => setViewingRequest(null)} 
          maxWidth="sm" fullWidth 
          PaperProps={{ sx: { borderRadius: "20px", overflow: 'hidden' } }}
        >
          {viewingRequest && (
            <Box>
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "1.1rem" }}>Inquiry Profile</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>REF: {viewingRequest._id}</Typography>
                </Box>
                <IconButton onClick={() => setViewingRequest(null)} size="small" sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0' }}><CloseOutlined fontSize="small" /></IconButton>
              </Box>

              <DialogContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Candidate Details</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                      <Avatar sx={{ bgcolor: PRIMARY_TEAL, width: 45, height: 45, fontWeight: 800 }}>{viewingRequest.firstName[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: "1.1rem" }}>{viewingRequest.firstName} {viewingRequest.lastName}</Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "0.8rem", fontWeight: 600 }}>Current Qualification: {viewingRequest.qualification}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Selected Pathway</Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" mt={1.5}>
                        <WorkspacePremiumOutlined sx={{ color: ACCENT_GOLD }} />
                        <Typography sx={{ fontWeight: 700, color: PRIMARY_TEAL }}>{viewingRequest.programme}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ bgcolor: "#F8FAFC", p: 2.5, borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                     <Stack spacing={1.5}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <EmailOutlined sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewingRequest.email}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <ContactPhoneOutlined sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewingRequest.contact}</Typography>
                        </Stack>
                     </Stack>
                  </Box>
                  {viewingRequest.adminReply && (
                    <Box sx={{ bgcolor: "#F0FDF4", p: 2.5, borderRadius: "12px", border: "1px solid #DCFCE7" }}>
                       <Typography variant="caption" sx={{ fontWeight: 800, color: "#16A34A", textTransform: "uppercase" }}>Administrative Note</Typography>
                       <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "#14532D", lineHeight: 1.6, fontWeight: 500 }}>{viewingRequest.adminReply}</Typography>
                    </Box>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC' }}>
                <Button onClick={() => setViewingRequest(null)} fullWidth variant="contained" sx={{ bgcolor: PRIMARY_TEAL, py: 1.2, borderRadius: "10px" }}>Dismiss View</Button>
              </DialogActions>
            </Box>
          )}
        </Dialog>

        <Snackbar 
          open={snackbar.open} autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "8px", fontWeight: 700 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
};

export default RequestConsultation;