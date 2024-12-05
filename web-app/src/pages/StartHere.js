import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assessment, Business, Timeline, Upload } from '@mui/icons-material';
import { ReactFlow, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const StartHere = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: ' Our Team',
      content: 'We are a team of 3 Machine Learning students under BreakthroughTech AI at MIT. We\'re working with our Salesforce challenge advisor to build a SAAS Customer Sentiment Analysis platform using ML',
      icon: <Business sx={{ fontSize: 40, color: '#748CAB' }} />
    },
    {
      title: 'Project Overview',
      content: 'Our platform uses various Machine Learning models to provide insights into customer sentiment and optimal outreach timing, helping businesses make data-driven decisions.',
      icon: <Assessment sx={{ fontSize: 40, color: '#748CAB' }} />
    },
    {
      title: 'How to Navigate',
      content: 'Start with the Data Overview to understand our dataset, then explore Business Overview for context. View Analytics for a detailed look at our models and results.',
      icon: <Timeline sx={{ fontSize: 40, color: '#748CAB' }} />
    }
  ];

  // Flow diagram nodes
  const nodes = [
    // Data Source Nodes
    { id: '1', position: { x: 50, y: 50 }, data: { label: 'Feedback Data' }, type: 'input', style: { background: '#bbdefb' } },
    { id: '2', position: { x: 50, y: 150 }, data: { label: 'Leads Data' }, type: 'input', style: { background: '#bbdefb' } },
    { id: '3', position: { x: 50, y: 250 }, data: { label: 'Availability Data' }, type: 'input', style: { background: '#bbdefb' } },
    
    // Model Nodes
    { id: '4', position: { x: 300, y: 50 }, data: { label: 'Sentiment Analysis\n(99% accuracy)' }, style: { background: '#c8e6c9' } },
    { id: '5', position: { x: 300, y: 150 }, data: { label: 'Lead Scoring' }, style: { background: '#c8e6c9' } },
    { id: '6', position: { x: 300, y: 250 }, data: { label: 'Outreach Prediction\n(91% accuracy)' }, style: { background: '#c8e6c9' } },
  ];

  // Flow diagram edges
  const edges = [
    { id: 'e1-4', source: '1', target: '4', animated: true },
    { id: 'e2-5', source: '2', target: '5', animated: true },
    { id: 'e3-6', source: '3', target: '6', animated: true },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        BTTAI Group 47 | SAAS Customer Sentiment Analysis
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Discover insights into who to reach out to, when to reach out, and why to reach out.  
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
                    Start with our pre-loaded dataset to see what our models are working with:
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
                    Take a closer look at our various models and results:
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/sentiment-analysis')}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    View Analyses
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

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
            <Typography variant="h5" gutterBottom>
              Model Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%', backgroundColor: '#2B3F5C' }}>
                  <Typography variant="h6" gutterBottom>
                    Sentiment Analysis
                  </Typography>
                  <Typography variant="body1">
                    Classifying customer reviews to better understand their sentiment towards a product (99% accuracy).
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/sentiment-analysis')}
                    sx={{ mt: 2 }}
                  >
                    View Sentiment Analysis
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%', backgroundColor: '#2B3F5C' }}>
                  <Typography variant="h6" gutterBottom>
                    Lead Scoring
                  </Typography>
                  <Typography variant="body1">
                    Prioritizing high-value leads for conversion.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/lead-scoring')}
                    sx={{ mt: 2 }}
                  >
                    View Lead Scoring
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%', backgroundColor: '#2B3F5C' }}>
                  <Typography variant="h6" gutterBottom>
                    Outreach Prediction
                  </Typography>
                  <Typography variant="body1">
                    Optimizing engagement timing for maximum impact (91% accuracy).
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/outreach-timing')}
                    sx={{ mt: 2 }}
                  >
                    View Outreach Prediction
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
            <Typography variant="h5" gutterBottom>
              Data Flow
            </Typography>
            <Box sx={{ height: '400px', backgroundColor: '#2B3F5C', borderRadius: 1 }}>
              <ReactFlow 
                nodes={nodes}
                edges={edges}
                fitView
              >
                <Background />
              </ReactFlow>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartHere;