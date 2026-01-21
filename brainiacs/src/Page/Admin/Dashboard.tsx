import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Avatar, IconButton, List, ListItemButton, 
  ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, Stack, 
  useTheme, useMediaQuery, Divider, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button 
} from "@mui/material";
import { 
  DashboardOutlined, 
  ShoppingBagOutlined, // بيع
  HomeWorkOutlined,    // شراء
  VpnKeyOutlined,      // إيجار
  FormatPaintOutlined, // تشطيب
  SettingsOutlined, 
  LogoutOutlined, 
  MenuOpen, 
  LockOutlined, 
  ArrowForwardIos, 
  Close 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// IMPORT SEPARATE PAGES
import Properties from "./Properties";
import Overview from "./Overview";
import CreateAdmin from "./Settings";

const drawerWidth = 300;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("لوحة التحكم");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const [userData, setUserData] = useState({ name: "", profileImage: "", role: "مدير نظام" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const primaryTeal = "#004652";
  const accentGold = "#CC9D2F";
  const menuFont = "Tajawal, sans-serif";

  useEffect(() => {
    const savedData = localStorage.getItem("adminData");
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) { console.error("Session parsing error"); }
    }
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminData");
    navigate("/login");
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "لوحة التحكم": return <Overview />;
      case "بيع العقار": return <Properties />;
      case "الإعدادات": return <CreateAdmin />;
      default: return <Overview />;
    }
  };

  // ✅ القائمة المحدثة بالأيقونات الصحيحة
  const menuItems = [
    { text: "لوحة التحكم", icon: <DashboardOutlined /> },
    { text: "بيع العقار", icon: <HomeWorkOutlined /> },
    { text: "شراء العقار", icon: <ShoppingBagOutlined/> },
    { text: "إيجار العقار", icon: <VpnKeyOutlined /> },
    { text: "تشطيب العقار", icon: <FormatPaintOutlined /> },
    { text: "الإعدادات", icon: <SettingsOutlined /> },
  ];

  const sidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: primaryTeal, color: "white" }}>
      <Box sx={{ pt: { xs: 12, md: 8 }, pb: 6, px: 4, textAlign: "center", position: "relative" }}>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ position: "absolute", left: 20, top: 30, color: "white" }}>
            <Close />
          </IconButton>
        )}
        <Box sx={{ 
          width: 80, height: 80, 
          bgcolor: "rgba(255,255,255,0.08)", 
          borderRadius: "28px", 
          display: "flex", justifyContent: "center", alignItems: "center", 
          margin: "0 auto 25px", border: `1.5px solid ${accentGold}` 
        }}>
          <LockOutlined sx={{ color: accentGold, fontSize: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontFamily: menuFont, fontWeight: 900 }}>
          ديجي ليزر <span style={{ color: accentGold }}>العقارية</span>
        </Typography>
      </Box>

      <List sx={{ px: 3, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text} 
            onClick={() => { setActiveTab(item.text); setMobileOpen(false); }} 
            sx={{ 
              borderRadius: "20px", 
              mb: 1.5, 
              bgcolor: activeTab === item.text ? accentGold : "transparent", 
              color: activeTab === item.text ? primaryTeal : "rgba(255,255,255,0.6)", 
              py: 1.8,
              "&:hover": { bgcolor: activeTab === item.text ? accentGold : "rgba(255,255,255,0.05)" }
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 45, "& svg": { fontSize: 26 } }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontFamily: menuFont, fontWeight: activeTab === item.text ? 900 : 500 }} 
            />
            {activeTab === item.text && <ArrowForwardIos sx={{ fontSize: 14 }} />}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 3, pb: 4 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
        <ListItemButton onClick={() => setLogoutDialogOpen(true)} sx={{ borderRadius: "18px", color: "#FF7070", "&:hover": { bgcolor: "rgba(255,112,112,0.1)" } }}>
          <ListItemIcon sx={{ color: "inherit", minWidth: 45 }}><LogoutOutlined /></ListItemIcon>
          <ListItemText primary="تسجيل الخروج" primaryTypographyProps={{ fontFamily: menuFont, fontWeight: 800 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", direction: "rtl", bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          mr: { md: `${drawerWidth}px` }, 
          bgcolor: "rgba(255, 255, 255, 0.9)", 
          backdropFilter: "blur(15px)", 
          borderBottom: "1px solid #E2E8F0", 
          zIndex: (theme) => isMobile ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: { xs: 90, md: 110 }, px: { xs: 3, md: 6 } }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton 
              onClick={() => setMobileOpen(true)} 
              sx={{ display: { md: "none" }, color: primaryTeal, bgcolor: "#F1F5F9" }}
            >
              <MenuOpen fontSize="large" />
            </IconButton>
            <Typography variant="h5" sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal }}>
              {activeTab}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2.5}>
            <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontFamily: menuFont, fontWeight: 900, color: primaryTeal, fontSize: "1.1rem" }}>
                {userData.name || "المدير"}
              </Typography>
              <Typography sx={{ fontFamily: menuFont, fontWeight: 500, color: "#94A3B8", fontSize: "0.85rem" }}>
                {userData.role}
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 55, height: 55, 
                border: `2px solid ${accentGold}`, 
                bgcolor: primaryTeal, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
              }} 
              src={userData.profileImage}
            >
              {!userData.profileImage && (userData.name ? userData.name[0] : "A")}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth } }}>
        <Drawer 
          variant="temporary" 
          open={mobileOpen} 
          onClose={() => setMobileOpen(false)} 
          anchor="right" 
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {sidebarContent}
        </Drawer>
        <Drawer 
          variant="permanent" 
          anchor="right" 
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, border: "none", boxShadow: "-15px 0 35px rgba(0,70,82,0.12)" } }} 
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 8 }, mt: { xs: "110px", md: "130px" }, width: "100%" }}>
        {renderActivePage()}
      </Box>

      {/* ✅ LOGOUT DIALOG */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} dir="rtl" PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: menuFont, fontWeight: 900 }}>تأكيد الخروج</DialogTitle>
        <DialogContent><DialogContentText sx={{ fontFamily: menuFont }}>هل أنت متأكد من رغبتك في تسجيل الخروج؟</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} sx={{ fontFamily: menuFont, color: "#64748B" }}>إلغاء</Button>
          <Button onClick={handleConfirmLogout} variant="contained" sx={{ bgcolor: "#FF7070", fontFamily: menuFont, borderRadius: "10px", px: 3 }}>خروج</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;