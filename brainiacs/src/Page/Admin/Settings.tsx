import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert
} from "@mui/material";
import {
  PersonOutline,
  MailOutline,
  Visibility,
  VisibilityOff,
  CloudUpload,
  AddCircleOutline,
  RemoveRedEyeOutlined,
  ArrowBack,
  EditOutlined,
  Search,
  QrCode2,
  AccessTime,
  GppGoodOutlined,
  CheckCircle,
  DeleteOutline,
} from "@mui/icons-material";

const primaryTeal = "#004652";
const accentGold = "#CC9D2F";
const dangerRed = "#E11D48";
const menuFont = "Tajawal, sans-serif";
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminManagement: React.FC = () => {
  const [view, setView] = useState<"list" | "form" | "details">("list");
  const [admins, setAdmins] = useState<any[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Alerts and Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });


  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/all`);
      setAdmins(response.data);
      setFilteredAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query)
    );
    setFilteredAdmins(filtered);
  }, [searchQuery, admins]);

  const handleAddNew = () => {
    setSelectedAdmin(null);
    setIsEditing(false);
    setView("form");
  };

  const handleViewDetails = (admin: any) => {
    setSelectedAdmin(admin);
    setView("details");
  };

  const handleFormSave = async (formData: any) => {
    setLoading(true);
    try {
      if (isEditing && selectedAdmin) {
        await axios.put(`${BASE_URL}/api/edit/${selectedAdmin._id}`, formData);
        setSnackbar({ open: true, message: "تم تحديث بيانات المسؤول بنجاح", severity: "success" });
      } else {
        await axios.post(`${BASE_URL}/api/create`, formData);
        setSnackbar({ open: true, message: "تم إنشاء المسؤول الجديد بنجاح", severity: "success" });
      }
      fetchAdmins();
      setView("list");
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || "حدث خطأ في النظام", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ACTIONS ---
  const openDeleteConfirm = (id: string) => {
    setAdminToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/delete/${adminToDelete}`);
      setSnackbar({ open: true, message: "تم حذف الحساب نهائياً من النظام", severity: "success" });
      fetchAdmins();
      setView("list");
    } catch (error: any) {
      setSnackbar({ open: true, message: "فشل حذف الحساب، حاول مرة أخرى", severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  return (
    <Box sx={{ direction: "rtl", width: "100%", pt: 0, pb: 5, px: { xs: 1, md: 0 }, textAlign: "right" }}>
      {/* --- NOTIFICATIONS --- */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ fontFamily: menuFont, fontWeight: 700, borderRadius: '15px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} dir="rtl">
        <DialogTitle sx={{ fontFamily: menuFont, fontWeight: 900, color: dangerRed, textAlign: 'right' }}>تأكيد الحذف النهائي</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: menuFont, textAlign: 'right' }}>
            أنت على وشك حذف هذا المسؤول. هذا الإجراء سيؤدي إلى إزالة كافة الصلاحيات والبيانات المرتبطة بهذا الحساب ولا يمكن التراجع عنه.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-start' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: menuFont, color: "#64748B", fontWeight: 700 }}>إلغاء</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: dangerRed, fontFamily: menuFont, fontWeight: 800, px: 3, "&:hover": { bgcolor: "#be123c" } }}>تأكيد الحذف</Button>
        </DialogActions>
      </Dialog>

      {/* --- HEADER --- */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={3} sx={{ mb: 5 }}>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h3" sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, fontSize: { xs: "2.2rem", md: "2.8rem" } }}>
            {view === "list" && "إدارة المسؤولين"}
            {view === "form" && (isEditing ? "تعديل البيانات" : "إنشاء مسؤول جديد")}
            {view === "details" && "ملف المسؤول"}
          </Typography>
        </Box>

        {view === "list" ? (
          <Button
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddCircleOutline sx={{ ml: 1, fontSize: '1.5rem !important' }} />}
            sx={{ bgcolor: primaryTeal, fontFamily: menuFont, borderRadius: "14px", px: 6, py: 1.8, fontSize: "1.1rem", fontWeight: 800 }}
          >
            إضافة مسؤول
          </Button>
        ) : (
          <Button onClick={() => { setView("list"); setSelectedAdmin(null); }} startIcon={<ArrowBack sx={{ ml: 1 }} />} sx={{ fontFamily: menuFont, color: primaryTeal, fontWeight: 800, fontSize: '1.1rem' }}>
            العودة للقائمة
          </Button>
        )}
      </Stack>

      {loading && view === "list" ? (
        <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress sx={{ color: primaryTeal }} /></Stack>
      ) : (
        <>
          {view === "list" && (
            <>
              <TextField
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <Search sx={{ color: "#94A3B8", ml: 1, fontSize: '1.8rem' }} /> }}
                sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "18px", bgcolor: "#F8FAFC", fontFamily: menuFont, height: "65px" }, "& input": { textAlign: 'right' } }}
              />
              <AdminList 
                admins={filteredAdmins} 
                onView={handleViewDetails} 
                onEdit={(admin: any) => { setSelectedAdmin(admin); setIsEditing(true); setView("form"); }} 
                onDelete={openDeleteConfirm}
              />
            </>
          )}
          {view === "form" && <AdminForm admin={selectedAdmin} isEditing={isEditing} onSave={handleFormSave} loading={loading} />}
          {view === "details" && <AdminDetails admin={selectedAdmin} onEdit={() => { setIsEditing(true); setView("form"); }} onDelete={openDeleteConfirm} />}
        </>
      )}
    </Box>
  );
};

