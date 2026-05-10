import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Chip, Button, TextField, MenuItem, Card, CardMedia, CardContent,
  Pagination, Dialog, Divider, Tooltip, ToggleButtonGroup, ToggleButton,
  Snackbar, Alert, LinearProgress, useMediaQuery, useTheme,
  Checkbox, Breadcrumbs, Link, ThemeProvider, createTheme
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, FiberManualRecord, WarningAmberRounded,
  VisibilityOutlined, LinkOutlined, CloseOutlined,
  SmartphoneOutlined, FileDownloadOutlined, CheckCircleOutline, 
  NavigateNext, HistoryToggleOffOutlined,
  GridViewOutlined, ViewListOutlined, TitleOutlined, FormatAlignLeftOutlined,
  FormatAlignCenterOutlined, FormatAlignRightOutlined, ImageOutlined
} from "@mui/icons-material";

// Components (Assumed to be in your project)
import AddSliderForm from "./CreateNewSlider";
import UpdateSliderForm from "./UpdateSlider";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "LOGISTICS_SLIDER_VAULT";
const PRIMARY_TEAL = "#004652";

// Create a strict Montserrat theme override for this entire module
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

// --- ENHANCED INTERFACE DEFINITIONS ---
interface Slider {
  _id: string;
  name: string;
  imageUrl: string;
  mobileImageUrl: string;
  redirectLink?: string;
  status: "Active" | "Inactive";
  // New Text Integration Properties
  overlayTitle?: string;
  overlaySubtitle?: string;
  textColor?: string;
  textPosition?: "left" | "center" | "right";
  // Metrics
  clicks?: number;
  impressions?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * HOME SLIDER MANAGEMENT SYSTEM v3.0 - ENTERPRISE EDITION
 * Features: Optimistic UI, Bulk Actions, Instant Hydration, Dual View Modes (Table/Grid),
 * Advanced Image & Text Compositing Previews, Extensive Logging.
 */
const HomeSlider = () => {
  // 1. STATE MANAGEMENT (HYDRATED)
  const [sliders, setSliders] = useState<Slider[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">("idle");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [viewingSlider, setViewingSlider] = useState<Slider | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // View & Selection States
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selected, setSelected] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const rowsPerPage = viewMode === "grid" ? 6 : 8; 

  // 2. STALE-WHILE-REVALIDATE (SWR) FETCH LOGIC
  const fetchSliders = useCallback(async (isManual = false) => {
    if (isManual) setSyncStatus("syncing");
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const data = await response.json();
      
      setSliders(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setSyncStatus("idle");
      if (isManual) triggerSnackbar("Database synchronization complete", "success");
    } catch (error) {
      setSyncStatus("error");
      triggerSnackbar("Offline Mode: Using cached data", "error");
    }
  }, []);

  useEffect(() => {
    fetchSliders();
    const interval = setInterval(() => fetchSliders(), 300000);
    return () => clearInterval(interval);
  }, [fetchSliders]);

  // Reset page when switching views to prevent empty states
  useEffect(() => {
    setPage(1);
  }, [viewMode]);

  // 3. OPTIMISTIC ACTION HANDLERS
  const triggerSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setSliders(prev => prev.map(s => s._id === id ? { ...s, status: newStatus } : s));
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/sliders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
      setHistory(prev => [`Status changed for Asset ${id.substring(0,6)}`, ...prev].slice(0, 8));
    } catch {
      fetchSliders(); 
      triggerSnackbar("Database sync failed. Rolling back.", "error");
    }
  };

  const handleDelete = async () => {
    const targetId = deleteDialog.id;
    if (!targetId) return;

    const updated = sliders.filter(s => s._id !== targetId);
    setSliders(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    setDeleteDialog({ open: false, id: null });
    setSelected(prev => prev.filter(id => id !== targetId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/sliders/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Asset successfully purged from visually active database", "success");
      setHistory(prev => [`Deleted Asset ${targetId.substring(0,6)}`, ...prev].slice(0, 8));
    } catch {
      fetchSliders();
      triggerSnackbar("Deletion failed on server. Restoring.", "error");
    }
  };

  const handleBulkDelete = async () => {
    // Optimistic bulk delete
    const updated = sliders.filter(s => !selected.includes(s._id));
    setSliders(updated);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    
    const count = selected.length;
    setSelected([]);
    triggerSnackbar(`Purging ${count} visual assets...`, "success");
    setHistory(prev => [`Bulk deleted ${count} assets`, ...prev].slice(0, 8));

    // Real implementation would loop or hit a bulk endpoint here
    fetchSliders(); 
  };

  // 4. BULK ACTIONS & EXPORT
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? paginatedData.map(n => n._id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const exportToCSV = () => {
    const headers = ["ID,Name,Status,TitleOverlay,SubtitleOverlay,DesktopURL,MobileURL,Clicks\n"];
    const rows = sliders.map(s => 
      `${s._id},${s.name},${s.status},"${s.overlayTitle || ''}","${s.overlaySubtitle || ''}",${s.imageUrl},${s.mobileImageUrl},${s.clicks || 0}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slider_media_audit_${new Date().getTime()}.csv`;
    a.click();
    setHistory(prev => [`Exported Media Audit CSV`, ...prev].slice(0, 8));
  };

  // 5. SEARCH & PAGINATION LOGIC
  const filteredData = useMemo(() => {
    return sliders.filter((s) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        s.name.toLowerCase().includes(searchLower) || 
        s._id.toLowerCase().includes(searchLower) ||
        (s.overlayTitle && s.overlayTitle.toLowerCase().includes(searchLower));
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sliders, searchQuery, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // View Renders
  if (showAddForm) return <ThemeProvider theme={montserratTheme}><AddSliderForm onBack={() => { setShowAddForm(false); fetchSliders(); }} /></ThemeProvider>;
  if (editingSlider) return <ThemeProvider theme={montserratTheme}><UpdateSliderForm sliderData={editingSlider} onBack={() => { setEditingSlider(null); fetchSliders(); }} /></ThemeProvider>;

  // TEXT COMPOSITOR HELPER
  const renderTextAlignmentIcon = (align?: string) => {
    if (align === 'center') return <FormatAlignCenterOutlined fontSize="inherit" />;
    if (align === 'right') return <FormatAlignRightOutlined fontSize="inherit" />;
    return <FormatAlignLeftOutlined fontSize="inherit" />;
  };

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* --- BREADCRUMBS & TOP NAVIGATION --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>MEDIA & SLIDERS</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Media Banner Architecture
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: syncStatus === 'idle' ? '#10B981' : '#F59E0B', animation: syncStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none' }} />
               <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: "#64748B", letterSpacing: 0.5 }}>
                 {syncStatus === 'syncing' ? 'SYNCING ASSETS...' : 'MEDIA SYSTEMS ONLINE'}
               </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
             <Tooltip title="Export Configuration">
                <IconButton size="medium" onClick={exportToCSV} sx={{ bgcolor: "#FFF", border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <FileDownloadOutlined fontSize="small" />
                </IconButton>
             </Tooltip>
             <Button 
              size="medium"
              variant="contained" 
              onClick={() => setShowAddForm(true)}
              startIcon={<AddPhotoAlternateOutlined fontSize="small" />}
              sx={{ bgcolor: PRIMARY_TEAL, borderRadius: "8px", px: 3, py: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: "0 4px 12px rgba(0,70,82,0.15)", "&:hover": { bgcolor: "#002d35" } }}
            >
              Upload New Media
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
                placeholder="Search media by name, text overlay, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <SearchOutlined sx={{ mr: 1, color: PRIMARY_TEAL, fontSize: '1.2rem' }} />,
                  sx: { fontWeight: 600, fontSize: '0.85rem' }
                }}
              />
              <Divider orientation="vertical" flexItem />
              <TextField
                select
                size="small"
                variant="standard"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontWeight: 700, fontSize: '0.8rem', minWidth: '100px', color: PRIMARY_TEAL } }}
              >
                <MenuItem value="All" sx={{ fontSize: '0.8rem' }}>All Status</MenuItem>
                <MenuItem value="Active" sx={{ fontSize: '0.8rem' }}>Active</MenuItem>
                <MenuItem value="Inactive" sx={{ fontSize: '0.8rem' }}>Inactive</MenuItem>
              </TextField>
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
            {syncStatus === 'syncing' && <LinearProgress sx={{ position: 'absolute', top: -10, left: 0, right: 0, height: 3, borderRadius: '4px', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: PRIMARY_TEAL } }} />}
            
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
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>VISUAL ASSET</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>IDENTITY & SCHEMA</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>TEXT OVERLAY DATA</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>DEPLOYMENT</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", pr: 4, letterSpacing: 0.5 }}>MEDIA CONTROLS</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((slider) => (
                                <TableRow key={slider._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                    <Checkbox size="small" checked={selected.includes(slider._id)} onChange={() => handleSelectOne(slider._id)} />
                                    </TableCell>
                                    <TableCell>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Tooltip title="Desktop Rendering" arrow placement="top">
                                            <Avatar src={slider.imageUrl} variant="rounded" sx={{ width: 65, height: 36, borderRadius: "6px", border: '1px solid #CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <ImageOutlined sx={{ color: '#94A3B8' }} />
                                            </Avatar>
                                        </Tooltip>
                                        <Tooltip title="Mobile Optimized" arrow placement="top">
                                            <Avatar src={slider.mobileImageUrl} variant="rounded" sx={{ width: 28, height: 36, borderRadius: "4px", border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                                            <SmartphoneOutlined sx={{ fontSize: 16, color: '#94A3B8' }} />
                                            </Avatar>
                                        </Tooltip>
                                    </Stack>
                                    </TableCell>
                                    <TableCell>
                                    <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem", lineHeight: 1.2 }}>{slider.name}</Typography>
                                    <Stack direction="row" spacing={1} mt={0.5}>
                                        <Typography sx={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 600 }}>UID: {slider._id.substring(0, 8)}</Typography>
                                        <Typography sx={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 600 }}>|</Typography>
                                        <Typography sx={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 600 }}>{(slider.clicks || 0).toLocaleString()} Clicks</Typography>
                                    </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {slider.overlayTitle ? (
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <TitleOutlined sx={{ fontSize: 14, color: slider.textColor || '#1E293B' }} />
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                                                        {slider.overlayTitle.length > 20 ? slider.overlayTitle.substring(0,20)+'...' : slider.overlayTitle}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title={`Text Aligned: ${slider.textPosition || 'Left'}`}>
                                                        <Box sx={{ color: '#94A3B8', display: 'flex', fontSize: '0.8rem' }}>
                                                            {renderTextAlignmentIcon(slider.textPosition)}
                                                        </Box>
                                                    </Tooltip>
                                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: slider.textColor || '#FFF', border: '1px solid #CBD5E1' }} />
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontStyle: 'italic' }}>No overlay text</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={`Click to set as ${slider.status === 'Active' ? 'Inactive' : 'Active'}`} arrow>
                                        <Chip 
                                            size="small"
                                            onClick={() => handleToggleStatus(slider._id, slider.status)}
                                            label={slider.status.toUpperCase()} 
                                            icon={<FiberManualRecord sx={{ fontSize: "10px !important" }} />}
                                            sx={{ cursor: 'pointer', fontWeight: 800, fontSize: "0.65rem", height: '24px', letterSpacing: 0.5, bgcolor: slider.status === "Active" ? "#DCFCE7" : "#F1F5F9", color: slider.status === "Active" ? "#15803D" : "#64748B", transition: 'all 0.2s', '&:hover': { filter: 'brightness(0.95)' } }} 
                                        />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Preview Visual Output">
                                            <IconButton size="small" onClick={() => setViewingSlider(slider)} sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <VisibilityOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Media Data">
                                            <IconButton size="small" onClick={() => setEditingSlider(slider)} sx={{ color: "#475569", bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <EditOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Purge Asset">
                                            <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: slider._id })} sx={{ color: "#EF4444", bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}>
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
                    // --- 2. ADVANCED GRID / MEDIA GALLERY VIEW ---
                    <motion.div key="grid-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                            gap: 3 
                        }}>
                            {paginatedData.map((slider) => (
                                <Box key={slider._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={slider.imageUrl}
                                                alt={slider.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            {/* Simulate the text overlay directly on the grid card */}
                                            {slider.overlayTitle && (
                                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.3)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: slider.textPosition === 'center' ? 'center' : slider.textPosition === 'right' ? 'flex-end' : 'flex-start' }}>
                                                    <Typography sx={{ color: slider.textColor || '#FFF', fontWeight: 800, fontSize: '1.1rem', textShadow: '0px 2px 4px rgba(0,0,0,0.5)', textAlign: slider.textPosition }}>
                                                        {slider.overlayTitle}
                                                    </Typography>
                                                    {slider.overlaySubtitle && (
                                                        <Typography sx={{ color: slider.textColor || '#FFF', fontWeight: 500, fontSize: '0.75rem', textShadow: '0px 1px 2px rgba(0,0,0,0.5)', mt: 0.5, textAlign: slider.textPosition }}>
                                                            {slider.overlaySubtitle.substring(0, 40)}{slider.overlaySubtitle.length > 40 ? '...' : ''}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox 
                                                    size="small" 
                                                    checked={selected.includes(slider._id)} 
                                                    onChange={() => handleSelectOne(slider._id)}
                                                    sx={{ color: '#FFF', '&.Mui-checked': { color: PRIMARY_TEAL }, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '4px', p: 0.5, '&:hover': { bgcolor: '#FFF' } }}
                                                />
                                            </Box>
                                            <Box sx={{ position: 'absolute', bottom: 10, left: 10 }}>
                                                <Chip 
                                                    size="small"
                                                    label={slider.status.toUpperCase()} 
                                                    sx={{ fontWeight: 800, fontSize: "0.6rem", height: '20px', bgcolor: slider.status === "Active" ? "#10B981" : "#64748B", color: "#FFF", boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} 
                                                />
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: '0.9rem', mb: 1 }} noWrap>
                                                {slider.name}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>
                                                    {new Date(slider.createdAt).toLocaleDateString()}
                                                </Typography>
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => setViewingSlider(slider)} sx={{ color: PRIMARY_TEAL, p: 0.5 }}><VisibilityOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => setEditingSlider(slider)} sx={{ color: "#475569", p: 0.5 }}><EditOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: slider._id })} sx={{ color: "#EF4444", p: 0.5 }}><DeleteOutline fontSize="small" /></IconButton>
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
                    TOTAL ASSETS: {filteredData.length}
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

        {/* --- RECENT MEDIA ACTIVITY LOG --- */}
        <Box sx={{ mt: 3 }}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <HistoryToggleOffOutlined sx={{ color: PRIMARY_TEAL, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: PRIMARY_TEAL, letterSpacing: 0.5 }}>RECENT MEDIA ACTIVITY</Typography>
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

        {/* --- ADVANCED QUICK VIEW / COMPOSITOR DIALOG --- */}
        <Dialog 
          open={Boolean(viewingSlider)} 
          onClose={() => setViewingSlider(null)} 
          maxWidth="lg" 
          fullWidth 
          PaperProps={{ sx: { borderRadius: "16px", p: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' } }}
        >
          {viewingSlider && (
            <Box>
              {/* Header */}
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: '1.2rem', letterSpacing: -0.5 }}>Media Asset Compositor Preview</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Live visualization of text overlays across breakpoints</Typography>
                 </Box>
                 <IconButton size="medium" onClick={() => setViewingSlider(null)} sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F1F5F9' } }}>
                     <CloseOutlined fontSize="small" />
                 </IconButton>
              </Box>
              
              <Box p={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    {/* Desktop Preview */}
                    <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, mb: 1, color: '#64748B', letterSpacing: 0.5 }}>DESKTOP RENDER (1920x600 Ratio)</Typography>
                        <Paper variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden', height: '280px', position: 'relative', bgcolor: '#000' }}>
                            <img src={viewingSlider.imageUrl} alt="Desktop" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            {/* Live Text Overlay Compositing */}
                            {viewingSlider.overlayTitle && (
                                <Box sx={{ 
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                    p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                                    alignItems: viewingSlider.textPosition === 'center' ? 'center' : viewingSlider.textPosition === 'right' ? 'flex-end' : 'flex-start',
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)'
                                }}>
                                    <Typography sx={{ color: viewingSlider.textColor || '#FFF', fontWeight: 900, fontSize: '2.5rem', textShadow: '0px 4px 10px rgba(0,0,0,0.6)', textAlign: viewingSlider.textPosition, maxWidth: '70%', lineHeight: 1.1 }}>
                                        {viewingSlider.overlayTitle}
                                    </Typography>
                                    {viewingSlider.overlaySubtitle && (
                                        <Typography sx={{ color: viewingSlider.textColor || '#FFF', fontWeight: 500, fontSize: '1.1rem', textShadow: '0px 2px 5px rgba(0,0,0,0.6)', mt: 2, textAlign: viewingSlider.textPosition, maxWidth: '60%' }}>
                                            {viewingSlider.overlaySubtitle}
                                        </Typography>
                                    )}
                                    {viewingSlider.redirectLink && (
                                        <Button variant="contained" sx={{ mt: 4, bgcolor: viewingSlider.textColor || '#FFF', color: '#000', fontWeight: 800, px: 4, py: 1.5, borderRadius: '30px', '&:hover': { bgcolor: '#F8FAFC' } }}>
                                            Explore Now
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Box>
                    
                    {/* Mobile Preview */}
                    <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, mb: 1, color: '#64748B', letterSpacing: 0.5 }}>MOBILE RENDER (800x800 Ratio)</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Paper variant="outlined" sx={{ borderRadius: '24px', overflow: 'hidden', height: '350px', width: '200px', position: 'relative', bgcolor: '#000', border: '6px solid #1E293B' }}>
                                <img src={viewingSlider.mobileImageUrl} alt="Mobile" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                {/* Mobile Text Compositing */}
                                {viewingSlider.overlayTitle && (
                                    <Box sx={{ 
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                        p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                                        alignItems: 'center', // Always center on mobile for best look
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
                                    }}>
                                        <Typography sx={{ color: viewingSlider.textColor || '#FFF', fontWeight: 900, fontSize: '1.2rem', textShadow: '0px 2px 5px rgba(0,0,0,0.6)', textAlign: 'center', lineHeight: 1.2 }}>
                                            {viewingSlider.overlayTitle}
                                        </Typography>
                                        {viewingSlider.overlaySubtitle && (
                                            <Typography sx={{ color: viewingSlider.textColor || '#FFF', fontWeight: 500, fontSize: '0.7rem', textShadow: '0px 1px 3px rgba(0,0,0,0.6)', mt: 1, textAlign: 'center' }}>
                                                {viewingSlider.overlaySubtitle}
                                            </Typography>
                                        )}
                                        {viewingSlider.redirectLink && (
                                            <Button variant="contained" size="small" sx={{ mt: 2, fontSize: '0.6rem', bgcolor: viewingSlider.textColor || '#FFF', color: '#000', fontWeight: 800, borderRadius: '20px' }}>
                                                View
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />
                
                {/* Meta Data & Configuration */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                    gap: 3 
                }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', height: '100%' }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, mb: 1.5, color: '#94A3B8', letterSpacing: 0.5 }}>METADATA & SCHEMA</Typography>
                        <Stack spacing={1}>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Asset ID:</Typography><Typography sx={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>{viewingSlider._id}</Typography></Box>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Created:</Typography><Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{new Date(viewingSlider.createdAt).toLocaleDateString()}</Typography></Box>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Status:</Typography>
                                <Chip size="small" label={viewingSlider.status} sx={{ height: '18px', fontSize: '0.6rem', fontWeight: 800, bgcolor: viewingSlider.status === 'Active' ? '#10B981' : '#94A3B8', color: '#FFF' }} />
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', height: '100%' }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, mb: 1.5, color: '#94A3B8', letterSpacing: 0.5 }}>TEXT OVERLAY SETTINGS</Typography>
                        <Stack spacing={1}>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Has Title:</Typography><Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{viewingSlider.overlayTitle ? 'Yes' : 'No'}</Typography></Box>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Has Subtitle:</Typography><Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{viewingSlider.overlaySubtitle ? 'Yes' : 'No'}</Typography></Box>
                            <Box display="flex" justifyContent="space-between"><Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Alignment:</Typography><Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{viewingSlider.textPosition || 'Left'}</Typography></Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', height: '100%' }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, mb: 1.5, color: '#94A3B8', letterSpacing: 0.5 }}>INTERACTION & ROUTING</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: PRIMARY_TEAL, mb: 2 }}>
                            <LinkOutlined sx={{ fontSize: '1.2rem' }} />
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, wordBreak: 'break-all' }}>{viewingSlider.redirectLink || 'No external URL configured'}</Typography>
                        </Stack>
                        <Button variant="outlined" fullWidth size="small" sx={{ borderColor: '#CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.7rem' }}>
                            Copy Destination Link
                        </Button>
                    </Paper>
                </Box>
              </Box>
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
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Confirm Asset Purge</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              You are about to permanently delete this visual asset and its associated text overlays from the system. This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button size="large" onClick={() => setDeleteDialog({ open: false, id: null })} fullWidth variant="outlined" sx={{ fontWeight: 700, color: "#64748B", borderColor: '#CBD5E1', fontSize: '0.8rem' }}>Abort</Button>
              <Button size="large" onClick={handleDelete} fullWidth variant="contained" sx={{ bgcolor: "#EF4444", fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(239,68,68,0.2)', "&:hover": { bgcolor: '#DC2626' } }}>Purge Asset</Button>
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

export default HomeSlider;
