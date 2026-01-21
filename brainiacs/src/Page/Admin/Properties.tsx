import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; 
import {
  Box, Typography, Button, CircularProgress, IconButton, Pagination,
  Dialog, Zoom, Divider, Chip, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, GlobalStyles, Tooltip, InputAdornment,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
  LocationOn, Business, WhatsApp, CallOutlined, FileDownloadOutlined, 
  Search, VisibilityOutlined, Scale, AttachMoney, DeleteOutline,
  InfoOutlined, Speed, RequestPageOutlined, PersonOutline, PhoneAndroidOutlined
} from "@mui/icons-material";
import { TextField } from "@mui/material";

// الإعدادات البصرية
const TAJAWAL = "'Tajawal', sans-serif";
const primaryTeal = "#004652";
const accentGold = "#CC9D2F";

interface PropertyRequest {
  _id?: string;
  propertyStatus: string;
  propertyType: string;
  location: string;
  developer: string;
  area: string;
  priceLimit: string;
  priceOffer: string;
  notes: string;
  clientName: string;
  clientMobile: string;
  contactChannels: { chat: boolean; whatsapp: boolean; call: boolean };
  createdAt?: string;
}

const Properties: React.FC = () => {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewRequest, setViewRequest] = useState<PropertyRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const apiHost = import.meta.env.VITE_API_URL;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiHost}/api/save-request`);
      if (res.data.success) setRequests(res.data.data);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`${apiHost}/api/save-request/${deleteId}`);
      if (res.data.success) {
        setRequests(requests.filter(item => item._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) { alert("حدث خطأ أثناء الحذف"); }
  };

  const handleExport = (dataToExport: PropertyRequest[], fileName: string) => {
    const formatted = dataToExport.map(item => ({
      "اسم العميل": item.clientName, 
      "رقم الجوال": item.clientMobile, 
      "حالة العقار": item.propertyStatus,
      "نوع العقار": item.propertyType, 
      "الموقع": item.location, 
      "المطور": item.developer,
      "المساحة": item.area, 
      "الحد السعري": item.priceLimit,
      "السعر المعروض": item.priceOffer, 
      "ملاحظات": item.notes,
      "التاريخ": item.createdAt ? new Date(item.createdAt).toLocaleString("ar-EG") : ""
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "البيانات الكاملة");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const filtered = requests.filter(r => 
    r.clientName?.includes(searchTerm) || r.clientMobile?.includes(searchTerm)
  );

  const paginated = filtered.slice((page - 1) * 7, page * 7);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{ color: accentGold }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, bgcolor: "#F4F7F9", minHeight: "100vh", direction: "rtl" }}>
      <GlobalStyles styles={{ body: { fontFamily: TAJAWAL } }} />

      {/* --- الهيدر --- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4, gap: 2 }}>
        <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: primaryTeal, fontFamily: TAJAWAL, fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
            سجل المبيعات المتكامل
          </Typography>
          <Typography sx={{ color: "#64748B", fontFamily: TAJAWAL, fontSize: '0.9rem' }}>إدارة وتصدير كافة بيانات طلبات العملاء</Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<FileDownloadOutlined sx={{ ml: 1 }} />} 
          onClick={() => handleExport(filtered, "سجل_الطلبات_الكامل")}
          sx={{ borderRadius: "10px", fontFamily: TAJAWAL, borderColor: "#CBD5E1", color: "#475569", px: 4, py: 1.2 }}
        >
          تصدير البيانات الكاملة
        </Button>
      </Stack>

      {/* --- البحث --- */}
      <TextField 
        fullWidth 
        placeholder="ابحث باسم العميل أو رقم الجوال..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
            mb: 3, bgcolor: "white", borderRadius: "12px", 
            "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: TAJAWAL, "& fieldset": { border: "none" }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
            "& .MuiInputBase-input::placeholder": { fontFamily: TAJAWAL, opacity: 0.7 }
        }}
        InputProps={{ startAdornment: ( <InputAdornment position="start"> <Search sx={{ color: "#94A3B8", mr: 1 }} /> </InputAdornment> ) }}
      />

      {/* --- الجدول --- */}
      <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "none", overflowX: "auto" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              {["العميل", "الحالة", "النوع", "المساحة", "العرض المالي", "التواصل", "التحكم"].map(h => (
                <TableCell key={h} align="right" sx={{ fontWeight: 800, fontFamily: TAJAWAL, color: "#475569" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700, fontFamily: TAJAWAL, color: primaryTeal }}>{item.clientName}</Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748B" }}>{item.clientMobile}</Typography>
                </TableCell>
                <TableCell align="right"><Chip label={item.propertyStatus} size="small" variant="outlined" sx={{ fontFamily: TAJAWAL, color: primaryTeal, borderColor: primaryTeal }} /></TableCell>
                <TableCell align="right"><Chip label={item.propertyType} size="small" sx={{ fontFamily: TAJAWAL, fontWeight: 700, bgcolor: accentGold, color: 'white' }} /></TableCell>
                <TableCell align="right" sx={{ fontFamily: TAJAWAL }}>{item.area}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, color: primaryTeal, fontFamily: TAJAWAL }}>{item.priceOffer}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {item.contactChannels.whatsapp && <WhatsApp sx={{ color: "#25D366", fontSize: 18 }} />}
                    {item.contactChannels.call && <CallOutlined sx={{ color: "#3B82F6", fontSize: 18 }} />}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                   <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="عرض البيانات الكاملة"><IconButton onClick={() => setViewRequest(item)} sx={{ color: primaryTeal }}><VisibilityOutlined /></IconButton></Tooltip>
                      <Tooltip title="حذف الطلب"><IconButton onClick={() => setDeleteId(item._id || null)} sx={{ color: "#EF4444" }}><DeleteOutline /></IconButton></Tooltip>
                   </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- نافذة الحذف --- */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} TransitionComponent={Zoom}>
        <DialogTitle sx={{ fontFamily: TAJAWAL, fontWeight: 800, textAlign: 'right' }}>تأكيد الحذف</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily: TAJAWAL, textAlign: 'right' }}>هل أنت متأكد من حذف هذا الطلب نهائياً؟</Typography></DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-start' }}>
          <Button onClick={() => setDeleteId(null)} sx={{ fontFamily: TAJAWAL }}>إلغاء</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ fontFamily: TAJAWAL, bgcolor: "#EF4444" }}>حذف نهائي</Button>
        </DialogActions>
      </Dialog>

      {/* --- نافذة العرض المنبثقة (Pop-up) --- */}
      <Dialog open={Boolean(viewRequest)} onClose={() => setViewRequest(null)} fullWidth maxWidth="sm" TransitionComponent={Zoom} PaperProps={{ sx: { borderRadius: '20px' } }}>
        {viewRequest && (
          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: primaryTeal, fontFamily: TAJAWAL }}>تفاصيل الطلب الكاملة</Typography>
                
                {/* الجزء المطلوب: أيقونات العميل والخط */}
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mt: 1.5 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonOutline sx={{ color: accentGold, fontSize: 18 }} />
                    <Typography sx={{ color: accentGold, fontWeight: 700, fontFamily: TAJAWAL, fontSize: "1.1rem" }}>{viewRequest.clientName}</Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: "#CBD5E1", height: 18, alignSelf: 'center' }} />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PhoneAndroidOutlined sx={{ color: "#64748B", fontSize: 18 }} />
                    <Typography sx={{ color: "#64748B", fontWeight: 600, fontFamily: TAJAWAL, fontSize: "1.1rem" }}>{viewRequest.clientMobile}</Typography>
                  </Stack>
                </Stack>
              </Box>
              
              <Divider sx={{ borderStyle: 'dashed' }}><Chip label="بيانات الوحدة" size="small" sx={{ fontFamily: TAJAWAL }} /></Divider>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <DetailRow icon={<InfoOutlined />} label="حالة العقار" value={viewRequest.propertyStatus} />
                <DetailRow icon={<Speed />} label="نوع العقار" value={viewRequest.propertyType} />
                <DetailRow icon={<Business />} label="المطور" value={viewRequest.developer} />
                <DetailRow icon={<Scale />} label="المساحة" value={viewRequest.area} />
                <DetailRow icon={<RequestPageOutlined />} label="الحد السعري" value={viewRequest.priceLimit} />
                <DetailRow icon={<AttachMoney />} label="السعر المعروض" value={viewRequest.priceOffer} />
              </Box>

              <DetailRow icon={<LocationOn />} label="الموقع الجغرافي" value={viewRequest.location} />

              <Box sx={{ p: 2, bgcolor: "#F1F5F9", borderRadius: "12px" }}>
                <Typography sx={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 700, mb: 1, fontFamily: TAJAWAL }}>ملاحظات إضافية:</Typography>
                <Typography sx={{ fontFamily: TAJAWAL, fontSize: '0.95rem', lineHeight: 1.6 }}>{viewRequest.notes || "لا توجد ملاحظات مسجلة"}</Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button fullWidth variant="contained" startIcon={<FileDownloadOutlined sx={{ ml: 1 }} />} onClick={() => handleExport([viewRequest], `طلب_${viewRequest.clientName}`)} sx={{ bgcolor: "#475569", fontFamily: TAJAWAL, py: 1.2, borderRadius: '10px' }}>تصدير إكسل</Button>
                <Button fullWidth variant="contained" startIcon={<WhatsApp sx={{ ml: 1 }} />} sx={{ bgcolor: "#25D366", fontFamily: TAJAWAL, py: 1.2, borderRadius: '10px' }}>واتساب</Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Dialog>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(filtered.length / 7)} page={page} onChange={(_, v) => setPage(v)} color="primary" sx={{ "& .MuiPaginationItem-root": { fontFamily: TAJAWAL } }} />
      </Box>
    </Box>
  );
};

// مكون عرض الصفوف
const DetailRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: accentGold, display: 'flex' }}>{icon}</Box>
      <Typography sx={{ color: "#64748B", fontFamily: TAJAWAL, fontSize: "0.85rem", whiteSpace: 'nowrap' }}>{label}:</Typography>
    </Stack>
    <Typography sx={{ fontWeight: 700, fontFamily: TAJAWAL, textAlign: 'left', pl: 1, fontSize: '0.9rem' }}>{value}</Typography>
  </Stack>
);

export default Properties;