import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Stack, Paper, TextField, Button, Avatar, IconButton,
  Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
 Snackbar, Alert
} from "@mui/material";
import {
 MailOutline, Visibility, VisibilityOff, CloudUpload,
  AddCircleOutline, RemoveRedEyeOutlined, ArrowBack, EditOutlined, Search,
  QrCode2, AccessTime, GppGoodOutlined, CheckCircle, DeleteOutline,
} from "@mui/icons-material";

const primaryTeal = "#004652";
const accentGold = "#CC9D2F";
const dangerRed = "#E11D48";
const menuFont = "Montserrat, sans-serif"; // Changed to English-friendly font
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminManagement: React.FC = () => {
  const [view, setView] = useState<"list" | "form" | "details">("list");
  const [admins, setAdmins] = useState<any[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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

  useEffect(() => { fetchAdmins(); }, []);

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

  const handleFormSave = async (formData: any) => {
    setLoading(true);
    try {
      if (isEditing && selectedAdmin) {
        await axios.put(`${BASE_URL}/api/edit/${selectedAdmin._id}`, formData);
        setSnackbar({ open: true, message: "Admin updated successfully", severity: "success" });
      } else {
        await axios.post(`${BASE_URL}/api/create`, formData);
        setSnackbar({ open: true, message: "New admin created successfully", severity: "success" });
      }
      fetchAdmins();
      setView("list");
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || "System error occurred", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/delete/${adminToDelete}`);
      setSnackbar({ open: true, message: "Account deleted permanently", severity: "success" });
      fetchAdmins();
      setView("list");
    } catch (error: any) {
      setSnackbar({ open: true, message: "Delete failed, please try again", severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  return (
    <Box sx={{ direction: "ltr", width: "100%", pt: 0, pb: 5, px: { xs: 1, md: 0 }, textAlign: "left" }}>
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: menuFont, fontWeight: 900, color: dangerRed }}>Confirm Permanent Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: menuFont }}>
            You are about to delete this admin account. This action will remove all permissions and data associated with this account and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: menuFont, color: "#64748B", fontWeight: 700 }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: dangerRed, fontFamily: menuFont, fontWeight: 800, px: 3 }}>Confirm Delete</Button>
        </DialogActions>
      </Dialog>

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, fontSize: { xs: "2.2rem", md: "2.8rem" } }}>
          {view === "list" && "Admin Management"}
          {view === "form" && (isEditing ? "Edit Admin" : "Create New Admin")}
          {view === "details" && "Admin Profile"}
        </Typography>

        {view === "list" ? (
          <Button variant="contained" onClick={handleAddNew} startIcon={<AddCircleOutline />} sx={{ bgcolor: primaryTeal, fontFamily: menuFont, borderRadius: "14px", px: 4, py: 1.5, fontWeight: 800 }}>
            Add New Admin
          </Button>
        ) : (
          <Button onClick={() => setView("list")} startIcon={<ArrowBack />} sx={{ fontFamily: menuFont, color: primaryTeal, fontWeight: 800 }}>
            Back to List
          </Button>
        )}
      </Stack>

      {view === "list" && (
        <>
          <TextField
            placeholder="Search by name or email..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ color: "#94A3B8", mr: 1 }} /> }}
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "18px", bgcolor: "#F8FAFC" } }}
          />
          <AdminList admins={filteredAdmins} onView={(a:any) => {setSelectedAdmin(a); setView("details");}} onEdit={(a: any) => { setSelectedAdmin(a); setIsEditing(true); setView("form"); }} onDelete={(id:string) => {setAdminToDelete(id); setDeleteDialogOpen(true);}} />
        </>
      )}
      {view === "form" && <AdminForm admin={selectedAdmin} isEditing={isEditing} onSave={handleFormSave} loading={loading} />}
      {view === "details" && <AdminDetails admin={selectedAdmin} onEdit={() => { setIsEditing(true); setView("form"); }} onDelete={(id:string) => {setAdminToDelete(id); setDeleteDialogOpen(true);}} />}
    </Box>
  );
};

/* --- LIST VIEW --- */
const AdminList = ({ admins, onView, onEdit, onDelete }: any) => (
  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "28px", border: "1px solid #E2E8F0" }}>
    <Table sx={{ minWidth: 900 }}>
      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
        <TableRow>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900 }}>#</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900 }}>Profile</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900 }}>Full Name</TableCell>
          <TableCell sx={{ fontFamily: menuFont, fontWeight: 900 }}>Status</TableCell>
          <TableCell align="center" sx={{ fontFamily: menuFont, fontWeight: 900 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {admins.map((admin: any, index: number) => (
          <TableRow key={admin._id} hover>
            <TableCell sx={{ fontWeight: 900, color: "#94A3B8" }}>{index + 1}</TableCell>
            <TableCell><Avatar src={admin.profileImage} sx={{ width: 50, height: 50 }} /></TableCell>
            <TableCell>
              <Typography sx={{ fontFamily: menuFont, fontWeight: 800, color: primaryTeal }}>{admin.name}</Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>{admin.email}</Typography>
            </TableCell>
            <TableCell>
              <Chip label={admin.twoFAEnabled ? "Active" : "Disabled"} sx={{ fontWeight: 800, bgcolor: admin.twoFAEnabled ? "#10B98115" : "#64748B15", color: admin.twoFAEnabled ? "#10B981" : "#64748B" }} />
            </TableCell>
            <TableCell align="center">
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton onClick={() => onView(admin)} sx={{ bgcolor: "#F1F5F9" }}><RemoveRedEyeOutlined /></IconButton>
                <IconButton onClick={() => onEdit(admin)} sx={{ bgcolor: "#FFFBEB" }}><EditOutlined /></IconButton>
                <IconButton onClick={() => onDelete(admin._id)} sx={{ bgcolor: "#FFF1F2" }}><DeleteOutline /></IconButton>
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
    <Paper elevation={0} sx={{ p: 5, borderRadius: "40px", bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", maxWidth: "800px", mx: "auto" }}>
      <Stack spacing={4}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar src={formData.profileImage} sx={{ width: 120, height: 120, border: "4px solid #fff", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} />
            <IconButton onClick={() => { setTempUrl(formData.profileImage); setOpenPopup(true); }} sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: primaryTeal, color: "#fff", '&:hover': { bgcolor: '#00353d' } }}>
              <CloudUpload />
            </IconButton>
          </Box>
        </Box>
        <Stack spacing={3}>
          <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <TextField
            fullWidth
            type={showPass ? "text" : "password"}
            label={isEditing ? "New Password (Leave blank to keep current)" : "Password"}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            InputProps={{ endAdornment: <IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton> }}
          />
        </Stack>
        <Button variant="contained" disabled={loading} onClick={() => onSave(formData)} sx={{ bgcolor: primaryTeal, py: 2, borderRadius: "15px", fontWeight: 900 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? "Update Admin" : "Create Account")}
        </Button>
      </Stack>
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Profile Image URL</DialogTitle>
        <DialogContent><TextField fullWidth autoFocus value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} sx={{ mt: 1 }} /></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)}>Cancel</Button>
          <Button onClick={() => { setFormData({...formData, profileImage: tempUrl}); setOpenPopup(false); }} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

/* --- DETAILS VIEW (With 2FA Fix) --- */
const AdminDetails = ({ admin: initialAdmin, onEdit, onDelete }: any) => {
  const [admin, setAdmin] = useState(initialAdmin);
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleSetup2FA = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/setup-2fa`, { adminId: admin._id });
      setQrCode(res.data.qrCode);
      setIsVerifying(true);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to generate QR Code" });
    }
  };

  const handleVerifyAndEnable = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/verify-2fa`, { 
        adminId: admin._id, 
        token: verificationCode 
      });
      if (res.data.success) {
        setAdmin({ ...admin, twoFAEnabled: true });
        setIsVerifying(false);
        setQrCode("");
        setSnackbar({ open: true, message: "2FA Enabled Successfully!" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Invalid verification code" });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 5, borderRadius: "40px", border: "1px solid #E2E8F0", bgcolor: "#fff", maxWidth: "900px", mx: "auto" }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity="info">{snackbar.message}</Alert>
      </Snackbar>
      <Stack spacing={5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar src={admin?.profileImage} sx={{ width: 120, height: 120, bgcolor: primaryTeal }}>{admin.name[0]}</Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: primaryTeal }}>{admin.name}</Typography>
              <Typography sx={{ color: "#64748B", fontWeight: 700 }}>System Administrator</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
             <Button variant="outlined" onClick={onEdit} sx={{ borderColor: accentGold, color: accentGold }}>Edit</Button>
             <Button variant="outlined" onClick={() => onDelete(admin._id)} sx={{ borderColor: dangerRed, color: dangerRed }}>Delete</Button>
          </Stack>
        </Stack>
        
        <Divider />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
          <DetailItem label="Email Address" value={admin.email} icon={<MailOutline />} />
          <DetailItem label="Join Date" value={new Date(admin.createdAt).toLocaleDateString()} icon={<AccessTime />} />
        </Box>

        <Paper variant="outlined" sx={{ p: 4, borderRadius: "30px", bgcolor: "#F8FAFC", border: "1px dashed #E2E8F0" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
            <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: "20px", border: "1px solid #E2E8F0", textAlign: 'center' }}>
              {qrCode ? (
                <Stack spacing={2} alignItems="center">
                   <img src={qrCode} alt="QR Code" style={{ width: '160px' }} />
                   <Typography variant="caption" color="primary" fontWeight={700}>Scan with Authenticator</Typography>
                </Stack>
              ) : (
                <QrCode2 sx={{ fontSize: '100px', color: primaryTeal, opacity: admin.twoFAEnabled ? 1 : 0.2 }} />
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 900, color: primaryTeal, fontSize: '1.3rem' }}>Account Security (2FA)</Typography>
                {admin.twoFAEnabled ? <CheckCircle sx={{ color: '#10B981' }} /> : <GppGoodOutlined sx={{ color: '#94A3B8' }} />}
              </Stack>
              <Typography sx={{ color: "#64748B", mb: 3 }}>
                {admin.twoFAEnabled 
                  ? "Two-factor authentication is protecting your account." 
                  : "Protect your account using Google Authenticator or Authy app."}
              </Typography>

              {!admin.twoFAEnabled && !isVerifying && (
                <Button variant="contained" onClick={handleSetup2FA} sx={{ bgcolor: primaryTeal }}>Enable 2FA</Button>
              )}

              {isVerifying && (
                <Stack direction="row" spacing={2}>
                  <TextField 
                    size="small" 
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleVerifyAndEnable} sx={{ bgcolor: "#10B981" }}>Verify & Activate</Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

const DetailItem = ({ label, value, icon }: any) => (
  <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
      <Box sx={{ color: primaryTeal }}>{icon}</Box>
      <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 800 }}>{label}</Typography>
    </Stack>
    <Typography sx={{ fontWeight: 800, color: primaryTeal }}>{value}</Typography>
  </Box>
);

export default AdminManagement;