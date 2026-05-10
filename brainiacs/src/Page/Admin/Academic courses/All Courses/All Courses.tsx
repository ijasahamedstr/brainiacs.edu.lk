import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, Typography, Stack, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, 
  Button, TextField, InputAdornment, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Chip, Divider
} from "@mui/material";
import { 
  DeleteOutline, SearchOutlined, VisibilityOutlined, 
  SchoolOutlined, CalendarMonthOutlined, RefreshOutlined, 
  ChevronRightRounded, LocalOfferOutlined,
  LayersOutlined
} from "@mui/icons-material";

// Components 
import CreateCourse from "./CreateCourses";
// import UpdateCourse from "./UpdateCourses";

// --- Configuration & Global Style ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const montserrat = "'Montserrat', sans-serif";
const primaryTeal = "#004652";
const surfaceColor = "#F8FAFC";

// --- Interfaces ---
interface ModuleRow {
  code: string;
  name: string;
  credits: string;
}

interface Semester {
  semesterName: string;
  moduleRows: ModuleRow[];
}

interface Course {
  _id: string;
  courseName: string;
  courseCategory: string;
  courseDescription: string[];
  duration: string;
  intake: string;
  awardingBody: string;
  entryRequirement: string;
  progression: string;
  scholarships: string;
  semesters: Semester[];
  careerPathways: string[];
  coverImage: string;
  images: string[];
  createdAt: string;
}

const CourseManager = () => {
  const [data, setData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  // const [editingItem, setEditingItem] = useState<Course | null>(null);
  const [viewingItem, setViewingItem] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/course`);
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
      const response = await fetch(`${API_BASE_URL}/api/course/${itemToDelete}`, { method: "DELETE" });
      if (response.ok) {
        setData((prev) => prev.filter((item) => item._id !== itemToDelete));
        setDeleteDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  if (showAddForm) return <CreateCourse onBack={() => { setShowAddForm(false); fetchData(); }} />;
  // if (editingItem) return <UpdateCourse itemData={editingItem} onBack={() => { setEditingItem(null); fetchData(); }} />;

  return (
    <Box sx={{ width: "100%", bgcolor: surfaceColor, p: { xs: 2, md: 4 }, minHeight: "100vh", fontFamily: montserrat }}>
      
      {/* HEADER */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{md: "center"}} spacing={3} mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: montserrat, fontWeight: 800, color: primaryTeal, letterSpacing: "-1px" }}>
            Course Curriculum Manager
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: montserrat, color: "#64748B", mt: 0.5, fontWeight: 500 }}>
            Overseeing {data.length} academic programs and structured syllabi.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)} 
          startIcon={<SchoolOutlined />}
          sx={{ 
            fontFamily: montserrat, bgcolor: primaryTeal, borderRadius: "12px", px: 3, py: 1.2,
            textTransform: "none", fontWeight: 700, boxShadow: "0 8px 16px rgba(0, 70, 82, 0.15)",
            '&:hover': { bgcolor: "#002d35" }
          }}
        >
          Add New Course
        </Button>
      </Stack>

      {/* SEARCH */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: "16px", border: "1px solid #E2E8F0", display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: primaryTeal }} /></InputAdornment>,
            sx: { borderRadius: "10px", fontFamily: montserrat }
          }}
        />
        <IconButton onClick={fetchData} sx={{ bgcolor: "#F1F5F9" }}><RefreshOutlined /></IconButton>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              {["COURSE IDENTITY", "AWARDING BODY", "TIMELINE", "STRUCTURE", "ACTIONS"].map((head) => (
                <TableCell key={head} sx={{ fontFamily: montserrat, fontWeight: 800, color: "#64748B", fontSize: "0.75rem" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}><CircularProgress size={30} sx={{ color: primaryTeal }} /></TableCell></TableRow>
            ) : paginatedData.map((course) => (
              <TableRow component={motion.tr} layout key={course._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={course.coverImage} variant="rounded" sx={{ width: 45, height: 45, borderRadius: "10px" }} />
                    <Box>
                      <Typography sx={{ fontFamily: montserrat, fontWeight: 700, color: primaryTeal, fontSize: "0.9rem" }}>{course.courseName}</Typography>
                      <Chip label={course.courseCategory} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, fontFamily: montserrat }} />
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontFamily: montserrat, fontSize: "0.85rem", fontWeight: 600 }}>{course.awardingBody}</TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" sx={{ fontFamily: montserrat, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                      <CalendarMonthOutlined sx={{ fontSize: 14 }} /> {course.duration}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: montserrat, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                      <LocalOfferOutlined sx={{ fontSize: 14 }} /> {course.intake}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: montserrat, fontWeight: 700, color: "#64748B", display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayersOutlined sx={{ fontSize: 16 }} /> {course.semesters?.length || 0} Semesters
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Preview"><IconButton onClick={() => setViewingItem(course)} sx={{ color: primaryTeal, bgcolor: "#F0F5F6" }}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                    {/* <Tooltip title="Edit"><IconButton onClick={() => setEditingItem(course)} sx={{ color: "#64748B", bgcolor: "#F8FAFC" }}><EditOutlined fontSize="small" /></IconButton></Tooltip> */}
                    <Tooltip title="Delete"><IconButton onClick={() => { setItemToDelete(course._id); setDeleteDialogOpen(true); }} sx={{ color: "#F43F5E", bgcolor: "#FFF1F2" }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: "1px solid #E2E8F0" }}>
          <Pagination count={Math.ceil(filteredData.length / rowsPerPage)} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      </TableContainer>

      {/* --- STACKED VIEW MODAL (No Grid) --- */}
      <Dialog open={Boolean(viewingItem)} onClose={() => setViewingItem(null)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "20px" } }}>
        {viewingItem && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "1px solid #E2E8F0" }}>
              <Typography sx={{ fontFamily: montserrat, fontWeight: 800, color: primaryTeal }}>{viewingItem.courseName}</Typography>
              <IconButton onClick={() => setViewingItem(null)}><ChevronRightRounded sx={{ transform: 'rotate(90deg)' }} /></IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Box component="img" src={viewingItem.coverImage} sx={{ width: '100%', height: 240, objectFit: 'cover' }} />
              
              <Stack spacing={4} sx={{ p: 4 }}>
                {/* 1. Description */}
                <Box>
                  <Typography variant="overline" sx={{ fontFamily: montserrat, fontWeight: 900, color: primaryTeal }}>About Program</Typography>
                  {viewingItem.courseDescription.map((p, i) => (
                    <Typography key={i} sx={{ fontFamily: montserrat, fontSize: "0.9rem", mt: 1, color: "#475569", lineHeight: 1.7 }}>{p}</Typography>
                  ))}
                </Box>

                <Divider />

                {/* 2. Key Details */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Box>
                    <Typography sx={{ fontFamily: montserrat, fontSize: "0.75rem", fontWeight: 800, color: "#94A3B8" }}>AWARDING BODY</Typography>
                    <Typography sx={{ fontFamily: montserrat, fontWeight: 700 }}>{viewingItem.awardingBody}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: montserrat, fontSize: "0.75rem", fontWeight: 800, color: "#94A3B8" }}>SCHOLARSHIPS</Typography>
                    <Typography sx={{ fontFamily: montserrat, fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: viewingItem.scholarships || "None" }} />
                  </Box>
                </Stack>

                {/* 3. Curriculum Structure */}
                <Box>
                  <Typography variant="overline" sx={{ fontFamily: montserrat, fontWeight: 900, color: primaryTeal, display: 'block', mb: 2 }}>Academic Syllabus</Typography>
                  {viewingItem.semesters.map((sem, sIdx) => (
                    <Box key={sIdx} sx={{ mb: 3 }}>
                      <Typography sx={{ fontFamily: montserrat, fontWeight: 800, fontSize: "0.85rem", bgcolor: "#F1F5F9", p: 1, borderRadius: "8px", mb: 1 }}>{sem.semesterName}</Typography>
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "10px" }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                            <TableRow>
                              <TableCell sx={{ fontFamily: montserrat, fontWeight: 700, fontSize: "0.7rem" }}>CODE</TableCell>
                              <TableCell sx={{ fontFamily: montserrat, fontWeight: 700, fontSize: "0.7rem" }}>MODULE</TableCell>
                              <TableCell align="right" sx={{ fontFamily: montserrat, fontWeight: 700, fontSize: "0.7rem" }}>CREDITS</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sem.moduleRows.map((row, rIdx) => (
                              <TableRow key={rIdx}>
                                <TableCell sx={{ fontFamily: montserrat, fontSize: "0.75rem" }}>{row.code}</TableCell>
                                <TableCell sx={{ fontFamily: montserrat, fontSize: "0.75rem", fontWeight: 600 }}>{row.name}</TableCell>
                                <TableCell align="right" sx={{ fontFamily: montserrat, fontSize: "0.75rem" }}>{row.credits}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
                </Box>

                {/* 4. Rich Text Sections */}
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "12px" }}>
                    <Typography sx={{ fontFamily: montserrat, fontWeight: 800, fontSize: "0.8rem", color: primaryTeal, mb: 1 }}>ENTRY REQUIREMENTS</Typography>
                    <Typography sx={{ fontFamily: montserrat, fontSize: "0.85rem" }} dangerouslySetInnerHTML={{ __html: viewingItem.entryRequirement }} />
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "12px" }}>
                    <Typography sx={{ fontFamily: montserrat, fontWeight: 800, fontSize: "0.8rem", color: primaryTeal, mb: 1 }}>CAREER PATHWAYS</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {viewingItem.careerPathways.map((path, i) => (
                        <Chip key={i} label={path} size="small" sx={{ fontFamily: montserrat, fontWeight: 600 }} />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingItem(null)} fullWidth variant="contained" sx={{ fontFamily: montserrat, bgcolor: primaryTeal, py: 1.5, borderRadius: "12px", fontWeight: 700 }}>Close Overview</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: montserrat, fontWeight: 800 }}>Remove Course?</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: montserrat }}>This will permanently delete the curriculum and all associated semester data.</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: montserrat, fontWeight: 700 }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ fontFamily: montserrat, bgcolor: "#F43F5E", fontWeight: 700 }}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManager;