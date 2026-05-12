import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, Card, CardMedia, CardContent,
  Pagination, Dialog, Tooltip, ToggleButtonGroup, ToggleButton,
  Snackbar, Alert, Checkbox, Breadcrumbs, Link, ThemeProvider, createTheme,
  Chip, Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, SearchOutlined, WarningAmberRounded,
  VisibilityOutlined, CloseOutlined, CheckCircleOutline, NavigateNext, 
  HistoryToggleOffOutlined, GridViewOutlined, ViewListOutlined,
  SchoolOutlined, CalendarMonthOutlined, LocalOfferOutlined, LayersOutlined
} from "@mui/icons-material";

// Components 
import CreateCourse from "./CreateCourses";
// import UpdateCourse from "./UpdateCourses";

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CACHE_KEY = "COURSE_MANAGER_VAULT";
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

// --- MATCHED TO MONGOOSE SCHEMA ---
interface ModuleRow {
  code: string;
  name: string;
  credits: string;
}

interface Semester {
  semesterName: string;
  moduleRows: ModuleRow[];
}

interface Course {
  _id: string;
  courseName: string;
  courseCategory: string;
  courseDescription: string[];
  duration: string;
  intake: string;
  awardingBody: string;
  entryRequirement: string;
  progression: string;
  scholarships: string;
  semesters: Semester[];
  careerPathways: string[];
  coverImage: string;
  images: string[];
  createdAt: string;
}

