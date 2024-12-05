import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assessment, Business, Timeline, Upload } from '@mui/icons-material';

const StartHere = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'About Our Team',
      content: 'We are a team of data scientists and developers passionate about helping businesses understand and improve their customer relationships through advanced sentiment analysis.',
      icon: <Business sx={{ fontSize: 40, color: '#748CAB' }} />
    },
    {
      title: 'Project Overview',
      content: 'Our platform combines machine learning with traditional analytics to provide deep insights into customer sentiment, helping businesses make data-driven decisions.',
      icon: <Assessment sx={{ fontSize: 40, color: '#748CAB' }} />
    },
    {
      title: 'How to Navigate',
      content: 'Start with the Data Overview to understand our dataset, then explore Business Overview for context. Use Analytics for detailed sentiment analysis and insights.',
      icon: <Timeline sx={{ fontSize: 40, color: '#748CAB' }} />
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Customer Sentiment Analysis
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Discover insights from customer feedback and improve your business decisions
      </Typography>

      <Grid container spacing={4}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              sx={{ 
                p: 3, 
                backgroundColor: '#1D2D44', 
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Box sx={{ mb: 2 }}>
                {section.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.content}
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 4, backgroundColor: '#1D2D44', borderRadius: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Quick Start Guide
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    1. Explore Our Demo
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Start with our pre-loaded dataset to see the power of our analysis tools:
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/data-overview')}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    View Demo Data
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/business-overview')}
                    sx={{ mb: 1 }}
                  >
                    Business Context
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    2. Analyze Insights
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Dive deep into sentiment analysis and discover actionable insights:
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/sentiment-analysis')}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    View Analysis
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/results')}
                    sx={{ mb: 1 }}
                  >
                    See Results
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartHere; 