import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, Stack,
  CircularProgress
} from "@mui/material";
import { DeleteOutline, VisibilityOutlined, HomeWork } from "@mui/icons-material";
import axios from "axios";

// Define the shape of your data
interface PropertyRequest {
  _id: string;
  clientName: string;
  clientMobile: string;
  propertyType: string;
  location: string;
  area: string;
  priceOffer?: string;
  priceLimit?: string;
}

const Propertyforsale: React.FC = () => {
  // Apply the interface to state
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiHost = import.meta.env.VITE_API_URL;
  const menuFont = "Tajawal, sans-serif";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiHost}/api/save-request`);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sale requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        const response = await axios.delete(`${apiHost}/api/save-request/${id}`);
        if (response.data.success) {
          setRequests((prev) => prev.filter((item) => item._id !== id));
        }
      } catch (error) {
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: "#004652" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
        <Box sx={{ bgcolor: "#004652", p: 1.5, borderRadius: "15px", display: 'flex' }}>
          <HomeWork sx={{ color: "#fff", fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ fontFamily: menuFont, fontWeight: 900, color: "#004652" }}>
          طلبات بيع العقارات ({requests.length})
        </Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: "25px", border: "1px solid #E2E8F0" }}>
        <Table dir="rtl">
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>العميل</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>الجوال</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>نوع العقار</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>الموقع</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>المساحة</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontFamily: menuFont }}>السعر</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, fontFamily: menuFont }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell align="right" sx={{ fontFamily: menuFont }}>{row.clientName}</TableCell>
                <TableCell align="right" sx={{ fontFamily: menuFont }}>{row.clientMobile}</TableCell>
                <TableCell align="right">
                  <Chip label={row.propertyType || "عقار"} size="small" sx={{ fontFamily: menuFont }} />
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: menuFont }}>{row.location}</TableCell>
                <TableCell align="right" sx={{ fontFamily: menuFont }}>{row.area}</TableCell>
                <TableCell align="right" sx={{ fontFamily: menuFont, fontWeight: 900, color: "#CC9D2F" }}>
                  {/* Property 'priceOffer' logic now works perfectly */}
                  {row.priceOffer || row.priceLimit || "على السوم"}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <IconButton size="small" sx={{ color: "#004652" }}>
                      <VisibilityOutlined fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#FF7070" }} onClick={() => handleDelete(row._id)}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Propertyforsale;