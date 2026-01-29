import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Stack, Paper, TextField, Button, Avatar, IconButton,
  Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from "@mui/material";
import {
  MailOutline, Link as LinkIcon,
  AddCircleOutline, ArrowBack, EditOutlined, Search,
  QrCode2, AccessTime, DeleteOutline,
  KeyboardArrowRight,
  ShieldMoonOutlined, SecurityUpdateGood, CancelOutlined
} from "@mui/icons-material";

// --- GLOBAL THEME & COMPACT SIZING ---
const primaryTeal = "#004652";
const accentGold = "#CC9D2F";
const dangerRed = "#E11D48";
const primaryFont = "'Montserrat', sans-serif";
const BASE_URL = import.meta.env.VITE_API_URL;

const montserratStyle = {
  fontFamily: primaryFont,
  letterSpacing: "-0.01em"
};

const pageIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/all`);
      setAdmins(response.data);
      setFilteredAdmins(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = admins.filter(a => 
      a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query)
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
        setSnackbar({ open: true, message: "Profile Updated", severity: "success" });
      } else {
        await axios.post(`${BASE_URL}/api/create`, formData);
        setSnackbar({ open: true, message: "Admin Created", severity: "success" });
      }
      fetchAdmins();
      setView("list");
    } catch (error: any) {
      setSnackbar({ open: true, message: "Action Failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/delete/${adminToDelete}`);
      setSnackbar({ open: true, message: "Account Deleted", severity: "success" });
      fetchAdmins();
      setView("list");
    } catch {
      setSnackbar({ open: true, message: "Delete Failed", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFB", p: { xs: 2, md: 4 } }}>
      <Snackbar 
        open={snackbar.open} autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ ...montserratStyle, borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ ...montserratStyle, fontWeight: 800, color: primaryTeal }}>
            {view === "list" ? "Admin Console" : "Security Hub"}
          </Typography>
          <Typography sx={{ ...montserratStyle, color: "#64748B", fontWeight: 500, fontSize: "0.85rem" }}>
            Identity & Privilege Management
          </Typography>
        </Box>
        {view === "list" ? (
          <Button 
            component={motion.button} whileHover={{ scale: 1.02 }}
            variant="contained" onClick={handleAddNew} startIcon={<AddCircleOutline />} 
            sx={{ ...montserratStyle, bgcolor: primaryTeal, borderRadius: "10px", px: 3, py: 1, fontWeight: 700, fontSize: "0.8rem", textTransform: 'none' }}
          >
            Create Admin
          </Button>
        ) : (
          <Button onClick={() => setView("list")} startIcon={<ArrowBack />} sx={{ ...montserratStyle, fontWeight: 700, color: primaryTeal, fontSize: "0.8rem" }}>
            Back to List
          </Button>
        )}
      </Stack>

      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div key="list" {...pageIn}>
            <TextField
              placeholder="Filter by credentials..."
              fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ 
                startAdornment: <Search sx={{ color: primaryTeal, mr: 1, fontSize: 20 }} />,
                sx: { ...montserratStyle, borderRadius: "12px", bgcolor: "#FFF", fontSize: "0.85rem", border: '1px solid #E2E8F0' }
              }}
              sx={{ mb: 3 }}
            />
            <AdminList 
                admins={filteredAdmins} 
                onView={(a:any) => {setSelectedAdmin(a); setView("details");}} 
                onEdit={(a: any) => { setSelectedAdmin(a); setIsEditing(true); setView("form"); }} 
                onDelete={(id:string) => {setAdminToDelete(id); setDeleteDialogOpen(true);}} 
            />
          </motion.div>
        )}

        {view === "form" && (
          <motion.div key="form" {...pageIn}>
            <AdminForm admin={selectedAdmin} isEditing={isEditing} onSave={handleFormSave} loading={loading} />
          </motion.div>
        )}

        {view === "details" && (
          <motion.div key="details" {...pageIn}>
            <AdminDetails admin={selectedAdmin} onEdit={() => { setIsEditing(true); setView("form"); }} onDelete={(id:any) => {setAdminToDelete(id); setDeleteDialogOpen(true);}} />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: "15px" } }}>
        <DialogTitle sx={{ ...montserratStyle, fontWeight: 800, fontSize: '1rem' }}>Terminate Access?</DialogTitle>
        <DialogContent><Typography sx={{ ...montserratStyle, fontSize: '0.85rem' }}>This action will revoke all system permissions for this user.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ ...montserratStyle, fontSize: '0.75rem' }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ ...montserratStyle, bgcolor: dangerRed, fontSize: '0.75rem' }}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* --- TABLE VIEW --- */
const AdminList = ({ admins, onView, onEdit, onDelete }: any) => (
  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "15px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
    <Table size="small">
      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
        <TableRow>
          <TableCell sx={{ ...montserratStyle, fontWeight: 700, color: "#64748B", pl: 3, py: 2, fontSize: '0.75rem' }}>ADMINISTRATOR</TableCell>
          <TableCell sx={{ ...montserratStyle, fontWeight: 700, color: "#64748B", fontSize: '0.75rem' }}>SECURITY</TableCell>
          <TableCell align="right" sx={{ ...montserratStyle, fontWeight: 700, color: "#64748B", pr: 3, fontSize: '0.75rem' }}>ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {admins.map((admin: any) => (
          <TableRow key={admin._id} hover component={motion.tr}>
            <TableCell sx={{ pl: 3, py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={admin.profileImage} sx={{ width: 36, height: 36 }} />
                <Box>
                  <Typography sx={{ ...montserratStyle, fontWeight: 700, color: primaryTeal, fontSize: "0.85rem" }}>{admin.name}</Typography>
                  <Typography sx={{ ...montserratStyle, color: "#94A3B8", fontSize: "0.7rem" }}>{admin.email}</Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>
              <Chip 
                label={admin.twoFAEnabled ? "2FA ACTIVE" : "STANDARD"} 
                sx={{ 
                    ...montserratStyle, fontWeight: 800, fontSize: '0.6rem', height: 22,
                    bgcolor: admin.twoFAEnabled ? "#10B98115" : "#F1F5F9", 
                    color: admin.twoFAEnabled ? "#059669" : "#64748B" 
                }} 
              />
            </TableCell>
            <TableCell align="right" sx={{ pr: 2 }}>
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <IconButton size="small" onClick={() => onView(admin)} sx={{ color: primaryTeal }}><KeyboardArrowRight fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => onEdit(admin)} sx={{ color: accentGold }}><EditOutlined fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => onDelete(admin._id)} sx={{ color: dangerRed }}><DeleteOutline fontSize="small" /></IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

/* --- FORM VIEW WITH IMAGE PREVIEW --- */
const AdminForm = ({ admin, isEditing, onSave, loading }: any) => {
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "",
    profileImage: admin?.profileImage || "",
  });

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", border: "1px solid #E2E8F0", maxWidth: "600px", mx: "auto" }}>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <motion.div animate={{ scale: formData.profileImage ? 1 : 0.9 }}>
            <Avatar 
                src={formData.profileImage} 
                sx={{ width: 90, height: 90, mx: 'auto', border: `3px solid ${primaryTeal}`, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} 
            />
          </motion.div>
          <Typography sx={{ ...montserratStyle, mt: 1.5, fontSize: '0.75rem', fontWeight: 700, color: primaryTeal }}>
             {formData.profileImage ? "Live Preview Active" : "No Profile Image"}
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField 
            fullWidth label="Photo Link (URL)" size="small" 
            placeholder="https://example.com/photo.jpg"
            value={formData.profileImage} onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, fontSize: 18, color: '#94A3B8' }} /> }}
            InputLabelProps={{ sx: { ...montserratStyle, fontSize: '0.8rem' } }}
          />
          <TextField 
            fullWidth label="Full Name" size="small" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            InputLabelProps={{ sx: { ...montserratStyle, fontSize: '0.8rem' } }}
          />
          <TextField 
            fullWidth label="Email" size="small" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            InputLabelProps={{ sx: { ...montserratStyle, fontSize: '0.8rem' } }}
          />
          <TextField 
            fullWidth type="password" label="Password" size="small" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            InputLabelProps={{ sx: { ...montserratStyle, fontSize: '0.8rem' } }}
          />
        </Stack>
        <Button 
          variant="contained" fullWidth disabled={loading} onClick={() => onSave(formData)} 
          sx={{ ...montserratStyle, bgcolor: primaryTeal, py: 1.2, borderRadius: "8px", fontWeight: 700, fontSize: '0.8rem', textTransform: 'none' }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : (isEditing ? "Update Credentials" : "Create Account")}
        </Button>
      </Stack>
    </Paper>
  );
};

