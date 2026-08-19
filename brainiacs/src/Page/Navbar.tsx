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
  Collapse,
  LinearProgress,
  Fade
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
===================================================================== */
const MENU_CONFIG = {
  showHome: true,
  showOurStory: true,
  showFaculties: false, 
  showProgrammes: true,
  showStudentLife: true,
  showNews: true,
  showContact: true,
  showLoginBtn: true,
  showRegisterBtn: true,
};

/* =====================================================================
   HEADER COLOR CONFIGURATION (CLEAN & CLEAR THEME)
===================================================================== */
const HEADER_COLORS = {
  topBg: 'transparent',
  scrolledBg: 'rgba(255, 255, 255, 0.95)', // Clear frosted white glass on scroll
  topText: '#000000',                      // Black text on load
  scrolledText: '#1a1a1a',                 // Dark text on scroll
  activeText: '#4caf50',                   // Green active indicator
  border: 'rgba(0, 0, 0, 0.08)'            // Clean subtle borders
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

// Fixed Header Island/Pill with Color Transition & Increased Width & More Top Space
const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})<{ isScrolled?: boolean }>(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? HEADER_COLORS.scrolledBg : HEADER_COLORS.topBg,
  borderRadius: isScrolled ? '50px' : '0px',
  marginTop: isScrolled ? '32px' : '0px', // <--- INCREASED TOP SPACE HERE (was 16px)
  padding: isScrolled ? '8px 30px !important' : '20px 24px !important',
  backdropFilter: isScrolled ? 'blur(20px)' : 'none',
  WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
  border: isScrolled ? `1px solid ${HEADER_COLORS.border}` : '1px solid transparent',
  boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  maxWidth: isScrolled ? '1450px' : '100%',
  margin: '0 auto',
  [theme.breakpoints.down('lg')]: { 
    borderRadius: isScrolled ? '30px' : '0px', 
    maxWidth: isScrolled ? '98%' : '100%',
    marginTop: isScrolled ? '24px' : '0px', // <--- INCREASED TOP SPACE FOR LAPTOP/TABLET (was 12px)
  },
  [theme.breakpoints.down('sm')]: {
    padding: isScrolled ? '6px 16px !important' : '12px 16px !important',
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
    marginTop: isScrolled ? '16px' : '0px', // Added extra spacing for mobile scrolling
  }
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isScrolled',
})<{ active?: boolean; isScrolled?: boolean }>(({ active, isScrolled }) => ({
  color: active ? HEADER_COLORS.activeText : (isScrolled ? HEADER_COLORS.scrolledText : HEADER_COLORS.topText),
  textTransform: 'none',
  fontSize: '0.82rem',
  fontWeight: 700,
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
    backgroundColor: HEADER_COLORS.activeText,
    borderRadius: '4px',
    transition: 'transform 0.3s ease',
    boxShadow: active ? `0 2px 8px ${alpha(HEADER_COLORS.activeText, 0.4)}` : 'none',
  },
  '&:hover': {
    color: HEADER_COLORS.activeText,
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    '&::after': { transform: 'translateX(-50%) scaleX(1)' }
  },
}));

const GradientBtn = styled(Button)(() => ({
  borderRadius: '24px', 
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
  border: 'none',
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
  borderRadius: '24px',
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: `1px solid ${HEADER_COLORS.border}`,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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

  const [loadProgress, setLoadProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:1200px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    setIsLoading(true);
    setLoadProgress(0);
    
    const timer = setInterval(() => {
      setLoadProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 400); 
          return 100;
        }
        const diff = Math.random() * 25;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [location.pathname]);

  React.useEffect(() => {
    const fetchFaculties = async () => {
      if (!MENU_CONFIG.showFaculties) return; 
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
      if (!MENU_CONFIG.showProgrammes) return; 
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

  const MOBILE_QUICK_LINKS = [
    ...(MENU_CONFIG.showHome ? [{ text: 'Home', icon: <HomeIcon sx={{ fontSize: '18px' }} />, path: '/' }] : []),
    ...(MENU_CONFIG.showFaculties ? [{ text: 'Faculties', icon: <SchoolIcon sx={{ fontSize: '18px' }} />, action: 'facs' }] : []),
    ...(MENU_CONFIG.showProgrammes ? [{ text: 'Programmes', icon: <MenuBookIcon sx={{ fontSize: '18px' }} />, action: 'prog' }] : []),
    ...(MENU_CONFIG.showOurStory ? [{ text: 'Our Story', icon: <InfoIcon sx={{ fontSize: '18px' }} />, action: 'story' }] : []),
    ...(MENU_CONFIG.showContact ? [{ text: 'Contact', icon: <PhoneIcon sx={{ fontSize: '18px' }} />, path: '/contact' }] : []),
    ...(MENU_CONFIG.showLoginBtn ? [{ text: 'Login', icon: <LoginIcon sx={{ fontSize: '18px' }} />, path: '/login' }] : []),
  ];

  return (
    <React.Fragment>
      {/* Top Page Loading Bar */}
      <Fade in={isLoading} unmountOnExit>
        <LinearProgress 
          variant="determinate" 
          value={loadProgress} 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: '3px',
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
              boxShadow: '0 0 12px #4caf50',
            }
          }}
        />
      </Fade>

      <AppBar position="fixed" sx={{ bgcolor: 'transparent', boxShadow: 'none', zIndex: 1300, pointerEvents: 'none' }}>
        <Container maxWidth="xl" sx={{ pointerEvents: 'auto' }}>
          <StyledToolbar isScrolled={isScrolled}>

            {/* LOGO CONTAINER - Clear Style */}
            <Box
              onClick={() => handleNavigate('/')}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: '20px', 
                bgcolor: isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: isScrolled ? 'none' : 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box
                component="img"
                src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp"
                sx={{
                  height: { xs: '26px', md: '40px' },
                  objectFit: 'contain',
                }}
              />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                {MENU_CONFIG.showHome && <NavButton isScrolled={isScrolled} active={location.pathname === '/'} onClick={() => handleNavigate('/')}>Home</NavButton>}
                {MENU_CONFIG.showOurStory && <NavButton isScrolled={isScrolled} active={isDropdownActive(ourStoryLinks)} onClick={(e) => handleOpenMenu(e, 'story')} endIcon={<ArrowDropDownIcon />}>Our Story</NavButton>}
                {MENU_CONFIG.showFaculties && <NavButton isScrolled={isScrolled} active={isDropdownActive(dynamicFacultyLinks)} onClick={(e) => handleOpenMenu(e, 'facs')} endIcon={<ArrowDropDownIcon />}>Faculties</NavButton>}
                {MENU_CONFIG.showProgrammes && <NavButton isScrolled={isScrolled} active={isMegaMenuActive()} onClick={(e) => handleOpenMenu(e, 'prog')} endIcon={<ArrowDropDownIcon />}>Programmes</NavButton>}
                {MENU_CONFIG.showStudentLife && <NavButton isScrolled={isScrolled} active={location.pathname === '/student-life'} onClick={() => handleNavigate('/student-life')}>Student Life</NavButton>}
                {MENU_CONFIG.showNews && <NavButton isScrolled={isScrolled} active={location.pathname === '/News'} onClick={() => handleNavigate('/News')}>News</NavButton>}
                {MENU_CONFIG.showContact && <NavButton isScrolled={isScrolled} active={location.pathname === '/contact'} onClick={() => handleNavigate('/contact')}>Contact</NavButton>}

                {/* Dropdown Menu - Clear White Glass Style */}
                <Menu
                  anchorEl={anchorEl} open={activeMenu === 'story' || activeMenu === 'facs'} onClose={handleCloseMenu} sx={{ zIndex: 1600 }}
                  PaperProps={{
                    sx: {
                      bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', color: '#1a1a1a', mt: 2,
                      borderRadius: '16px', border: `1px solid ${HEADER_COLORS.border}`, minWidth: 220,
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {(activeMenu === 'story' ? ourStoryLinks : dynamicFacultyLinks).map((link) => (
                    <MenuItem
                      key={link.path} onClick={() => handleNavigate(link.path)}
                      sx={{
                        fontSize: '0.85rem', py: 1.4, px: 3, my: 0.5, mx: 1, borderRadius: '8px',
                        color: location.pathname === link.path ? HEADER_COLORS.activeText : '#333333', fontFamily: 'Montserrat', fontWeight: 600,
                        borderLeft: location.pathname === link.path ? `3px solid ${HEADER_COLORS.activeText}` : '3px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { color: HEADER_COLORS.activeText, bgcolor: alpha(HEADER_COLORS.activeText, 0.08), borderLeft: `3px solid ${HEADER_COLORS.activeText}`, transform: 'translateX(4px)' }
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                </Menu>

                {/* MEGA MENU: Programmes - Clear White Glass Style */}
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
                          bgcolor: 'rgba(255,255,255,0.98)', 
                          backdropFilter: 'blur(20px)', 
                          color: '#1a1a1a',
                          borderRadius: '20px', 
                          border: `1px solid ${HEADER_COLORS.border}`, 
                          display: 'flex', 
                          justifyContent: 'flex-start',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
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
                                      color: '#1a1a1a', fontWeight: 800, fontSize: '0.7rem', mb: 1.5, textTransform: 'uppercase',
                                      letterSpacing: '1px', pb: 1, borderBottom: '1px solid rgba(0,0,0,0.06)', textAlign: 'left'
                                    }}>
                                      {group.title}
                                    </Typography>
                                    {group.items.map((item) => (
                                      <ListItemButton
                                        key={item.label} onClick={() => handleNavigate(item.path)}
                                        sx={{
                                          p: 1, borderRadius: '8px', mb: 0.5, transition: 'all 0.2s', textAlign: 'left', justifyContent: 'flex-start',
                                          '&:hover': { bgcolor: alpha(HEADER_COLORS.activeText, 0.08), transform: 'translateX(4px)' } 
                                        }}
                                      >
                                        <ListItemText
                                          primary={item.label}
                                          primaryTypographyProps={{
                                            fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Montserrat',
                                            color: location.pathname === item.path ? HEADER_COLORS.activeText : '#555555',
                                          }}
                                        />
                                      </ListItemButton>
                                    ))}
                                  </Box>
                                ))
                              ) : (
                                <Typography sx={{ color: '#777', fontSize: '0.8rem', p: 1 }}>Loading modules...</Typography>
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
                        borderRadius: '24px', textTransform: 'none', fontSize: '0.78rem', fontWeight: 700,
                        fontFamily: '"Montserrat", sans-serif', padding: '8px 18px', height: '40px',
                        bgcolor: isScrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.4)', 
                        color: HEADER_COLORS.topText, 
                        border: `1px solid ${isScrolled ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.15)'}`,
                        backdropFilter: isScrolled ? 'none' : 'blur(5px)',
                        transition: 'all 0.3s', 
                        '&:hover': { 
                          bgcolor: 'rgba(0,0,0,0.08)', 
                          transform: 'translateY(-2px)' 
                        }
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
                  <IconButton onClick={() => handleNavigate('/register-online')} sx={{ background: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(46,125,50,0.15) 100%)', color: HEADER_COLORS.activeText, border: '1px solid rgba(76,175,80,0.3)', borderRadius: '14px', p: 1 }}>
                    <AppRegistrationIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                )}
                {MENU_CONFIG.showLoginBtn && (
                  <IconButton onClick={() => handleNavigate('/login')} sx={{ color: HEADER_COLORS.topText, bgcolor: isScrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.5)', border: `1px solid ${isScrolled ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.15)'}`, borderRadius: '14px', p: 1 }}>
                    <LoginIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                )}
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* --- Mobile App Floating Bottom Navigation (Light Theme) --- */}
      <FloatingBottomNav elevation={0}>
        <BottomNavigation
          showLabels
          value={location.pathname}
          sx={{
            bgcolor: 'transparent',
            height: '66px',
            '& .MuiBottomNavigationAction-root': { color: '#888', minWidth: 'auto', padding: '8px 0 6px', transition: 'all 0.3s ease' },
            '& .Mui-selected': {
              color: HEADER_COLORS.activeText,
              transform: 'translateY(-4px)',
              '& .MuiSvgIcon-root': { filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))' }
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

      {/* Drawer - Clear Light Theme */}
      <Drawer
        anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ zIndex: 1600 }}
        PaperProps={{
          sx: {
            bgcolor: '#ffffff',
            color: '#1a1a1a',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            borderTop: `1px solid ${HEADER_COLORS.border}`,
            boxShadow: '0 -15px 40px rgba(0,0,0,0.1)',
            maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            pb: 'env(safe-area-inset-bottom)'
          }
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pt: 2, pb: 1.5 }}>
          <Box sx={{ width: 40, height: 5, bgcolor: '#e0e0e0', borderRadius: '10px' }} />
        </Box>

        <Box sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.3px', color: '#1a1a1a' }}>Navigation</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#666', bgcolor: 'rgba(0,0,0,0.04)', width: 34, height: 34, borderRadius: '10px', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
              <CloseOutlined sx={{ fontSize: '18px' }} />
            </IconButton>
          </Stack>

          {/* Flex Row Scrollable Chips - Light Theme */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mb: 2, 
            overflowX: 'auto', 
            pb: 1.5, 
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' } 
          }}>
            {MOBILE_QUICK_LINKS.map((item) => {
              const isActive = (item.path && location.pathname === item.path) || (item.action && activeMobileTab === item.action);

              return (
                <Paper
                  key={item.text} elevation={0}
                  onClick={() => {
                    if (item.path) handleNavigate(item.path);
                    if (item.action) setActiveMobileTab(activeMobileTab === item.action ? null : item.action);
                  }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    px: 2, py: 1.2, borderRadius: "20px", cursor: "pointer", 
                    whiteSpace: 'nowrap',
                    background: isActive ? 'linear-gradient(145deg, rgba(76,175,80,0.12) 0%, rgba(76,175,80,0.04) 100%)' : '#f5f5f5',
                    border: isActive ? `1px solid rgba(76,175,80,0.3)` : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(76,175,80,0.1)' : 'none',
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:active": { transform: "scale(0.96)" }
                  }}
                >
                  <Box sx={{ display: 'flex', color: isActive ? HEADER_COLORS.activeText : '#777', transition: 'all 0.2s' }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontFamily: 'Montserrat', fontWeight: isActive ? 700 : 600, fontSize: "0.8rem", color: isActive ? HEADER_COLORS.activeText : "#555", transition: 'all 0.2s' }}>
                    {item.text}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* Dynamic Lists View with Animations - Light Theme */}
        <Box sx={{ overflowY: 'auto', px: 3, pb: 8, flexGrow: 1 }}>
          {MENU_CONFIG.showFaculties && (
            <Collapse in={activeMobileTab === 'facs'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#888', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Faculties</Typography>
              <List disablePadding sx={{ bgcolor: '#f9f9f9', borderRadius: '16px', border: `1px solid ${HEADER_COLORS.border}`, mb: 3 }}>
                {dynamicFacultyLinks.map(link => (
                  <ListItemButton key={link.path} onClick={() => handleNavigate(link.path)} sx={{ py: 1.5, px: 2.5, borderBottom: '1px solid rgba(0,0,0,0.04)', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Montserrat' }} sx={{ color: location.pathname === link.path ? HEADER_COLORS.activeText : '#333' }} />
                    <ChevronRightIcon sx={{ fontSize: '16px', color: '#999' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}

          {MENU_CONFIG.showProgrammes && (
            <Collapse in={activeMobileTab === 'prog'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#888', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Programmes</Typography>
              <Box sx={{ bgcolor: '#f9f9f9', borderRadius: '16px', p: 1.5, border: `1px solid ${HEADER_COLORS.border}`, mb: 3 }}>
                {dynamicProgrammeGroups.map(group => (
                  <Box key={group.title} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                    <Typography sx={{ 
                      color: HEADER_COLORS.activeText, fontSize: '0.65rem', fontWeight: 800, px: 1, mb: 0.8, 
                      textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'left' 
                    }}>
                      {group.title}
                    </Typography>
                    {group.items.map(item => (
                      <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ 
                        borderRadius: '10px', py: 1, px: 1.5, mb: 0.2, textAlign: 'left', justifyContent: 'flex-start' 
                      }}>
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Montserrat' }} 
                          sx={{ color: location.pathname === item.path ? HEADER_COLORS.activeText : '#444' }} 
                        />
                      </ListItemButton>
                    ))}
                  </Box>
                ))}
              </Box>
            </Collapse>
          )}

          {MENU_CONFIG.showOurStory && (
            <Collapse in={activeMobileTab === 'story'} timeout="auto" unmountOnExit>
              <Typography sx={{ color: '#888', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '1px' }}>Browse &gt; Overview</Typography>
              <List disablePadding sx={{ bgcolor: '#f9f9f9', borderRadius: '16px', border: `1px solid ${HEADER_COLORS.border}`, mb: 3 }}>
                {ourStoryLinks.map(link => (
                  <ListItemButton key={link.label} onClick={() => handleNavigate(link.path)} sx={{ py: 1.5, px: 2.5, borderBottom: '1px solid rgba(0,0,0,0.04)', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Montserrat' }} sx={{ color: location.pathname === link.path ? HEADER_COLORS.activeText : '#333' }} />
                    <ChevronRightIcon sx={{ fontSize: '16px', color: '#999' }} />
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
                  borderRadius: '16px', fontWeight: 800, fontFamily: 'Montserrat', fontSize: '0.9rem',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)', textTransform: 'none',
                  border: 'none', '&:hover': { transform: 'translateY(-2px)' }
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