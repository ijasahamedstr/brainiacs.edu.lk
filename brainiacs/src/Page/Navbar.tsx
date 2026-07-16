import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Grow,
  Popper,
  ClickAwayListener,
  BottomNavigation,
  BottomNavigationAction,
  Stack,
  Collapse
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoIcon from '@mui/icons-material/Info';
import PhoneIcon from '@mui/icons-material/Phone';

/* --- Environment Variables --- */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* =====================================================================
   MENU CONFIGURATION SETTINGS (MANUAL ON/OFF SWITCHES)
   Change these to 'false' to manually hide a menu item globally.
===================================================================== */
const MENU_CONFIG = {
  showHome: true,
  showOurStory: true,
  showFaculties: false, // Set to false to hide Faculties menu
  showProgrammes: true,
  showStudentLife: true,
  showNews: true,
  showContact: true,
  showLoginBtn: true,
  showRegisterBtn: true,
};
/* ===================================================================== */

/* --- Helper Function --- */
const generateSlug = (name: string) => {
  return encodeURIComponent(
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  );
};

/* --- Data Structures --- */
const ourStoryLinks = [
  { label: 'About Us', path: '/aboutus' },
  { label: 'Leadership & Governance', path: '/leadership-governance' },
  { label: "President's Message", path: '/Presidentmessage' },
  { label: 'Our Partners', path: '/partners' },
  { label: 'Our Team', path: '/our-team' },
];

/* --- Types --- */
interface NavLink {
  label: string;
  path: string;
}

interface ProgrammeGroup {
  title: string;
  items: NavLink[];
}

/* --- Styled Components --- */
const StyledToolbar = styled(Toolbar)<{ isScrolled?: boolean }>(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(18, 18, 18, 0.4)',
  borderRadius: '20px',
  marginTop: isScrolled ? '12px' : '20px',
  padding: '6px 16px 6px 24px !important',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.5)' : 'none',
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  [theme.breakpoints.down('lg')]: { borderRadius: '16px', marginTop: '10px' },
  [theme.breakpoints.down('sm')]: {
    borderRadius: isScrolled ? '16px' : '20px',
    marginTop: isScrolled ? '8px' : '12px',
    backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(18, 18, 18, 0.6)',
  }
}));

const NavButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#4caf50' : '#e4e4e7',
  textTransform: 'none',
  fontSize: '0.82rem',
  fontWeight: 600,
  fontFamily: '"Montserrat", sans-serif',
  margin: '0 4px',
  padding: '8px 14px',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
    width: '40%',
    height: '3px',
    backgroundColor: '#4caf50',
    borderRadius: '4px',
    transition: 'transform 0.3s ease',
    boxShadow: active ? '0 0 10px rgba(76, 175, 80, 0.6)' : 'none',
  },
  '&:hover': {
    color: '#4caf50',
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    '&::after': { transform: 'translateX(-50%) scaleX(1)' }
  },
}));

const GradientBtn = styled(Button)(() => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.78rem',
  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  padding: '8px 20px',
  height: '40px',
  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #66bb6a 0%, #388e3c 100%)',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)',
    transform: 'translateY(-2px)'
  },
}));

const FloatingBottomNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 16,
  left: 16,
  right: 16,
  zIndex: 1400,
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: 'rgba(15, 15, 15, 0.85)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
}));

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = React.useState<string | null>(null);
  const [dynamicFacultyLinks, setDynamicFacultyLinks] = React.useState<NavLink[]>([]);
  const [dynamicProgrammeGroups, setDynamicProgrammeGroups] = React.useState<ProgrammeGroup[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:1200px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const fetchFaculties = async () => {
      if (!MENU_CONFIG.showFaculties) return; // Skip fetch if disabled
      try {
        const response = await fetch(`${API_BASE_URL}/api/faculties`);
        if (!response.ok) throw new Error('Failed to fetch faculties');
        const data = await response.json();
        const fetchedLinks = data.map((faculty: { _id: string; name: string }) => ({
          label: faculty.name,
          path: `/faculties/${generateSlug(faculty.name)}`
        }));
        setDynamicFacultyLinks(fetchedLinks);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    const fetchProgrammes = async () => {
      if (!MENU_CONFIG.showProgrammes) return; // Skip fetch if disabled
      try {
        const response = await fetch(`${API_BASE_URL}/api/course`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        const groupedData = data.reduce((acc: Record<string, ProgrammeGroup>, course: any) => {
          const categoryName = course.courseCategory || 'Other Programmes';
          if (!acc[categoryName]) {
            acc[categoryName] = { title: categoryName, items: [] };
          }
          acc[categoryName].items.push({
            label: course.courseName,
            path: `/courses/${course._id}`
          });
          return acc;
        }, {});
        setDynamicProgrammeGroups(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchFaculties();
    fetchProgrammes();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menu);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseMenu();
    setActiveMobileTab(null);
  };

  const openDrawerWithSection = (key: string) => {
    setActiveMobileTab(key);
    setDrawerOpen(true);
  };

  const isDropdownActive = (links: NavLink[]) => links.some(link => link.path === location.pathname);

  const isMegaMenuActive = () => {
    return dynamicProgrammeGroups.some(group =>
      group.items.some(item => item.path === location.pathname)
    );
  };

  // Filter Mobile Grid Menu based on Config
  const MOBILE_GRID_MENU = [
    ...(MENU_CONFIG.showHome ? [{ text: 'Home', icon: <HomeIcon sx={{ fontSize: '22px' }} />, path: '/' }] : []),
    ...(MENU_CONFIG.showFaculties ? [{ text: 'Faculties', icon: <SchoolIcon sx={{ fontSize: '22px' }} />, action: 'facs' }] : []),
    ...(MENU_CONFIG.showProgrammes ? [{ text: 'Programmes', icon: <MenuBookIcon sx={{ fontSize: '22px' }} />, action: 'prog' }] : []),
    ...(MENU_CONFIG.showOurStory ? [{ text: 'Our Story', icon: <InfoIcon sx={{ fontSize: '22px' }} />, action: 'story' }] : []),
    ...(MENU_CONFIG.showContact ? [{ text: 'Contact', icon: <PhoneIcon sx={{ fontSize: '22px' }} />, path: '/contact' }] : []),
    ...(MENU_CONFIG.showLoginBtn ? [{ text: 'Login', icon: <LoginIcon sx={{ fontSize: '22px' }} />, path: '/login' }] : []),
  ];

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ bgcolor: 'transparent', boxShadow: 'none', zIndex: 1300, pointerEvents: 'none' }}>
        <Container maxWidth="xl" sx={{ pointerEvents: 'auto' }}>
          <StyledToolbar isScrolled={isScrolled}>

            {/* LOGO CONTAINER */}
            <Box
              onClick={() => handleNavigate('/')}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#ffffff', // Changed to solid white
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#f5f5f5', // Slight light-gray tint on hover
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <Box
                component="img"
                src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp"
                sx={{
                  height: { xs: '26px', md: '45px' },
                  objectFit: 'contain',
                }}
              />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                {MENU_CONFIG.showHome && <NavButton active={location.pathname === '/'} onClick={() => handleNavigate('/')}>Home</NavButton>}
                {MENU_CONFIG.showOurStory && <NavButton active={isDropdownActive(ourStoryLinks)} onClick={(e) => handleOpenMenu(e, 'story')} endIcon={<ArrowDropDownIcon />}>Our Story</NavButton>}
                {MENU_CONFIG.showFaculties && <NavButton active={isDropdownActive(dynamicFacultyLinks)} onClick={(e) => handleOpenMenu(e, 'facs')} endIcon={<ArrowDropDownIcon />}>Faculties</NavButton>}
                {MENU_CONFIG.showProgrammes && <NavButton active={isMegaMenuActive()} onClick={(e) => handleOpenMenu(e, 'prog')} endIcon={<ArrowDropDownIcon />}>Programmes</NavButton>}
                {MENU_CONFIG.showStudentLife && <NavButton active={location.pathname === '/student-life'} onClick={() => handleNavigate('/student-life')}>Student Life</NavButton>}
                {MENU_CONFIG.showNews && <NavButton active={location.pathname === '/News'} onClick={() => handleNavigate('/News')}>News</NavButton>}
                {MENU_CONFIG.showContact && <NavButton active={location.pathname === '/contact'} onClick={() => handleNavigate('/contact')}>Contact</NavButton>}

                {/* Dropdown Menu (Our Story, Faculties) */}
                <Menu
                  anchorEl={anchorEl} open={activeMenu === 'story' || activeMenu === 'facs'} onClose={handleCloseMenu} sx={{ zIndex: 1600 }}
                  PaperProps={{
                    sx: {
                      bgcolor: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(20px)', color: '#fff', mt: 2,
                      borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: 220,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                    }
                  }}
                >
                  {(activeMenu === 'story' ? ourStoryLinks : dynamicFacultyLinks).map((link) => (
                    <MenuItem
                      key={link.path} onClick={() => handleNavigate(link.path)}
                      sx={{
                        fontSize: '0.85rem', py: 1.4, px: 3, my: 0.5, mx: 1, borderRadius: '8px',
                        color: location.pathname === link.path ? '#4caf50' : '#e4e4e7', fontFamily: 'Montserrat', fontWeight: 600,
                        borderLeft: location.pathname === link.path ? '3px solid #4caf50' : '3px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { color: '#4caf50', bgcolor: alpha('#4caf50', 0.1), borderLeft: '3px solid #4caf50', transform: 'translateX(4px)' }
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                </Menu>

                {/* MEGA MENU: Programmes (LEFT ALIGNED TEXT) */}
                {MENU_CONFIG.showProgrammes && (
                  <Popper 
                    open={activeMenu === 'prog'} 
                    anchorEl={anchorEl} 
                    transition 
                    placement="bottom" 
                    sx={{ zIndex: 1600 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper sx={{
                          mt: 2, 
                          p: 3.5, 
                          bgcolor: 'rgba(15,15,15,0.95)', 
                          backdropFilter: 'blur(20px)', 
                          color: '#fff',
                          borderRadius: '20px', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          display: 'flex', 
                          justifyContent: 'flex-start', // Justified to flex-start
                          boxShadow: '0 20px 50px rgba(0,0,0,0.8)', 
                          maxHeight: '70vh', 
                          overflowY: 'auto'
                        }}>
                          <ClickAwayListener onClickAway={(e) => {
                            if (anchorEl && anchorEl.contains(e.target as Node)) return;
                            handleCloseMenu();
                          }}>
                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: '1000px', justifyContent: 'flex-start' }}>
                              {dynamicProgrammeGroups.length > 0 ? (
                                dynamicProgrammeGroups.map((group) => (
                                  <Box key={group.title} sx={{ minWidth: 220, mb: 1 }}>
                                    <Typography sx={{
                                      color: '#fff', fontWeight: 800, fontSize: '0.7rem', mb: 1.5, textTransform: 'uppercase',
                                      letterSpacing: '1px', pb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)',
                                      textAlign: 'left' // Aligned left
                                    }}>
                                      {group.title}
                                    </Typography>
                                    {group.items.map((item) => (
                                      <ListItemButton
                                        key={item.label} onClick={() => handleNavigate(item.path)}
                                        sx={{
                                          p: 1, borderRadius: '8px', mb: 0.5, transition: 'all 0.2s',
                                          textAlign: 'left', // Aligned left
                                          justifyContent: 'flex-start', // Aligned left
                                          '&:hover': { bgcolor: alpha('#4caf50', 0.1), transform: 'translateX(4px)' } 
                                        }}
                                      >
                                        <ListItemText
                                          primary={item.label}
                                          primaryTypographyProps={{
                                            fontSize: '0.8rem', fontWeight: 500, fontFamily: 'Montserrat',
                                            color: location.pathname === item.path ? '#4caf50' : '#a1a1aa',
                                          }}
                                        />
                                        {/* Removed FiberManualRecordIcon bullet point completely */}
                                      </ListItemButton>
                                    ))}
                                  </Box>
                                ))
                              ) : (
                                <Typography sx={{ color: '#71717a', fontSize: '0.8rem', p: 1 }}>Loading modules...</Typography>
                              )}
                            </Box>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                )}

                <Box sx={{ ml: 2.5, display: 'flex', gap: 1.5 }}>
                  {MENU_CONFIG.showLoginBtn && (
                    <Button
                      onClick={() => handleNavigate('/login')}
                      sx={{
                        borderRadius: '12px', textTransform: 'none', fontSize: '0.78rem', fontWeight: 700,
                        fontFamily: '"Montserrat", sans-serif', padding: '8px 18px', height: '40px',
                        bgcolor: 'rgba(255,255,255,0.03)', color: '#d4d4d8', border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff', transform: 'translateY(-2px)' }
                      }}
                    >
                      Login
                    </Button>
                  )}
                  {MENU_CONFIG.showRegisterBtn && (
                    <GradientBtn onClick={() => handleNavigate('/register-online')}>Register Now</GradientBtn>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                {MENU_CONFIG.showRegisterBtn && (
                  <IconButton onClick={() => handleNavigate('/register-online')} sx={{ background: 'linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(46,125,50,0.2) 100%)', color: '#4caf50', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '12px', p: 1 }}>
                    <AppRegistrationIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                )}
                {MENU_CONFIG.showLoginBtn && (
                  <IconButton onClick={() => handleNavigate('/login')} sx={{ color: '#d4d4d8', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', p: 1 }}>
                    <LoginIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* --- Mobile App Floating Bottom Navigation --- */}
      <FloatingBottomNav elevation={0}>
        <BottomNavigation
          showLabels
          value={location.pathname}
          sx={{
            bgcolor: 'transparent',
            height: '66px',
            '& .MuiBottomNavigationAction-root': { color: '#71717a', minWidth: 'auto', padding: '8px 0 6px', transition: 'all 0.3s ease' },
            '& .Mui-selected': {
              color: '#4caf50',
              transform: 'translateY(-4px)',
              '& .MuiSvgIcon-root': { filter: 'drop-shadow(0 2px 6px rgba(76, 175, 80, 0.5))' }
            },
            '& .MuiBottomNavigationAction-label': { fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2px', marginTop: '4px' }
          }}
        >
          {MENU_CONFIG.showHome && <BottomNavigationAction label="Home" value="/" icon={<HomeIcon sx={{ fontSize: '22px', transition: 'all 0.3s' }} />} onClick={() => handleNavigate('/')} />}
          {MENU_CONFIG.showFaculties && <BottomNavigationAction label="Faculties" value="/faculties" icon={<SchoolIcon sx={{ fontSize: '22px', transition: 'all 0.3s' }} />} onClick={() => openDrawerWithSection('facs')} />}
          {MENU_CONFIG.showProgrammes && <BottomNavigationAction label="Modules" value="/programmes" icon={<MenuBookIcon sx={{ fontSize: '22px', transition: 'all 0.3s' }} />} onClick={() => openDrawerWithSection('prog')} />}
          <BottomNavigationAction label="Menu" value="menu" icon={<MenuIcon sx={{ fontSize: '22px', transition: 'all 0.3s' }} />} onClick={() => setDrawerOpen(true)} />
        </BottomNavigation>
      </FloatingBottomNav>

      {/* Grid Menu Drawer */}
      <Drawer
        anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ zIndex: 1600 }}
        PaperProps={{
          sx: {
            bgcolor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
            color: '#ffffff',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 -15px 50px rgba(0,0,0,0.9)',
            maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            pb: 'env(safe-area-inset-bottom)'
          }
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pt: 2, pb: 1.5 }}>
          <Box sx={{ width: 40, height: 5, bgcolor: '#333', borderRadius: '10px' }} />
        </Box>

        <Box sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.3px', color: '#fff' }}>Navigation Center</Typography>
              <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.7rem', color: '#4caf50', textTransform: 'uppercase', letterSpacing: '1px' }}>Brainiacs Digital</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#a1a1aa', bgcolor: 'rgba(255,255,255,0.06)', width: 34, height: 34, borderRadius: '10px', backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <CloseOutlined sx={{ fontSize: '18px' }} />
            </IconButton>
          </Stack>

          {/* Grid Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
            {MOBILE_GRID_MENU.map((item) => {
              const isActive = (item.path && location.pathname === item.path) || (item.action && activeMobileTab === item.action);

              return (
                <Paper
                  key={item.text} elevation={0}
                  onClick={() => {
                    if (item.path) handleNavigate(item.path);
                    if (item.action) setActiveMobileTab(activeMobileTab === item.action ? null : item.action);
                  }}
                  sx={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    p: 1.8, borderRadius: "14px", cursor: "pointer", textAlign: "center",
                    background: isActive ? 'linear-gradient(145deg, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0.02) 100%)' : 'rgba(20,20,20,0.6)',
                    border: isActive ? `1px solid rgba(76,175,80,0.4)` : '1px solid rgba(255,255,255,0.04)',
                    boxShadow: isActive ? '0 8px 20px rgba(76,175,80,0.1)' : 'none',
                    backdropFilter: 'blur(10px)',
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:active": { transform: "scale(0.94)" }
                  }}
                >
                  <Box sx={{ mb: 1, color: isActive ? '#4caf50' : '#888', filter: isActive ? 'drop-shadow(0 2px 4px rgba(76,175,80,0.4))' : 'none', transition: 'all 0.2s' }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontFamily: 'Montserrat', fontWeight: isActive ? 800 : 600, fontSize: "0.7rem", color: isActive ? "#fff" : "#a1a1aa", transition: 'all 0.2s' }}>
                    {item.text}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* Dynamic Lists View with Animations */}
        <Box sx={{ overflowY: 'auto', px: 3, pb: 8, flexGrow: 1 }}>
          {MENU_CONFIG.showFaculties && (
            <Collapse in={activeMobileTab === 'facs'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Faculties</Typography>
              <List disablePadding sx={{ bgcolor: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', mb: 3 }}>
                {dynamicFacultyLinks.map(link => (
                  <ListItemButton key={link.path} onClick={() => handleNavigate(link.path)} sx={{ py: 1.5, px: 2.5, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Montserrat' }} sx={{ color: location.pathname === link.path ? '#fff' : '#d4d4d8' }} />
                    <ChevronRightIcon sx={{ fontSize: '16px', color: '#444' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}

          {MENU_CONFIG.showProgrammes && (
            <Collapse in={activeMobileTab === 'prog'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Programmes</Typography>
              <Box sx={{ bgcolor: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(10px)', borderRadius: '16px', p: 1.5, border: '1px solid rgba(255,255,255,0.04)', mb: 3 }}>
                {dynamicProgrammeGroups.map(group => (
                  <Box key={group.title} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                    <Typography sx={{ 
                      color: '#4caf50', fontSize: '0.65rem', fontWeight: 800, px: 1, mb: 0.8, 
                      textTransform: 'uppercase', letterSpacing: '0.8px',
                      textAlign: 'left' // Aligned left
                    }}>
                      {group.title}
                    </Typography>
                    {group.items.map(item => (
                      <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ 
                        borderRadius: '10px', py: 1, px: 1.5, mb: 0.2, 
                        textAlign: 'left', // Aligned left
                        justifyContent: 'flex-start' // Aligned left
                      }}>
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Montserrat' }} 
                          sx={{ color: location.pathname === item.path ? '#fff' : '#a1a1aa' }} 
                        />
                        {/* Removed FiberManualRecordIcon bullet point completely */}
                      </ListItemButton>
                    ))}
                  </Box>
                ))}
              </Box>
            </Collapse>
          )}

          {MENU_CONFIG.showOurStory && (
            <Collapse in={activeMobileTab === 'story'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Overview</Typography>
              <List disablePadding sx={{ bgcolor: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', mb: 3 }}>
                {ourStoryLinks.map(link => (
                  <ListItemButton key={link.label} onClick={() => handleNavigate(link.path)} sx={{ py: 1.5, px: 2.5, borderBottom: '1px solid rgba(255,255,255,0.03)', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Montserrat' }} sx={{ color: location.pathname === link.path ? '#fff' : '#d4d4d8' }} />
                    <ChevronRightIcon sx={{ fontSize: '16px', color: '#444' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}

          {!activeMobileTab && MENU_CONFIG.showRegisterBtn && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                fullWidth variant="contained" startIcon={<AppRegistrationIcon sx={{ fontSize: '20px' }} />}
                sx={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: '#fff', py: 1.6,
                  borderRadius: '14px', fontWeight: 800, fontFamily: 'Montserrat', fontSize: '0.9rem',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)', textTransform: 'none',
                  border: '1px solid rgba(255,255,255,0.1)', '&:hover': { transform: 'translateY(-2px)' }
                }}
                onClick={() => handleNavigate('/register-online')}
              >
                Start New Enrollment
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Box sx={{ height: { xs: '85px', lg: '0px' } }} />
    </React.Fragment>
  );
}