/* --- 2FA LOGIC DETAILS --- */
const AdminDetails = ({ admin: initialAdmin, onEdit, onDelete }: any) => {
  const [admin, setAdmin] = useState(initialAdmin);
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleSetup2FA = async () => {
    setLoading2FA(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/setup-2fa`, { adminId: admin._id });
      setQrCode(res.data.qrCode);
      setIsVerifying(true);
    } catch (err) {
      setSnackbar({ open: true, message: "Security Error" });
    } finally {
      setLoading2FA(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    setLoading2FA(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/verify-2fa`, { adminId: admin._id, token: verificationCode });
      if (res.data.success) {
        setAdmin({ ...admin, twoFAEnabled: true });
        setIsVerifying(false);
        setQrCode("");
        setSnackbar({ open: true, message: "2FA Verified" });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Invalid Code" });
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", border: "1px solid #E2E8F0" }}>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity="info" sx={{ ...montserratStyle, fontSize: '0.75rem' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Stack spacing={3}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar src={admin.profileImage} sx={{ width: 100, height: 100, borderRadius: "20px" }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ ...montserratStyle, fontWeight: 800, color: primaryTeal, fontSize: '1.1rem' }}>{admin.name}</Typography>
            <Typography sx={{ ...montserratStyle, color: "#64748B", fontWeight: 600, fontSize: '0.75rem' }}>Admin Node</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
               <Button size="small" variant="contained" onClick={onEdit} sx={{ ...montserratStyle, bgcolor: accentGold, borderRadius: "6px", fontSize: '0.65rem', textTransform: 'none' }}>Edit</Button>
               <Button size="small" variant="outlined" onClick={() => onDelete(admin._id)} sx={{ ...montserratStyle, color: dangerRed, borderColor: dangerRed, borderRadius: "6px", fontSize: '0.65rem', textTransform: 'none' }}>Revoke</Button>
            </Stack>
          </Box>
        </Stack>

        <Divider />

        <Paper 
          component={motion.div} layout
          sx={{ 
            p: 3, borderRadius: "15px", 
            background: admin.twoFAEnabled ? "linear-gradient(135deg, #065F46 0%, #10B981 100%)" : "#1E293B",
            color: "#FFF"
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Box sx={{ bgcolor: "#FFF", p: 1, borderRadius: "12px", minWidth: 100, minHeight: 100, display: 'flex', alignItems: 'center' }}>
              {qrCode ? (
                <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={qrCode} style={{ width: 90 }} />
              ) : (
                <QrCode2 sx={{ fontSize: 50, color: admin.twoFAEnabled ? "#10B981" : "#475569" }} />
              )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ ...montserratStyle, fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                {admin.twoFAEnabled ? <SecurityUpdateGood fontSize="small" /> : <ShieldMoonOutlined fontSize="small" />}
                {admin.twoFAEnabled ? "2FA Hardened" : "Two-Step Verification"}
              </Typography>
              <Typography sx={{ ...montserratStyle, opacity: 0.8, mt: 0.5, fontSize: '0.7rem' }}>
                {admin.twoFAEnabled ? "Biometric & Token protection active." : "Enhance security by adding a mobile token layer."}
              </Typography>

              {!admin.twoFAEnabled && !isVerifying && (
                <Button 
                  size="small" variant="contained" onClick={handleSetup2FA} 
                  sx={{ ...montserratStyle, bgcolor: "#FFF", color: "#000", mt: 1.5, fontSize: '0.65rem', textTransform: 'none' }}
                >
                  {loading2FA ? <CircularProgress size={14} /> : "Enable 2FA"}
                </Button>
              )}

              {isVerifying && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <TextField 
                    placeholder="6-Digit" size="small"
                    value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                    InputProps={{ sx: { ...montserratStyle, bgcolor: "#FFF", borderRadius: "6px", fontSize: '0.7rem', width: 90 } }}
                  />
                  <Button onClick={handleVerifyAndEnable} variant="contained" sx={{ ...montserratStyle, bgcolor: "#10B981", fontSize: '0.65rem' }}>Verify</Button>
                  <IconButton onClick={() => setIsVerifying(false)} size="small" sx={{ color: "#FFF" }}><CancelOutlined fontSize="small" /></IconButton>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <DetailItem label="Channel" value={admin.email} icon={<MailOutline fontSize="small" />} />
          <DetailItem label="Provisioned" value={new Date(admin.createdAt).toLocaleDateString()} icon={<AccessTime fontSize="small" />} />
        </Box>
      </Stack>
    </Paper>
  );
};

const DetailItem = ({ label, value, icon }: any) => (
  <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: primaryTeal }}>{icon}</Box>
      <Box>
        <Typography sx={{ ...montserratStyle, color: "#94A3B8", fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase' }}>{label}</Typography>
        <Typography sx={{ ...montserratStyle, fontWeight: 700, color: primaryTeal, fontSize: '0.75rem' }}>{value}</Typography>
      </Box>
    </Stack>
  </Box>
);

export default AdminManagement;