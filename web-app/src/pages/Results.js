import React, { useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Divider } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Results = () => {
  const conversionData = [
    { month: 'Jan', optimized: 45, standard: 32 },
    { month: 'Feb', optimized: 52, standard: 34 },
    { month: 'Mar', optimized: 58, standard: 36 },
    { month: 'Apr', optimized: 62, standard: 35 },
  ];

  const impactData = [
    { name: 'High Impact', value: 45, color: '#748CAB' },
    { name: 'Medium Impact', value: 35, color: '#3E5C76' },
    { name: 'Low Impact', value: 20, color: '#F0EBD8' },
  ];

  const keyFindings = [
    {
      category: 'Sentiment Analysis',
      findings: [
        'Positive sentiment increased by 15% after implementing targeted improvements',
        'Product features receive highest positive feedback (80%)',
        'Pricing concerns identified as main area for improvement'
      ]
    },
    {
      category: 'Lead Scoring',
      findings: [
        'New scoring model improved conversion rate by 35%',
        'High-priority leads show 3x better conversion rate',
        'Sentiment-based scoring provides 25% better accuracy'
      ]
    },
    {
      category: 'Outreach Timing',
      findings: [
        'Peak engagement windows identified (9-11 AM)',
        'System availability optimized for key interaction periods',
        'Response rates improved by 40% during optimal windows'
      ]
    }
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
          Results & Insights
        </Typography>
        <Typography variant="body1" paragraph>
          Comprehensive analysis of our sentiment-driven lead prioritization and outreach optimization efforts.
        </Typography>
      </section>

      <Grid container spacing={4}>
        <Grid item xs={12} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Conversion Rate Improvement
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis dataKey="month" stroke="#F0EBD8" />
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
                <Line type="monotone" dataKey="optimized" stroke="#748CAB" strokeWidth={3} name="Optimized Approach" />
                <Line type="monotone" dataKey="standard" stroke="#F0EBD8" strokeWidth={3} name="Standard Approach" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Impact Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impactData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {impactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[3] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Key Findings
            </Typography>
            <Box sx={{ mt: 2 }}>
              {keyFindings.map((category, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {category.category}
                  </Typography>
                  {category.findings.map((finding, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      • {finding}
                    </Typography>
                  ))}
                  {index < keyFindings.length - 1 && (
                    <Divider sx={{ my: 2, backgroundColor: '#3E5C76' }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Results; 