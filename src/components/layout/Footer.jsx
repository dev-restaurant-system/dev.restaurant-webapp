import React from 'react';
import { Box, Typography, Grid, IconButton, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';


const Footer = () => (
  <Box component="footer" sx={{
      bgcolor: '#fafafa',
      color: '#333',
      pt: { xs: 3, md: 6 },
      pb: 0,
      mt: 'auto',
      borderTop: '1px solid #e0e0e0',
      width: '100%',
      overflow: 'hidden',
  }}>
    <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="space-between" sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 } }}>
      
      {/* LEFT COLUMN - Company Info */}
      <Grid item xs={6} sm={6} md={4}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          mb: { xs: 1, md: 2 }, 
          fontFamily: "'Playfair Display', serif", 
          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.75rem' } 
        }}>
          RitaFoodland
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#666', 
          mb: { xs: 0.5, md: 1 }, 
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, 
          lineHeight: { xs: 1.4, md: 1.6 } 
        }}>
          Anukul More, Block C <br/>
          Nath Colony, Chandmari<br/>
          J.N Colony, Kalyani <br/>
          Kalyani Station Road-741235
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#666', 
          mb: { xs: 0.5, md: 1 }, 
          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' } 
        }}>
          +91 80131 19338
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: { xs: 0.5, md: 1 } }}>
          <IconButton href="#" size="small" sx={{ 
            color: '#333', 
            bgcolor: '#ededed', 
            '&:hover': { bgcolor: '#e0e0e0' },
            width: { xs: '28px', md: '36px' },
            height: { xs: '28px', md: '36px' }
          }}>
            <FacebookIcon sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}/>
          </IconButton>
          <IconButton href="#" size="small" sx={{ 
            color: '#333', 
            bgcolor: '#ededed', 
            '&:hover': { bgcolor: '#e0e0e0' },
            width: { xs: '28px', md: '36px' },
            height: { xs: '28px', md: '36px' }
          }}>
            <InstagramIcon sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}/>
          </IconButton>
          <IconButton href="mailto:mithun695roy@gmail.com" size="small" sx={{ 
            color: '#333', 
            bgcolor: '#ededed', 
            '&:hover': { bgcolor: '#e0e0e0' },
            width: { xs: '28px', md: '36px' },
            height: { xs: '28px', md: '36px' }
          }}>
            <EmailIcon sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}/>
          </IconButton>
        </Stack>
      </Grid>

      {/* RIGHT COLUMN - Opening Hours + Google Play (Mobile & Tablet) */}
      {/* This will show on mobile and tablet only */}
      <Grid item xs={6} sm={6} md={4} sx={{ display: { xs: 'block', md: 'none' } }}>
        {/* Opening Hours */}
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          mb: { xs: 1, md: 1 }, 
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } 
        }}>
          Opening Hours
        </Typography>
        <Stack spacing={{ xs: 0.3, md: 0.5 }} sx={{ color: '#666', mb: 2 }}>
          <Typography variant="body2" sx={{ 
            fontWeight: 600, 
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' } 
          }}>
            Open Daily
          </Typography>
          <Typography variant="body2" sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.9rem' },
            lineHeight: { xs: 1.3, md: 1.5 }
          }}>
            Midnight Shift: 12:00 am – 1:15 am
          </Typography>
          <Typography variant="body2" sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.9rem' },
            lineHeight: { xs: 1.3, md: 1.5 }
          }}>
            Day Shift: 11:30 pm – 12:00 am
          </Typography>
        </Stack>

        {/* Download App */}
        <Typography variant="body2" sx={{ 
          mb: 0.8, 
          color: '#888', 
          fontWeight: 500, 
          fontSize: { xs: '0.8rem', sm: '0.85rem' },
          textAlign: 'left'
        }}>
          Download Our App
        </Typography>
        <a
          href="https://play.google.com/store/apps/details?id=com.ritafoodland.customer"
          target="https://play.google.com/store/apps/details?id=com.somnath.customer_app"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <img
            src="https://web.archive.org/web/20221209141042im_/https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            style={{
              height: '50px',
              width: 'auto',
              maxWidth: '100%',
              boxShadow: '0 1.5px 8px rgba(0,0,0,.12)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.18)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1.5px 8px rgba(0,0,0,.12)';
            }}
          />
        </a>
      </Grid>

      {/* MIDDLE COLUMN - Opening Hours (Desktop Only) */}
      <Grid item xs={12} sm={6} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          mb: 1, 
          fontSize: '1.25rem'
        }}>
          Opening Hours
        </Typography>
        <Stack spacing={0.5} sx={{ color: '#666' }}>
          <Typography variant="body2" sx={{ 
            fontWeight: 600, 
            fontSize: '0.9rem'
          }}>
            Open Daily
          </Typography>
          <Typography variant="body2" sx={{ 
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}>
            Midnight Shift: 12:00 am – 1:15 am
          </Typography>
          <Typography variant="body2" sx={{ 
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}>
            Day Shift: 11:30 pm – 12:00 am
          </Typography>
        </Stack>
      </Grid>

      {/* RIGHT COLUMN - Google Play Store (Desktop Only) */}
      <Grid item xs={12} md={4} sx={{ 
        textAlign: 'right',
        display: { xs: 'none', md: 'block' }
      }}>
        <Typography variant="body2" sx={{ 
          mb: 1.5, 
          color: '#888', 
          fontWeight: 500, 
          fontSize: '1rem'
        }}>
          Download Our App
        </Typography>
        <a
          href="https://play.google.com/store/apps/details?id=com.ritafoodland.customer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <img
            src="https://web.archive.org/web/20221209141042im_/https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            style={{
              height: '60px',
              width: 'auto',
              maxWidth: '100%',
              boxShadow: '0 1.5px 8px rgba(0,0,0,.12)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.18)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1.5px 8px rgba(0,0,0,.12)';
            }}
          />
        </a>
      </Grid>
    </Grid>


    <Divider sx={{ mt: { xs: 3, md: 4 }, mb: 0 }} />


    <Box sx={{
      bgcolor: '#222',
      color: '#fff',
      py: { xs: 1.5, md: 2 },
      px: { xs: 2, md: 0 },
      width: '100%',
      textAlign: 'center',
      mt: 0,
    }}>
      <Typography variant="caption" sx={{ 
        letterSpacing: '.02em', 
        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '1em' }, 
        color: '#fff',
        display: 'block'
      }}>
        &copy; {new Date().getFullYear()} RitaFoodland. All Rights Reserved.
        <Link to="/privacy-policy" style={{ 
          color: '#ddd', 
          marginLeft: 8, 
          textDecoration: 'underline' 
        }}>
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  </Box>
);


export default Footer;
