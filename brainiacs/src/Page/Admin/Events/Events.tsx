import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  AvatarGroup, Tooltip, Checkbox, Chip, Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, AddPhotoAlternateOutlined, 
  SearchOutlined, RefreshOutlined, VisibilityOutlined, 
  PlaceOutlined, AccessTimeOutlined, EventOutlined,
  CalendarTodayOutlined
} from "@mui/icons-material";
import CreateEvent from "./CreateEvents";
import UpdateEvent from "./UpdateEvents";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// Interface matching your Mongoose Schema
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
  // --- States ---
  const [data, setData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventData | null>(null);
  const [viewingItem, setViewingItem] = useState<EventData | null>(null);
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
      const response = await fetch(`${API_BASE_URL}/api/events`);
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
      const response = await fetch(`${API_BASE_URL}/api/events/${itemToDelete}`, {
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
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase())
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

  // --- Conditional Renders ---
  if (showAddForm) return <CreateEvent onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateEvent itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh", fontFamily: primaryFont }}>
      
      {/* HEADER SECTION */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, letterSpacing: "-1px" }}>
            Event Manager
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Management portal for campus scheduling and location logistics.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<AddPhotoAlternateOutlined />}
          sx={{ 
            fontFamily: primaryFont, bgcolor: primaryTeal, borderRadius: "12px", px: 4, py: 1.5,
            textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(0, 70, 82, 0.2)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Create New Event
        </Button>
      </Stack>

      {/* SEARCH BOX */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: primaryFont }
          }}
        />
        <Tooltip title="Refresh Database">
          <IconButton onClick={fetchData} sx={{ border: "1px solid #E2E8F0" }}><RefreshOutlined /></IconButton>
        </Tooltip>
      </Paper>

      {/* DATA TABLE */}
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
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>MEDIA</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>EVENT INFO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>LOGISTICS</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>DATES</TableCell>
              <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem", pr: 4 }}>ACTIONS</TableCell>
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
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
                  </TableCell>
                  <TableCell>
                    <AvatarGroup max={3} sx={{ justifyContent: 'flex-start', '& .MuiAvatar-root': { width: 40, height: 40, border: '2px solid white' } }}>
                      {item.imageUrls.map((url, idx) => (
                        <Avatar key={idx} src={url} variant="rounded" />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: "0.95rem" }}>{item.eventName}</Typography>
                    <Typography sx={{ fontFamily: primaryFont, fontSize: "0.7rem", color: "#94A3B8" }}>ID: {item._id.slice(-6).toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PlaceOutlined sx={{ fontSize: 14 }} /> {item.eventPlace}
                      </Typography>
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 600, color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeOutlined sx={{ fontSize: 14 }} /> {item.eventTime}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Chip label={`Start: ${new Date(item.startDate).toLocaleDateString()}`} size="small" sx={{ fontFamily: primaryFont, fontSize: '0.65rem', height: 20, bgcolor: "#F1F5F9" }} />
                      <Chip label={`End: ${new Date(item.finishDate).toLocaleDateString()}`} size="small" variant="outlined" sx={{ fontFamily: primaryFont, fontSize: '0.65rem', height: 20 }} />
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Pop View"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><Typography sx={{ fontFamily: primaryFont }}>No matching records found.</Typography></TableCell></TableRow>
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Box>
            {selectedItems.length > 0 && (
              <Button size="small" color="error" startIcon={<DeleteOutline />} sx={{ fontFamily: primaryFont, fontWeight: 700, textTransform: "none" }}>
                Delete Selected ({selectedItems.length})
              </Button>
            )}
          </Box>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" }, '& .MuiPaginationItem-root': { fontFamily: primaryFont } }}
          />
        </Stack>
      </TableContainer>

      {/* POP SCREEN (VIEW MODAL) */}
      <Dialog 
        open={Boolean(viewingItem)} 
        onClose={() => setViewingItem(null)} 
        fullWidth 
        maxWidth="md" 
        PaperProps={{ sx: { borderRadius: "24px" } }}
      >
        {viewingItem && (
          <>
            <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, p: 3, pb: 1 }}>
              {viewingItem.eventName}
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              {/* IMAGE GALLERY */}
              <Box sx={{ p: 3, display: 'flex', gap: 2, overflowX: 'auto', bgcolor: "#F1F5F9" }}>
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
              <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', border: `1px solid ${primaryTeal}20` }}>
                  <Typography sx={{ fontFamily: primaryFont, fontSize: "0.65rem", color: "#64748B", fontWeight: 700, textTransform: 'uppercase', mb: 1.5 }}>
                    Location & Time
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <PlaceOutlined sx={{ fontSize: 20, color: primaryTeal }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.95rem", fontWeight: 600 }}>{viewingItem.eventPlace}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <AccessTimeOutlined sx={{ fontSize: 20, color: primaryTeal }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.95rem", fontWeight: 600 }}>{viewingItem.eventTime}</Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', border: `1px solid ${primaryTeal}20` }}>
                  <Typography sx={{ fontFamily: primaryFont, fontSize: "0.65rem", color: "#64748B", fontWeight: 700, textTransform: 'uppercase', mb: 1.5 }}>
                    Event Dates
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <CalendarTodayOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.9rem", fontWeight: 600 }}>
                        Starts: {new Date(viewingItem.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <EventOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.9rem", fontWeight: 600 }}>
                        Ends: {new Date(viewingItem.finishDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              {/* DESCRIPTION BLOCKS */}
              <Box sx={{ px: 3, pb: 4 }}>
                <Typography sx={{ fontFamily: primaryFont, mb: 2, fontWeight: 800, fontSize: "0.75rem", color: primaryTeal, letterSpacing: "1px" }}>
                  DETAILED DESCRIPTION
                </Typography>
                {viewingItem.eventDescription.map((para, i) => (
                  <Typography 
                    key={i} 
                    sx={{ 
                      fontFamily: primaryFont, 
                      fontSize: '0.95rem', 
                      color: '#334155', 
                      lineHeight: 1.7, 
                      mb: 2,
                      bgcolor: '#F8FAFC',
                      p: 2.5,
                      borderRadius: '12px',
                      borderLeft: `5px solid ${primaryTeal}`
                    }}
                  >
                    {para}
                  </Typography>
                ))}
              </Box>

              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ fontFamily: primaryFont, fontSize: '0.65rem', color: '#94A3B8' }}>
                  Database Record Created: {new Date(viewingItem.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#F8FAFC" }}>
              <Button 
                onClick={() => setViewingItem(null)} 
                fullWidth 
                variant="contained" 
                sx={{ 
                  fontFamily: primaryFont, 
                  fontWeight: 800, 
                  bgcolor: primaryTeal, 
                  borderRadius: "12px", 
                  textTransform: "none",
                  py: 1.5
                }}
              >
                Close Pop Screen
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "20px" } }}>
         <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800 }}>Remove Event?</DialogTitle>
         <DialogContent><DialogContentText sx={{ fontFamily: primaryFont }}>This action is permanent. This event will be removed from all public calendars.</DialogContentText></DialogContent>
         <DialogActions sx={{ p: 2.5 }}>
           <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, textTransform: "none", color: "#64748B" }}>Cancel</Button>
           <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: primaryFont, fontWeight: 700, textTransform: "none", bgcolor: "#F43F5E" }}>Confirm Delete</Button>
         </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManager;