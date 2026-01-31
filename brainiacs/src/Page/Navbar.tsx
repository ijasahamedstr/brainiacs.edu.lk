import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  useScrollTrigger,
  Fade
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SchoolIcon from '@mui/icons-material/School';

/* --- Data Structures --- */
const ourStoryLinks = [
  { label: 'About Us', path: '/aboutus' },
  { label: 'Leadership & Governance', path: '/leadership-governance' },
  { label: "President's Message", path: '/Presidentmessage' },
  { label: 'Our Partners', path: '/partners' },
];

const facultyLinks = [
  { label: 'About Faculties', path: '/faculties/about' },
  { label: 'Faculty of IT', path: '/faculties/it' },
  { label: 'Faculty of Business', path: '/faculties/business' },
];

const programmeGroups = [
  {
    title: 'Foundation & Tech',
    items: [
      { label: 'Foundation in Business', path: '/programmes/foundation-business' },
      { label: 'Foundation in Science', path: '/programmes/foundation-science' },
      { label: 'Foundation in IT', path: '/programmes/foundation-it' },
      { label: 'Foundation in Engineering', path: '/programmes/foundation-engineering' },
      { label: 'BTEC HND Level 5 Computing', path: '/programmes/btec-computing' }
    ],
  },
  {
    title: 'Business & Pathways',
    items: [
      { label: 'Deakin 1+2 Pathway', path: '/programmes/deakin' },
      { label: 'BTEC HND Level 5 Business', path: '/programmes/btec-business' },
      { label: 'Diploma in Business Analytics', path: '/programmes/business-analytics' },
      { label: 'Accounting & Finance', path: '/programmes/accounting' },
      { label: 'Sport Management', path: '/programmes/sport-management' }
    ],
  },
  {
    title: 'Teacher Training',
    items: [
      { label: 'Diploma in Primary Teaching', path: '/programmes/primary-teaching' },
      { label: 'Diploma in English (ELT)', path: '/programmes/elt' },
      { label: 'Teaching Mathematics', path: '/programmes/math-teaching' },
      { label: 'Special Needs Education', path: '/programmes/special-needs' },
      { label: 'UWE Early Childhood', path: '/programmes/uwe-early-childhood' }
    ],
  },
];

/* --- Styled Components --- */

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})<{ isScrolled?: boolean }>(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? 'rgba(17, 17, 17, 0.98)' : 'rgba(17, 17, 17, 0.4)',
  borderRadius: '60px',
  marginTop: isScrolled ? '10px' : '25px',
  padding: '10px 15px 10px 25px !important',
  color: 'white',
  boxShadow: isScrolled ? '0px 20px 50px rgba(0,0,0,0.5)' : 'none',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('lg')]: { borderRadius: '40px', marginTop: '10px' },
  [theme.breakpoints.down('sm')]: { borderRadius: '25px', marginTop: '8px' }
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  color: active ? '#4caf50' : '#ffffff',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 700,
  margin: '0 5px',
  fontFamily: '"Montserrat", sans-serif',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 5,
    left: '50%',
    width: 0,
    height: '2px',
    backgroundColor: '#4caf50',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': { color: '#4caf50', backgroundColor: 'transparent' },
  '&:hover::after': { width: '60%' }
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 800,
  fontFamily: '"Montserrat", sans-serif',
  display: 'flex',
  alignItems: 'center',
  padding: '8px 20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '46px',
}));

// NEW: STUDENT REGISTER ONLINE BUTTON
const RegisterButton = styled(ActionButton)(() => ({
  backgroundColor: '#4caf50',
  color: '#fff',
  marginRight: '12px',
  padding: '8px 24px',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  '&:hover': {
    backgroundColor: '#388e3c',
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
  },
  '& .icon-wrap': {
    marginLeft: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.3s ease',
  },
  '&:hover .icon-wrap': {
    transform: 'translateX(4px) translateY(-2px)',
  }
}));

const LoginButton = styled(ActionButton)(() => ({
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginRight: '12px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#4caf50',
    transform: 'translateY(-3px)',
  },
  '& .login-icon': { marginRight: '8px', color: '#4caf50', fontSize: '1.4rem' }
}));

const ContactButton = styled(ActionButton)(() => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: '6px 6px 6px 20px',
  '&:hover': { backgroundColor: '#4caf50', color: '#fff', transform: 'translateY(-3px)' },
  '& .icon-wrap': {
    backgroundColor: '#000', color: '#fff', borderRadius: '50%',
    width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '12px',
  },
  '&:hover .icon-wrap': { backgroundColor: '#fff', color: '#4caf50' }
}));

/* --- Main Component --- */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: HTMLElement | null }>({});

  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width:1200px)');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenMenu = (key: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl({ ...anchorEl, [key]: event.currentTarget });
  };

  const handleCloseMenu = () => setAnchorEl({});

  const toggleMobileMenu = (key: string) => {
    setMobileOpen({ ...mobileOpen, [key]: !mobileOpen[key] });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseMenu();
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none', zIndex: 1500 }}>
        <Container maxWidth="xl">
          <StyledToolbar isScrolled={isScrolled}>
            {/* LOGO */}
            <Box onClick={() => handleNavigate('/')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="University Logo"
                sx={{ height: { xs: '38px', md: '52px' }, filter: 'brightness(0) invert(1)', transition: '0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
              />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                <NavButton onClick={() => handleNavigate('/')}>Home</NavButton>

                {/* OUR STORY DROPDOWN */}
                <Box onMouseEnter={(e) => handleOpenMenu('story', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Our Story</NavButton>
                  <Menu anchorEl={anchorEl['story']} open={Boolean(anchorEl['story'])} onClose={handleCloseMenu} disableScrollLock
                    sx={{ pointerEvents: 'none', '& .MuiPaper-root': { pointerEvents: 'auto', mt: 1.5, borderRadius: '18px', bgcolor: '#111', color: '#fff', border: '1px solid #333', minWidth: 240, boxShadow: '0 15px 40px rgba(0,0,0,0.6)' } }}>
                    {ourStoryLinks.map(link => (
                      <MenuItem key={link.label} onClick={() => handleNavigate(link.path)} sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', py: 1.5, '&:hover': { color: '#4caf50', bgcolor: 'rgba(76,175,80,0.08)' } }}>
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* FACULTIES DROPDOWN */}
                <Box onMouseEnter={(e) => handleOpenMenu('faculties', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Faculties</NavButton>
                  <Menu anchorEl={anchorEl['faculties']} open={Boolean(anchorEl['faculties'])} onClose={handleCloseMenu} disableScrollLock
                    sx={{ pointerEvents: 'none', '& .MuiPaper-root': { pointerEvents: 'auto', mt: 1.5, borderRadius: '18px', bgcolor: '#111', color: '#fff', border: '1px solid #333', minWidth: 240 } }}>
                    {facultyLinks.map(link => (
                      <MenuItem key={link.label} onClick={() => handleNavigate(link.path)} sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', py: 1.5, '&:hover': { color: '#4caf50', bgcolor: 'rgba(76,175,80,0.08)' } }}>
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* PROGRAMMES MEGA MENU */}
                <Box onMouseEnter={(e) => handleOpenMenu('prog', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Programmes</NavButton>
                  <Popper open={Boolean(anchorEl['prog'])} anchorEl={anchorEl['prog']} transition placement="bottom-end">
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps} style={{ transformOrigin: 'top right' }}>
                        <Paper sx={{ mt: 2.5, p: 5, bgcolor: '#111', color: '#fff', borderRadius: '35px', border: '1px solid #333', maxWidth: '1100px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
                          <Box sx={{ display: 'flex', gap: 5 }}>
                            {programmeGroups.map((group, idx) => (
                              <React.Fragment key={group.title}>
                                <Box sx={{ minWidth: 240 }}>
                                  <Typography sx={{ color: '#4caf50', fontWeight: 900, fontSize: '0.75rem', mb: 3, textTransform: 'uppercase', fontFamily: 'Montserrat', letterSpacing: 1.5 }}>{group.title}</Typography>
                                  {group.items.map(item => (
                                    <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ borderRadius: '12px', mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', '& span': { color: '#4caf50' } } }}>
                                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.88rem', fontFamily: 'Montserrat',  }} />
                                    </ListItemButton>
                                  ))}
                                </Box>
                                {idx < 2 && <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
                              </React.Fragment>
                            ))}
                          </Box>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Box>

                <NavButton onClick={() => handleNavigate('/student-life')}>Student Life</NavButton>
                <NavButton onClick={() => handleNavigate('/News')}>News</NavButton>

                {/* ACTION BUTTONS GROUP */}
                <Box sx={{ display: 'flex', ml: 3 }}>
                  <RegisterButton onClick={() => handleNavigate('/register-online')}>
                    Student Register Online <div className="icon-wrap"><ArrowOutwardIcon sx={{ fontSize: '1.1rem' }} /></div>
                  </RegisterButton>
                  
                  <LoginButton onClick={() => handleNavigate('/login')}>
                    <PersonOutlineIcon className="login-icon" /> Login
                  </LoginButton>

                  <ContactButton onClick={() => handleNavigate('/contact')}>
                    Contact Us <div className="icon-wrap"><ArrowOutwardIcon sx={{ fontSize: '1.1rem' }} /></div>
                  </ContactButton>
                </Box>
              </Box>
            ) : (
              /* MOBILE TOOLBAR BUTTONS */
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => handleNavigate('/register-online')} sx={{ color: '#4caf50' }}><AppRegistrationIcon /></IconButton>
                <IconButton onClick={() => handleNavigate('/login')} sx={{ color: 'white' }}><PersonOutlineIcon /></IconButton>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><MenuIcon /></IconButton>
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} 
        PaperProps={{ sx: { width: { xs: '85%', sm: '400px' }, bgcolor: '#0a0a0a', color: '#fff', borderLeft: '1px solid #222' } }}>
        
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
          <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" sx={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ p: 3, pb: 10 }}>
          <List disablePadding>
            <ListItemButton onClick={() => handleNavigate('/')} sx={{ py: 2, borderRadius: '12px' }}>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 800, fontFamily: 'Montserrat', fontSize: '1.1rem' }} />
            </ListItemButton>
            
            <ListItemButton onClick={() => toggleMobileMenu('story')} sx={{ py: 2, borderRadius: '12px', mt: 1 }}>
              <ListItemText primary="Our Story" primaryTypographyProps={{ fontWeight: 800, fontFamily: 'Montserrat', fontSize: '1.1rem' }} />
              {mobileOpen['story'] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={mobileOpen['story']} timeout="auto">
              <List sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '15px', mx: 1, mt: 1 }}>
                {ourStoryLinks.map(link => (
                  <ListItemButton key={link.label} onClick={() => handleNavigate(link.path)} sx={{ pl: 4, py: 1.5 }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: '#ccc' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <ListItemButton onClick={() => toggleMobileMenu('prog')} sx={{ py: 2, borderRadius: '12px', mt: 1 }}>
              <ListItemText primary="Programmes" primaryTypographyProps={{ fontWeight: 800, fontFamily: 'Montserrat', fontSize: '1.1rem' }} />
              {mobileOpen['prog'] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={mobileOpen['prog']} timeout="auto">
               {programmeGroups.map(group => (
                 <Box key={group.title} sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, mt: 1, mx: 1, borderRadius: '20px' }}>
                    <Typography sx={{ color: '#4caf50', fontSize: '0.7rem', fontWeight: 900, mb: 1.5, fontFamily: 'Montserrat', textTransform: 'uppercase', letterSpacing: 1.2 }}>{group.title}</Typography>
                    {group.items.map(item => (
                      <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ borderRadius: '8px', py: 1 }}>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontFamily: 'Montserrat', fontSize: '0.85rem' }} />
                      </ListItemButton>
                    ))}
                 </Box>
               ))}
            </Collapse>

            <ListItemButton sx={{ py: 2, borderRadius: '12px', mt: 1 }} onClick={() => handleNavigate('/student-life')}>
              <ListItemText primary="Student Life" primaryTypographyProps={{ fontWeight: 800, fontFamily: 'Montserrat', fontSize: '1.1rem' }} />
            </ListItemButton>

            <ListItemButton sx={{ py: 2, borderRadius: '12px', mt: 1 }} onClick={() => handleNavigate('/News')}>
              <ListItemText primary="News" primaryTypographyProps={{ fontWeight: 800, fontFamily: 'Montserrat', fontSize: '1.1rem' }} />
            </ListItemButton>
          </List>

          {/* MOBILE ACTION BUTTONS */}
          <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button fullWidth variant="contained" onClick={() => handleNavigate('/register-online')}
              startIcon={<SchoolIcon />}
              sx={{ bgcolor: '#4caf50', color: '#fff', borderRadius: '18px', py: 2.2, textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(76,175,80,0.3)' }}>
              Student Register Online
            </Button>
            
            <Button fullWidth variant="outlined" onClick={() => handleNavigate('/login')}
              startIcon={<PersonOutlineIcon />}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '18px', py: 2, textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700 }}>
              Login to Portal
            </Button>
            
            <Button fullWidth variant="contained" onClick={() => handleNavigate('/contact')}
              sx={{ bgcolor: '#fff', color: '#000', borderRadius: '18px', py: 2, textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 800, '&:hover': { bgcolor: '#4caf50', color: '#fff' } }}>
              Contact Us Now
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}