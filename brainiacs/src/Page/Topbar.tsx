import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const contactInfo = [
  {
    icon: Phone,
    text: '(+94) 770683809',
    href: 'tel:+94770683809',
  },
  {
    icon: Email,
    text: 'Clicklanka97@gmail.com',
    href: 'mailto:Clicklanka97@gmail.com',
  },
  {
    icon: LocationOn,
    text: '55/1 Mathavan Road Kalmunai-03',
    href: null, // Not clickable
  },
];

const Topbar: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: '#333',
        color: 'white',
        px: { xs: 2, sm: 4 },
        py: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
        overflowX: 'auto',
      }}
    >
      {/* Left Section: Contact Label + Info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 3 },
          flexWrap: 'wrap',
          pl: { xs: 0, sm: 2, md: 8 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: '#34b34e',
          }}
        >
          Need Assistance? Contact Us:
        </Typography>

        {contactInfo.map(({ icon: Icon, text, href }, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              '&:hover': { color: '#34b34e' },
            }}
          >
            {Icon && <Icon sx={{ mr: 1, fontSize: '1.1rem' }} />}
            {href ? (
              <Link
                href={href}
                underline="none"
                color="inherit"
                sx={{ '&:hover': { color: '#34b34e' } }}
              >
                {text}
              </Link>
            ) : (
              text
            )}
          </Typography>
        ))}
      </Box>

      {/* Right Section: Inquire Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          mt: { xs: 2, md: 0 },
          pr: { xs: 0, sm: 2, md: 6 },
        }}
      >
        <Button
          variant="outlined"
          size="small"
          href="#contact"
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            border: 'none',
            borderRadius: '20px',
            paddingX: 3,
            color: '#35b34e',
            position: 'relative',
            zIndex: 0,

            '&:before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '22px',
              padding: '2px',
              background:
                'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #7b2ff7, #ff0080)',
              backgroundSize: '300% 300%',
              animation: 'gradient 4s linear infinite',
              zIndex: -1,
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
            },

            '&:hover': {
              bgcolor: '#0a5297',
              color: 'white',
              borderColor: '#0a5297',
            },

            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        >
          Inquire Here
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
