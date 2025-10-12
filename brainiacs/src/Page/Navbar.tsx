import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import { alpha, styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElFaculties, setAnchorElFaculties] = React.useState<null | HTMLElement>(null);
  const [anchorElProgrammes, setAnchorElProgrammes] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleOpenNavMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElNav(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenFacultiesMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElFaculties(e.currentTarget);
  const handleCloseFacultiesMenu = () => setAnchorElFaculties(null);
  const handleOpenProgrammesMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElProgrammes(e.currentTarget);
  const handleCloseProgrammesMenu = () => setAnchorElProgrammes(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Auto-close menus when route changes
  React.useEffect(() => {
    handleCloseNavMenu();
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
        marginTop: { xs: 0, md: '65px' }
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
            py: 1.5,
          }}
        >
          {/* --- Left Side (Logo + Mobile Menu) --- */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img
                src="https://i.ibb.co/6RkH7J3r/Small-scaled.webp"
                alt="Logo"
                style={{ height: 50 }}
              />
            </Box>
          </Box>

          {/* --- Center Section: Desktop Nav --- */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {pages.map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  my: 2,
                  color: 'black',
                  textTransform: 'none',
                  mx: 1,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                }}
              >
                {label}
              </Button>
            ))}

            {/* Faculties */}
            <Box
              onMouseEnter={isDesktop ? handleOpenFacultiesMenu : undefined}
              onMouseLeave={isDesktop ? handleCloseFacultiesMenu : undefined}
            >
              <Button
                onClick={!isDesktop ? handleOpenFacultiesMenu : undefined}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  my: 2,
                  color: 'black',
                  textTransform: 'none',
                  mx: 1,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                }}
              >
                Faculties
              </Button>
              <Menu
                anchorEl={anchorElFaculties}
                open={Boolean(anchorElFaculties)}
                onClose={handleCloseFacultiesMenu}
                MenuListProps={{ onMouseLeave: isDesktop ? handleCloseFacultiesMenu : undefined }}
              >
                {facultiesMenu.map(({ label, path }) => (
                  <MenuItem
                    key={label}
                    component={Link}
                    to={path}
                    onClick={handleCloseFacultiesMenu}
                    sx={{ textTransform: 'none', fontSize: '0.95rem' }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Programmes */}
            <Box
              onMouseEnter={isDesktop ? handleOpenProgrammesMenu : undefined}
              onMouseLeave={isDesktop ? handleCloseProgrammesMenu : undefined}
            >
              <Button
                onClick={!isDesktop ? handleOpenProgrammesMenu : undefined}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  my: 2,
                  color: 'black',
                  textTransform: 'none',
                  mx: 1,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                }}
              >
                Programmes
              </Button>
              <Menu
                anchorEl={anchorElProgrammes}
                open={Boolean(anchorElProgrammes)}
                onClose={handleCloseProgrammesMenu}
                MenuListProps={{ onMouseLeave: isDesktop ? handleCloseProgrammesMenu : undefined }}
              >
                {programmesMenu.map((group) => (
                  <Box key={group.label}>
                    <MenuItem disabled>
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                      >
                        {group.label}
                      </Typography>
                    </MenuItem>
                    {group.subItems.map(({ label, path }) => (
                      <MenuItem
                        key={label}
                        component={Link}
                        to={path}
                        onClick={handleCloseProgrammesMenu}
                        sx={{ pl: 4, textTransform: 'none', fontSize: '0.95rem' }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </Box>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* --- Right Side: Search --- */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Search onSubmit={handleSearchSubmit}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                value={searchQuery}
                onChange={handleSearchChange}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
        </Toolbar>

        {/* --- Mobile Menu Drawer --- */}
        <Menu
          anchorEl={anchorElNav}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {pages.map(({ label, path }) => (
            <MenuItem key={label} component={Link} to={path} onClick={handleCloseNavMenu}>
              <Typography textAlign="center">{label}</Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleOpenFacultiesMenu}>Faculties</MenuItem>
          <MenuItem onClick={handleOpenProgrammesMenu}>Programmes</MenuItem>
        </Menu>
      </Container>
    </AppBar>
  );
}
