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
import { alpha, styled, useTheme } from '@mui/material/styles';
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

const pages = [
  { label: 'Products', path: '/products' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Blog', path: '/blog' },
  { label: 'Student Life', path: '/student-life' },
  { label: 'Events', path: '/events' },
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

// --- Styled search components ---
const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
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
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
    borderRadius: '50px',
  },
}));

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openFaculties, setOpenFaculties] = React.useState(false);
  const [openProgrammes, setOpenProgrammes] = React.useState(false);
  const [anchorElFaculties, setAnchorElFaculties] = React.useState<null | HTMLElement>(null);
  const [anchorElProgrammes, setAnchorElProgrammes] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
  const handleOpenFacultiesMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElFaculties(e.currentTarget);
  const handleCloseFacultiesMenu = () => setAnchorElFaculties(null);
  const handleOpenProgrammesMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElProgrammes(e.currentTarget);
  const handleCloseProgrammesMenu = () => setAnchorElProgrammes(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  React.useEffect(() => {
    setDrawerOpen(false);
    handleCloseFacultiesMenu();
    handleCloseProgrammesMenu();
  }, [location]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#D0D3D4',
        color: 'black',
        boxShadow: 'none',
        marginTop: { xs: 0, md: '65px' },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          {/* --- Mobile View --- */}
          {!isDesktop ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="Logo" style={{ height: 50 }} />
              </Box>

              <IconButton onClick={handleDrawerToggle} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              {/* --- Desktop View --- */}
              <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="Logo" style={{ height: 50 }} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {pages.map(({ label, path }) => (
                  <Button key={label} component={Link} to={path} sx={{ color: 'black', mx: 1, fontWeight: 500 }}>
                    {label}
                  </Button>
                ))}

                <Button
                  onMouseEnter={handleOpenFacultiesMenu}
                  onMouseLeave={handleCloseFacultiesMenu}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500 }}
                >
                  Faculties
                </Button>
                <Menu
                  anchorEl={anchorElFaculties}
                  open={Boolean(anchorElFaculties)}
                  onClose={handleCloseFacultiesMenu}
                  MenuListProps={{ onMouseLeave: handleCloseFacultiesMenu }}
                >
                  {facultiesMenu.map(({ label, path }) => (
                    <MenuItem key={label} component={Link} to={path}>
                      {label}
                    </MenuItem>
                  ))}
                </Menu>

                <Button
                  onMouseEnter={handleOpenProgrammesMenu}
                  onMouseLeave={handleCloseProgrammesMenu}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500 }}
                >
                  Programmes
                </Button>
                <Menu
                  anchorEl={anchorElProgrammes}
                  open={Boolean(anchorElProgrammes)}
                  onClose={handleCloseProgrammesMenu}
                  MenuListProps={{ onMouseLeave: handleCloseProgrammesMenu }}
                >
                  {programmesMenu.map((group) => (
                    <Box key={group.label}>
                      <MenuItem disabled>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {group.label}
                        </Typography>
                      </MenuItem>
                      {group.subItems.map(({ label, path }) => (
                        <MenuItem key={label} component={Link} to={path} sx={{ pl: 4 }}>
                          {label}
                        </MenuItem>
                      ))}
                    </Box>
                  ))}
                </Menu>
              </Box>

              {/* Right Search */}
              <Search onSubmit={handleSearchSubmit}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" value={searchQuery} onChange={handleSearchChange} />
              </Search>
            </>
          )}
        </Toolbar>
      </Container>

      {/* --- Drawer --- */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{
            width: 280,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* --- Drawer Header with Logo --- */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: '#f8f8f8',
            }}
          >
            <Box component={Link} to="/" onClick={handleDrawerToggle}>
              <img src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp" alt="Logo" style={{ height: 50 }} />
            </Box>
          </Box>

          {/* Scrollable Menu Section */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List>
              {pages.map(({ label, path }) => (
                <ListItemButton key={label} component={Link} to={path} onClick={handleDrawerToggle}>
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}

              <ListItemButton onClick={() => setOpenFaculties(!openFaculties)}>
                <ListItemText primary="Faculties" />
                {openFaculties ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openFaculties} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {facultiesMenu.map(({ label, path }) => (
                    <ListItemButton key={label} sx={{ pl: 4 }} component={Link} to={path} onClick={handleDrawerToggle}>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              <ListItemButton onClick={() => setOpenProgrammes(!openProgrammes)}>
                <ListItemText primary="Programmes" />
                {openProgrammes ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openProgrammes} timeout="auto" unmountOnExit>
                {programmesMenu.map((group) => (
                  <Box key={group.label} sx={{ pl: 2 }}>
                    <Typography variant="subtitle2" sx={{ pl: 1, pt: 1, fontWeight: 600 }}>
                      {group.label}
                    </Typography>
                    {group.subItems.map(({ label, path }) => (
                      <ListItemButton
                        key={label}
                        sx={{ pl: 4 }}
                        component={Link}
                        to={path}
                        onClick={handleDrawerToggle}
                      >
                        <ListItemText primary={label} />
                      </ListItemButton>
                    ))}
                  </Box>
                ))}
              </Collapse>
            </List>
          </Box>

          {/* --- Bottom Section --- */}
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              padding: '6px',
              paddingTop: '10px',
              paddingBottom: '15px',
              textAlign: 'center',
              backgroundColor: '#f8f8f8',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: '#333',
                fontWeight: 500,
                fontSize: '0.7rem',
                flexWrap: 'wrap',
                mb: 1,
              }}
            >
              <PhoneIcon fontSize="small" /> (+94) 672260200 | <EmailIcon fontSize="small" /> info@brainiacs.edu.lk
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    '&:hover': { bgcolor: '#000', color: 'white' },
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
