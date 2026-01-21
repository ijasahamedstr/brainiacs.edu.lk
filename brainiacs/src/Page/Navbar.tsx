import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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
  [theme.breakpoints.down('lg')]: {
    borderRadius: '40px',
    marginTop: '10px',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '25px',
    marginTop: '8px',
  }
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
  '&:hover': { color: '#4caf50', backgroundColor: 'transparent' },
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
  transition: 'all 0.3s ease-in-out',
  height: '46px',
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
  '& .login-icon': {
    marginRight: '8px',
    color: '#4caf50',
    fontSize: '1.4rem',
  }
}));

const ContactButton = styled(ActionButton)(() => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: '6px 6px 6px 20px',
  '&:hover': { 
    backgroundColor: '#4caf50', 
    color: '#fff',
    transform: 'translateY(-3px)',
  },
  '& .icon-wrap': {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '12px',
  },
  '&:hover .icon-wrap': {
    backgroundColor: '#fff',
    color: '#4caf50',
  }
}));

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: HTMLElement | null }>({});

  const location = useLocation();
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
            <Box onClick={() => handleNavigate('/')} sx={{ cursor: 'pointer', display: 'flex' }}>
              <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="Logo"
                sx={{ height: { xs: '38px', md: '52px' }, filter: 'brightness(0) invert(1)' }}
              />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                <NavButton onClick={() => handleNavigate('/')}>Home</NavButton>

                <Box onMouseEnter={(e) => handleOpenMenu('story', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Our Story</NavButton>
                  <Menu anchorEl={anchorEl['story']} open={Boolean(anchorEl['story'])} onClose={handleCloseMenu} disableScrollLock
                    sx={{ pointerEvents: 'none', '& .MuiPaper-root': { pointerEvents: 'auto', mt: 1, borderRadius: '18px', bgcolor: '#111', color: '#fff', border: '1px solid #333', minWidth: 220 } }}>
                    {ourStoryLinks.map(link => (
                      <MenuItem key={link.label} onClick={() => handleNavigate(link.path)} sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', py: 1.2 }}>
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Box onMouseEnter={(e) => handleOpenMenu('faculties', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Faculties</NavButton>
                  <Menu anchorEl={anchorEl['faculties']} open={Boolean(anchorEl['faculties'])} onClose={handleCloseMenu} disableScrollLock
                    sx={{ pointerEvents: 'none', '& .MuiPaper-root': { pointerEvents: 'auto', mt: 1, borderRadius: '18px', bgcolor: '#111', color: '#fff', border: '1px solid #333', minWidth: 220 } }}>
                    {facultyLinks.map(link => (
                      <MenuItem key={link.label} onClick={() => handleNavigate(link.path)} sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', py: 1.2 }}>
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Box onMouseEnter={(e) => handleOpenMenu('prog', e)} onMouseLeave={handleCloseMenu}>
                  <NavButton endIcon={<ArrowDropDownIcon />}>Programmes</NavButton>
                  <Popper open={Boolean(anchorEl['prog'])} anchorEl={anchorEl['prog']} transition placement="bottom-end">
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper sx={{ mt: 2.5, p: 5, bgcolor: '#111', color: '#fff', borderRadius: '35px', border: '1px solid #333', maxWidth: '1100px' }}>
                          <Box sx={{ display: 'flex', gap: 5 }}>
                            {programmeGroups.map((group, idx) => (
                              <React.Fragment key={group.title}>
                                <Box sx={{ minWidth: 220 }}>
                                  <Typography sx={{ color: '#4caf50', fontWeight: 900, fontSize: '0.75rem', mb: 3, textTransform: 'uppercase', fontFamily: 'Montserrat' }}>{group.title}</Typography>
                                  {group.items.map(item => (
                                    <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ borderRadius: '12px', mb: 0.5 }}>
                                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontFamily: 'Montserrat' }} />
                                    </ListItemButton>
                                  ))}
                                </Box>
                                {idx < 2 && <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />}
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

                <Box sx={{ display: 'flex', ml: 3 }}>
                  <LoginButton onClick={() => handleNavigate('/login')}>
                    <PersonOutlineIcon className="login-icon" /> Login
                  </LoginButton>
                  <ContactButton onClick={() => handleNavigate('/contact')}>
                    Contact Us <div className="icon-wrap"><ArrowOutwardIcon sx={{ fontSize: '1.1rem' }} /></div>
                  </ContactButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => handleNavigate('/login')} sx={{ color: 'white' }}><PersonOutlineIcon /></IconButton>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><MenuIcon /></IconButton>
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: '85%', bgcolor: '#0a0a0a', color: '#fff' } }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
          <Box component="img" src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" sx={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ p: 3, pb: 10 }}>
          <List disablePadding>
            <ListItemButton onClick={() => handleNavigate('/')} sx={{ py: 2 }}>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat' }} />
            </ListItemButton>
            
            <ListItemButton onClick={() => toggleMobileMenu('story')} sx={{ py: 2 }}>
              <ListItemText primary="Our Story" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat' }} />
              {mobileOpen['story'] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={mobileOpen['story']} timeout="auto">
              <List sx={{ bgcolor: '#111', borderRadius: '15px', mx: 1 }}>
                {ourStoryLinks.map(link => (
                  <ListItemButton key={link.label} onClick={() => handleNavigate(link.path)} sx={{ pl: 4 }}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <ListItemButton onClick={() => toggleMobileMenu('prog')} sx={{ py: 2 }}>
              <ListItemText primary="Programmes" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat' }} />
              {mobileOpen['prog'] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={mobileOpen['prog']} timeout="auto">
               {programmeGroups.map(group => (
                 <Box key={group.title} sx={{ bgcolor: '#111', p: 2, mt: 1, borderRadius: '15px' }}>
                    <Typography sx={{ color: '#4caf50', fontSize: '0.75rem', fontWeight: 900, mb: 1, fontFamily: 'Montserrat', textTransform: 'uppercase' }}>{group.title}</Typography>
                    {group.items.map(item => (
                      <ListItemButton key={item.label} onClick={() => handleNavigate(item.path)} sx={{ borderRadius: '8px' }}>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontFamily: 'Montserrat', fontSize: '0.85rem' }} />
                      </ListItemButton>
                    ))}
                 </Box>
               ))}
            </Collapse>

            <ListItemButton sx={{ py: 2 }} onClick={() => handleNavigate('/student-life')}>
              <ListItemText primary="Student Life" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat' }} />
            </ListItemButton>
            <ListItemButton sx={{ py: 2 }} onClick={() => handleNavigate('/News')}>
              <ListItemText primary="News" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Montserrat' }} />
            </ListItemButton>
          </List>

          <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => handleNavigate('/login')} sx={{ color: '#fff', borderColor: '#4caf50', borderRadius: '15px', py: 1.8, textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700 }}>
              Login to Portal
            </Button>
            <Button fullWidth variant="contained" onClick={() => handleNavigate('/contact')} sx={{ bgcolor: '#4caf50', color: '#fff', borderRadius: '15px', py: 1.8, textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 800 }}>
              Contact Us Now
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}