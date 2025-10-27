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
  Paper,
  ClickAwayListener,
  Grow,
  Popper,
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

/* --- Pages & Menus --- */
const pages = [
  { label: 'Home', path: '/' },
  { label: 'Student Life', path: '/student-life' },
  { label: 'Events', path: '/events' },
];

const ourStoryMenu = [
  { label: 'About Us', path: '/aboutus' },
  { label: 'Leadership and Governance', path: '/leadersip-governance' },
  { label: "President's Message", path: '/Presidentmessage' },
  { label: 'Our Partners', path: '/faculties/partners' },
];

const facultiesMenu = [
  { label: 'About Us', path: '/faculties/about' },
  { label: 'Leadership and Governance', path: '/leadersip-governance' },
  { label: "President's Message", path: '/Presidentmessage' },
  { label: 'Our Partners', path: '/faculties/partners' },
];

const programmesMenu = [
  {
    label: 'Lyceum Global Foundation',
    subItems: [
      { label: 'Foundation in Business', path: '/programmes/foundation-business' },
      { label: 'Foundation in Science', path: '/programmes/foundation-science' },
      { label: 'Foundation in Information Technology', path: '/programmes/foundation-it' },
      { label: 'Foundation in Engineering', path: '/programmes/foundation-engineering' },
    ],
  },
  {
    label: 'BTEC HND Level 5 in Computing',
    subItems: [
      { label: 'Pearson BTEC HND in Computing (Software Engineering)', path: '/programmes/btec/software-engineering' },
      { label: 'Pearson BTEC HND in Computing (Data Analytics)', path: '/programmes/btec/data-analytics' },
    ],
  },
  {
    label: 'Deakin 1+2 Pathway Programme',
    subItems: [
      { label: 'Diploma Of Business (Business Analytics)', path: '/programmes/deakin/analytics' },
      { label: 'Diploma Of Business (Management)', path: '/programmes/deakin/management' },
      { label: 'Diploma Of Business (Commerce)', path: '/programmes/deakin/commerce' },
      { label: 'Diploma Of Business (Sport Management)', path: '/programmes/deakin/sport' },
    ],
  },
  {
    label: 'BTEC HND Level 5 in Business',
    subItems: [
      { label: 'Pearson BTEC HND in Business (Accounting and Finance)', path: '/programmes/btec/accounting-finance' },
      { label: 'Pearson BTEC HND in Business (Management)', path: '/programmes/btec/management' },
    ],
  },
  {
    label: 'Teacher Training Diplomas',
    subItems: [
      { label: 'Diploma in Primary School Teaching', path: '/programmes/teacher/primary-teaching' },
      { label: 'Diploma in English Language Teaching', path: '/programmes/teacher/elt' },
      { label: 'Diploma in Teaching Mathematics', path: '/programmes/teacher/math' },
      { label: 'Diploma in Early Childhood Development Education', path: '/programmes/teacher/ecd' },
      { label: 'Diploma in Teaching Special Needs Education', path: '/programmes/teacher/sen' },
    ],
  },
  {
    label: 'UWE Pathway Programmes',
    subItems: [
      { label: 'Pearson BTEC HND in Early Childhood Education and Care', path: '/programmes/uwe/early-childhood' },
      { label: 'Diploma in Early Childhood Development Education', path: '/programmes/uwe/ecd' },
    ],
  },
];

/* --- Styled Search --- */
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
  const [anchorElOurStory, setAnchorElOurStory] = React.useState<null | HTMLElement>(null);
  const [anchorElProgrammes, setAnchorElProgrammes] = React.useState<null | HTMLElement>(null);
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

  const marginTopValue = isDesktop || isMarginTop57px ? '57px' : '0px';

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const openMega = Boolean(anchorElProgrammes);
  const handleOpenMega = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProgrammes(event.currentTarget);
  };
  const handleCloseMega = () => {
    setAnchorElProgrammes(null);
  };
  const handleClickAwayMega = (event: MouseEvent | TouchEvent) => {
    const anchor = anchorElProgrammes;
    if (anchor && event.target && (anchor as HTMLElement).contains(event.target as Node)) return;
    handleCloseMega();
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#ffffff',
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
                  onMouseEnter={(e) => setAnchorElOurStory(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Our Story
                </Button>
                <Menu
                  anchorEl={anchorElOurStory}
                  open={Boolean(anchorElOurStory)}
                  onClose={() => setAnchorElOurStory(null)}
                  MenuListProps={{ onMouseLeave: () => setAnchorElOurStory(null) }}
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
                  onMouseEnter={(e) => setAnchorElFaculties(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Faculties
                </Button>
                <Menu
                  anchorEl={anchorElFaculties}
                  open={Boolean(anchorElFaculties)}
                  onClose={() => setAnchorElFaculties(null)}
                  MenuListProps={{ onMouseLeave: () => setAnchorElFaculties(null) }}
                >
                  {facultiesMenu.map(({ label, path }) => (
                    <MenuItem key={label} component={Link} to={path} onClick={() => setAnchorElFaculties(null)} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Programmes - MEGA MENU */}
              <Box>
                <Button
                  aria-haspopup="true"
                  aria-expanded={openMega ? 'true' : undefined}
                  onClick={handleOpenMega}
                  onMouseEnter={handleOpenMega}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: 'black', mx: 1, fontWeight: 500, textTransform: 'none', minWidth: 'auto', fontFamily: '"Montserrat", sans-serif' }}
                >
                  Programmes
                </Button>

                {/* Popper */}
                <Popper
                  open={openMega}
                  anchorEl={anchorElProgrammes}
                  placement="bottom-start"
                  transition
                  disablePortal={false}
                  style={{ zIndex: 9998,margin:'10px' }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: 'top center' }}>
                      <Paper
                        elevation={6}
                        sx={{
                          position: 'relative', // ✅ bring front
                          zIndex: 9999,       // ✅ high z-index
                          mt: 1.5,
                          width: '90vw',
                          maxWidth: '1200px',
                          borderRadius: 2,
                          p: 3,
                          boxShadow: '0 10px 30px rgba(25,25,25,0.12)',
                        }}
                      >
                        <ClickAwayListener onClickAway={handleClickAwayMega}>
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                            {/* Columns container */}
                            <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
                              {/* Column 1 */}
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                  CERTIFICATE IN SPORT ADMINISTRATION
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                  LYCEUM GLOBAL FOUNDATION
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  {programmesMenu
                                    .filter((g) => g.label === 'Lyceum Global Foundation' || g.label === 'BTEC HND Level 5 in Computing')
                                    .map((group) => (
                                      <Box key={group.label} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
                                          {group.label === 'Lyceum Global Foundation' ? '' : ' '}
                                        </Typography>
                                        {group.subItems.map((it) => (
                                          <Box
                                            key={it.label}
                                            component={Link}
                                            to={it.path}
                                            onClick={handleCloseMega}
                                            sx={{
                                              display: 'block',
                                              textDecoration: 'none',
                                              color: 'text.primary',
                                              py: '4px',
                                              fontSize: '0.95rem',
                                              fontFamily: '"Montserrat", sans-serif',
                                            }}
                                          >
                                            {it.label}
                                          </Box>
                                        ))}
                                      </Box>
                                    ))}
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                    PEARSON BTEC HND IN COUNSELLING AND APPLIED PSYCHOLOGY
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Column 2 */}
                              <Box sx={{ minWidth: 0, flex: 1, borderLeft: '1px solid rgba(0,0,0,0.06)', pl: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                  DEAKIN 1+2 PATHWAY PROGRAMME
                                </Typography>
                                {programmesMenu
                                  .filter((g) => g.label.includes('Deakin') || g.label.includes('BTEC HND Level 5 in Business'))
                                  .map((group) => (
                                    <Box key={group.label} sx={{ mb: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
                                        {group.label}
                                      </Typography>
                                      {group.subItems.map((it) => (
                                        <Box
                                          key={it.label}
                                          component={Link}
                                          to={it.path}
                                          onClick={handleCloseMega}
                                          sx={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            color: 'text.primary',
                                            py: '4px',
                                            fontSize: '0.95rem',
                                            fontFamily: '"Montserrat", sans-serif',
                                          }}
                                        >
                                          {it.label}
                                        </Box>
                                      ))}
                                    </Box>
                                  ))}
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                    BACHELOR OF EDUCATION HONOURS IN PRIMARY EDUCATION
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Column 3 */}
                              <Box sx={{ minWidth: 0, flex: 1, borderLeft: '1px solid rgba(0,0,0,0.06)', pl: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Montserrat", sans-serif' }}>
                                  TEACHER TRAINING DIPLOMAS
                                </Typography>

                                {programmesMenu
                                  .filter((g) => g.label.includes('Teacher Training') || g.label.includes('UWE'))
                                  .map((group) => (
                                    <Box key={group.label} sx={{ mb: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
                                        {group.label}
                                      </Typography>
                                      {group.subItems.map((it) => (
                                        <Box
                                          key={it.label}
                                          component={Link}
                                          to={it.path}
                                          onClick={handleCloseMega}
                                          sx={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            color: 'text.primary',
                                            py: '4px',
                                            fontSize: '0.95rem',
                                            fontFamily: '"Montserrat", sans-serif',
                                          }}
                                        >
                                          {it.label}
                                        </Box>
                                      ))}
                                    </Box>
                                  ))}
                              </Box>
                            </Box>
                          </Box>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>

              {/* Search */}
              {!isRemoveSearch && (
                <Search onSubmit={handleSearchSubmit} sx={{ ml: 2 }}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} value={searchQuery} onChange={handleSearchChange} />
                </Search>
              )}
            </Box>
          ) : (
            /* Mobile Hamburger */
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <List>
            {pages.map(({ label, path }) => (
              <ListItemButton key={label} component={Link} to={path}>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
