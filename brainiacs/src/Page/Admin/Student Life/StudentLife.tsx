import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, Pagination, Dialog, DialogContent, 
  DialogActions, AvatarGroup, Tooltip, Checkbox, 
  ToggleButtonGroup, ToggleButton, Snackbar, Alert, 
  Breadcrumbs, Link, ThemeProvider, createTheme, Card, CardMedia, CardContent
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, WarningAmberRounded, VisibilityOutlined, 
  DescriptionOutlined, CollectionsOutlined, FileDownloadOutlined,
   NavigateNext, 
  HistoryToggleOffOutlined, GridViewOutlined, ViewListOutlined, 
  CheckCircleOutline, CloseOutlined
} from "@mui/icons-material";

import CreateStudentLife from "./CreateStudentLife";
import UpdateStudentLife from "./UpdateStudentLife";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "STUDENT_LIFE_VAULT";
const PRIMARY_TEAL = "#004652";

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

interface StudentLife {
  _id: string;
  name: string;
  descriptions: string[]; 
  imageUrls: string[];
  createdAt: string;
}

const StudentLifeManager = () => {
  // 1. STATE MANAGEMENT (HYDRATED INSTANTLY FROM CACHE)
  const [data, setData] = useState<StudentLife[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentLife | null>(null);
  const [viewingItem, setViewingItem] = useState<StudentLife | null>(null);
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
      const response = await fetch(`${API_BASE_URL}/api/student-life`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const fetchedData: StudentLife[] = await response.json();
      
      const newDataString = JSON.stringify(fetchedData);
      const currentCache = localStorage.getItem(CACHE_KEY);

      // ONLY update state and trigger a re-render if database differs from cache
      if (currentCache !== newDataString) {
        setData(fetchedData);
        localStorage.setItem(CACHE_KEY, newDataString);
      }
      setSyncStatus("online");
    } catch (error) {
      setSyncStatus("offline");
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
    const interval = setInterval(() => fetchData(), 3000); // Silent polling every 3 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [viewMode, searchQuery]);

  // 3. OPTIMISTIC ACTION HANDLERS
  const triggerSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async () => {
    const targetId = deleteDialog.id;
    if (!targetId) return;

    // Optimistically update UI
    const updated = data.filter(s => s._id !== targetId);
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    setDeleteDialog({ open: false, id: null });
    setSelected(prev => prev.filter(id => id !== targetId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/student-life/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Section successfully purged", "success");
      setHistory(prev => [`Deleted Section: ${targetId.substring(0,6)}`, ...prev].slice(0, 8));
    } catch {
      fetchData(); // Revert if failed
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
    triggerSnackbar(`Purging ${count} sections...`, "success");
    setHistory(prev => [`Bulk deleted ${count} items`, ...prev].slice(0, 8));

    deletedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/student-life/${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Failed to delete", id);
        }
    });
  };

  const exportToCSV = () => {
    const headers = ["ID,Name,DescriptionsCount,ImagesCount,CreatedAt\n"];
    const rows = filteredData.map(item => 
      `${item._id},"${item.name}",${item.descriptions.length},${item.imageUrls.length},${item.createdAt}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-life-report.csv`;
    a.click();
    triggerSnackbar("CSV Report Downloaded", "success");
    setHistory(prev => [`Exported CSV Analytics`, ...prev].slice(0, 8));
  };

  // 4. LOGIC HELPERS
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? paginatedData.map(n => n._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // View Renders
  if (showAddForm) return <ThemeProvider theme={montserratTheme}><CreateStudentLife onBack={() => { setShowAddForm(false); fetchData(); }} /></ThemeProvider>;
  if (editingItem) return <ThemeProvider theme={montserratTheme}><UpdateStudentLife itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} /></ThemeProvider>;

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* --- BREADCRUMBS & TOP NAVIGATION --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>CAMPUS EXPERIENCE</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Student Life Manager
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: syncStatus === 'online' ? '#10B981' : '#EF4444' }} />
               <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: "#64748B", letterSpacing: 0.5 }}>
                 {syncStatus === 'online' ? 'LIVE SYNC ACTIVE' : 'OFFLINE MODE'}
               </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button 
              size="medium" variant="outlined" onClick={exportToCSV}
              startIcon={<FileDownloadOutlined fontSize="small" />}
              sx={{ color: PRIMARY_TEAL, borderColor: PRIMARY_TEAL, borderRadius: "8px", px: 2, py: 1, fontSize: '0.8rem', fontWeight: 700 }}
            >
              Export
            </Button>
             <Button 
              size="medium" variant="contained" onClick={() => setShowAddForm(true)}
              startIcon={<AddPhotoAlternateOutlined fontSize="small" />}
              sx={{ bgcolor: PRIMARY_TEAL, borderRadius: "8px", px: 3, py: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: "0 4px 12px rgba(0,70,82,0.15)", "&:hover": { bgcolor: "#002d35" } }}
            >
              Add New Section
            </Button>
          </Stack>
        </Stack>

        {/* --- UTILITY CONTROL BAR --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ flex: 2 }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <TextField
                fullWidth size="small" variant="standard"
                placeholder="Search by section name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    <ToggleButton value="table" sx={{ px: 2, "&.Mui-selected": { bgcolor: PRIMARY_TEAL, color: 'white', "&:hover": { bgcolor: '#002d35' } } }}>
                        <ViewListOutlined fontSize="small" sx={{ mr: 1 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>TABLE</Typography>
                    </ToggleButton>
                    <ToggleButton value="grid" sx={{ px: 2, "&.Mui-selected": { bgcolor: PRIMARY_TEAL, color: 'white', "&:hover": { bgcolor: '#002d35' } } }}>
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
                        <Table size="medium" sx={{ minWidth: 900 }}>
                            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                <Checkbox size="small" indeterminate={selected.length > 0 && selected.length < paginatedData.length} checked={paginatedData.length > 0 && selected.length === paginatedData.length} onChange={handleSelectAll} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>GALLERY</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>SECTION NAME</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>INVENTORY</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>CREATED AT</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", pr: 4, letterSpacing: 0.5 }}>CONTROLS</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((item) => (
                                <TableRow key={item._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                    <Checkbox size="small" checked={selected.includes(item._id)} onChange={() => handleSelectOne(item._id)} />
                                    </TableCell>
                                    <TableCell>
                                        <AvatarGroup max={3} sx={{ justifyContent: 'flex-start', '& .MuiAvatar-root': { width: 38, height: 38, border: '2px solid white' } }}>
                                          {item.imageUrls.map((url, idx) => (
                                            <Avatar key={idx} src={url} variant="rounded" />
                                          ))}
                                        </AvatarGroup>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem" }}>{item.name}</Typography>
                                        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>ID: {item._id.slice(-6).toUpperCase()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CollectionsOutlined sx={{ fontSize: 14 }} /> {item.imageUrls.length} Media
                                          </Typography>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <DescriptionOutlined sx={{ fontSize: 14 }} /> {item.descriptions.length} Blocks
                                          </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B" }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Quick Preview">
                                            <IconButton onClick={() => setViewingItem(item)} size="small" sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9' }}>
                                              <VisibilityOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Section">
                                            <IconButton onClick={() => setEditingItem(item)} size="small" sx={{ color: "#475569", bgcolor: '#F1F5F9' }}>
                                              <EditOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: item._id })} size="small" sx={{ color: "#EF4444", bgcolor: '#FEF2F2' }}>
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
                            {paginatedData.map((item) => (
                                <Box key={item._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia component="img" height="180" image={item.imageUrls[0]} alt={item.name} sx={{ objectFit: 'cover' }} />
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox 
                                                    size="small" checked={selected.includes(item._id)} 
                                                    onChange={() => handleSelectOne(item._id)}
                                                    sx={{ color: '#FFF', '&.Mui-checked': { color: PRIMARY_TEAL }, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '4px', p: 0.5 }}
                                                />
                                            </Box>
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0, 70, 82, 0.85)', color: 'white', p: 1.5, backdropFilter: 'blur(4px)' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>{item.name}</Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>
                                                    {item.imageUrls.length} ITEMS
                                                </Typography>
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => setViewingItem(item)} sx={{ color: PRIMARY_TEAL, p: 0.5 }}><VisibilityOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => setEditingItem(item)} sx={{ color: "#475569", p: 0.5 }}><EditOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: item._id })} sx={{ color: "#EF4444", p: 0.5 }}><DeleteOutline fontSize="small" /></IconButton>
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
                    TOTAL SECTIONS: {filteredData.length}
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
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic' }}>No changes made in this session.</Typography>
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

        {/* --- PREVIEW DIALOG --- */}
        <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "24px", overflow: 'hidden' } }}>
          {viewingItem && (
            <Box>
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "1.2rem" }}>{viewingItem.name}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>ID: {viewingItem._id}</Typography>
                </Box>
                <IconButton onClick={() => setViewingItem(null)} size="small" sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0' }}><CloseOutlined fontSize="small" /></IconButton>
              </Box>
              <DialogContent sx={{ p: 0, maxHeight: '70vh', overflowY: 'auto' }}>
                <Box sx={{ p: 3 }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Media Gallery</Typography>
                   <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
                      {viewingItem.imageUrls.map((url, i) => (
                        <Box key={i} component="img" src={url} sx={{ height: 180, width: 260, objectFit: 'cover', borderRadius: "16px", border: '1px solid #E2E8F0', flexShrink: 0 }} />
                      ))}
                   </Stack>
                </Box>
                <Box sx={{ p: 3, bgcolor: "#F8FAFC" }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Editorial Content</Typography>
                   {viewingItem.descriptions.map((desc, i) => (
                     <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: "16px", mb: 2, border: "1px solid #E2E8F0", borderLeft: `6px solid ${PRIMARY_TEAL}` }}>
                        <Typography sx={{ color: "#475569", lineHeight: 1.8, fontSize: "0.95rem", fontWeight: 500 }}>{desc}</Typography>
                     </Paper>
                   ))}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC' }}>
                <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ bgcolor: PRIMARY_TEAL, py: 1.2, borderRadius: "10px" }}>Dismiss View</Button>
              </DialogActions>
            </Box>
          )}
        </Dialog>

        {/* --- DELETE DIALOG --- */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: '380px' } }}>
          <Box textAlign="center" p={3}>
            <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <WarningAmberRounded sx={{ color: "#EF4444", fontSize: 36 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Delete Section?</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              This will permanently remove the section and all media from the public site. This action cannot be reversed.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="large" onClick={() => setDeleteDialog({ open: false, id: null })} fullWidth variant="outlined" sx={{ color: "#64748B", borderColor: '#CBD5E1' }}>Abort</Button>
              <Button size="large" onClick={handleDelete} fullWidth variant="contained" sx={{ bgcolor: "#EF4444", "&:hover": { bgcolor: '#DC2626' } }}>Purge Data</Button>
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

export default StudentLifeManager;