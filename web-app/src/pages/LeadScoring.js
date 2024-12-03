import React, { useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Rating } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const LeadScoring = () => {
  const leadScores = [
    { name: 'High Priority', score: 85, count: 45 },
    { name: 'Medium Priority', score: 65, count: 78 },
    { name: 'Low Priority', score: 35, count: 32 },
  ];

  const leadMetrics = [
    { subject: 'Engagement', A: 85, fullMark: 100 },
    { subject: 'Sentiment', A: 75, fullMark: 100 },
    { subject: 'Budget Match', A: 90, fullMark: 100 },
    { subject: 'Need Match', A: 80, fullMark: 100 },
    { subject: 'Authority', A: 70, fullMark: 100 },
    { subject: 'Timeline', A: 85, fullMark: 100 },
  ];

  const sections = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    sections.current.forEach((section) => {
      if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <section ref={(el) => (sections.current[0] = el)}>
        <Typography variant="h4" gutterBottom>
          Lead Scoring
        </Typography>
        <Typography variant="body1" paragraph>
          Our lead scoring system combines sentiment analysis with traditional metrics to prioritize leads effectively.
        </Typography>
      </section>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Lead Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={leadScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis dataKey="name" stroke="#F0EBD8" />
                <YAxis stroke="#F0EBD8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="#748CAB" />
                <Bar dataKey="count" fill="#3E5C76" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Lead Quality Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={leadMetrics}>
                <PolarGrid stroke="#3E5C76" />
                <PolarAngleAxis dataKey="subject" stroke="#F0EBD8" />
                <PolarRadiusAxis stroke="#F0EBD8" />
                <Radar name="Lead Quality" dataKey="A" stroke="#748CAB" fill="#748CAB" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} ref={(el) => (sections.current[3] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Scoring Criteria
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: 'Sentiment Score',
                  description: 'Based on customer feedback analysis',
                  rating: 4
                },
                {
                  title: 'Engagement Level',
                  description: 'Interaction frequency and quality',
                  rating: 5
                },
                {
                  title: 'Budget Alignment',
                  description: 'Match with product pricing',
                  rating: 3
                }
              ].map((criterion, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ backgroundColor: '#0D1321', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {criterion.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {criterion.description}
                      </Typography>
                      <Rating value={criterion.rating} readOnly />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadScoring; 