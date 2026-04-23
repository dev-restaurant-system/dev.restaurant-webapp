import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import DeckIcon from '@mui/icons-material/Deck';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { TypeAnimation } from 'react-type-animation';

import chickenbriyani from '../assets/chickenbriyani.jpg';
import chickenchap from '../assets/chickenchap.jpg';
import butterchicken from '../assets/butterchicken.jpg';
import chicckenfriedrice from '../assets/chickenfriedrice.jpg';
import eggtorka from '../assets/eggtorka.jpg';
import moglai from '../assets/mogali.jpg';
import mottorponir from '../assets/mottoponir.jpg';
import nanruti from '../assets/nanruti.jpg';
import ricechicken from '../assets/ricechicken.jpg';
import roll from '../assets/roll.jpg';
import special from '../assets/special.jpg';
import tandori from '../assets/tandori.jpg';
import vegthali from '../assets/vegthali.jpg';
import chickenthali from '../assets/chickenthali.jpg';
import chickenkosha from '../assets/chickenkosha.jpg';
import chowmin from '../assets/chowmin.jpg';
import landingimage from '../assets/restaurant_second_image.png';

// Fade in keyframe for animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled hero section with background image and overlay
const HeroSection = styled(Box)(({ theme }) => ({
  height: '70vh',
  width: '100%',
  maxWidth: '100vw',
  backgroundImage: `url(${landingimage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white',
  position: 'relative',
  marginTop: '64px',
  marginLeft: 0,
  marginRight: 0,
  padding: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 0,
  },
  [theme.breakpoints.down('md')]: {
    height: '80vh',
    backgroundPosition: '50% center',
  },
  [theme.breakpoints.down('sm')]: {
    height: '80vh',
    width: '100%',
    maxWidth: '100vw',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
}));


// UPDATED: Styling for the parts of the animated restaurant name
const RitaText = styled('span')({
  color: '#6FCF4B'
});

const FoodlandText = styled('span')({
  color: '#FA8900'
});

// Services section styling
const ServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: '#f0f7f0',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 2),
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 2),
  },
}));



// Section header with subtitle and title
const SectionHeader = ({ subtitle, title }) => (
  <Box sx={{ textAlign: 'center', mb: 5 }}>
    <Typography sx={{
      color: '#c0392b',
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.2rem',
      mb: 1,
      position: 'relative',
      display: 'inline-block',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        width: '40px',
        height: '1px',
        backgroundColor: '#c0392b',
      },
      '&::before': { right: '100%', mr: 2 },
      '&::after': { left: '100%', ml: 2 },
    }}>
      {subtitle}
    </Typography>
    <Typography sx={{
      fontWeight: 'bold',
      fontSize: '2.5rem',
      color: '#2c3e50',
      fontFamily: "'Roboto', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '1px',
    }}>
      {title}
    </Typography>
  </Box>
);

// Individual service card styling
const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
  },
}));

// Icon wrapper with green background and white icon color
const ServiceIconWrapper = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  margin: '0 auto 16px auto',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4CAF50',
  color: 'white',
}));

const BusinessPortfolioPage = () => {
  const galleryImages = [
    { id: 1, title: 'moglai poreta', src: moglai },
    { id: 2, title: 'Wood-Fired Pizza', src: chickenchap },
    { id: 3, title: 'chickenfriedrice', src: chicckenfriedrice },
    { id: 4, title: 'egg torka', src: eggtorka },
    { id: 5, title: 'mottor ponir', src: mottorponir },
    { id: 7, title: 'nan ruti', src: nanruti },
    { id: 8, title: 'chicken briyani', src: chickenbriyani },
    { id: 9, title: 'rice chicken', src: ricechicken },
    { id: 10, title: 'butterchicken', src: butterchicken },
    { id: 11, title: 'roll', src: roll },
    { id: 12, title: 'special', src: special },
    { id: 13, title: 'tandori', src: tandori },
    { id: 14, title: 'vegthali', src: vegthali },
    { id: 15, title: 'chickenthali', src: chickenthali },
    { id: 16, title: 'chickenkosha', src: chickenkosha },
    { id: 17, title: 'chowmin', src: chowmin },
  ];

  const services = [
    {
      title: "Fine Dining",
      description: "An idyllic ambience and affable service for an experience that is much more than just quality food.",
      icon: <DeckIcon sx={{ fontSize: '2.5rem' }} />
    },
    {
      title: "Skilled Chefs",
      description: "Our expert chefs present creative and authentic dishes prepared with only the best of ingredients.",
      icon: <SoupKitchenIcon sx={{ fontSize: '2.5rem' }} />
    },
    {
      title: "City Delivery",
      description: "Our prompt delivery team ensures that your favourite food is delivered right to your doorstep.",
      icon: <DeliveryDiningIcon sx={{ fontSize: '2.5rem' }} />
    }
  ];

  return (
    <Box sx={{
      backgroundColor: '#FCFFF5',
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      <Navbar />


      <HeroSection>
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          padding: { xs: '16px 20px', md: '20px 16px' },
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* UPDATED: Animated and Responsive Title */}
          {/* UPDATED: Animated Title with Color Change Animation */}
<Typography
  component="div"
  variant="h1"
  sx={{
    fontWeight: 700,
    fontFamily: "'Playfair Display', serif",
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
    letterSpacing: '0.02em',
    lineHeight: 1.3,
    color: 'white',
    textShadow: '2px 4px 16px rgba(0,0,0,0.7), 0 2px 8px rgba(255,153,51,0.3)',
    width: '100%',
    textAlign: 'center',
    wordWrap: 'break-word',
    // ADD THIS COLOR ANIMATION
    animation: 'colorChange 8s ease-in-out infinite',
    '@keyframes colorChange': {
      '0%': { color: '#FFFFFF' },      // White
      '14%': { color: '#FF6B6B' },     // Coral Red (appetizing)
      '28%': { color: '#FFD93D' },     // Golden Yellow (warmth)
      '42%': { color: '#6FCF4B' },     // Fresh Green (healthy)
      '56%': { color: '#FA8900' },     // Orange (energetic)
      '70%': { color: '#FF4757' },     // Hot Red (spicy)
      '84%': { color: '#FFA502' },     // Amber (inviting)
      '100%': { color: '#FFFFFF' },    // Back to White
    },
  }}
>
  <TypeAnimation
    sequence={[
      'Welcome to',
      1000,
      'Welcome to',
      () => {
        // This function is called after the sequence item is complete.
      }
    ]}
    wrapper="span"
    cursor={false}
    repeat={0}
    style={{ display: 'block' }}
  />
  <TypeAnimation
    sequence={[
      1500, // wait 1.5s before starting the name
      'Rita Foodland',
    ]}
    wrapper="span"
    cursor={true}
    repeat={Infinity}
    style={{
      display: 'block',
      marginTop: '8px'
    }}
  />
</Typography>

          <Typography
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
              mt: { xs: 2, md: 3 },
              mb: { xs: 2, md: 4 },
              fontWeight: 400,
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              display: 'inline-block',
              padding: { xs: '8px 16px', md: '12px 28px' },
              borderRadius: 2,
              boxShadow: '0 3px 24px rgba(0,0,0,0.2)',
              animation: `${fadeIn} 1.6s 0.4s backwards`,
              textAlign: 'center',
              maxWidth: '90%',
              lineHeight: 1.6,
              letterSpacing: '0.5px',
            }}
          >

            Experience the taste of tradition and innovation.
          </Typography>
        </Box>
      </HeroSection>

      <Container>
        <Section sx={{ padding: { xs: '23px 10px', md: '60px 12px' } }}>
          <SectionHeader subtitle="Our Story" title="About Us" />
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', margin: '0 auto' }}>
            Founded in 2021, RitaFoodland began as a small family venture with a passion for authentic cuisine. Our journey is one of love for food and dedication to quality. We use only the freshest ingredients to create memorable dishes that bring people together.
          </Typography>
        </Section>
      </Container>

      <ServicesSection id="services-section" sx={{ padding: { xs: '40px 16px', md: '80px 32px' } }}>
        <Container maxWidth="lg">
          <SectionHeader subtitle="What We Offer" title="Our Services" />
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
            {services.map((service, index) => (
              <Box key={index} sx={{ flex: '1 1 300px', maxWidth: { xs: '100%', sm: '350px' } }}>
                <ServiceCard>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <ServiceIconWrapper>{service.icon}</ServiceIconWrapper>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333', mb: 1.5 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </ServiceCard>
              </Box>
            ))}
          </Box>
        </Container>
      </ServicesSection>

      <Container>
        <Section id="gallery-section">
          <SectionHeader subtitle="Discover our popular dishes" title="Food Gallery" />
          <Grid container spacing={3} justifyContent="center">
            {galleryImages.length > 0 ? (
              galleryImages.map((item) => (
                <Grid
                  item
                  key={item.id}
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 240,
                      height: 240,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      position: 'relative',
                      padding: 1,
                      bgcolor: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No gallery images are available right now.</Alert>
              </Grid>
            )}
          </Grid>
        </Section>
      </Container>

      <Footer />
    </Box>
  );
};

export default BusinessPortfolioPage;