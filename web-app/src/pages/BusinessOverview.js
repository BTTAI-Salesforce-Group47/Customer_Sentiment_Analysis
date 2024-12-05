import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector } from '@mui/lab';
import StorageIcon from '@mui/icons-material/Storage';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const BusinessOverview = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Business Understanding
      </Typography>

      {/* Project Objectives Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Project Objectives
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: '#1D2D44' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AnalyticsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Sentiment Analysis & Lead Prioritization</Typography>
              </Box>
              <Typography variant="body2">
                • Analyze customer feedback sentiment
                • Identify high-potential leads
                • Assess conversion probability
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: '#1D2D44' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Predictive Outreach Timing</Typography>
              </Box>
              <Typography variant="body2">
                • Determine optimal contact windows
                • Consider product availability metrics
                • Maximize engagement potential
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Structure Section */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <StorageIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Data Structure</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#2C3E50' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Availability Metrics
                </Typography>
                <Typography variant="body2">
                  • Downtime duration
                  • Affected customers
                  • Regional impact
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#2C3E50' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  CRM Data
                </Typography>
                <Typography variant="body2">
                  • Lead information
                  • Company details
                  • Contact status
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#2C3E50' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Customer Feedback
                </Typography>
                <Typography variant="body2">
                  • Sentiment data
                  • Product ratings
                  • Text feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Lead Management Timeline */}
      <Paper sx={{ p: 3, backgroundColor: '#1D2D44' }}>
        <Typography variant="h6" gutterBottom>
          Lead Management Process
        </Typography>
        <Timeline position="alternate">
          {[
            { status: 'New', description: 'Initial entry into system' },
            { status: 'Contacted', description: 'First outreach made' },
            { status: 'Qualified', description: 'Meets business criteria' },
            { status: 'Proposal', description: 'Formal offer sent' },
            { status: 'Negotiation', description: 'Active discussion' },
            { status: 'Closed', description: 'Final outcome determined' }
          ].map((item, index, arr) => (
            <TimelineItem key={item.status}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < arr.length - 1 && <TimelineConnector sx={{ height: 80 }} />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1" color="primary">
                  {item.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </div>
  );
};

export default BusinessOverview; 