/* --- LIST VIEW --- */
const AdminList = ({ admins, onView, onEdit, onDelete }: any) => (
  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "28px", border: "1px solid #E2E8F0" }}>
    <Table sx={{ minWidth: 900 }}>
      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
        <TableRow>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, textAlign: "center" }}>#</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, textAlign: "right" }}>الصورة</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, textAlign: "right" }}>الاسم الكامل</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, textAlign: "right" }}>الحالة</TableCell>
          <TableCell align="center" sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal }}>الإجراءات</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {admins.map((admin: any, index: number) => (
          <TableRow key={admin._id} hover>
            <TableCell sx={{ textAlign: "center", fontFamily: menuFont, fontWeight: 900, color: "#94A3B8" }}>{index + 1}</TableCell>
            <TableCell sx={{ textAlign: "right" }}><Avatar src={admin.profileImage} sx={{ width: 55, height: 55, border: `2px solid ${primaryTeal}10` }} /></TableCell>
            <TableCell sx={{ textAlign: "right" }}>
              <Typography sx={{ fontFamily: menuFont, fontWeight: 800, color: primaryTeal }}>{admin.name}</Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>{admin.email}</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: "right" }}>
              <Chip label={admin.twoFAEnabled ? "نشط" : "غير نشط"} sx={{ fontFamily: menuFont, fontWeight: 800, bgcolor: admin.twoFAEnabled ? "#10B98115" : "#64748B15", color: admin.twoFAEnabled ? "#10B981" : "#64748B" }} />
            </TableCell>
            <TableCell align="center">
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Tooltip title="عرض"><IconButton onClick={() => onView(admin)} sx={{ bgcolor: "#F1F5F9", color: primaryTeal }}><RemoveRedEyeOutlined /></IconButton></Tooltip>
                <Tooltip title="تعديل"><IconButton onClick={() => onEdit(admin)} sx={{ bgcolor: "#FFFBEB", color: accentGold }}><EditOutlined /></IconButton></Tooltip>
                <Tooltip title="حذف"><IconButton onClick={() => onDelete(admin._id)} sx={{ bgcolor: "#FFF1F2", color: dangerRed }}><DeleteOutline /></IconButton></Tooltip>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

/* --- FORM VIEW --- */
const AdminForm = ({ admin, isEditing, onSave, loading }: any) => {
  const [showPass, setShowPass] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "",
    profileImage: admin?.profileImage || "",
  });

  return (
    <Paper elevation={0} sx={{ p: { xs: 4, md: 7 }, borderRadius: "40px", bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", maxWidth: "900px", mx: "auto" }}>
      <Stack spacing={5}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar src={formData.profileImage} sx={{ width: 140, height: 140, bgcolor: "#fff", border: "6px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                {!formData.profileImage && <PersonOutline sx={{fontSize: 60, color: "#CBD5E1"}}/>}
            </Avatar>
            <IconButton onClick={() => { setTempUrl(formData.profileImage); setOpenPopup(true); }} sx={{ position: "absolute", bottom: 5, right: 5, bgcolor: primaryTeal, color: "#fff", border: "4px solid #fff", p: 1, '&:hover': { bgcolor: '#00353d' } }}>
              <CloudUpload sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
          <TextField fullWidth label="الاسم الكامل" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "#fff", height: '65px' }, "& label": { fontFamily: menuFont, right: 20, left: 'auto', transformOrigin: 'right' }, "& input": { textAlign: 'right' } }} />
          <TextField fullWidth label="البريد الإلكتروني" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "#fff", height: '65px' }, "& label": { fontFamily: menuFont, right: 20, left: 'auto', transformOrigin: 'right' }, "& input": { textAlign: 'right' } }} />
          <TextField
            fullWidth
            type={showPass ? "text" : "password"}
            label={isEditing ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ gridColumn: { md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "#fff", height: '65px' }, "& label": { fontFamily: menuFont, right: 20, left: 'auto', transformOrigin: 'right' }, "& input": { textAlign: 'right' } }}
            InputProps={{ endAdornment: <IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton> }}
          />
        </Box>
        <Button variant="contained" disabled={loading} onClick={() => onSave(formData)} sx={{ bgcolor: primaryTeal, py: 2.5, borderRadius: "20px", fontFamily: menuFont, fontWeight: 900, fontSize: "1.2rem" }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? "حفظ التغييرات" : "إنشاء الحساب")}
        </Button>
      </Stack>
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} dir="rtl">
        <DialogTitle sx={{ fontFamily: menuFont, fontWeight: 900, textAlign: 'right' }}>رابط الصورة الشخصية</DialogTitle>
        <DialogContent>
          <TextField fullWidth autoFocus placeholder="https://..." value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenPopup(false)} sx={{ fontFamily: menuFont, color: "#64748B" }}>إلغاء</Button>
          <Button onClick={() => { setFormData({...formData, profileImage: tempUrl}); setOpenPopup(false); }} variant="contained" sx={{ bgcolor: primaryTeal, fontFamily: menuFont }}>تحديث</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

