import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Checkbox, Chip,
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, SearchOutlined, 
  VisibilityOutlined, RefreshOutlined, 
  SchoolOutlined, PersonAddOutlined, AccountBalanceOutlined, 
  BadgeOutlined, AccountTreeOutlined 
} from "@mui/icons-material";
import CreateAcademicStaff from "./CreateAcademic Staffs";
import UpdateAcademicStaff from "./UpdateAcademic Staffs";

// Note: Ensure these file names match your actual academic staff components

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

interface AcademicStaff {
  _id: string;
  name: string;
  jobDescription: string; // Acts as "Designation" (e.g., Professor, Lecturer)
  department: string;
  detailedBio: string;
  imageUrl: string; 
  createdAt: string;
}

const AcademicStaffManager = () => {
  // --- States ---
  const [data, setData] = useState<AcademicStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicStaff | null>(null);
  const [viewingItem, setViewingItem] = useState<AcademicStaff | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  // --- API Actions ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Assuming your endpoint is updated to /academic-staff
      const response = await fetch(`${API_BASE_URL}/api/academic-staff`);
      const result = await response.json();
      if (response.ok) setData(result);
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
      const response = await fetch(`${API_BASE_URL}/api/academic-staff/${itemToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== itemToDelete));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- Search Logic (Name, Dept, or Designation) ---
  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(paginatedData.map(n => n._id));
      return;
    }
    setSelectedItems([]);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (showAddForm) return <CreateAcademicStaff onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateAcademicStaff itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* 1. TOP UTILITY BAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip 
          label="University Directory" 
          size="small" 
          icon={<AccountBalanceOutlined sx={{ fontSize: '1rem !important' }} />}
          sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "rgba(0, 70, 82, 0.1)", color: primaryTeal, px: 1 }} 
        />
        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Stack>

      {/* 2. HEADER SECTION */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: "-1px" }}>
            Academic Staff
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Manage faculty profiles, department assignments, and academic roles.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<PersonAddOutlined />}
          sx={{ 
            fontFamily: primaryFont, bgcolor: primaryTeal, borderRadius: "12px", px: 3, py: 1.2,
            textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(0, 70, 82, 0.2)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Add Staff Member
        </Button>
      </Stack>

      {/* 3. SEARCH & FILTERS */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, department, or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: primaryFont }
          }}
        />
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchData} sx={{ border: "1px solid #E2E8F0" }}><RefreshOutlined /></IconButton>
        </Tooltip>
      </Paper>

      {/* 4. DATA TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "#FFF" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedData.length}
                  checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>PHOTO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>STAFF DETAILS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>DEPARTMENT</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>ACADEMIC TITLE</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>JOINED</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem", pr: 4 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
            {isLoading ? (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 12 }}><CircularProgress size={30} sx={{ color: primaryTeal }} /></TableCell></TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow 
                  component={motion.tr}
                  layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={item._id} hover sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
                  </TableCell>
                  <TableCell>
                    <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 48, height: 48, borderRadius: "12px", border: '1px solid #E2E8F0' }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: "0.95rem" }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>ID: {item._id.slice(-6).toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.department} 
                      size="small" 
                      variant="outlined" 
                      icon={<AccountTreeOutlined sx={{ fontSize: '0.8rem !important' }}/>}
                      sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#475569" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SchoolOutlined sx={{ fontSize: 16, color: "#64748B" }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                        {item.jobDescription}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Bio"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit Staff"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Remove"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                   <Typography sx={{ fontFamily: primaryFont, color: "#64748B" }}>No staff records found.</Typography>
                </TableCell>
              </TableRow>
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        {/* FOOTER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Box>{selectedItems.length > 0 && <Button color="error" size="small">Bulk Delete ({selectedItems.length})</Button>}</Box>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page} onChange={(_, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" } }}
          />
        </Stack>
      </TableContainer>

      {/* 5. VIEW PROFILE MODAL */}
      <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "24px" } }}>
        {viewingItem && (
          <>
            <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, p: 3 }}>
              Staff Profile
            </DialogTitle>
            <DialogContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar src={viewingItem.imageUrl} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, borderRadius: "20px", border: `4px solid ${primaryTeal}20` }} />
              <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>{viewingItem.name}</Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, mb: 3 }}>
                <Chip icon={<AccountTreeOutlined />} label={viewingItem.department} sx={{ fontWeight: 700, fontFamily: primaryFont }} />
                <Chip icon={<BadgeOutlined />} label={viewingItem.jobDescription} sx={{ fontWeight: 700, fontFamily: primaryFont }} />
              </Stack>

              <Paper elevation={0} sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 1 }}>Academic Biography</Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.6, fontSize: "0.9rem" }}>
                   {viewingItem.detailedBio}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ bgcolor: primaryTeal, borderRadius: "12px" }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 6. DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800 }}>Remove Staff Member?</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont }}>This action will permanently delete this staff record from the department database.</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: "#F43F5E" }}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcademicStaffManager;