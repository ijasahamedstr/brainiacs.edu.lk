import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, 
  Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Divider
} from "@mui/material";
import { 
  DeleteOutline, EditOutlined, 
  SearchOutlined, WarningAmberRounded,
  VisibilityOutlined, LinkOutlined,
  CloseOutlined, HandshakeOutlined, LanguageOutlined,
  DescriptionOutlined
} from "@mui/icons-material";
import AddPartnerForm from "./AddPartnerForm";
import UpdatePartnerForm from "./UpdatePartnerForm";

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

// Updated Interface for Partner Schema
interface Partner {
  _id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl?: string;
  createdAt: string;
}

const PartnerManagement = () => {
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/partners`);
      const data = await response.json();
      if (response.ok) setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openDeleteDialog = (id: string) => {
    setPartnerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setPartnerToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!partnerToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/partners/${partnerToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPartners((prev) => prev.filter((p) => p._id !== partnerToDelete));
        closeDeleteDialog();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredData = useMemo(() => {
    return partners.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, partners]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  if (showAddForm) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Box sx={{ bgcolor: surfaceColor, p: 3, minHeight: "100vh" }}>
          <AddPartnerForm onBack={() => { setShowAddForm(false); fetchPartners(); }} />
        </Box>
      </motion.div>
    );
  }

  if (editingPartner) {
    return (
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <Box sx={{ bgcolor: surfaceColor, p: 3, minHeight: "100vh" }}>
          {/* <UpdatePartnerForm partnerData={editingPartner} onBack={() => { setEditingPartner(null); fetchPartners(); }} /> */}
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
              Network Partners
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
              Manage corporate collaborations and institutional partnerships.
            </Typography>
        </Box>
        <Button 
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<HandshakeOutlined />}
          sx={{ 
            bgcolor: primaryTeal, borderRadius: "12px", px: 4, py: 2, 
            fontFamily: primaryFont, fontWeight: 700, textTransform: "none",
            fontSize: "0.95rem", boxShadow: "0 10px 20px -5px rgba(0, 70, 82, 0.4)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Add New Partner
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
          placeholder="Search partners by name or description..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600 }
          }}
        />
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
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", py: 3, fontSize: "0.75rem" }}>LOGO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>PARTNER INFO</TableCell>
              <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem", display: { xs: 'none', md: 'table-cell' } }}>DESCRIPTION</TableCell>
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
                paginatedData.map((partner) => (
                  <TableRow 
                    key={partner._id} 
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    hover
                  >
                    <TableCell>
                      <Avatar 
                        src={partner.logoUrl} 
                        variant="square" 
                        sx={{ width: 60, height: 60, borderRadius: "12px", p: 0.5, bgcolor: "#f8f9fa", border: "1px solid #E2E8F0", '& img': { objectFit: 'contain' } }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal }}>
                        {partner.name}
                      </Typography>
                      {partner.websiteUrl && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                           <LanguageOutlined sx={{ fontSize: 12, color: "#94A3B8" }} />
                           <Typography sx={{ fontFamily: primaryFont, fontSize: "0.7rem", color: "#94A3B8" }}>
                            {partner.websiteUrl.replace(/^https?:\/\//, '')}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: "300px" }}>
                      <Typography noWrap sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>
                        {partner.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton onClick={() => setViewingPartner(partner)} size="small" sx={{ color: primaryTeal }}>
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setEditingPartner(partner)} size="small" sx={{ color: "#64748B" }}>
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteDialog(partner._id)} size="small" sx={{ color: "#F43F5E" }}>
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography sx={{ fontFamily: primaryFont, color: "#94A3B8" }}>No partners found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 700, fontSize: "0.8rem" }}>
            Displaying {paginatedData.length} of {filteredData.length} partners
          </Typography>
          <Pagination 
            count={Math.ceil(filteredData.length / rowsPerPage)} 
            page={page}
            onChange={(e, v) => setPage(v)}
            sx={{ '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" }, '& .MuiPaginationItem-root': { fontFamily: primaryFont, fontWeight: 600 } }}
          />
        </Box>
      </TableContainer>

      <Dialog 
          open={Boolean(viewingPartner)} 
          onClose={() => setViewingPartner(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ 
            component: motion.div, 
            initial: { scale: 0.9, opacity: 0 }, 
            animate: { scale: 1, opacity: 1 }, 
            sx: { borderRadius: "24px", p: 1 } 
          }}
        >
          {viewingPartner && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "1.2rem" }}>
                  Partner Profile
                </Typography>
                <IconButton onClick={() => setViewingPartner(null)} size="small">
                  <CloseOutlined />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: '16px' }}>
                  <img 
                    src={viewingPartner.logoUrl} 
                    alt={viewingPartner.name} 
                    style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }} 
                  />
                </Box>

                <Stack spacing={2.5}>
                  {/* Partner Name */}
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                      Partner Name
                    </Typography>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal, fontSize: '1.1rem' }}>
                      {viewingPartner.name}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Updated Description Section (Handling Array) */}
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                      Description
                    </Typography>
                    
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                      {Array.isArray(viewingPartner.description) ? (
                        viewingPartner.description.map((point, index) => (
                          <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                            <DescriptionOutlined sx={{ fontSize: 18, color: primaryTeal, mt: 0.4 }} />
                            <Typography sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.6, flex: 1 }}>
                              {point}
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        // Fallback if data is a string
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <DescriptionOutlined sx={{ fontSize: 18, color: primaryTeal, mt: 0.4 }} />
                          <Typography sx={{ fontFamily: primaryFont, color: "#475569", lineHeight: 1.6 }}>
                            {viewingPartner.description}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>

                  {/* Website Section */}
                  {viewingPartner.websiteUrl && (
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                        Official Website
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <LinkOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                        <Typography 
                          component="a" 
                          href={viewingPartner.websiteUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            fontFamily: primaryFont, 
                            fontWeight: 600, 
                            color: primaryTeal, 
                            textDecoration: 'none', 
                            '&:hover': { textDecoration: 'underline' } 
                          }}
                        >
                          {viewingPartner.websiteUrl}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={() => setViewingPartner(null)} 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    bgcolor: primaryTeal, 
                    borderRadius: "12px", 
                    textTransform: "none", 
                    fontFamily: primaryFont, 
                    fontWeight: 700,
                    '&:hover': { bgcolor: primaryTeal, opacity: 0.9 }
                  }}
                >
                  Close Profile
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
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: primaryFont, fontWeight: 500, color: "#64748B" }}>
            Removing this partner will delete their profile from the directory. Do you wish to proceed?
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
            Remove Partner
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerManagement;