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
  DeleteOutline, EditOutlined, SearchOutlined, WarningAmberRounded, 
  VisibilityOutlined, FileDownloadOutlined,
  RefreshOutlined, ChevronRightRounded, 
  WorkOutline, PersonAddOutlined, CorporateFare, BadgeOutlined
} from "@mui/icons-material";
import CreateGovernance from "./CreateBoardofGovernance";
import UpdateGovernance from "./UpdateBoardofGovernance";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// Updated Interface for Board Members
interface BoardMember {
  _id: string;
  name: string;
  jobDescription: string;
  detailedBio: string;
  imageUrl: string; // Changed from array to single string for profile photos
  createdAt: string;
}

const BoardGovernanceManager = () => {
  // --- States ---
  const [data, setData] = useState<BoardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardMember | null>(null);
  const [viewingItem, setViewingItem] = useState<BoardMember | null>(null);
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
      const response = await fetch(`${API_BASE_URL}/api/board-governance`);
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
      const response = await fetch(`${API_BASE_URL}/api/board-governance/${itemToDelete}`, {
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

  // --- Logic Helpers ---
  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
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

  const exportToCSV = () => {
    const headers = ["ID,Name,JobDescription,CreatedAt\n"];
    const rows = filteredData.map(item => 
      `${item._id},${item.name},"${item.jobDescription}",${item.createdAt}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `board-governance-list.csv`;
    a.click();
  };

  // --- Conditional Renders ---
  if (showAddForm) return <CreateGovernance onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateGovernance itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* 1. TOP UTILITY BAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip 
          label="Corporate Governance" 
          size="small" 
          icon={<CorporateFare sx={{ fontSize: '1rem !important' }} />}
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
            Board of Governance
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Manage leadership profiles, executive roles, and member designations.
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
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
            Add Board Member
          </Button>
        </Stack>
      </Stack>

      {/* 3. SEARCH & FILTERS */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or designation..."
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
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>PROFILE</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>MEMBER DETAILS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>DESIGNATION / JOB</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>DATE JOINED</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem", pr: 4 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 12 }}><CircularProgress size={30} sx={{ color: primaryTeal }} /></TableCell></TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow 
                  component={motion.tr}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={item._id} 
                  hover 
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
                  </TableCell>
                  <TableCell>
                    <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 48, height: 48, borderRadius: "12px", border: '1px solid #E2E8F0' }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: "0.95rem" }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>UID: {item._id.slice(-6).toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkOutline sx={{ fontSize: 16, color: "#64748B" }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                        {item.jobDescription}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Profile"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit Member"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Remove"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Box sx={{ opacity: 0.5 }}>
                    <SearchOutlined sx={{ fontSize: 48, color: "#CBD5E1", mb: 2 }} />
                    <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600 }}>No board members found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        {/* 5. FOOTER / PAGINATION */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Box>
            {selectedItems.length > 0 && (
              <Button size="small" color="error" startIcon={<DeleteOutline />} sx={{ fontFamily: primaryFont, fontWeight: 700 }}>
                Bulk Delete ({selectedItems.length})
              </Button>
            )}
          </Box>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" }, '& .MuiPaginationItem-root': { fontFamily: primaryFont, fontWeight: 600 } }}
          />
        </Stack>
      </TableContainer>

      {/* 6. MODALS & DIALOGS */}
      <Dialog 
        open={Boolean(viewingItem)} 
        onClose={() => setViewingItem(null)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "24px" } }}
      >
        {viewingItem && (
          <>
            <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, p: 3, display: 'flex', justifyContent: 'space-between' }}>
              Member Profile
              <IconButton onClick={() => setViewingItem(null)}><ChevronRightRounded sx={{ transform: 'rotate(90deg)' }} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar 
                src={viewingItem.imageUrl} 
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2, borderRadius: "20px", border: `4px solid ${primaryTeal}20` }} 
              />
              <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
                {viewingItem.name}
              </Typography>
              <Chip 
                icon={<BadgeOutlined />} 
                label={viewingItem.jobDescription} 
                sx={{ mt: 1, mb: 3, fontWeight: 700, fontFamily: primaryFont, bgcolor: "#F1F5F9" }} 
              />
              <Paper elevation={0} sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 1, color: "#1E293B" }}>Role & Responsibilities</Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.6, fontSize: "0.9rem" }}>
                   This section contains the official job description and governance responsibilities for {viewingItem.name}.
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: primaryTeal, py: 1.5, borderRadius: "12px" }}>
                Done
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberRounded sx={{ color: "#F43F5E" }} /> Remove Member?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont }}>
            Are you sure you want to remove this member? This will delete their profile from the Board of Governance records.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: "#F43F5E", borderRadius: "10px", px: 3 }}>Remove Member</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardGovernanceManager;