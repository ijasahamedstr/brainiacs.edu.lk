import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  InputBase,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// --- Pages & Menus ---
const pages = [
  { label: 'Home', path: '/' },
  { label: 'Student Life', path: '/student-life' },
  { label: 'Events', path: '/events' },
];

const ourStoryMenu = [
  { label: 'About Us', path: '/aboutus' },
  { label: 'Leadership and Governance', path: '/faculties/leadership' },
  { label: "President's Message", path: '/faculties/president' },
  { label: 'Our Partners', path: '/faculties/partners' },
];

const facultiesMenu = [
  { label: 'About Us', path: '/faculties/about' },
  { label: 'Leadership and Governance', path: '/faculties/leadership' },
  { label: "President's Message", path: '/faculties/president' },
  { label: 'Our Partners', path: '/faculties/partners' },
];

const programmesMenu = [
  {
    label: 'Lyceum Global Foundation',
    subItems: [
      { label: 'Foundation in Business', path: '/programmes/foundation-business' },
      { label: 'Foundation in Science', path: '/programmes/foundation-science' },
      { label: 'Foundation in IT', path: '/programmes/foundation-it' },
      { label: 'Foundation in Engineering', path: '/programmes/foundation-engineering' },
    ],
  },
  {
    label: 'Deakin 1+2 Pathway Programme',
    subItems: [
      { label: 'Diploma Of Business (Analytics)', path: '/programmes/deakin/analytics' },
      { label: 'Diploma Of Business (Management)', path: '/programmes/deakin/management' },
      { label: 'Diploma Of Business (Commerce)', path: '/programmes/deakin/commerce' },
      { label: 'Diploma Of Business (Sport Management)', path: '/programmes/deakin/sport' },
    ],
  },
];

// --- Styled Search ---
const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
  flexShrink: 0,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#999',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: { width: '18ch' },
    [theme.breakpoints.up('md')]: { width: '25ch' },
    borderRadius: '50px',
  },
}));

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openFaculties, setOpenFaculties] = React.useState(false);
  const [openProgrammes, setOpenProgrammes] = React.useState(false);
  const [openOurStory, setOpenOurStory] = React.useState(false);
  const [anchorElFaculties, setAnchorElFaculties] = React.useState<null | HTMLElement>(null);
  const [anchorElProgrammes, setAnchorElProgrammes] = React.useState<null | HTMLElement>(null);
  const [anchorElOurStory, setAnchorElOurStory] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  const isDesktop = useMediaQuery('(min-width:1024px)');
  const isMarginTop57px = useMediaQuery(
    '(min-width:768px) and (max-width:1024px), (min-width:820px) and (max-width:1180px), (min-width:853px) and (max-width:1280px), (min-width:912px) and (max-width:1368px)'
  );
  const isRemoveSearch = useMediaQuery('(width:1024px) and (height:1366px), (width:1024px) and (height:600px)');

  React.useEffect(() => {
    setDrawerOpen(false);
    setAnchorElFaculties(null);
    setAnchorElProgrammes(null);
    setAnchorElOurStory(null);
  }, [location]);

  const marginTopValue = (isDesktop || isMarginTop57px) ? '57px' : '0px';

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#D0D3D4',
        color: 'black',
        boxShadow: 'none',
        transition: 'margin-top 0.3s ease',
        marginTop: marginTopValue,
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, flexWrap: 'wrap' }}>
          {/* Logo */}
          <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp"
              alt="Logo"
              sx={{ maxHeight: { xs: 40, sm: 50, md: 60 }, width: 'auto' }}
            />
          </Box>

          {isDesktop ? (
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {pages.map(({ label, path }) => (
                <Button
                  key={label}
                  component={Link}
                  to={path}
                  sx={{
                    color: 'black',
                    mx: 1,
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: 'auto',
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  {label}
                </Button>
              ))}

              {/* Our Story Dropdown */}
              <Box>
                <Button
                  onClick={(e) => setAnchorElOurStory(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Our Story
                </Button>
                <Menu
                  anchorEl={anchorElOurStory}
                  open={Boolean(anchorElOurStory)}
                  onClose={() => setAnchorElOurStory(null)}
                >
                  {ourStoryMenu.map(({ label, path }) => (
                    <MenuItem
                      key={label}
                      component={Link}
                      to={path}
                      onClick={() => setAnchorElOurStory(null)}
                      sx={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Faculties Dropdown */}
              <Box>
                <Button
                  onClick={(e) => setAnchorElFaculties(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Faculties
                </Button>
                <Menu
                  anchorEl={anchorElFaculties}
                  open={Boolean(anchorElFaculties)}
                  onClose={() => setAnchorElFaculties(null)}
                >
                  {facultiesMenu.map(({ label, path }) => (
                    <MenuItem key={label} component={Link} to={path} onClick={() => setAnchorElFaculties(null)} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Programmes Dropdown */}
              <Box>
                <Button
                  onClick={(e) => setAnchorElProgrammes(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Programmes
                </Button>
                <Menu
                  anchorEl={anchorElProgrammes}
                  open={Boolean(anchorElProgrammes)}
                  onClose={() => setAnchorElProgrammes(null)}
                >
                  {programmesMenu.map((group) => (
                    <Box key={group.label}>
                      <MenuItem disabled>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                          {group.label}
                        </Typography>
                      </MenuItem>
                      {group.subItems.map(({ label, path }) => (
                        <MenuItem key={label} component={Link} to={path} onClick={() => setAnchorElProgrammes(null)} sx={{ pl: 4, fontFamily: '"Montserrat", sans-serif' }}>
                          {label}
                        </MenuItem>
                      ))}
                    </Box>
                  ))}
                </Menu>
              </Box>

              {/* Search */}
              {!isRemoveSearch && (
                <Search onSubmit={handleSearchSubmit} sx={{ ml: 2, flexShrink: 1, minWidth: 120, maxWidth: 250 }}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase placeholder="Search…" sx={{ fontFamily: '"Montserrat", sans-serif' }} value={searchQuery} onChange={handleSearchChange} />
                </Search>
              )}
            </Box>
          ) : (
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle} PaperProps={{ sx: { width: '80%', maxWidth: 280 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'center', bgcolor: '#f8f8f8' }}>
            <Box component={Link} to="/" onClick={handleDrawerToggle}>
              <img src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="Logo" style={{ maxHeight: 50, width: 'auto' }} />
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List>
              {pages.map(({ label, path }) => (
                <ListItemButton key={label} sx={{ fontFamily: '"Montserrat", sans-serif' }} component={Link} to={path} onClick={handleDrawerToggle}>
                  <ListItemText primary={label} sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                </ListItemButton>
              ))}

              {/* Our Story Collapse */}
              <ListItemButton onClick={() => setOpenOurStory(!openOurStory)} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                <ListItemText primary="Our Story" sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                {openOurStory ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openOurStory} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {ourStoryMenu.map(({ label, path }) => (
                    <ListItemButton key={label} sx={{ pl: 4, fontFamily: '"Montserrat", sans-serif' }} component={Link} to={path} onClick={handleDrawerToggle}>
                      <ListItemText primary={label} sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              {/* Faculties Collapse */}
              <ListItemButton onClick={() => setOpenFaculties(!openFaculties)} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                <ListItemText primary="Faculties" sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                {openFaculties ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openFaculties} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {facultiesMenu.map(({ label, path }) => (
                    <ListItemButton key={label} sx={{ pl: 4, fontFamily: '"Montserrat", sans-serif' }} component={Link} to={path} onClick={handleDrawerToggle}>
                      <ListItemText primary={label} sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              {/* Programmes Collapse */}
              <ListItemButton onClick={() => setOpenProgrammes(!openProgrammes)}>
                <ListItemText primary="Programmes" sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                {openProgrammes ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openProgrammes} timeout="auto" unmountOnExit>
                {programmesMenu.map((group) => (
                  <Box key={group.label} sx={{ pl: 2, fontFamily: '"Montserrat", sans-serif' }}>
                    <Typography variant="subtitle2" sx={{ pl: 1, pt: 1, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                      {group.label}
                    </Typography>
                    {group.subItems.map(({ label, path }) => (
                      <ListItemButton key={label} sx={{ pl: 4, fontFamily: '"Montserrat", sans-serif' }} component={Link} to={path} onClick={handleDrawerToggle}>
                        <ListItemText primary={label} sx={{ fontFamily: '"Montserrat", sans-serif' }} />
                      </ListItemButton>
                    ))}
                  </Box>
                ))}
              </Collapse>
            </List>
          </Box>

          {/* Bottom Info */}
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              px: 0,
              py: 1.5,
              width: '100%',
              textAlign: 'center',
              bgcolor: '#f8f8f8',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gap: 1,
                flexWrap: 'wrap',
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                fontFamily: '"Montserrat", sans-serif',
                px: 0,
              }}
            >
              <PhoneIcon />
              <Typography component="span" sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: '9.5px' }}>
                (+94) 672260200
              </Typography>
              <Typography component="span" sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: '9.5px' }}>
                |
              </Typography>
              <EmailIcon />
              <Typography component="span" sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: '9.5px' }}>
                info@brainiacs.edu.lk
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
                width: '100%',
                px: 0,
              }}
            >
              {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    '&:hover': { bgcolor: '#000', color: '#fff' },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
