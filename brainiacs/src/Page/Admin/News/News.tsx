import { useState, useMemo, useEffect } from "react";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  AvatarGroup, Tooltip, Chip, Zoom, Fade, Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, SearchOutlined, WarningAmberRounded, 
  VisibilityOutlined, NewspaperOutlined, FilterListOutlined,
  RefreshOutlined, CalendarMonthOutlined, ArrowForwardIosRounded,
} from "@mui/icons-material";
import CreateNews from "./CreateNews";
import UpdateNews from "./UpdateNews";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F1F5F9";
const borderColor = "#E2E8F0";

interface NewsItem {
  _id: string;
  heading: string;
  descriptions: string[]; 
  imageUrls: string[]; 
  descriptionImage: string;
  createdAt: string;
  tags?: string[];
  slug: string;
  author: string;
  status: "draft" | "published";
}

const NewsManager = () => {
  const [data, setData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [viewingItem, setViewingItem] = useState<NewsItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  // --- API ACTIONS ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${itemToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== itemToDelete));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- LOGIC ---
  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.heading?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // Reset page when searching
  useEffect(() => { setPage(1); }, [searchQuery]);

  // Styles
  const headerCellStyle = { 
    fontFamily: primaryFont, 
    fontWeight: 800, 
    color: "#64748B", 
    fontSize: "0.75rem", 
    textTransform: "uppercase",
    letterSpacing: "1px",
    py: 2.5
  };

  const bodyCellStyle = { 
    fontFamily: primaryFont, 
    color: "#1E293B", 
    fontSize: "0.9rem",
    py: 2
  };

  if (showAddForm) return <CreateNews onBack={() => { setShowAddForm(false); fetchData(); }} />;
  if (editingItem) return <UpdateNews itemData={{ ...editingItem, tags: editingItem.tags || [] }} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 5 }, minHeight: "100vh" }}>
      
      {/* TOP BRANDING & ACTION HEADER */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={5}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
            <Box sx={{ bgcolor: primaryTeal, p: 1, borderRadius: "12px", display: "flex" }}>
               <NewspaperOutlined sx={{ color: "#FFF" }} />
            </Box>
            <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
              Publisher Dashboard
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 500 }}>
            Global News Distribution & Editorial Control Center
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh Feed">
            <IconButton onClick={fetchData} sx={{ border: `1px solid ${borderColor}`, bgcolor: "#FFF" }}>
              <RefreshOutlined />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            disableElevation
            onClick={() => setShowAddForm(true)} 
            startIcon={<NewspaperOutlined />}
            sx={{ 
              bgcolor: primaryTeal, 
              borderRadius: "14px", 
              textTransform: "none", 
              fontFamily: primaryFont,
              fontWeight: 800,
              px: 4,
              py: 1.5,
              "&:hover": { bgcolor: "#00353d" }
            }}
          >
            Create New Article
          </Button>
        </Stack>
      </Stack>

      {/* FILTER & SEARCH UTILITIES */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: "20px", border: `1px solid ${borderColor}`, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter articles by headline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "12px", fontFamily: primaryFont, bgcolor: "#F8FAFC" }
          }}
        />
        <Button startIcon={<FilterListOutlined />} sx={{ fontFamily: primaryFont, color: "#64748B", textTransform: "none", fontWeight: 700 }}>Filters</Button>
      </Paper>

      {/* MAIN CONTENT TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: `1px solid ${borderColor}`, overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ p: 10, textAlign: "center" }}>
            <CircularProgress size={40} sx={{ color: primaryTeal }} />
            <Typography sx={{ mt: 2, fontFamily: primaryFont, fontWeight: 600, color: "#94A3B8" }}>Loading Articles...</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={headerCellStyle}>Cover & Gallery</TableCell>
                <TableCell sx={headerCellStyle}>Editorial Heading</TableCell>
                <TableCell sx={headerCellStyle}>Publish Date</TableCell>
                <TableCell sx={headerCellStyle}>Tags</TableCell>
                <TableCell align="right" sx={{ ...headerCellStyle, pr: 4 }}>Management</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={bodyCellStyle}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={item.descriptionImage} variant="rounded" sx={{ width: 60, height: 40, borderRadius: "8px", border: `1px solid ${borderColor}` }} />
                      <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.6rem", fontFamily: primaryFont } }}>
                        {item.imageUrls?.map((url, i) => <Avatar key={i} src={url} />)}
                      </AvatarGroup>
                    </Stack>
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    <Typography sx={{ fontWeight: 700, fontFamily: primaryFont, color: "#1E293B", lineHeight: 1.2 }}>{item.heading}</Typography>
                    <Typography sx={{ fontSize: "0.70rem", fontFamily: primaryFont, color: "#94A3B8", mt: 0.5 }}>
                       {item.descriptions?.length || 0} Narrative Blocks
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthOutlined sx={{ fontSize: 16, color: "#94A3B8" }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", fontWeight: 600 }}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    <Stack direction="row" spacing={0.5}>
                      {item.tags?.slice(0, 2).map((tag, i) => (
                        <Chip key={i} label={tag} size="small" sx={{ height: 20, fontSize: "0.65rem", fontFamily: primaryFont, fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Quick View"><IconButton onClick={() => setViewingItem(item)} sx={{ color: primaryTeal }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton onClick={() => setEditingItem(item)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton onClick={() => { setItemToDelete(item._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* PAGINATION FOOTER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderTop: `1px solid ${borderColor}`, bgcolor: "#F8FAFC" }}>
          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>
            Showing {paginatedData.length} of {filteredData.length} Results
          </Typography>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage) || 1} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            sx={{ "& .MuiPaginationItem-root": { fontFamily: primaryFont, fontWeight: 700 } }}
          />
        </Stack>
      </TableContainer>

      {/* ARTICLE PREVIEW MODAL */}
      <Dialog 
        open={Boolean(viewingItem)} 
        onClose={() => setViewingItem(null)} 
        fullWidth maxWidth="md"
        TransitionComponent={Fade}
        PaperProps={{ sx: { borderRadius: "28px", p: 1 } }}
      >
        {viewingItem && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, fontSize: "1.3rem", color: primaryTeal }}>{viewingItem.heading}</Typography>
              <IconButton onClick={() => setViewingItem(null)}><ArrowForwardIosRounded sx={{ transform: "rotate(90deg)" }} /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ width: "100%", height: 300, borderRadius: "20px", mb: 3, overflow: "hidden" }}>
                  <img src={viewingItem.descriptionImage} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
                
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, mb: 2, fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase" }}>Content Body</Typography>
                {viewingItem.descriptions?.map((desc, i) => (
                  <Box key={i} sx={{ mb: 3, fontFamily: primaryFont, color: "#334155", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: desc }} />
                ))}

                <Divider sx={{ my: 4 }} />
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, mb: 2, fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase" }}>Gallery Assets</Typography>
                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
                  {viewingItem.imageUrls?.map((url, i) => (
                    <Box key={i} component="img" src={url} alt={`Gallery ${i}`} sx={{ height: 140, borderRadius: "14px", border: `1px solid ${borderColor}` }} />
                  ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingItem(null)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B" }}>Close Preview</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{ sx: { borderRadius: "24px", p: 2 } }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <WarningAmberRounded sx={{ color: "#F43F5E", fontSize: 60, mb: 2 }} />
          <Typography sx={{ fontFamily: primaryFont, fontWeight: 900, fontSize: "1.4rem" }}>Confirm Deletion</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, textAlign: "center", color: "#64748B" }}>
            Are you sure you want to delete this article? This action is permanent and will remove the news from all public feeds.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#64748B", textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: "#F43F5E", fontFamily: primaryFont, fontWeight: 800, textTransform: "none", px: 4, borderRadius: "12px", "&:hover": { bgcolor: "#BE123C" } }}>Delete Forever</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default NewsManager;