const CourseManager = () => {
  // 1. STATE MANAGEMENT (HYDRATED INSTANTLY FROM CACHE)
  const [data, setData] = useState<Course[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  
  const [syncStatus, setSyncStatus] = useState<"online" | "offline">("online");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Course | null>(null);
  const [viewingItem, setViewingItem] = useState<Course | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // View & Selection States
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selected, setSelected] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const rowsPerPage = viewMode === "grid" ? 6 : 8; 

  // 2. SILENT BACKGROUND FETCH LOGIC (NO LOADING SPINNERS)
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course`);
      if (!response.ok) throw new Error("Connection Interrupted");
      const fetchedData: Course[] = await response.json();
      
      const newDataString = JSON.stringify(fetchedData);
      const currentCache = localStorage.getItem(CACHE_KEY);

      // ONLY update state and trigger a re-render if the database data is different from our local cache
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
  }, [viewMode]);

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
      const res = await fetch(`${API_BASE_URL}/api/course/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      triggerSnackbar("Course record successfully purged", "success");
      setHistory(prev => [`Deleted Record ${targetId.substring(0,6)}`, ...prev].slice(0, 8));
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
    triggerSnackbar(`Purging ${count} course records...`, "success");
    setHistory(prev => [`Bulk deleted ${count} records`, ...prev].slice(0, 8));

    // Map through and delete on server
    deletedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/course/${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Failed to delete", id);
        }
    });
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
        item.courseName.toLowerCase().includes(searchLower) || 
        item.courseCategory.toLowerCase().includes(searchLower) ||
        item.awardingBody.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // View Renders
  if (showAddForm) return <ThemeProvider theme={montserratTheme}><CreateCourse onBack={() => { setShowAddForm(false); fetchData(); }} /></ThemeProvider>;
  // if (editingItem) return <ThemeProvider theme={montserratTheme}><UpdateCourse itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} /></ThemeProvider>;

  return (
    <ThemeProvider theme={montserratTheme}>
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F4F7FA", p: { xs: 1.5, md: 3 } }}>
        
        {/* --- BREADCRUMBS & TOP NAVIGATION --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} mb={3} spacing={2}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: '0.8rem' }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DASHBOARD</Link>
              <Typography color="text.primary" sx={{ fontSize: '0.65rem', fontWeight: 800, color: PRIMARY_TEAL }}>ACADEMICS</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: PRIMARY_TEAL, letterSpacing: "-0.5px", fontSize: '1.4rem' }}>
              Course Curriculum Manager
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
              variant="contained" 
              onClick={() => setShowAddForm(true)}
              startIcon={<SchoolOutlined fontSize="small" />}
              sx={{ bgcolor: PRIMARY_TEAL, borderRadius: "8px", px: 3, py: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: "0 4px 12px rgba(0,70,82,0.15)", "&:hover": { bgcolor: "#002d35" } }}
            >
              Add New Course
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
                placeholder="Search by course name, category, or awarding body..."
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
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>COVER</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>COURSE INFO</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>TIMELINE</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", letterSpacing: 0.5 }}>STRUCTURE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#64748B", pr: 4, letterSpacing: 0.5 }}>CONTROLS</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((course) => (
                                <TableRow key={course._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                    <Checkbox size="small" checked={selected.includes(course._id)} onChange={() => handleSelectOne(course._id)} />
                                    </TableCell>
                                    <TableCell>
                                        <Avatar src={course.coverImage} variant="rounded" sx={{ width: 60, height: 45, borderRadius: "8px", border: '1px solid #CBD5E1' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: "0.85rem", lineHeight: 1.2 }}>{course.courseName}</Typography>
                                        <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                                            <Chip label={course.courseCategory} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
                                            <Typography sx={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>|</Typography>
                                            <Typography sx={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600 }}>{course.awardingBody}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, color: '#475569' }}>
                                                <CalendarMonthOutlined sx={{ fontSize: 14 }} /> {course.duration}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, color: '#475569' }}>
                                                <LocalOfferOutlined sx={{ fontSize: 14 }} /> {course.intake}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LayersOutlined sx={{ fontSize: 16 }} /> {course.semesters?.length || 0} Semesters
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 2 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Preview Course">
                                            <IconButton size="small" onClick={() => setViewingItem(course)} sx={{ color: PRIMARY_TEAL, bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <VisibilityOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Tooltip title="Edit Course">
                                            <IconButton size="small" onClick={() => setEditingItem(course)} sx={{ color: "#475569", bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                                            <EditOutlined fontSize="small" />
                                            </IconButton>
                                        </Tooltip> */}
                                        <Tooltip title="Delete Course">
                                            <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: course._id })} sx={{ color: "#EF4444", bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}>
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
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                            gap: 3 
                        }}>
                            {paginatedData.map((course) => (
                                <Box key={course._id}>
                                    <Card sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={course.coverImage}
                                                alt={course.courseName}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <Checkbox 
                                                    size="small" 
                                                    checked={selected.includes(course._id)} 
                                                    onChange={() => handleSelectOne(course._id)}
                                                    sx={{ color: '#FFF', '&.Mui-checked': { color: PRIMARY_TEAL }, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '4px', p: 0.5, '&:hover': { bgcolor: '#FFF' } }}
                                                />
                                            </Box>
                                            <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                                                <Chip label={course.courseCategory} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: PRIMARY_TEAL, fontWeight: 800, fontSize: '0.65rem' }} />
                                            </Box>
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0, 70, 82, 0.85)', color: 'white', p: 1.5, backdropFilter: 'blur(4px)' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>{course.courseName}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>{course.awardingBody}</Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack spacing={1} mb={2}>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarMonthOutlined sx={{ fontSize: 16, color: PRIMARY_TEAL }} /> {course.duration}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LayersOutlined sx={{ fontSize: 16, color: PRIMARY_TEAL }} /> {course.semesters?.length || 0} Semesters
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>
                                                    Added {new Date(course.createdAt).toLocaleDateString()}
                                                </Typography>
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => setViewingItem(course)} sx={{ color: PRIMARY_TEAL, p: 0.5 }}><VisibilityOutlined fontSize="small" /></IconButton>
                                                    {/* <IconButton size="small" onClick={() => setEditingItem(course)} sx={{ color: "#475569", p: 0.5 }}><EditOutlined fontSize="small" /></IconButton> */}
                                                    <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: course._id })} sx={{ color: "#EF4444", p: 0.5 }}><DeleteOutline fontSize="small" /></IconButton>
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
          PaperProps={{ sx: { borderRadius: "16px", p: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' } }}
        >
          {viewingItem && (
            <Box>
              {/* Header */}
              <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: PRIMARY_TEAL, fontSize: '1.2rem', letterSpacing: -0.5 }}>{viewingItem.courseName}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>ID: {viewingItem._id}</Typography>
                 </Box>
                 <IconButton size="medium" onClick={() => setViewingItem(null)} sx={{ bgcolor: '#FFF', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F1F5F9' } }}>
                     <CloseOutlined fontSize="small" />
                 </IconButton>
              </Box>
              
              <Box sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <Box component="img" src={viewingItem.coverImage} sx={{ width: '100%', height: 240, objectFit: 'cover' }} />
                
                <Stack spacing={4} sx={{ p: 4 }}>
                  {/* 1. Description */}
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL }}>About Program</Typography>
                    {viewingItem.courseDescription.map((p, i) => (
                      <Typography key={i} sx={{ fontSize: "0.9rem", mt: 1, color: "#475569", lineHeight: 1.7 }}>{p}</Typography>
                    ))}
                  </Box>

                  <Divider />

                  {/* 2. Key Details */}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <Box flex={1}>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#94A3B8" }}>AWARDING BODY</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{viewingItem.awardingBody}</Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#94A3B8" }}>SCHOLARSHIPS</Typography>
                      <Typography sx={{ fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: viewingItem.scholarships || "None" }} />
                    </Box>
                  </Stack>

                  {/* 3. Curriculum Structure */}
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: PRIMARY_TEAL, display: 'block', mb: 2 }}>Academic Syllabus</Typography>
                    {viewingItem.semesters.map((sem, sIdx) => (
                      <Box key={sIdx} sx={{ mb: 3 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", bgcolor: "#F1F5F9", p: 1, borderRadius: "8px", mb: 1 }}>{sem.semesterName}</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "10px" }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>CODE</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>MODULE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>CREDITS</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sem.moduleRows.map((row, rIdx) => (
                                <TableRow key={rIdx}>
                                  <TableCell sx={{ fontSize: "0.75rem" }}>{row.code}</TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600 }}>{row.name}</TableCell>
                                  <TableCell align="right" sx={{ fontSize: "0.75rem" }}>{row.credits}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ))}
                  </Box>

                  {/* 4. Rich Text Sections */}
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "12px" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.8rem", color: PRIMARY_TEAL, mb: 1 }}>ENTRY REQUIREMENTS</Typography>
                      <Typography sx={{ fontSize: "0.85rem" }} dangerouslySetInnerHTML={{ __html: viewingItem.entryRequirement }} />
                    </Box>
                    <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "12px" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.8rem", color: PRIMARY_TEAL, mb: 1 }}>CAREER PATHWAYS</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {viewingItem.careerPathways.map((path, i) => (
                          <Chip key={i} label={path} size="small" sx={{ fontWeight: 600, mt: 0.5 }} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
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
            <Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: '1.1rem', mb: 1 }}>Confirm Curriculum Purge</Typography>
            <Typography sx={{ color: "#64748B", mb: 4, fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.5 }}>
              You are about to permanently delete this course and all associated semester data. This action cannot be undone.
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

export default CourseManager;