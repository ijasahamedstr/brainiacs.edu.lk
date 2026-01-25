import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Avatar, IconButton, List, ListItemButton, 
  ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, Stack, 
  useTheme, useMediaQuery, Divider, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, Tooltip,
  Fade, Collapse
} from "@mui/material";
import { 
  DashboardOutlined, ExpandLess, ExpandMore, SchoolOutlined,
  CampaignOutlined, QuestionAnswerOutlined, NewspaperOutlined,
  EventOutlined, SupportAgentOutlined, AccountBalanceOutlined,
  Diversity1Outlined, HandshakeOutlined, SettingsOutlined, 
  LogoutOutlined, MenuOpen, ArrowForwardIos,
  NotificationsActiveOutlined, CategoryOutlined,
  AutoStoriesOutlined, Circle, ViewCarouselOutlined,
  HowToRegOutlined, VerifiedOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// IMPORT SEPARATE PAGES
import Properties from "./Properties";
import Overview from "./Overview";
import CreateAdmin from "./Settings";

const drawerWidth = 290;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State Management
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [userData, setUserData] = useState({ name: "System Admin", profileImage: "", role: "Super User" });

  // Design Tokens
  const primaryTeal = "#004652";
  const accentGold = "#CC9D2F";
  const primaryFont = '"Montserrat", sans-serif';
  const LOGO_URL = "https://i.ibb.co/6RkH7J3r/Small-scaled.webp";

  useEffect(() => {
    setIsLoaded(true);
    const savedData = localStorage.getItem("adminData");
    if (savedData) {
      try { setUserData(JSON.parse(savedData)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminData");
    navigate("/login");
  };

  const handleSubmenuToggle = (menuText: string) => {
    setOpenSubmenu(openSubmenu === menuText ? null : menuText);
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (isMobile) setMobileOpen(false);
  };

  // Full Menu Configuration Including Slider, Registration, and Certificates
  const menuConfig = [
    { text: "Dashboard", icon: <DashboardOutlined />, isNested: false },
    { 
      text: "Courses", icon: <SchoolOutlined />, isNested: true,
      children: [
        { text: "All Courses", icon: <AutoStoriesOutlined /> },
        { text: "Course Category", icon: <CategoryOutlined /> }
      ]
    },
    { text: "Home Slider", icon: <ViewCarouselOutlined />, isNested: false },
    { text: "Student Registration", icon: <HowToRegOutlined />, isNested: false },
    { text: "Certificates", icon: <VerifiedOutlined />, isNested: false },
    { text: "Campus Offer", icon: <CampaignOutlined />, isNested: false },
    { text: "Ask Our Student", icon: <QuestionAnswerOutlined />, isNested: false },
    { text: "News", icon: <NewspaperOutlined />, isNested: false },
    { text: "Event", icon: <EventOutlined />, isNested: false },
    { text: "Request Consultation", icon: <SupportAgentOutlined />, isNested: false },
    { text: "Faculties", icon: <AccountBalanceOutlined />, isNested: false },
    { text: "Student Life", icon: <Diversity1Outlined />, isNested: false },
    { text: "Partners", icon: <HandshakeOutlined />, isNested: false },
    { text: "Settings", icon: <SettingsOutlined />, isNested: false },
  ];

  const sidebarContent = (
    <Box sx={{ 
      height: "100%", display: "flex", flexDirection: "column", 
      bgcolor: primaryTeal, color: "white",
      background: `linear-gradient(185deg, ${primaryTeal} 0%, #002d35 100%)`,
      position: 'relative', overflowX: 'hidden'
    }}>
      <Box sx={{ pt: { xs: 12, md: 5 }, px: 3, textAlign: "center", zIndex: 1 }}>
        <Box sx={{ 
          mb: 4, display: 'inline-flex', bgcolor: '#FFFFFF', p: 2, 
          borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
        }}>
          <Box component="img" src={LOGO_URL} alt="Logo" sx={{ width: 180, height: 'auto' }} />
        </Box>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, mt: 1, pb: 4, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '10px' } }}>
        {menuConfig.map((item) => (
          <React.Fragment key={item.text}>
            <ListItemButton 
              onClick={() => item.isNested ? handleSubmenuToggle(item.text) : handleTabChange(item.text)} 
              sx={{ 
                borderRadius: "14px", mb: 0.5, py: 1.4,
                bgcolor: activeTab === item.text || openSubmenu === item.text ? "rgba(255,255,255,0.12)" : "transparent",
                color: activeTab === item.text ? "white" : "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)", transform: "translateX(4px)" }
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: primaryFont, fontWeight: 600, fontSize: '0.88rem' }} />
              {item.isNested ? (openSubmenu === item.text ? <ExpandLess sx={{ opacity: 0.5 }} /> : <ExpandMore sx={{ opacity: 0.5 }} />) : (activeTab === item.text && <ArrowForwardIos sx={{ fontSize: 10 }} />)}
            </ListItemButton>

            {item.isNested && item.children && (
              <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ mb: 1 }}>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.text} onClick={() => handleTabChange(child.text)}
                      sx={{ 
                        pl: 6, py: 1, borderRadius: "10px", mx: 1, mb: 0.2,
                        bgcolor: activeTab === child.text ? "rgba(204, 157, 47, 0.15)" : "transparent",
                        color: activeTab === child.text ? accentGold : "rgba(255,255,255,0.5)",
                        "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 25, color: 'inherit' }}><Circle sx={{ fontSize: 6 }} /></ListItemIcon>
                      <ListItemText primary={child.text} primaryTypographyProps={{ fontFamily: primaryFont, fontSize: '0.82rem', fontWeight: 500 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ px: 3, pb: 4 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.08)", mb: 3 }} />
        <Button fullWidth variant="outlined" onClick={() => setLogoutDialogOpen(true)} startIcon={<LogoutOutlined />} sx={{ borderRadius: "14px", color: "#FF8E8E", borderColor: "rgba(255,142,142,0.3)", fontFamily: primaryFont, fontWeight: 700, textTransform: 'none', py: 1.2 }}>Sign Out</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#F0F4F8", minHeight: "100vh" }}>
      <AppBar 
        position="fixed" elevation={0} 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` },
          bgcolor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", 
          borderBottom: `2px solid ${primaryTeal}10`, zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: { xs: 85, md: 100 }, px: { xs: 3, md: 5 } }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            {isMobile && <IconButton onClick={() => setMobileOpen(true)} sx={{ color: primaryTeal, bgcolor: '#f1f5f9' }}><MenuOpen /></IconButton>}
            <Box>
              <Typography variant="h4" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal, letterSpacing: '-1.5px', textTransform: 'capitalize' }}>
                {activeTab}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 25, height: 3, bgcolor: accentGold, borderRadius: 2 }} />
                <Typography sx={{ fontFamily: primaryFont, fontSize: '0.7rem', color: accentGold, fontWeight: 800, letterSpacing: '2.8px', textTransform: 'uppercase' }}>
                  Campus Admin Console
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={3}>
            <Tooltip title="Alerts"><IconButton sx={{ border: '1.5px solid #F1F5F9', color: '#64748B' }}><NotificationsActiveOutlined sx={{ fontSize: 20 }} /></IconButton></Tooltip>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ pl: 2, borderLeft: '1px solid #E2E8F0' }}>
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "0.95rem" }}>{userData.name}</Typography>
                <Typography sx={{ fontFamily: primaryFont, color: "#10B981", fontSize: "0.7rem", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}><Circle sx={{ fontSize: 8 }} /> ONLINE</Typography>
              </Box>
              <Avatar src={userData.profileImage} sx={{ width: 52, height: 52, border: `2px solid ${primaryTeal}20`, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}>{!userData.profileImage && "A"}</Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        <Drawer variant={isMobile ? "temporary" : "permanent"} open={isMobile ? mobileOpen : true} onClose={() => setMobileOpen(false)} sx={{ "& .MuiDrawer-paper": { width: drawerWidth, border: "none", boxShadow: "10px 0 40px rgba(0,0,0,0.03)" } }}>{sidebarContent}</Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: { xs: "85px", md: "100px" }, width: "100%" }}>
        <Fade in={isLoaded} timeout={600}>
          <Box sx={{ bgcolor: 'white', borderRadius: '32px', minHeight: 'calc(100vh - 185px)', p: { xs: 2, md: 4 }, boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,0.8)' }}>
            {activeTab === "Dashboard" && <Overview />}
            {activeTab === "All Courses" && <Properties />}
            {activeTab === "Settings" && <CreateAdmin />}
            
            {/* NEW MODULES FALLBACKS */}
            {activeTab === "Home Slider" && (
                <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h5">Slider Management Interface</Typography></Box>
            )}
            {activeTab === "Student Registration" && (
                <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h5">Student Admissions & Enrollment</Typography></Box>
            )}
            {activeTab === "Certificates" && (
                <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h5">Certificate Verification & Issuance</Typography></Box>
            )}

            {!["Dashboard", "All Courses", "Settings", "Home Slider", "Student Registration", "Certificates"].includes(activeTab) && (
              <Box sx={{ textAlign: 'center', py: 15, opacity: 0.6 }}>
                <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 700 }}>{activeTab} Module</Typography>
                <Typography sx={{ fontFamily: primaryFont }}>System records for this section are currently being synchronized...</Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}>
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal }}>Confirm Logout</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily: primaryFont, color: "#64748B" }}>Are you sure you want to end your current session? All unsaved changes will be lost.</Typography></DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} sx={{ fontWeight: 700, color: "#94A3B8" }}>Cancel</Button>
          <Button onClick={handleConfirmLogout} variant="contained" sx={{ bgcolor: "#FF7070", borderRadius: "12px", px: 3, fontWeight: 700, "&:hover": { bgcolor: "#E65F5F" } }}>Logout Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;