import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, Pagination, Dialog, DialogContent, 
  Tooltip, Checkbox, Divider, ToggleButtonGroup, ToggleButton, 
  Snackbar, Alert, Breadcrumbs, Link, ThemeProvider, createTheme, 
  Card, CardContent
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, SearchOutlined, WarningAmberRounded, 
  VisibilityOutlined, NavigateNext, HistoryToggleOffOutlined, 
  GridViewOutlined, ViewListOutlined, CheckCircleOutline, 
  FileDownloadOutlined, CloseOutlined, BarChartOutlined, AddOutlined
} from "@mui/icons-material";

import CreateMemberCount from "./CreateMemberCount";
import UpdateMemberCount from "./UpdateMemberCount";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "MEMBER_COUNT_VAULT";
const PRIMARY_TEAL = "#004652";

// Create a strict Montserrat theme override
const montserratTheme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    allVariants: {
      fontFamily: "'Montserrat', sans-serif",
    },
  },
  components: {
    MuiButton: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif", textTransform: 'none' } } },
    MuiTableCell: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
    MuiInputBase: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
    MuiMenuItem: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
    MuiChip: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
    MuiAlert: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
    MuiPaginationItem: { styleOverrides: { root: { fontFamily: "'Montserrat', sans-serif" } } },
  }
});

// --- INTERFACES ---
interface MemberCountData {
  _id: string;
  title: string;
  count: number;
  suffix: string;
  createdAt: string;
}

const MemberCountDirectory = () => {
  // 1. STATE MANAGEMENT
  const [data, setData] = useState<MemberCountData[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MemberCountData | null>(null);
  const [viewingItem, setViewingItem] = useState<MemberCountData | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // View & Selection States
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selected, setSelected] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const rowsPerPage = 8; 

  // 2. SILENT BACKGROUND FETCH LOGIC
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member-count`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const fetchedData: MemberCountData[] = await response.json();
      
      const newDataString = JSON.stringify(fetchedData);
      const currentCache = localStorage.getItem(CACHE_KEY);

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
    fetchData(); 
    const interval = setInterval(() => fetchData(), 3000); 
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

    const updated = data.filter(s => s._id !== targetId);
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    setDeleteDialog({ open: false, id: null });
    setSelected(prev => prev.filter(id => id !== targetId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/member-count/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Statistic successfully purged", "success");
      setHistory(prev => [`Deleted Record ${targetId.substring(0,6)}`, ...prev].slice(0, 8));
    } catch {
      fetchData(); 
      triggerSnackbar("Deletion failed on server. Restoring.", "error");
    }
  };

  const handleBulkDelete = async () => {
    const updated = data.filter(s => !selected.includes(s._id));
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    
    const countItems = selected.length;
    const deletedIds = [...selected];
    setSelected([]);
    triggerSnackbar(`Purging ${countItems} statistics...`, "success");
    setHistory(prev => [`Bulk deleted ${countItems} records`, ...prev].slice(0, 8));

    deletedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/member-count/${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Failed to delete", id);
        }
    });
  };

  const exportToCSV = () => {
    const headers = ["ID,Title,Count,Suffix,Date Added\n"];
    const rows = filteredData.map(item => 
      `${item._id},"${item.title}",${item.count},"${item.suffix}",${new Date(item.createdAt).toLocaleDateString()}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `member-counts-directory.csv`;
    a.click();
    triggerSnackbar("CSV Directory Downloaded", "success");
    setHistory(prev => [`Exported Statistics CSV`, ...prev].slice(0, 8));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? paginatedData.map(n => n._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(searchLower) || item.count.toString().includes(searchLower);
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // View Renders
  if (showAddForm) return <ThemeProvider theme={montserratTheme}><CreateMemberCount onBack={() => { setShowAddForm(false); fetchData(); }} /></ThemeProvider>;
  if (editingItem) return <ThemeProvider theme={montserratTheme}><UpdateMemberCount itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} /></ThemeProvider>;

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* BREADCRUMBS & TOP NAVIGATION */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>ANALYTICS</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Campus Statistics
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
              variant="outlined" 
              onClick={exportToCSV}
              startIcon={<FileDownloadOutlined fontSize="small" />}
              sx={{ color: PRIMARY_TEAL, borderColor: PRIMARY_TEAL, borderRadius: "8px", px: 2, py: 1, fontSize: '0.8rem', fontWeight: 700 }}
            >
              Export
            </Button>
             <Button 
              variant="contained" 
              onClick={() => setShowAddForm(true)}
              startIcon={<AddOutlined fontSize="small" />}
              sx={{ bgcolor: PRIMARY_TEAL, borderRadius: "8px", px: 3, py: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: "0 4px 12px rgba(0,70,82,0.15)", "&:hover": { bgcolor: "#002d35" } }}
            >
              New Statistic
            </Button>
          </Stack>
        </Stack>

        {/* SEARCH & VIEW TOGGLE */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "8px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Search by title or count..."
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
          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Paper elevation={0} sx={{ p: 1, borderRadius: "8px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                    sx={{ height: '100%' }}
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

        {/* DATA VIEWS */}
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
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>METRIC</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>VALUE</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>DATE CREATED</TableCell>
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
                                      <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar variant="rounded" sx={{ width: 50, height: 50, borderRadius: "10px", border: '1px solid #E2E8F0', bgcolor: "#F8FAFC", color: PRIMARY_TEAL }}>
                                            <BarChartOutlined />
                                        </Avatar>
                                        <Box>
                                          <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "1rem" }}>{item.title}</Typography>
                                          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>UID: {item._id.slice(-6).toUpperCase()}</Typography>
                                        </Box>
                                      </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 900, color: '#1E293B', fontSize: "1.2rem", letterSpacing: -0.5 }}>
                                          {item.count}<span style={{ color: PRIMARY_TEAL }}>{item.suffix}</span>
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                          <Tooltip title="Preview">
                                              <IconButton size="small" onClick={() => setViewingItem(item)} sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                              <VisibilityOutlined fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Edit">
                                              <IconButton size="small" onClick={() => setEditingItem(item)} sx={{ color: "#475569", bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                              <EditOutlined fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Delete">
                                              <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: item._id })} sx={{ color: "#EF4444", bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}>
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
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {paginatedData.map((item) => (
                                <Box key={item._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Box sx={{ position: 'relative', p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox size="small" checked={selected.includes(item._id)} onChange={() => handleSelectOne(item._id)} sx={{ color: '#CBD5E1', '&.Mui-checked': { color: PRIMARY_TEAL }, p: 0.5 }} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: PRIMARY_TEAL, letterSpacing: -1 }}>
                                              {item.count}<span style={{ fontSize: '1.5rem', opacity: 0.8 }}>{item.suffix}</span>
                                            </Typography>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mt: 1, textAlign: 'center' }}>{item.title}</Typography>
                                        </Box>
                                        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', '&:last-child': { pb: 2 } }}>
                                            <Box>
                                                <Divider sx={{ mb: 1.5 }} />
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>
                                                        Created {new Date(item.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5}>
                                                        <IconButton size="small" onClick={() => setViewingItem(item)} sx={{ color: PRIMARY_TEAL, p: 0.5 }}><VisibilityOutlined fontSize="small" /></IconButton>
                                                        <IconButton size="small" onClick={() => setEditingItem(item)} sx={{ color: "#475569", p: 0.5 }}><EditOutlined fontSize="small" /></IconButton>
                                                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: item._id })} sx={{ color: "#EF4444", p: 0.5 }}><DeleteOutline fontSize="small" /></IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>

        {/* FOOTER & PAGINATION */}
        <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: "#64748B" }}>TOTAL RECORDS: {filteredData.length}</Typography>
                <AnimatePresence>
                    {selected.length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <Button size="small" variant="contained" color="error" onClick={handleBulkDelete} startIcon={<DeleteOutline sx={{ fontSize: '1rem' }} />} sx={{ fontWeight: 700, fontSize: '0.7rem', px: 2, borderRadius: '6px' }}>
                                DELETE SELECTED ({selected.length})
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Stack>
            <Pagination size="medium" count={Math.ceil(filteredData.length / rowsPerPage) || 1} page={page} onChange={(_, v) => setPage(v)} sx={{ "& .Mui-selected": { bgcolor: `${PRIMARY_TEAL} !important`, color: "#FFF", fontWeight: 800 }, "& .MuiPaginationItem-root": { fontWeight: 600, fontSize: '0.8rem' } }} />
        </Paper>

        {/* RECENT ACTIVITY LOG */}
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

        {/* QUICK VIEW DIALOG */}
        <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "24px", overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
          {viewingItem && (
            <Box>
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: '1.2rem', letterSpacing: -0.5 }}>Statistic Summary</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>ID: {viewingItem._id}</Typography>
                 </Box>
                 <IconButton size="medium" onClick={() => setViewingItem(null)} sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F1F5F9' } }}>
                     <CloseOutlined fontSize="small" />
                 </IconButton>
              </Box>
              <DialogContent sx={{ p: 4 }}>
                 <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: PRIMARY_TEAL, mb: 0, letterSpacing: -1 }}>
                      {viewingItem.count}<span style={{ fontSize: '2rem', opacity: 0.7 }}>{viewingItem.suffix}</span>
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>{viewingItem.title}</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600, mt: 2 }}>
                        Registered: {new Date(viewingItem.createdAt).toLocaleDateString()}
                    </Typography>
                 </Box>
              </DialogContent>
            </Box>
          )}
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: "16px", p: 1, maxWidth: '380px' } }}>
          <Box textAlign="center" p={3}>
            <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <WarningAmberRounded sx={{ color: "#EF4444", fontSize: 36 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Confirm Data Purge</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              You are about to permanently delete this statistic from the database. This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="large" onClick={() => setDeleteDialog({ open: false, id: null })} fullWidth variant="outlined" sx={{ fontWeight: 700, color: "#64748B", borderColor: '#CBD5E1', fontSize: '0.8rem' }}>Abort</Button>
              <Button size="large" onClick={handleDelete} fullWidth variant="contained" sx={{ bgcolor: "#EF4444", fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(239,68,68,0.2)', "&:hover": { bgcolor: '#DC2626' } }}>Delete Record</Button>
            </Stack>
          </Box>
        </Dialog>

        {/* GLOBAL NOTIFICATIONS */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "8px", fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
};

export default MemberCountDirectory;