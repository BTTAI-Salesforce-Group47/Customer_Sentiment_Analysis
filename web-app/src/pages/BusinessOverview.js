import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector } from '@mui/lab';

const BusinessOverview = () => {
  const leadStatuses = [
    { status: 'New', description: 'Lead just added to system, needs initial contact' },
    { status: 'Contacted', description: 'Initial outreach made, awaiting response' },
    { status: 'Qualified', description: 'Meets criteria for further engagement' },
    { status: 'Proposal Sent', description: 'Formal proposal/quote delivered' },
    { status: 'Negotiation', description: 'Active discussion of terms and conditions' },
    { status: 'Closed Won/Lost', description: 'Final outcome determined' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Business Understanding
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              backgroundColor: '#1D2D44',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Lead Management Process
            </Typography>
            <Timeline position="right">
              {leadStatuses.map((item, index) => (
                <TimelineItem key={item.status}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < leadStatuses.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary">
                        {item.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              backgroundColor: '#1D2D44',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Project Objectives
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                1. Sentiment Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Analyze customer feedback to understand sentiment patterns and identify improvement areas.
              </Typography>

              <Typography variant="subtitle1" color="primary" gutterBottom>
                2. Lead Prioritization
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Score and rank leads based on sentiment analysis and other metrics to optimize conversion rates.
              </Typography>

              <Typography variant="subtitle1" color="primary" gutterBottom>
                3. Optimal Outreach Timing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Determine the best timing for lead engagement based on availability metrics and customer behavior patterns.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default BusinessOverview; 