import { useState, useMemo, useEffect } from "react";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, 
  Button, Fade, TextField, MenuItem, InputAdornment, 
  Pagination, Tooltip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Chip
} from "@mui/material";
import { 
  SearchOutlined, EmailOutlined, ContactPhoneOutlined, SchoolOutlined, 
  CalendarMonthOutlined, VisibilityOutlined, CloseOutlined, SearchOffOutlined, 
  EditOutlined, BadgeOutlined, WorkspacePremiumOutlined, CheckCircleOutline,
  HourglassEmptyOutlined, InfoOutlined
} from "@mui/icons-material";
import UpdateGuidance from "./UpdateGuidance";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const primaryFont = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";
const accentGold = "#CC9D2F";

interface Guidance {
  _id: string;
  firstName: string;
  lastName: string;
  qualification: string;
  programme: string;
  email: string;
  contact: string;
  status: 'Pending' | 'Closed';
  adminReply?: string;
  createdAt: string;
}

const RequestConsultation = () => {
  const [requests, setRequests] = useState<Guidance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingRequest, setViewingRequest] = useState<Guidance | null>(null);
  const [editingRequest, setEditingRequest] = useState<Guidance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/guidance`);
      const data = await response.json();
      if (response.ok) setRequests(data);
    } catch (error) {
      console.error("Failed to fetch guidance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filteredData = useMemo(() => {
    return requests.filter((r) => {
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
      const matchText = fullName.includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProg = programmeFilter === "All" || r.programme === programmeFilter;
      return matchText && matchProg;
    });
  }, [searchQuery, programmeFilter, requests]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const programmes = useMemo(() => {
    const progs = Array.from(new Set(requests.map(r => r.programme)));
    return ["All", ...progs];
  }, [requests]);

  if (editingRequest) {
    return (
      <Box sx={{ bgcolor: surfaceColor, p: 3, minHeight: "100vh" }}>
        <UpdateGuidance 
          data={editingRequest} 
          onBack={() => { setEditingRequest(null); fetchRequests(); }} 
        />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 } }}>
        
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>
              Consultation Records
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: primaryFont, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
              Review and finalize student inquiries.
            </Typography>
          </Box>
        </Stack>

        {/* FILTER BAR */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: "20px", border: "1px solid #E2E8F0", display: "flex", flexWrap: "wrap", gap: 3, bgcolor: "#FFF" }}>
          <TextField
            fullWidth placeholder="Search student by name or email..." variant="outlined" value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
            sx={{ flex: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
              sx: { borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600 }
            }}
          />
          <TextField
            select label="Programme Filter" value={programmeFilter}
            onChange={(e) => {setProgrammeFilter(e.target.value); setPage(1);}}
            sx={{ flex: 1, minWidth: "200px" }}
            InputLabelProps={{ sx: { fontFamily: primaryFont, fontWeight: 600 } }}
            InputProps={{ sx: { borderRadius: "12px", fontFamily: primaryFont, fontWeight: 600 } }}
          >
            {programmes.map((prog) => (<MenuItem key={prog} value={prog} sx={{fontFamily: primaryFont}}>{prog}</MenuItem>))}
          </TextField>
        </Paper>

        {/* TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: "1px solid #E2E8F0", bgcolor: "#FFF", overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F1F5F9" }}>
              <TableRow>
                <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", py: 3, fontSize: "0.75rem" }}>STUDENT & STATUS</TableCell>
                <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>PROGRAMME</TableCell>
                <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>CONTACT INFO</TableCell>
                <TableCell sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>REQUESTED DATE</TableCell>
                <TableCell align="right" sx={{ fontFamily: primaryFont, fontWeight: 800, color: "#64748B", pr: 4, fontSize: "0.75rem" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}><CircularProgress sx={{ color: primaryTeal }} /></TableCell></TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((req) => (
                  <TableRow key={req._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                          <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: primaryTeal }}>{req.firstName} {req.lastName}</Typography>
                          <Chip 
                            size="small"
                            label={req.status || 'Pending'}
                            icon={req.status === 'Closed' ? <CheckCircleOutline /> : <HourglassEmptyOutlined />}
                            sx={{ 
                              mt: 0.5, 
                              fontFamily: primaryFont, 
                              fontWeight: 700, 
                              fontSize: '0.65rem',
                              bgcolor: req.status === 'Closed' ? '#ECFDF5' : '#FFF7ED',
                              color: req.status === 'Closed' ? '#10B981' : '#F97316',
                              borderColor: 'transparent'
                            }}
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SchoolOutlined sx={{ fontSize: 18, color: primaryTeal }} />
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, fontSize: "0.85rem" }}>{req.programme}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailOutlined sx={{ fontSize: 14, color: "#94A3B8" }} />
                          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", fontWeight: 500 }}>{req.email}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ContactPhoneOutlined sx={{ fontSize: 14, color: "#94A3B8" }} />
                          <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", fontWeight: 500 }}>{req.contact}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonthOutlined sx={{ fontSize: 16, color: "#94A3B8" }} />
                        <Typography sx={{ fontFamily: primaryFont, fontSize: "0.8rem", fontWeight: 600, color: "#64748B" }}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Full Details">
                          <IconButton onClick={() => setViewingRequest(req)} size="small" sx={{ color: primaryTeal, border: '1px solid #E2E8F0' }}>
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={req.status === 'Closed' ? "View Processing" : "Finalize Inquiry"}>
                          <IconButton onClick={() => setEditingRequest(req)} size="small" sx={{ color: req.status === 'Closed' ? "#64748B" : accentGold, border: '1px solid #E2E8F0' }}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                    <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
                      <SearchOffOutlined sx={{ fontSize: 60, color: "#94A3B8" }} />
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#475569" }}>No inquiries found</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0" }}>
            <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontWeight: 700, fontSize: "0.8rem" }}>
              Showing {paginatedData.length} of {filteredData.length} records
            </Typography>
            <Pagination 
              count={Math.ceil(filteredData.length / rowsPerPage)} 
              page={page} 
              onChange={(_, v) => setPage(v)} 
              sx={{ 
                '& .Mui-selected': { bgcolor: `${primaryTeal} !important`, color: "#FFF" }, 
                '& .MuiPaginationItem-root': { fontFamily: primaryFont, fontWeight: 600 } 
              }} 
            />
          </Box>
        </TableContainer>

        {/* VIEW DETAILS DIALOG */}
        <Dialog open={Boolean(viewingRequest)} onClose={() => setViewingRequest(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}>
          {viewingRequest && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "1.2rem" }}>Student Profile</Typography>
                <IconButton onClick={() => setViewingRequest(null)} size="small"><CloseOutlined /></IconButton>
              </DialogTitle>
              <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.2 }}>Personal Details</Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                      <BadgeOutlined sx={{ color: primaryTeal }} />
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#1E293B", fontSize: "1.1rem" }}>{viewingRequest.firstName} {viewingRequest.lastName}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5, ml: 0.5 }}>
                      <InfoOutlined sx={{ color: "#64748B", fontSize: 18 }} />
                      <Typography sx={{ fontFamily: primaryFont, color: "#64748B", fontSize: "0.85rem" }}>Qualification: {viewingRequest.qualification}</Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>Contact Information</Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <EmailOutlined sx={{ color: primaryTeal, fontSize: 20 }} />
                            <Typography sx={{ fontFamily: primaryFont, fontWeight: 500 }}>{viewingRequest.email}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <ContactPhoneOutlined sx={{ color: primaryTeal, fontSize: 20 }} />
                            <Typography sx={{ fontFamily: primaryFont, fontWeight: 500 }}>{viewingRequest.contact}</Typography>
                        </Stack>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>Selected Programme & Date</Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                      <WorkspacePremiumOutlined sx={{ color: accentGold }} />
                      <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, color: primaryTeal }}>{viewingRequest.programme}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                      <CalendarMonthOutlined sx={{ color: "#64748B", fontSize: 20 }} />
                      <Typography sx={{ fontFamily: primaryFont, fontSize: "0.85rem", color: "#64748B" }}>Requested on: {new Date(viewingRequest.createdAt).toLocaleString()}</Typography>
                    </Stack>
                  </Box>
                  {viewingRequest.adminReply && (
                    <>
                      <Divider />
                      <Box sx={{ bgcolor: "#F0FDF4", p: 2, borderRadius: "12px", border: "1px solid #DCFCE7" }}>
                         <Typography variant="caption" sx={{ fontFamily: primaryFont, fontWeight: 700, color: "#16A34A", textTransform: "uppercase" }}>Admin Reply</Typography>
                         <Typography sx={{ fontFamily: primaryFont, mt: 0.5, fontSize: "0.9rem", color: "#14532D" }}>{viewingRequest.adminReply}</Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewingRequest(null)} fullWidth variant="contained" sx={{ bgcolor: primaryTeal, borderRadius: "12px", fontFamily: primaryFont, fontWeight: 700 }}>Close View</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Fade>
  );
};

export default RequestConsultation;