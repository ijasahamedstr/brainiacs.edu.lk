import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, Pagination, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, AvatarGroup, Tooltip, Checkbox, 
  Chip, Divider, ToggleButtonGroup, ToggleButton, Snackbar, Alert, 
  Breadcrumbs, Link, ThemeProvider, createTheme, Card, CardMedia, CardContent
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, VisibilityOutlined, PlaceOutlined, 
  AccessTimeOutlined, EventOutlined, CalendarTodayOutlined,
  NavigateNext, HistoryToggleOffOutlined, GridViewOutlined, 
  ViewListOutlined, CheckCircleOutline, FileDownloadOutlined, 
  CloseOutlined, WarningAmberRounded
} from "@mui/icons-material";

import CreateEvent from "./CreateEvents";
import UpdateEvent from "./UpdateEvents";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "EVENT_MANAGER_VAULT";
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
interface EventData {
  _id: string;
  eventName: string;
  eventDescription: string[]; 
  eventPlace: string;
  eventTime: string;
  startDate: string;
  finishDate: string;
  imageUrls: string[];
  createdAt: string;
}

const EventManager = () => {
  // 1. STATE MANAGEMENT (HYDRATED INSTANTLY FROM CACHE)
  const [data, setData] = useState<EventData[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventData | null>(null);
  const [viewingItem, setViewingItem] = useState<EventData | null>(null);
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
      const response = await fetch(`${API_BASE_URL}/api/events`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const fetchedData: EventData[] = await response.json();
      
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
    // Aggressive silent polling every 3 seconds
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

    // Optimistically update UI instantly
    const updated = data.filter(s => s._id !== targetId);
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    setDeleteDialog({ open: false, id: null });
    setSelected(prev => prev.filter(id => id !== targetId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Event successfully purged", "success");
      setHistory(prev => [`Deleted Event ${targetId.substring(0,6)}`, ...prev].slice(0, 8));
    } catch {
      fetchData(); // Revert if failed
      triggerSnackbar("Deletion failed on server. Restoring.", "error");
    }
  };

  const handleBulkDelete = async () => {
    // Optimistically update UI instantly
    const updated = data.filter(s => !selected.includes(s._id));
    setData(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    
    const count = selected.length;
    const deletedIds = [...selected];
    setSelected([]);
    triggerSnackbar(`Purging ${count} events...`, "success");
    setHistory(prev => [`Bulk deleted ${count} events`, ...prev].slice(0, 8));

    // Map through and delete on server
    deletedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/events/${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Failed to delete", id);
        }
    });
  };

  const exportToCSV = () => {
    const headers = ["ID,EventName,Location,Time,StartDate,FinishDate,CreatedAt\n"];
    const rows = filteredData.map(item => 
      `${item._id},"${item.eventName}","${item.eventPlace}","${item.eventTime}",${new Date(item.startDate).toLocaleDateString()},${new Date(item.finishDate).toLocaleDateString()},${item.createdAt}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-events-directory.csv`;
    a.click();
    triggerSnackbar("CSV Directory Downloaded", "success");
    setHistory(prev => [`Exported Events Directory CSV`, ...prev].slice(0, 8));
  };

  // 4. BULK ACTIONS & SEARCH LOGIC
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? paginatedData.map(n => n._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.eventName.toLowerCase().includes(searchLower) ||
        item.eventPlace.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // View Renders
  if (showAddForm) return <ThemeProvider theme={montserratTheme}><CreateEvent onBack={() => { setShowAddForm(false); fetchData(); }} /></ThemeProvider>;
  if (editingItem) return <ThemeProvider theme={montserratTheme}><UpdateEvent itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} /></ThemeProvider>;

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* --- BREADCRUMBS & TOP NAVIGATION --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>CAMPUS LIFE</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Event Manager
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
              size="medium"
              variant="outlined" 
              onClick={exportToCSV}
              startIcon={<FileDownloadOutlined fontSize="small" />}
              sx={{ color: PRIMARY_TEAL, borderColor: PRIMARY_TEAL, borderRadius: "8px", px: 2, py: 1, fontSize: '0.8rem', fontWeight: 700 }}
            >
              Export
            </Button>
             <Button 
              size="medium"
              variant="contained" 
              onClick={() => setShowAddForm(true)}
              startIcon={<AddPhotoAlternateOutlined fontSize="small" />}
              sx={{ bgcolor: PRIMARY_TEAL, borderRadius: "8px", px: 3, py: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: "0 4px 12px rgba(0,70,82,0.15)", "&:hover": { bgcolor: "#002d35" } }}
            >
              Create New Event
            </Button>
          </Stack>
        </Stack>

        {/* --- ADVANCED UTILITY & MEDIA CONTROL BAR --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
            <Paper elevation={0} sx={{ p: 1, px: 2, borderRadius: "8px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Search by event name or location..."
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
            <Stack direction="row" spacing={2} height="100%">
                <Paper elevation={0} sx={{ flex: 1, p: 1, borderRadius: "8px", border: "1px solid #E2E8F0", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            </Stack>
          </Box>
        </Stack>

        {/* --- VIEW MODE SWITCHER --- */}
        <Box sx={{ position: 'relative', minHeight: '400px' }}>
            <AnimatePresence mode="wait">
                {viewMode === "table" ? (
                    // --- 1. CLASSIC DATA TABLE VIEW ---
                    <motion.div key="table-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                        <Table size="medium" sx={{ minWidth: 900 }}>
                            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                <Checkbox size="small" indeterminate={selected.length > 0 && selected.length < paginatedData.length} checked={paginatedData.length > 0 && selected.length === paginatedData.length} onChange={handleSelectAll} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>MEDIA</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>EVENT INFO</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>LOGISTICS</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>DATES</TableCell>
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
                                        <AvatarGroup max={3} sx={{ justifyContent: 'flex-start', '& .MuiAvatar-root': { width: 40, height: 40, border: '2px solid white' } }}>
                                          {item.imageUrls.map((url, idx) => (
                                            <Avatar key={idx} src={url} variant="rounded" />
                                          ))}
                                        </AvatarGroup>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem", lineHeight: 1.2 }}>{item.eventName}</Typography>
                                        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>ID: {item._id.slice(-6).toUpperCase()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PlaceOutlined sx={{ fontSize: 14 }} /> {item.eventPlace}
                                          </Typography>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeOutlined sx={{ fontSize: 14 }} /> {item.eventTime}
                                          </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                          <Chip label={`Start: ${new Date(item.startDate).toLocaleDateString()}`} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: "#F0F5F6", color: PRIMARY_TEAL, fontWeight: 700 }} />
                                          <Chip label={`End: ${new Date(item.finishDate).toLocaleDateString()}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20, fontWeight: 600 }} />
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Preview Event">
                                            <IconButton size="small" onClick={() => setViewingItem(item)} sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <VisibilityOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Event">
                                            <IconButton size="small" onClick={() => setEditingItem(item)} sx={{ color: "#475569", bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <EditOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Event">
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
                    // --- 2. ADVANCED GRID / GALLERY VIEW ---
                    <motion.div key="grid-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
                            gap: 3 
                        }}>
                            {paginatedData.map((item) => (
                                <Box key={item._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia component="img" height="200" image={item.imageUrls[0]} alt={item.eventName} sx={{ objectFit: 'cover' }} />
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox 
                                                    size="small" 
                                                    checked={selected.includes(item._id)} 
                                                    onChange={() => handleSelectOne(item._id)}
                                                    sx={{ color: '#FFF', '&.Mui-checked': { color: PRIMARY_TEAL }, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '4px', p: 0.5, '&:hover': { bgcolor: '#FFF' } }}
                                                />
                                            </Box>
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0, 70, 82, 0.85)', color: 'white', p: 1.5, backdropFilter: 'blur(4px)' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>{item.eventName}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>
                                                    <PlaceOutlined sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                                    {item.eventPlace}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack spacing={1} mb={2}>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                    <CalendarTodayOutlined sx={{ fontSize: 16, color: PRIMARY_TEAL }} /> 
                                                    {new Date(item.startDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                    <AccessTimeOutlined sx={{ fontSize: 16, color: PRIMARY_TEAL }} /> 
                                                    {item.eventTime}
                                                </Typography>
                                            </Stack>
                                            <Divider sx={{ mb: 1.5 }} />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.6rem' } }}>
                                                  {item.imageUrls.map((url, idx) => (
                                                    <Avatar key={idx} src={url} />
                                                  ))}
                                                </AvatarGroup>
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

        {/* --- FOOTER & PAGINATION (Unified for both views) --- */}
        <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: "12px", border: "1px solid #E2E8F0", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: "#64748B" }}>
                    TOTAL RECORDS: {filteredData.length}
                </Typography>
                <AnimatePresence>
                    {selected.length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <Button 
                                size="small" 
                                variant="contained" 
                                color="error" 
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
                size="medium"
                count={Math.ceil(filteredData.length / rowsPerPage)} 
                page={page} 
                onChange={(_, v) => setPage(v)}
                sx={{ "& .Mui-selected": { bgcolor: `${PRIMARY_TEAL} !important`, color: "#FFF", fontWeight: 800 }, "& .MuiPaginationItem-root": { fontWeight: 600, fontSize: '0.8rem' } }}
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
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                        gap: 2 
                    }}>
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

        {/* --- ADVANCED QUICK VIEW DIALOG --- */}
        <Dialog 
          open={Boolean(viewingItem)} 
          onClose={() => setViewingItem(null)} 
          maxWidth="md" 
          fullWidth 
          PaperProps={{ sx: { borderRadius: "24px", overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}
        >
          {viewingItem && (
            <Box>
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: '1.2rem', letterSpacing: -0.5 }}>{viewingItem.eventName}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>ID: {viewingItem._id}</Typography>
                 </Box>
                 <IconButton size="medium" onClick={() => setViewingItem(null)} sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F1F5F9' } }}>
                     <CloseOutlined fontSize="small" />
                 </IconButton>
              </Box>

              <DialogContent sx={{ p: 0, maxHeight: '75vh', overflowY: 'auto' }}>
                
                {/* IMAGE GALLERY */}
                <Box sx={{ p: 3, display: 'flex', gap: 2, overflowX: 'auto', bgcolor: "#F0F5F6", borderBottom: '1px solid #E2E8F0' }}>
                  {viewingItem.imageUrls.map((url, index) => (
                    <Box 
                      key={index} 
                      component="img" 
                      src={url} 
                      sx={{ 
                        height: 220, 
                        minWidth: 320, 
                        objectFit: 'cover', 
                        borderRadius: '16px', 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        border: "4px solid white"
                      }} 
                    />
                  ))}
                </Box>

                {/* LOGISTICS CARDS */}
                <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', border: `1px solid ${PRIMARY_TEAL}30`, bgcolor: '#F8FAFC' }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 800, textTransform: 'uppercase', mb: 2, letterSpacing: 0.5 }}>
                      Location & Time
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: PRIMARY_TEAL, width: 36, height: 36 }}><PlaceOutlined fontSize="small" /></Avatar>
                        <Box>
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: '#1E293B' }}>{viewingItem.eventPlace}</Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: '#64748B', fontWeight: 600 }}>Venue Details</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: PRIMARY_TEAL, width: 36, height: 36 }}><AccessTimeOutlined fontSize="small" /></Avatar>
                        <Box>
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: '#1E293B' }}>{viewingItem.eventTime}</Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: '#64748B', fontWeight: 600 }}>Scheduled Time</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', border: `1px solid ${PRIMARY_TEAL}30`, bgcolor: '#F8FAFC' }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 800, textTransform: 'uppercase', mb: 2, letterSpacing: 0.5 }}>
                      Event Dates
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: PRIMARY_TEAL, width: 36, height: 36 }}><CalendarTodayOutlined fontSize="small" /></Avatar>
                        <Box>
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: '#1E293B' }}>
                                {new Date(viewingItem.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: '#64748B', fontWeight: 600 }}>Opening Date</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: PRIMARY_TEAL, width: 36, height: 36 }}><EventOutlined fontSize="small" /></Avatar>
                        <Box>
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: '#1E293B' }}>
                                {new Date(viewingItem.finishDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: '#64748B', fontWeight: 600 }}>Closing Date</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>

                {/* DESCRIPTION BLOCKS */}
                <Box sx={{ px: 4, pb: 4 }}>
                  <Typography sx={{ mb: 2, fontWeight: 900, fontSize: "0.8rem", color: PRIMARY_TEAL, letterSpacing: "1px", textTransform: 'uppercase' }}>
                    Detailed Overview
                  </Typography>
                  {viewingItem.eventDescription.map((para, i) => (
                    <Typography 
                      key={i} 
                      sx={{ 
                        fontSize: '0.95rem', 
                        color: '#475569', 
                        lineHeight: 1.8, 
                        mb: 2,
                        bgcolor: '#FFF',
                        p: 3,
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        borderLeft: `6px solid ${PRIMARY_TEAL}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      {para}
                    </Typography>
                  ))}
                </Box>
              </DialogContent>
            </Box>
          )}
        </Dialog>

        {/* --- DELETE CONFIRMATION --- */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => setDeleteDialog({ open: false, id: null })} 
          PaperProps={{ sx: { borderRadius: "16px", p: 1, maxWidth: '380px' } }}
        >
          <Box textAlign="center" p={3}>
            <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <WarningAmberRounded sx={{ color: "#EF4444", fontSize: 36 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Confirm Event Purge</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              You are about to permanently delete this event and all associated gallery images from the campus calendar. This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="large" onClick={() => setDeleteDialog({ open: false, id: null })} fullWidth variant="outlined" sx={{ fontWeight: 700, color: "#64748B", borderColor: '#CBD5E1', fontSize: '0.8rem' }}>Abort</Button>
              <Button size="large" onClick={handleDelete} fullWidth variant="contained" sx={{ bgcolor: "#EF4444", fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(239,68,68,0.2)', "&:hover": { bgcolor: '#DC2626' } }}>Delete Record</Button>
            </Stack>
          </Box>
        </Dialog>

        {/* --- GLOBAL NOTIFICATIONS --- */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "8px", fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EventManager;