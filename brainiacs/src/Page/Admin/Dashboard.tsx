import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Avatar, IconButton, List, ListItemButton, 
  ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, Stack, 
  useTheme, useMediaQuery, Divider, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, Tooltip,
  Fade
} from "@mui/material";
import { 
  DashboardOutlined, 
  ShoppingBagOutlined, 
  HomeWorkOutlined,    
  VpnKeyOutlined,      
  FormatPaintOutlined, 
  SettingsOutlined, 
  LogoutOutlined, 
  MenuOpen, 
  ArrowForwardIos,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// IMPORT SEPARATE PAGES
import Properties from "./Properties";
import Overview from "./Overview";
import CreateAdmin from "./Settings";

const drawerWidth = 290;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [userData, setUserData] = useState({ name: "", profileImage: "", role: "System Admin" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardOutlined /> },
    { text: "Sale", icon: <HomeWorkOutlined /> },
    { text: "Purchase", icon: <ShoppingBagOutlined/> },
    { text: "Rent", icon: <VpnKeyOutlined /> },
    { text: "Finishing", icon: <FormatPaintOutlined /> },
    { text: "Settings", icon: <SettingsOutlined /> },
  ];

  const sidebarContent = (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      bgcolor: primaryTeal, 
      color: "white",
      background: `linear-gradient(185deg, ${primaryTeal} 0%, #002d35 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{
        position: 'absolute', top: -50, right: -50, width: 150, height: 150,
        borderRadius: '50%', background: 'rgba(204, 157, 47, 0.05)', filter: 'blur(40px)'
      }} />

      <Box sx={{ pt: { xs: 15, md: 5 }, px: 3, textAlign: "center", zIndex: 1 }}>
          <Box sx={{ 
            mb: 3, 
            position: 'relative', 
            display: 'inline-flex',
            bgcolor: '#FFFFFF', 
            p: 2.5, 
            borderRadius: '24px', 
            boxShadow: '0 12px 30px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)',
            border: '4px solid rgba(255,255,255,0.1)', 
            transition: 'all 0.4s ease-in-out',
            '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'scale(1.03)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }
          }}>
            <Box
                component="img"
                src={LOGO_URL}
                alt="DigiLaser Logo"
                sx={{
                    width: 200, 
                    height: 'auto',
                    display: 'block',
                }}
            />
          </Box>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text}
            onClick={() => { setActiveTab(item.text); isMobile && setMobileOpen(false); }} 
            sx={{ 
              borderRadius: "14px", 
              mb: 1, 
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              bgcolor: activeTab === item.text ? "rgba(255,255,255,1)" : "transparent", 
              color: activeTab === item.text ? primaryTeal : "rgba(255,255,255,0.6)", 
              py: 1.6,
              mx: 1,
              boxShadow: activeTab === item.text ? "0 10px 25px rgba(0,0,0,0.2)" : "none",
              "&:hover": { 
                bgcolor: activeTab === item.text ? "white" : "rgba(255,255,255,0.08)",
                transform: "translateX(8px)",
                color: activeTab === item.text ? primaryTeal : "white"
              }
            }}
          >
            <ListItemIcon sx={{ 
                color: activeTab === item.text ? primaryTeal : "inherit", 
                minWidth: 40,
                transition: '0.3s'
            }}>
              {React.cloneElement(item.icon as React.ReactElement)}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                  fontFamily: primaryFont, 
                  fontWeight: activeTab === item.text ? 800 : 500, 
                  fontSize: '0.92rem' 
              }} 
            />
            {activeTab === item.text && (
                <Fade in={true}>
                    <ArrowForwardIos sx={{ fontSize: 12, opacity: 0.7 }} />
                </Fade>
            )}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 3, pb: 4 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.08)", mb: 3 }} />
        <Button 
          fullWidth
          variant="outlined"
          onClick={() => setLogoutDialogOpen(true)}
          startIcon={<LogoutOutlined />}
          sx={{ 
            borderRadius: "14px", 
            color: "#FF8E8E", 
            borderColor: "rgba(255,142,142,0.3)",
            fontFamily: primaryFont, 
            fontWeight: 700,
            textTransform: 'none',
            py: 1.4,
            transition: '0.3s',
            "&:hover": { 
                bgcolor: "rgba(255,142,142,0.1)", 
                borderColor: "#FF8E8E",
                transform: 'translateY(-2px)'
            } 
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#F0F4F8", minHeight: "100vh" }}>
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          bgcolor: "rgba(255, 255, 255, 0.85)", 
          backdropFilter: "blur(15px)", 
          borderBottom: "1px solid rgba(0, 70, 82, 0.05)", 
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: { xs: 80, md: 100 }, px: { xs: 3, md: 5 } }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: primaryTeal, bgcolor: '#f1f5f9' }}>
                <MenuOpen />
              </IconButton>
            )}
            <Box>
                <Typography variant="h5" sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal, letterSpacing: '-0.5px' }}>
                {activeTab}
                </Typography>
                <Typography sx={{ fontFamily: primaryFont, fontSize: '0.7rem', color: accentGold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Live System Console
                </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={3}>
            <Tooltip title="Alerts">
                <IconButton sx={{ 
                    color: '#64748B', 
                    border: '1.5px solid #F1F5F9',
                    '&:hover': { color: primaryTeal, bgcolor: '#f1f5f9' }
                }}>
                    <NotificationsActiveOutlined sx={{ fontSize: 20 }} />
                </IconButton>
            </Tooltip>
            
            <Stack direction="row" alignItems="center" spacing={2} sx={{ pl: 2, borderLeft: '1px solid #E2E8F0' }}>
                <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                    <Typography sx={{ fontFamily: primaryFont, fontWeight: 800, color: primaryTeal, fontSize: "0.95rem" }}>
                        {userData.name || "Administrator"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }} />
                        <Typography sx={{ fontFamily: primaryFont, fontWeight: 600, color: "#94A3B8", fontSize: "0.75rem" }}>
                            Online
                        </Typography>
                    </Box>
                </Box>
                <Avatar 
                    src={userData.profileImage}
                    sx={{ 
                        width: 50, height: 50, 
                        border: `2px solid white`, 
                        bgcolor: primaryTeal, 
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                        fontFamily: primaryFont,
                        fontWeight: 700
                    }} 
                >
                    {!userData.profileImage && "A"}
                </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        <Drawer 
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          anchor="left"
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth, border: "none", boxShadow: "15px 0 45px rgba(0,0,0,0.04)" } }}
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* --- CONTENT AREA UPDATED FOR 85px MOBILE MARGIN --- */}
      <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          mt: { xs: "85px", md: "100px" }, // Adjusted exactly to 85px for mobile (xs)
          width: "100%"
        }}>
        <Fade in={isLoaded} timeout={800}>
            <Box sx={{ 
                bgcolor: 'white', 
                borderRadius: '32px', 
                minHeight: 'calc(100vh - 180px)', 
                p: { xs: 2, md: 4 },
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                border: '1px solid rgba(255,255,255,0.8)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {activeTab === "Dashboard" && <Overview />}
                {activeTab === "Sale" && <Properties />}
                {activeTab === "Settings" && <CreateAdmin />}
            </Box>
        </Fade>
      </Box>

      {/* Logout Confirmation */}
      <Dialog 
        open={logoutDialogOpen} 
        onClose={() => setLogoutDialogOpen(false)} 
        PaperProps={{ sx: { borderRadius: "28px", p: 1, width: '400px' } }}
      >
        <DialogTitle sx={{ fontFamily: primaryFont, fontWeight: 900, color: primaryTeal }}>
            Confirm Sign Out
        </DialogTitle>
        <DialogContent>
            <Typography sx={{ fontFamily: primaryFont, color: "#64748B" }}>
                Are you sure you want to end your session? Your progress is saved automatically.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} sx={{ fontFamily: primaryFont, color: "#94A3B8", fontWeight: 700 }}>
              Stay here
          </Button>
          <Button 
            onClick={handleConfirmLogout} 
            variant="contained" 
            sx={{ 
                bgcolor: "#FF7070", borderRadius: "12px", px: 4, 
                fontFamily: primaryFont, fontWeight: 700,
                "&:hover": { bgcolor: "#E65F5F" }
            }}
          >
              Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;