/* --- DETAILS VIEW --- */
const AdminDetails = ({ admin, onEdit, onDelete }: any) => {
  const [qrCode, setQrCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSetup2FA = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/setup-2fa`, { adminId: admin._id, email: admin.email });
      setQrCode(res.data.qrCode);
      setIsVerifying(true);
    } catch (error) { alert("فشل إعداد 2FA"); }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 5, md: 8 }, borderRadius: "40px", border: "1px solid #E2E8F0", bgcolor: "#fff", maxWidth: "950px", mx: "auto", textAlign: "right" }}>
      <Stack spacing={6}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={4} alignItems="center">
            <Avatar src={admin?.profileImage} sx={{ width: 140, height: 140, bgcolor: primaryTeal, border: `4px solid #fff`, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>{admin.name[0]}</Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal }}>{admin.name}</Typography>
              <Typography sx={{ color: "#64748B", fontFamily: menuFont, fontWeight: 700 }}>{admin.role || "مسؤول النظام"}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
             <Button variant="outlined" startIcon={<EditOutlined sx={{ml:1}}/>} onClick={onEdit} sx={{ fontFamily: menuFont, borderColor: accentGold, color: accentGold, borderRadius: "16px", px: 4, py: 1.5, fontWeight: 800 }}>تعديل</Button>
             <Button variant="outlined" startIcon={<DeleteOutline sx={{ml:1}}/>} onClick={() => onDelete(admin._id)} sx={{ fontFamily: menuFont, borderColor: dangerRed, color: dangerRed, borderRadius: "16px", px: 4, py: 1.5, fontWeight: 800 }}>حذف الحساب</Button>
          </Stack>
        </Stack>
        
        <Divider />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 4 }}>
          <DetailItem label="البريد الإلكتروني" value={admin.email} icon={<MailOutline />} />
          <DetailItem label="تاريخ الانضمام" value={new Date(admin.createdAt).toLocaleDateString('ar-EG')} icon={<AccessTime />} />
        </Box>

        <Paper variant="outlined" sx={{ p: 4, borderRadius: "32px", bgcolor: "#F8FAFC", border: "1px dashed #E2E8F0" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
              <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: "20px", border: "1px solid #E2E8F0" }}>
                  {qrCode ? <img src={qrCode} alt="QR" style={{ width: '160px' }} /> : <QrCode2 sx={{ fontSize: '100px', color: primaryTeal, opacity: 0.2 }} />}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, fontSize: '1.4rem' }}>أمان الحساب (2FA)</Typography>
                      {admin.twoFAEnabled ? <CheckCircle sx={{ color: '#10B981' }} /> : <GppGoodOutlined sx={{ color: '#94A3B8' }} />}
                  </Stack>
                  <Typography sx={{ fontFamily: menuFont, color: "#64748B", mb: 2 }}>{admin.twoFAEnabled ? "المصادقة الثنائية مفعلة حالياً." : "قم بحماية حسابك باستخدام تطبيق Google Authenticator."}</Typography>
                  {!admin.twoFAEnabled && !isVerifying && <Button variant="contained" onClick={handleSetup2FA} sx={{ bgcolor: primaryTeal, fontFamily: menuFont }}>بدء الإعداد</Button>}
              </Box>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

const DetailItem = ({ label, value, icon }: any) => (
  <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "24px", border: "1px solid #E2E8F0", textAlign: "right" }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
      <Box sx={{ color: primaryTeal, bgcolor: "#fff", p: 1, borderRadius: "10px", display: "flex" }}>{icon}</Box>
      <Typography variant="caption" sx={{ fontFamily: menuFont, color: "#94A3B8", fontWeight: 800 }}>{label}</Typography>
    </Stack>
    <Typography sx={{ fontFamily: menuFont, fontWeight: 800, color: primaryTeal, fontSize: "1.2rem", pr: 5 }}>{value}</Typography>
  </Box>
);

export default AdminManagement;