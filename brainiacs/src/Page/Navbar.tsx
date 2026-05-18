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
  Collapse,
  Paper,
  Grow,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

/* --- Environment Variables --- */
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  backgroundColor: isScrolled ? 'rgba(17, 17, 17, 0.98)' : 'rgba(17, 17, 17, 0.4)',
  borderRadius: '60px',
  marginTop: isScrolled ? '10px' : '25px',
  padding: '10px 15px 10px 25px !important',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('lg')]: { borderRadius: '40px', marginTop: '10px' },
  [theme.breakpoints.down('sm')]: { borderRadius: '25px', marginTop: '8px' }
}));

const NavButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#4caf50' : '#ffffff',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  margin: '0 4px',
  '&:hover': { color: '#4caf50', backgroundColor: 'transparent' },
}));

const ActionBtn = styled(Button)(() => ({
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '0.82rem',
  fontWeight: 800,
  fontFamily: '"Montserrat", sans-serif',
  padding: '8px 22px',
  height: '46px',
}));

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState<Record<string, boolean>>({});
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  
  const [dynamicFacultyLinks, setDynamicFacultyLinks] = React.useState<NavLink[]>([]);
  const [dynamicProgrammeGroups, setDynamicProgrammeGroups] = React.useState<ProgrammeGroup[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:1200px)');

  // --- Fetch Data ---
  React.useEffect(() => {
    // 1. Fetch Faculties
    const fetchFaculties = async () => {
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
        console.error("Error fetching faculties for navbar:", error);
      }
    };

    // 2. Fetch Courses and Group by Category
    const fetchProgrammes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/course`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const data = await response.json();
        
        // Group the raw course data by `courseCategory`
        const groupedData = data.reduce((acc: Record<string, ProgrammeGroup>, course: any) => {
          const categoryName = course.courseCategory || 'Other Programmes';
          
          if (!acc[categoryName]) {
            acc[categoryName] = { title: categoryName, items: [] };
          }
          
          acc[categoryName].items.push({
            label: course.courseName,
            // Assuming individual courses are rendered using their _id
            path: `/courses/${course._id}`
          });
          
          return acc;
        }, {});

        setDynamicProgrammeGroups(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching courses for navbar:", error);
      }
    };

    fetchFaculties();
    fetchProgrammes();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  const toggleMobileMenu = (key: string) => {
    setMobileOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseMenu();
  };

  const isDropdownActive = (links: NavLink[]) => {
    return links.some(link => link.path === location.pathname);
  };

  const isMegaMenuActive = () => {
    return dynamicProgrammeGroups.some(group => 
      group.items.some(item => item.path === location.pathname)
    );
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ bgcolor: 'transparent', boxShadow: 'none', zIndex: 1500 }}>
        <Container maxWidth="xl">
          <StyledToolbar isScrolled={isScrolled}>
            <Box onClick={() => handleNavigate('/')} sx={{ cursor: 'pointer', display: 'flex' }}>
              <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" sx={{ height: { xs: '35px', md: '50px' }, filter: 'brightness(0) invert(1)' }} />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <NavButton active={location.pathname === '/'} onClick={() => handleNavigate('/')}>
                  Home
                </NavButton>

                <NavButton active={isDropdownActive(ourStoryLinks)} onClick={(e) => handleOpenMenu(e, 'story')} endIcon={<ArrowDropDownIcon />}>
                  Our Story
                </NavButton>

                <NavButton active={isDropdownActive(dynamicFacultyLinks)} onClick={(e) => handleOpenMenu(e, 'facs')} endIcon={<ArrowDropDownIcon />}>
                  Faculties
                </NavButton>

                <NavButton active={isMegaMenuActive()} onClick={(e) => handleOpenMenu(e, 'prog')} endIcon={<ArrowDropDownIcon />}>
                  Programmes
                </NavButton>

                <NavButton active={location.pathname === '/student-life'} onClick={() => handleNavigate('/student-life')}>
                  Student Life
                </NavButton>

                <NavButton active={location.pathname === '/News'} onClick={() => handleNavigate('/News')}>
                  News
                </NavButton>

                <NavButton active={location.pathname === '/contact'} onClick={() => handleNavigate('/contact')}>
                  Contact Us
                </NavButton>

                <Menu 
                  anchorEl={anchorEl} 
                  open={activeMenu === 'story' || activeMenu === 'facs'} 
                  onClose={handleCloseMenu}
                  sx={{ zIndex: 1600 }}
                  PaperProps={{ sx: { bgcolor: '#111', color: '#fff', mt: 1.5, borderRadius: '15px', border: '1px solid #333', minWidth: 200 } }}
                >
                  {(activeMenu === 'story' ? ourStoryLinks : dynamicFacultyLinks).map((link) => (
                    <MenuItem 
                      key={link.path} 
                      onClick={() => handleNavigate(link.path)} 
                      sx={{ 
                        fontSize: '0.85rem', 
                        py: 1.2, 
                        color: location.pathname === link.path ? '#4caf50' : '#fff',
                        '&:hover': { color: '#4caf50' } 
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                  {activeMenu === 'facs' && dynamicFacultyLinks.length === 0 && (
                    <MenuItem disabled sx={{ fontSize: '0.85rem', color: '#888' }}>
                      Loading faculties...
                    </MenuItem>
                  )}
                </Menu>

                <Popper open={activeMenu === 'prog'} anchorEl={anchorEl} transition placement="bottom-end" sx={{ zIndex: 1600 }}>
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper sx={{ mt: 2.5, p: 4, bgcolor: '#111', color: '#fff', borderRadius: '30px', border: '1px solid #333', display: 'flex', gap: 4, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', maxHeight: '70vh', overflowY: 'auto' }}>
                        <ClickAwayListener onClickAway={(e) => {
                          if (anchorEl && anchorEl.contains(e.target as Node)) return;
                          handleCloseMenu();
                        }}>
                          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: '800px' }}>
                            {dynamicProgrammeGroups.length > 0 ? (
                              dynamicProgrammeGroups.map((group) => (
                                <Box key={group.title} sx={{ minWidth: 210, mb: 2 }}>
                                  <Typography sx={{ color: '#4caf50', fontWeight: 900, fontSize: '0.7rem', mb: 2, textTransform: 'uppercase' }}>{group.title}</Typography>
                                  {group.items.map((item) => (
                                    <ListItemButton 
                                      key={item.label} 
                                      onClick={() => handleNavigate(item.path)} 
                                      sx={{ p: 0.8, borderRadius: '8px' }}
                                    >
                                      <ListItemText 
                                        primary={item.label} 
                                        primaryTypographyProps={{ 
                                          fontSize: '0.82rem', 
                                          fontFamily: 'Montserrat',
                                          color: location.pathname === item.path ? '#4caf50' : '#fff'
                                        }} 
                                      />
                                    </ListItemButton>
                                  ))}
                                </Box>
                              ))
                            ) : (
                               <Typography sx={{ color: '#888', fontSize: '0.85rem', p: 2 }}>Loading programmes...</Typography>
                            )}
                          </Box>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>

                <Box sx={{ ml: 2, display: 'flex', gap: 1.5 }}>
                  <ActionBtn onClick={() => handleNavigate('/register-online')} sx={{ bgcolor: '#4caf50', color: '#fff', '&:hover': { bgcolor: '#388e3c' } }}>Register Online</ActionBtn>
                  <ActionBtn onClick={() => handleNavigate('/login')} sx={{ bgcolor: alpha('#fff', 0.1), color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><PersonOutlineIcon /></ActionBtn>
                </Box>
              </Box>
            ) : (
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <IconButton onClick={() => handleNavigate('/register-online')} sx={{ color: '#4caf50' }}><AppRegistrationIcon /></IconButton>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white', bgcolor: alpha('#fff', 0.1), borderRadius: '12px' }}><MenuIcon /></IconButton>
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: '85%', bgcolor: '#0a0a0a', color: '#fff', p: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" sx={{ height: '35px', filter: 'brightness(0) invert(1)' }} />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
        </Box>

        <List disablePadding sx={{ '& .MuiListItemText-primary': { fontWeight: 700, fontFamily: 'Montserrat' } }}>
          <ListItemButton onClick={() => handleNavigate('/')} sx={{ py: 1.5 }}>
            <ListItemText primary="Home" sx={{ color: location.pathname === '/' ? '#4caf50' : '#fff' }} />
          </ListItemButton>

          <ListItemButton onClick={() => toggleMobileMenu('story')} sx={{ py: 1.5 }}>
            <ListItemText primary="Our Story" sx={{ color: isDropdownActive(ourStoryLinks) ? '#4caf50' : '#fff' }} />
            {mobileOpen['story'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={mobileOpen['story']} timeout="auto">
            <List sx={{ pl: 3, bgcolor: alpha('#fff', 0.05), borderRadius: '12px' }}>
              {ourStoryLinks.map(link => (
                <ListItemButton key={link.label} onClick={() => handleNavigate(link.path)}>
                  <ListItemText primary={link.label} sx={{ color: location.pathname === link.path ? '#4caf50' : '#fff' }} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <ListItemButton onClick={() => toggleMobileMenu('facs')} sx={{ py: 1.5 }}>
            <ListItemText primary="Faculties" sx={{ color: isDropdownActive(dynamicFacultyLinks) ? '#4caf50' : '#fff' }} />
            {mobileOpen['facs'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={mobileOpen['facs']} timeout="auto">
            <List sx={{ pl: 3, bgcolor: alpha('#fff', 0.05), borderRadius: '12px' }}>
              {dynamicFacultyLinks.map(link => (
                <ListItemButton key={link.path} onClick={() => handleNavigate(link.path)}>
                  <ListItemText primary={link.label} sx={{ color: location.pathname === link.path ? '#4caf50' : '#fff' }} />
                </ListItemButton>
              ))}
              {dynamicFacultyLinks.length === 0 && (
                 <ListItemButton disabled>
                    <ListItemText primary="Loading..." sx={{ color: '#888' }} />
                 </ListItemButton>
              )}
            </List>
          </Collapse>

          <ListItemButton onClick={() => toggleMobileMenu('prog')} sx={{ py: 1.5 }}>
            <ListItemText primary="Programmes" sx={{ color: isMegaMenuActive() ? '#4caf50' : '#fff' }} />
            {mobileOpen['prog'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={mobileOpen['prog']} timeout="auto">
            <Box sx={{ pl: 3, bgcolor: alpha('#fff', 0.05), borderRadius: '15px', py: 1.5 }}>
              {dynamicProgrammeGroups.length > 0 ? (
                dynamicProgrammeGroups.map(group => (
                  <Box key={group.title} sx={{ mt: 1 }}>
                    <Typography sx={{ color: '#4caf50', fontSize: '0.7rem', fontWeight: 900, px: 2, textTransform: 'uppercase' }}>{group.title}</Typography>
                    {group.items.map(item => (
                      <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)}>
                        <ListItemText primary={item.label} sx={{ color: location.pathname === item.path ? '#4caf50' : '#fff' }} />
                      </ListItemButton>
                    ))}
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#888', fontSize: '0.85rem', p: 2 }}>Loading programmes...</Typography>
              )}
            </Box>
          </Collapse>

          <ListItemButton onClick={() => handleNavigate('/student-life')} sx={{ py: 1.5 }}>
            <ListItemText primary="Student Life" sx={{ color: location.pathname === '/student-life' ? '#4caf50' : '#fff' }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate('/News')} sx={{ py: 1.5 }}>
            <ListItemText primary="News" sx={{ color: location.pathname === '/News' ? '#4caf50' : '#fff' }} />
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate('/contact')} sx={{ py: 1.5 }}>
            <ListItemText primary="Contact Us" sx={{ color: location.pathname === '/contact' ? '#4caf50' : '#fff' }} />
          </ListItemButton>
        </List>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button fullWidth variant="contained" sx={{ bgcolor: '#4caf50', py: 1.8, borderRadius: '18px', fontWeight: 800 }} onClick={() => handleNavigate('/register-online')}>Register Online</Button>
          <Button fullWidth variant="outlined" sx={{ color: '#fff', borderColor: '#333', py: 1.8, borderRadius: '18px' }} onClick={() => handleNavigate('/login')}>Portal Login</Button>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}