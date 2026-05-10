import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Checkbox, Chip, List, ListItemButton, ListItemText, Collapse,
  ListItemIcon
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, 
  SearchOutlined, WarningAmberRounded, VisibilityOutlined, 
  FileDownloadOutlined, RefreshOutlined, 
  CategoryOutlined, AccountTreeOutlined,
  ExpandLess, ExpandMore, Circle
} from "@mui/icons-material";
import CreateCategory from "./CreateCourseCategory";
import UpdateCategory from "./UpdateCourseCategory";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryIndigo = "#312E81"; 
const surfaceColor = "#F8FAFC";

// --- Interfaces ---
interface CategoryNode {
  id: string;
  title: string;
  children: CategoryNode[];
}

interface CategorySection {
  _id: string;
  sectionTitle: string; 
  categories: CategoryNode[];
  createdAt: string;
  updatedAt: string;
}

// --- NEW: Recursive Component to Display Tree ---
const CategoryRenderer = ({ node, depth = 0 }: { node: CategoryNode; depth?: number }) => {
  const [open, setOpen] = useState(true); // Default to open so user sees data immediately
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <ListItemButton 
        onClick={() => setOpen(!open)} 
        sx={{ 
          pl: 2 + (depth * 3), 
          py: 0.5,
          borderRadius: "8px",
          mb: 0.5,
          '&:hover': { bgcolor: "#EEF2FF" }
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: primaryIndigo }}>
          {hasChildren ? (
             open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />
          ) : (
             <Circle sx={{ fontSize: 6, opacity: 0.4 }} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={node.title} 
          primaryTypographyProps={{ 
            fontFamily: primaryFont, 
            fontWeight: hasChildren ? 600 : 500,
            fontSize: "0.9rem",
            color: hasChildren ? primaryIndigo : "#475569"
          }} 
        />
      </ListItemButton>
      
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <CategoryRenderer key={child.id} node={child} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const CourseCategoryManager = () => {
  const [data, setData] = useState<CategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CategorySection | null>(null);
  const [viewingItem, setViewingItem] = useState<CategorySection | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/course-categories`);
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
      const response = await fetch(`${API_BASE_URL}/api/course-categories/${itemToDelete}`, {
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

  const filteredData = useMemo(() => {
    return data.filter((item) => 
      (item.sectionTitle || "Untitled Section").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // Helper to count all nodes in a nested tree
  const countTotalNodes = (nodes: CategoryNode[]): number => {
    if (!nodes) return 0;
    return nodes.reduce((acc, curr) => acc + 1 + countTotalNodes(curr.children), 0);
  };

  const exportToCSV = () => {
    const headers = ["ID,SectionTitle,TotalNodes,CreatedAt,UpdatedAt\n"];
    const rows = filteredData.map(item => 
      `${item._id},"${item.sectionTitle || 'Untitled'}",${countTotalNodes(item.categories)},${item.createdAt},${item.updatedAt}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculum-architecture-report.csv`;
    a.click();
  };

  if (showAddForm) return <CreateCategory onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateCategory itemData={{ _id: editingItem._id, categories: editingItem.categories ?? [] }} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip label="Architecture Admin" size="small" sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "rgba(49, 46, 129, 0.1)", color: primaryIndigo }} />
        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>System live: {new Date().toLocaleTimeString()}</Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryIndigo, letterSpacing: "-1px" }}>
            Curriculum Maps
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Management of nested course architectures and department structures.
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={exportToCSV} startIcon={<FileDownloadOutlined />} sx={{ fontFamily: primaryFont, color: primaryIndigo, borderColor: primaryIndigo, borderRadius: "12px", textTransform: "none", fontWeight: 700 }}>
            Export
          </Button>
          <Button variant="contained" onClick={() => setShowAddForm(true)} startIcon={<CategoryOutlined />} sx={{ fontFamily: primaryFont, bgcolor: primaryIndigo, borderRadius: "12px", px: 3, py: 1.2, textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(49, 46, 129, 0.2)", '&:hover': { bgcolor: "#1E1B4B" } }}>
            New Architecture
          </Button>
        </Stack>
      </Stack>

      {/* SEARCH */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by section title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryIndigo }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: primaryFont }
          }}
        />
        <Tooltip title="Reload Records"><IconButton onClick={fetchData} sx={{ border: "1px solid #E2E8F0" }}><RefreshOutlined /></IconButton></Tooltip>
      </Paper>

      {/* DATA TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "#FFF" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedData.length}
                  checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                  onChange={(e) => e.target.checked ? setSelectedItems(paginatedData.map(n => n._id)) : setSelectedItems([])}
                />
              </TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>SECTION TITLE</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>HIERARCHY STATS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>LAST UPDATED</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem", pr: 4 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 12 }}><CircularProgress size={30} sx={{ color: primaryIndigo }} /></TableCell></TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow component={motion.tr} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(item._id)} onChange={() => setSelectedItems(prev => prev.includes(item._id) ? prev.filter(i => i !== item._id) : [...prev, item._id])} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: '8px' }}><AccountTreeOutlined sx={{ color: primaryIndigo }} /></Box>
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryIndigo }}>
                        {item.sectionTitle || "Untitled Architecture"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={`${countTotalNodes(item.categories)} Total Nodes`} sx={{ fontFamily: primaryFont, fontWeight: 600, bgcolor: surfaceColor }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Tree"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryIndigo, bgcolor: "#EEF2FF" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit Map"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}><Typography sx={{ fontFamily: primaryFont, color: "#64748B" }}>No architectures found</Typography></TableCell></TableRow>
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Box>{selectedItems.length > 0 && <Button size="small" color="error" startIcon={<DeleteOutline />} sx={{ fontFamily: primaryFont, fontWeight: 700 }}>Bulk Delete ({selectedItems.length})</Button>}</Box>
          <Pagination count={Math.ceil(filteredData.length / rowsPerPage)} page={page} onChange={(_, v) => setPage(v)} sx={{ '& .Mui-selected': { bgcolor: `${primaryIndigo} !important`, color: "#FFF" }, '& .MuiPaginationItem-root': { fontFamily: primaryFont, fontWeight: 600 } }} />
        </Stack>
      </TableContainer>

      {/* VIEW MODAL - RECURSIVE DISPLAY */}
      <Dialog 
        open={Boolean(viewingItem)} 
        onClose={() => setViewingItem(null)} 
        fullWidth 
        maxWidth="sm" 
        PaperProps={{ sx: { borderRadius: "24px", p: 1, maxHeight: "85vh" } }}
      >
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountTreeOutlined sx={{ color: primaryIndigo }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: primaryIndigo }}>
              Architecture Preview
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers sx={{ borderColor: "#F1F5F9" }}>
          {viewingItem ? (
            <Box>
              {/* Header Info */}
              <Box sx={{ mb: 3, p: 2, bgcolor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <Typography variant="subtitle2" sx={{ color: "#64748B", fontFamily: primaryFont, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  Section Name
                </Typography>
                <Typography variant="h6" sx={{ color: primaryIndigo, fontWeight: 700, fontFamily: primaryFont }}>
                  {viewingItem.sectionTitle || "Untitled Section"}
                </Typography>
                <Stack direction="row" spacing={2} mt={1}>
                   <Chip size="small" label={`Database ID: ${viewingItem._id}`} sx={{ fontSize: "0.7rem", fontFamily: primaryFont }} />
                   <Chip size="small" label={`${countTotalNodes(viewingItem.categories)} Total Nodes`} color="primary" variant="outlined" sx={{ fontSize: "0.7rem", fontFamily: primaryFont, fontWeight: 600 }} />
                </Stack>
              </Box>

              {/* The Recursive Tree */}
              <Typography variant="subtitle2" sx={{ mb: 1, ml: 1, color: "#64748B", fontFamily: primaryFont, fontWeight: 700 }}>
                FULL HIERARCHY
              </Typography>
              
              <Paper elevation={0} variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden" }}>
                <List component="nav" disablePadding>
                  {viewingItem.categories && viewingItem.categories.length > 0 ? (
                    viewingItem.categories.map((category) => (
                      <CategoryRenderer key={category.id} node={category} />
                    ))
                  ) : (
                    <Box p={3} textAlign="center">
                        <Typography sx={{ color: "#94A3B8", fontStyle: "italic", fontFamily: primaryFont }}>
                        No categories defined in this section.
                        </Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </Box>
          ) : null}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setViewingItem(null)} 
            variant="contained"
            sx={{ 
              fontFamily: primaryFont, 
              fontWeight: 700, 
              borderRadius: "10px", 
              bgcolor: primaryIndigo, 
              textTransform: "none" 
            }}
          >
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800 }}><WarningAmberRounded sx={{ mr: 1, color: "#F43F5E", verticalAlign: 'middle' }} /> Delete Map?</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: primaryFont }}>This will permanently remove the entire course architecture.</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: "#F43F5E", borderRadius: "10px" }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseCategoryManager;