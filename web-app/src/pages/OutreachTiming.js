import React, { useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const OutreachTiming = () => {
  const availabilityData = [
    { hour: '00:00', availability: 99.9, engagement: 0.2 },
    { hour: '04:00', availability: 99.8, engagement: 0.1 },
    { hour: '08:00', availability: 98.5, engagement: 0.8 },
    { hour: '12:00', availability: 97.2, engagement: 1.0 },
    { hour: '16:00', availability: 98.0, engagement: 0.9 },
    { hour: '20:00', availability: 99.5, engagement: 0.4 },
  ];

  const customerImpact = [
    { time: 'Morning', affected: 120, response: 85 },
    { time: 'Afternoon', affected: 180, response: 145 },
    { time: 'Evening', affected: 90, response: 65 },
    { time: 'Night', affected: 45, response: 20 },
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
          Optimal Outreach Timing
        </Typography>
        <Typography variant="body1" paragraph>
          Using availability metrics and customer engagement patterns to determine the best times for outreach.
        </Typography>
      </section>

      <Grid container spacing={4}>
        <Grid item xs={12} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              System Availability vs. Engagement
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#F0EBD8" />
                <YAxis yAxisId="left" stroke="#F0EBD8" />
                <YAxis yAxisId="right" orientation="right" stroke="#F0EBD8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="availability" stroke="#748CAB" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#F0EBD8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Customer Impact Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={customerImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis dataKey="time" stroke="#F0EBD8" />
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
                <Bar dataKey="affected" fill="#748CAB" />
                <Bar dataKey="response" fill="#3E5C76" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[3] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Outreach Windows
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  time: 'Peak Hours (9 AM - 11 AM)',
                  description: 'Highest engagement rates with optimal system performance',
                  confidence: 'High Priority'
                },
                {
                  time: 'Mid-Day (2 PM - 4 PM)',
                  description: 'Balanced availability and response rates',
                  confidence: 'Medium Priority'
                },
                {
                  time: 'Early Evening (6 PM - 8 PM)',
                  description: 'Good for follow-ups and non-urgent communication',
                  confidence: 'Low Priority'
                }
              ].map((window, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ backgroundColor: '#0D1321' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {window.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {window.description}
                      </Typography>
                      <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                        {window.confidence}
                      </Typography>
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

export default OutreachTiming; 