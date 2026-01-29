import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // NEW: Framer Motion
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Chip, Button, Fade, TextField, MenuItem, InputAdornment, 
  Pagination, Tooltip, useTheme, useMediaQuery, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, FiberManualRecord, FilterList, WarningAmberRounded,
  VisibilityOutlined, LinkOutlined, CalendarTodayOutlined,
  CloseOutlined
} from "@mui/icons-material";
import AddSliderForm from "./CreateNewSlider";
import UpdateSliderForm from "./UpdateSlider";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.1, duration: 0.5 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

// Interface
interface Slider {
  _id: string;
  name: string;
  imageUrl: string;
  redirectLink?: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const HomeSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [viewingSlider, setViewingSlider] = useState<Slider | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const fetchSliders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders`);
      const data = await response.json();
      if (response.ok) setSliders(data);
    } catch (error) {
      console.error("Failed to fetch sliders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSliderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSliderToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!sliderToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders/${sliderToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSliders((prev) => prev.filter((s) => s._id !== sliderToDelete));
        closeDeleteDialog();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const filteredData = useMemo(() => {
    return sliders.filter((s) => {
      const matchText = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [searchQuery, statusFilter, sliders]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // --- TRANSITION RENDERING ---
  if (showAddForm) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Box sx={{ bgcolor: surfaceColor, p: 3, minHeight: "100vh" }}>
          <AddSliderForm onBack={() => { setShowAddForm(false); fetchSliders(); }} />
        </Box>
      </motion.div>
    );
  }

  if (editingSlider) {
    return (
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <Box sx={{ bgcolor: surfaceColor, p: 3, minHeight: "100vh" }}>
          <UpdateSliderForm sliderData={editingSlider} onBack={() => { setEditingSlider(null); fetchSliders(); }} />
        </Box>
      </motion.div>
    );
  }

  return (
    <Box 
      component={motion.div} 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 } }}
    >
      {/* HEADER SECTION */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={3} mb={4}>
        <Box>
            <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
              Home Sliders
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
              Manage your homepage hero banners and redirects.
            </Typography>
        </Box>
        <Button 
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<AddPhotoAlternateOutlined />}
          sx={{ 
            bgcolor: primaryTeal, borderRadius: "12px", px: 4, py: 2, 
            fontFamily: primaryFont, fontWeight: 700, textTransform: "none",
            fontSize: "0.95rem", boxShadow: "0 10px 20px -5px rgba(0, 70, 82, 0.4)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Create New Slider
        </Button>
      </Stack>

      {/* FILTER BAR */}
      <Paper 
        component={motion.div}
        variants={itemVariants}
        elevation={0} sx={{ 
        p: 2.5, mb: 4, borderRadius: "20px", border: "1px solid #E2E8F0", 
        display: "flex", flexWrap: "wrap", gap: 3, bgcolor: "#FFF"
      }}>
        <TextField
          fullWidth
          placeholder="Search by slider name..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
          sx={{ flex: 2, minWidth: "280px" }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600 }
          }}
        />
        
        <TextField
          select
          label="Filter Status"
          value={statusFilter}
          onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}}
          sx={{ flex: 1, minWidth: "160px" }}
          InputLabelProps={{ sx: { fontFamily: primaryFont, fontWeight: 600 } }}
          InputProps={{ 
              startAdornment: <InputAdornment position="start"><FilterList fontSize="small" /></InputAdornment>,
              sx: { borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600 }
          }}
        >
          <MenuItem value="All">All Sliders</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Paper>

      {/* DATA TABLE */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ borderRadius: "24px", border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "#FFF" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", py: 3, fontSize: "0.75rem" }}>PREVIEW</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>DETAILS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem", pr: 4 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={motion.tbody}>
            <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: primaryTeal }} />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((slider) => (
                  <TableRow 
                    key={slider._id} 
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    hover
                  >
                    <TableCell>
                      <Avatar 
                        src={slider.imageUrl} 
                        variant="rounded" 
                        sx={{ width: 100, height: 55, borderRadius: "10px", border: "2px solid #E2E8F0" }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal }}>
                        {slider.name}
                      </Typography>
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.7rem", color: "#94A3B8" }}>
                        ID: {slider._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<FiberManualRecord sx={{ fontSize: "10px !important" }} />}
                        label={slider.status} 
                        sx={{ 
                          fontFamily: primaryFont, fontWeight: 800, fontSize: "0.7rem",
                          bgcolor: slider.status === "Active" ? "#ECFDF5" : "#FFF1F2", 
                          color: slider.status === "Active" ? "#10B981" : "#F43F5E",
                          borderRadius: "8px"
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton onClick={() => setViewingSlider(slider)} size="small" sx={{ color: primaryTeal }}>
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setEditingSlider(slider)} size="small" sx={{ color: "#64748B" }}>
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteDialog(slider._id)} size="small" sx={{ color: "#F43F5E" }}>
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>No sliders found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 700, fontSize: "0.8rem" }}>
            Displaying {paginatedData.length} of {filteredData.length} sliders
          </Typography>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page}
            onChange={(e, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" }, '& .MuiPaginationItem-root': { fontFamily: primaryFont, fontWeight: 600 } }}
          />
        </Box>
      </TableContainer>

      {/* --- VIEW DETAILS DIALOG --- */}
      <Dialog 
        open={Boolean(viewingSlider)} 
        onClose={() => setViewingSlider(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ component: motion.div, initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, sx: { borderRadius: "24px", p: 1 } }}
      >
        {viewingSlider && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "1.2rem" }}>
                Slider Details
              </Typography>
              <IconButton onClick={() => setViewingSlider(null)} size="small">
                <CloseOutlined />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ width: "100%", borderRadius: "16px", overflow: "hidden", mb: 3, border: "1px solid #E2E8F0" }}>
                 <img src={viewingSlider.imageUrl} alt={viewingSlider.name} style={{ width: "100%", display: "block", objectFit: "cover" }} />
              </Box>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                    Banner Name
                  </Typography>
                  <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, color: primaryTeal }}>
                    {viewingSlider.name}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                    Redirect Link
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LinkOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 500, color: "#475569", fontSize: "0.9rem" }}>
                      {viewingSlider.redirectLink || "No link provided"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setViewingSlider(null)} 
                fullWidth 
                variant="contained" 
                sx={{ bgcolor: primaryTeal, borderRadius: "12px", textTransform: "none", fontFamily: primaryFont, fontWeight: 700 }}
              >
                Close Preview
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* --- DELETE DIALOG --- */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{ sx: { borderRadius: "20px", padding: "8px", width: "100%", maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: primaryFont, fontWeight: 800, color: "#1E293B" }}>
          <WarningAmberRounded sx={{ color: "#F43F5E", fontSize: "32px" }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500, color: "#64748B" }}>
            Are you sure you want to delete this slider? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={closeDeleteDialog} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{ bgcolor: "#F43F5E", fontFamily: primaryFont, fontWeight: 700, textTransform: "none", borderRadius: "10px", px: 3 }}
          >
            Delete Slider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeSlider;