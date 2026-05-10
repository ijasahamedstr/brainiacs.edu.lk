import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Checkbox, Chip, Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, WarningAmberRounded, VisibilityOutlined, 
  DescriptionOutlined, CollectionsOutlined, FileDownloadOutlined,
  RefreshOutlined, ChevronRightRounded,
  ImageOutlined
} from "@mui/icons-material";
import CreateFaculty from "./CreateFaculties";
import UpdateFaculty from "./UpdateFaculties";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// --- New Interface Definition ---
interface Faculty {
  _id: string;
  name: string;               // Faculty Name
  descriptions: string[];     // Faculty Description Array
  imageUrls: string[];        // Faculty Images Array (Gallery)
  coverImage: string;         // Cover Image Link
  deanName: string;           // Dean Name
  deanImage: string;          // Dean Image Link
  createdAt: string;
}

const FacultiesManager = () => {
  // --- States ---
  const [data, setData] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Faculty | null>(null);
  const [viewingItem, setViewingItem] = useState<Faculty | null>(null);
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
      const response = await fetch(`${API_BASE_URL}/api/faculties`);
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
      const response = await fetch(`${API_BASE_URL}/api/faculties/${itemToDelete}`, {
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
      item.deanName.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Updated CSV Export with new fields
  const exportToCSV = () => {
    const headers = ["ID,FacultyName,DeanName,DescriptionsCount,GalleryCount,CoverImage,CreatedAt\n"];
    const rows = filteredData.map(item => 
      `${item._id},"${item.name}","${item.deanName}",${item.descriptions.length},${item.imageUrls.length},"${item.coverImage}",${item.createdAt}`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculties-report.csv`;
    a.click();
  };

  // --- Conditional Renders ---
  if (showAddForm) return <CreateFaculty onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateFaculty itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* 1. TOP UTILITY BAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Chip 
          label="Academic Admin" 
          size="small" 
          sx={{ fontFamily: primaryFont, fontWeight: 700, bgcolor: "rgba(0, 70, 82, 0.1)", color: primaryTeal }} 
        />
        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Stack>

      {/* 2. HEADER SECTION */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: "-1px" }}>
            Faculties Manager
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Manage academic departments, deans, and faculty galleries.
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            onClick={exportToCSV}
            startIcon={<FileDownloadOutlined />}
            sx={{ fontFamily: primaryFont, color: primaryTeal, borderColor: primaryTeal, borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setShowAddForm(true)} 
            startIcon={<AddPhotoAlternateOutlined />}
            sx={{ 
              fontFamily: primaryFont, bgcolor: primaryTeal, borderRadius: "12px", px: 3, py: 1.2,
              textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(0, 70, 82, 0.2)",
              '&:hover': { bgcolor: "#002d35" }
            }}
          >
            Add Faculty
          </Button>
        </Stack>
      </Stack>

      {/* 3. SEARCH & FILTERS */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by faculty or dean name..."
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
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedData.length}
                  checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>FACULTY DETAILS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>DEAN / LEADERSHIP</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>CONTENT STATS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.7rem" }}>CREATED AT</TableCell>
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
                  
                  {/* Column 1: Faculty Info & Cover Image */}
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        src={item.coverImage} 
                        variant="rounded" 
                        sx={{ width: 60, height: 45, border: "1px solid #E2E8F0" }}
                      >
                        <ImageOutlined />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: "0.95rem" }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>
                          ID: {item._id.slice(-6).toUpperCase()}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Column 2: Dean Info */}
                  <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={item.deanImage} sx={{ width: 32, height: 32 }}>
                          {item.deanName?.charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#475569", fontSize: "0.85rem" }}>
                          {item.deanName}
                        </Typography>
                      </Stack>
                  </TableCell>

                  {/* Column 3: Statistics */}
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CollectionsOutlined sx={{ fontSize: 12 }} /> {item.imageUrls.length} Gallery Imgs
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DescriptionOutlined sx={{ fontSize: 12 }} /> {item.descriptions.length} Desc. Blocks
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Column 4: Date */}
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>

                  {/* Column 5: Actions */}
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Preview Details"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Box sx={{ opacity: 0.5 }}>
                    <SearchOutlined sx={{ fontSize: 48, color: "#CBD5E1", mb: 2 }} />
                    <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 600 }}>No faculties found</Typography>
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
                Delete Selected ({selectedItems.length})
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

      {/* 6. PREVIEW MODAL */}
      <Dialog 
        open={Boolean(viewingItem)} 
        onClose={() => setViewingItem(null)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "24px", overflow: 'hidden' } }}
      >
        {viewingItem && (
          <>
            {/* Modal Header with Cover Image */}
            <Box sx={{ position: 'relative', height: 180, width: '100%', bgcolor: '#eee' }}>
               <Box component="img" src={viewingItem.coverImage} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
               <Box sx={{ position: 'absolute', bottom: 20, left: 24 }}>
                  <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: '#FFF' }}>
                    {viewingItem.name}
                  </Typography>
               </Box>
               <IconButton onClick={() => setViewingItem(null)} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.2)', color: '#FFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)'} }}>
                  <ChevronRightRounded sx={{ transform: 'rotate(90deg)' }} />
               </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: 300 }}>
                 
                 {/* Left Side: Dean Info & Gallery */}
                 <Box sx={{ 
                    flex: { md: '0 0 35%' }, // ~35% width on desktop
                    bgcolor: "#F8FAFC", 
                    borderRight: { md: '1px solid #E2E8F0' }, 
                    borderBottom: { xs: '1px solid #E2E8F0', md: 'none' },
                    p: 3 
                 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                       <Avatar src={viewingItem.deanImage} sx={{ width: 100, height: 100, mb: 2, mx: 'auto', border: `4px solid #FFF`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Typography variant="h6" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#1E293B" }}>{viewingItem.deanName}</Typography>
                       <Chip label="Dean of Faculty" size="small" sx={{ mt: 1, bgcolor: primaryTeal, color: 'white', fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 2, color: "#64748B" }}>Gallery Preview</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                       {viewingItem.imageUrls.slice(0, 4).map((url, i) => (
                          <Box key={i} sx={{ width: 'calc(50% - 4px)' }}>
                             <Box component="img" src={url} sx={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                          </Box>
                       ))}
                    </Box>
                 </Box>

                 {/* Right Side: Descriptions */}
                 <Box sx={{ flex: 1, p: 3 }}>
                   <Typography variant="subtitle2" sx={{ fontFamily: primaryFont, fontWeight: 700, mb: 2, color: primaryTeal }}>About the Faculty</Typography>
                   {viewingItem.descriptions.map((desc, i) => (
                     <Typography key={i} paragraph sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>
                       {desc}
                     </Typography>
                   ))}
                 </Box>
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
              <Button onClick={() => setViewingItem(null)} sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 700 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberRounded sx={{ color: "#F43F5E" }} /> Delete Faculty?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont }}>
            This will permanently remove <b>{data.find(i => i._id === itemToDelete)?.name}</b> and all associated dean profiles and gallery images.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: primaryFont, bgcolor: "#F43F5E", borderRadius: "10px", px: 3 }}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultiesManager;