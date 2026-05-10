import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Checkbox, Chip, Link
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, SearchOutlined, WarningAmberRounded, 
  VisibilityOutlined, DescriptionOutlined, RefreshOutlined, 
  LanguageOutlined, BusinessOutlined, AddBusinessOutlined
} from "@mui/icons-material";

// Components
import CreatePartner from "./AddPartnerForm";
import UpdatePartner from "./UpdatePartnerForm";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

interface Partner {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description: string[]; 
  createdAt: string;
}

const PartnerManager = () => {
  // --- States ---
  const [data, setData] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [viewingItem, setViewingItem] = useState<Partner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  // --- API Actions ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/partners`);
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
      const response = await fetch(`${API_BASE_URL}/api/partners/${itemToDelete}`, {
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
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (showAddForm) return <CreatePartner onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdatePartner itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* 1. TOP UTILITY BAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip 
          label="Corporate Relations" 
          size="small" 
          sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "rgba(0, 70, 82, 0.1)", color: primaryTeal }} 
        />
        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
          Database active: {new Date().toLocaleTimeString()}
        </Typography>
      </Stack>

      {/* 2. HEADER SECTION */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: "-1px" }}>
            Partner Directory
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Manage official partnerships, logos, and organization profiles.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<AddBusinessOutlined />}
          sx={{ 
            fontFamily: primaryFont, bgcolor: primaryTeal, borderRadius: "12px", px: 4, py: 1.2,
            textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(0, 70, 82, 0.2)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Add Partner
        </Button>
      </Stack>

      {/* 3. SEARCH & FILTERS */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search partners by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: primaryFont }
          }}
        />
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchData} sx={{ border: "1px solid #E2E8F0" }}>
            <RefreshOutlined />
          </IconButton>
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
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>LOGO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>PARTNER INFO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>DESCRIPTION</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>JOINED DATE</TableCell>
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
                  component={motion.tr} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={item._id} hover 
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
                  </TableCell>
                  <TableCell>
                    <Avatar 
                        src={item.logoUrl} 
                        variant="rounded" 
                        sx={{ width: 48, height: 48, border: '1px solid #E2E8F0', bgcolor: '#FFF', p: 0.5 }}
                    >
                        <BusinessOutlined />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: "0.95rem" }}>{item.name}</Typography>
                    {item.websiteUrl && (
                        <Link href={item.websiteUrl} target="_blank" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: '#94A3B8', fontSize: '0.75rem' }}>
                            <LanguageOutlined sx={{ fontSize: 12 }} /> Visit Website
                        </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DescriptionOutlined sx={{ fontSize: 14 }} /> {item.description.length} Para(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Profile">
                        <IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}>
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Partner">
                        <IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}>
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}>
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <SearchOutlined sx={{ fontSize: 48, color: "#CBD5E1", mb: 2 }} />
                  <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600 }}>No partners found</Typography>
                </TableCell>
              </TableRow>
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Box>
            {selectedItems.length > 0 && (
              <Button size="small" variant="text" color="error" startIcon={<DeleteOutline />} sx={{ fontFamily: primaryFont, fontWeight: 700, textTransform: 'none' }}>
                Remove Selected ({selectedItems.length})
              </Button>
            )}
          </Box>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" } }}
          />
        </Stack>
      </TableContainer>

      {/* 5. VIEW MODAL */}
      <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "24px" } }}>
        {viewingItem && (
          <>
            <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={viewingItem.logoUrl} variant="rounded" sx={{ width: 40, height: 40, border: '1px solid #E2E8F0' }} />
              {viewingItem.name}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 2, color: "#1E293B" }}>About Organization</Typography>
              {viewingItem.description.map((text, i) => (
                <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: "12px", mb: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <Typography sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.6, fontSize: "0.9rem" }}>{text}</Typography>
                </Paper>
              ))}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ bgcolor: primaryTeal, borderRadius: "12px", py: 1.5, textTransform: 'none', fontFamily: primaryFont, fontWeight: 700 }}>Close Profile</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 6. DELETE CONFIRMATION */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberRounded sx={{ color: "#F43F5E" }} /> Remove Partner?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500 }}>
            This will permanently remove the partner profile and their logo from the system. This action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8", textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: "#F43F5E", borderRadius: "10px", textTransform: 'none', fontWeight: 700 }}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerManager;