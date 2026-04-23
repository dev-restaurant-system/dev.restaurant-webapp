import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Use a clean white background for the entire page
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
}));

// Main content section with adjusted padding for a wider look
const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5, 2), // Vertical padding, minimal horizontal padding
}));

// Main page header, inspired by the reference image
const SectionHeader = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '3rem',
  fontWeight: 700,
  color: '#333333', // Dark charcoal color for strong contrast
  textAlign: 'center',
  marginTop: theme.spacing(3), 
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.2rem',
  },
}));

// Sub-header for individual sections with a left accent border
const SubSectionHeader = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '1.75rem',
  fontWeight: 600,
  color: '#2c3e50', // A deep, professional blue-gray
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  borderLeft: `4px solid #4CAF50`, // Accent color inspired by the "ADMIN LOGIN" button
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

// Body text with a highly readable font and comfortable line spacing
const BodyText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Open Sans', sans-serif",
  fontSize: '1rem',
  lineHeight: 1.8,
  color: '#555555', // Soft black for easy reading
  marginBottom: theme.spacing(2),
}));

// Styled list item for clarity and consistency
const ListItem = styled('li')(({ theme }) => ({
  fontFamily: "'Open Sans', sans-serif",
  fontSize: '1rem',
  lineHeight: 1.8,
  color: '#555555',
  marginBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
}));

const PrivacyPolicyPage = () => {
  return (
    <PageContainer>
      <Navbar />
      <Container maxWidth="lg">
        <Section>
          <SectionHeader variant="h1">
            Privacy Policy
          </SectionHeader>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 6 }}>
            Last updated: September 16, 2025
          </Typography>

          <BodyText>
            Welcome to Ritafoodland! This Privacy Policy explains what information we collect when you use our app, how we use it, and how we keep it safe. Your privacy is very important to us, and we're committed to protecting your personal data.
          </BodyText>

          {/* --- Section 1: Information We Collect --- */}
          <SubSectionHeader variant="h2">
            1. What Information We Collect
          </SubSectionHeader>
          <BodyText>
            We only collect the information we absolutely need to get your food to you. When you sign up, we'll ask for:
          </BodyText>
          <ul>
            <ListItem>
              <strong>Your Name and Phone Number:</strong> We use your name to know who you are and your phone number to verify your account with a one-time password (OTP). We'll also use it to send you updates about your order.
            </ListItem>
            <ListItem>
              <strong>Your Delivery Address:</strong> This is simply so we know where to deliver your food.
            </ListItem>
          </ul>
          <BodyText>
            <strong>What We Don't Collect:</strong> We want to be very clear: we **never** ask for or store any payment details like credit cards or bank information, since we only accept Cash on Delivery. Our app doesn't use cookies or any other tracking tools.
          </BodyText>

          {/* --- Section 2: Use of Your Information --- */}
          <SubSectionHeader variant="h2">
            2. How We Use Your Information
          </SubSectionHeader>
          <BodyText>
            Here’s what we do with the information you provide:
          </BodyText>
          <ul>
            <ListItem>To manage and secure your account.</ListItem>
            <ListItem>To process your orders and make sure they get delivered to the right place.</ListItem>
            <ListItem>To keep you updated on your order status, like when it's confirmed or on its way.</ListItem>
            <ListItem>To look at general order patterns, which helps us make the app better and more reliable for you.</ListItem>
          </ul>

          {/* --- Section 3: Information Sharing and Disclosure --- */}
          <SubSectionHeader variant="h2">
            3. Who We Share Your Information With
          </SubSectionHeader>
          <BodyText>
            Your privacy is our priority. We will never sell or rent your personal information to anyone. The only times we share your information are:
          </BodyText>
          <ul>
            <ListItem>
              <strong>With Our Delivery Team:</strong> We give your name, address, and phone number to our delivery drivers so they can bring you your order.
            </ListItem>
            <ListItem>
              <strong>When Required by Law:</strong> If we are required by law or a court order, we may need to share your information with public authorities.
            </ListItem>
          </ul>
          
          {/* --- Other Sections --- */}
          <SubSectionHeader variant="h2">4. Keeping Your Data Safe</SubSectionHeader>
          <BodyText>We take reasonable steps to protect your information from being accessed or used by anyone who shouldn't have it. While we do our best to keep everything secure, please remember that no system is 100% foolproof.</BodyText>

          <SubSectionHeader variant="h2">5. Children's Privacy</SubSectionHeader>
          <BodyText>Our service is intended for users who are 13 years of age or older. We do not knowingly collect information from children. If you believe we have accidentally collected information from a child, please let us know so we can remove it.</BodyText>
          
          <SubSectionHeader variant="h2">6. Changes to This Policy</SubSectionHeader>
          <BodyText>We may update this policy from time to time. If we do, we'll post the changes right here on this page and update the "Last updated" date at the top. It's a good idea to check back here occasionally to see what's new.</BodyText>

        </Section>
      </Container>
      <Footer />
    </PageContainer>
  );
};

export default PrivacyPolicyPage;
