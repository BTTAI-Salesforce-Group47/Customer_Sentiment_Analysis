import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const SentimentAnalysis = () => {
  const [sentimentTrends, setSentimentTrends] = useState([]);
  const [sentimentByCategory, setSentimentByCategory] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [examples, setExamples] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const sections = useRef([]);

  const pieData = [
    { name: 'Positive', value: 60, color: '#748CAB' },
    { name: 'Negative', value: 25, color: '#3E5C76' },
    { name: 'Neutral', value: 15, color: '#F0EBD8' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trendsRes, categoryRes, comparisonRes, examplesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/sentiment/trends'),
          axios.get('http://localhost:5001/api/sentiment/by-category'),
          axios.get('http://localhost:5001/api/sentiment/comparison'),
          axios.get('http://localhost:5001/api/sentiment/examples')
        ]);
        
        setSentimentTrends(trendsRes.data);
        setSentimentByCategory(categoryRes.data);
        setComparisonData(comparisonRes.data);
        setExamples(examplesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <section ref={(el) => (sections.current[0] = el)}>
        <Typography variant="h4" gutterBottom>
          Sentiment Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Our advanced sentiment analysis system processes customer feedback to understand emotions and opinions.
          This helps identify areas of improvement and opportunities for better engagement.
        </Typography>
      </section>

      <Grid container spacing={4}>
        <Grid item xs={12} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sentimentTrends}>
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
                <Line type="monotone" dataKey="positive" stroke="#748CAB" strokeWidth={3} />
                <Line type="monotone" dataKey="negative" stroke="#F0EBD8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sentiment by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentByCategory}>
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
                <Bar dataKey="positive" fill="#748CAB" />
                <Bar dataKey="negative" fill="#3E5C76" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[3] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overall Sentiment Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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

        <Grid item xs={12} ref={(el) => (sections.current[4] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: 'Positive Trends',
                  content: 'Overall positive sentiment has increased by 15% over the last quarter.'
                },
                {
                  title: 'Areas for Improvement',
                  content: 'Pricing-related sentiment shows room for improvement with 45% negative feedback.'
                },
                {
                  title: 'Customer Support',
                  content: 'Support team performance maintains a steady 65% positive rating.'
                }
              ].map((insight, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ backgroundColor: '#0D1321', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {insight.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} ref={(el) => (sections.current[5] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Analysis Comparison
            </Typography>
            {comparisonData && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Text-Based Analysis
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography>Positive: {comparisonData.text_positive.toFixed(1)}%</Typography>
                    <Typography>Negative: {comparisonData.text_negative.toFixed(1)}%</Typography>
                    <Typography>Neutral: {comparisonData.text_neutral.toFixed(1)}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Combined Analysis (Text + Rating)
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography>Positive: {comparisonData.combined_positive.toFixed(1)}%</Typography>
                    <Typography>Negative: {comparisonData.combined_negative.toFixed(1)}%</Typography>
                    <Typography>Neutral: {comparisonData.combined_neutral.toFixed(1)}%</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} ref={(el) => (sections.current[6] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Example Reviews
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Review Text</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Text Sentiment</TableCell>
                    <TableCell>Combined Score</TableCell>
                    <TableCell>Classification</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examples.map((example, index) => (
                    <TableRow key={index}>
                      <TableCell>{example.feedback_text || 'N/A'}</TableCell>
                      <TableCell>{example.rating || 'N/A'}</TableCell>
                      <TableCell>
                        {example.text_sentiment != null 
                          ? example.text_sentiment.toFixed(2) 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {example.combined_score != null 
                          ? example.combined_score.toFixed(2) 
                          : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        color: example.classification === 'positive' ? '#4caf50' : 
                               example.classification === 'negative' ? '#f44336' : '#ff9800'
                      }}>
                        {example.classification || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SentimentAnalysis; 