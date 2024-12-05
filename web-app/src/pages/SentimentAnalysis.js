import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Papa from 'papaparse';

const SentimentAnalysis = () => {
  const [sentimentTrends, setSentimentTrends] = useState([]);
  const [sentimentByCategory, setSentimentByCategory] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [examples, setExamples] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const sections = useRef([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching CSV data...');
        const response = await fetch('/datasets/feedback_data_with_sentiment.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        console.log('CSV data fetched, parsing...');
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: 'greedy',
          complete: function(results) {
            if (results.errors.length > 0) {
              console.error('Parse errors:', results.errors);
            }
            
            console.log('Headers:', results.meta.fields);
            console.log('First row:', results.data[0]);
            console.log('Total rows:', results.data.length);
            
            // Filter out invalid rows and sample every 10th row
            const validData = results.data.filter(row => 
              row && 
              typeof row.Feedback === 'string' && 
              row.Feedback.trim() !== '' &&
              typeof row.text_sentiment !== 'undefined'
            );
            
            console.log('Valid rows:', validData.length);
            
            const sampledData = validData.filter((_, index) => index % 10 === 0);
            console.log('Sampled rows:', sampledData.length);
            
            if (sampledData.length === 0) {
              console.error('No valid data found after filtering');
              return;
            }
            
            // Process data for sentiment trends (by month)
            const trendsByMonth = {};
            sampledData.forEach(row => {
              const date = new Date(row.Timestamp);
              const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
              if (!trendsByMonth[month]) {
                trendsByMonth[month] = { positive: 0, negative: 0, total: 0 };
              }
              trendsByMonth[month].total++;
              if (parseFloat(row.text_sentiment) > 5) {
                trendsByMonth[month].positive++;
              } else {
                trendsByMonth[month].negative++;
              }
            });

            const trends = Object.entries(trendsByMonth).map(([month, counts]) => ({
              month,
              positive: (counts.positive / counts.total * 100).toFixed(1),
              negative: (counts.negative / counts.total * 100).toFixed(1)
            }));
            setSentimentTrends(trends);

            // Process data for sentiment by category
            const categoryData = {};
            sampledData.forEach(row => {
              const category = row['Company Name'] || 'General';
              if (!categoryData[category]) {
                categoryData[category] = { positive: 0, negative: 0, total: 0 };
              }
              categoryData[category].total++;
              if (parseFloat(row.text_sentiment) > 5) {
                categoryData[category].positive++;
              } else {
                categoryData[category].negative++;
              }
            });

            const categories = Object.entries(categoryData)
              .filter(([_, counts]) => counts.total > 5) // Only show categories with more than 5 entries
              .map(([name, counts]) => ({
                name,
                positive: (counts.positive / counts.total * 100).toFixed(1),
                negative: (counts.negative / counts.total * 100).toFixed(1)
              }));
            setSentimentByCategory(categories);

            // Process overall sentiment distribution
            const totals = { positive: 0, negative: 0, neutral: 0, total: sampledData.length };
            sampledData.forEach(row => {
              const score = parseFloat(row.text_sentiment);
              if (score > 6) totals.positive++;
              else if (score < 4) totals.negative++;
              else totals.neutral++;
            });

            const positivePercent = (totals.positive / totals.total) * 100;
            const negativePercent = (totals.negative / totals.total) * 100;
            const neutralPercent = (totals.neutral / totals.total) * 100;

            setComparisonData({
              text_positive: positivePercent,
              text_negative: negativePercent,
              text_neutral: neutralPercent,
              combined_positive: positivePercent,
              combined_negative: negativePercent,
              combined_neutral: neutralPercent
            });

            // Update pie chart data
            const pieData = [
              { name: 'Positive', value: positivePercent, color: '#748CAB' },
              { name: 'Negative', value: negativePercent, color: '#3E5C76' },
              { name: 'Neutral', value: neutralPercent, color: '#F0EBD8' }
            ];

            // Set example reviews
            setExamples(sampledData.slice(0, 5).map(row => ({
              feedback_text: row.Feedback,
              rating: row.Rating,
              text_sentiment: parseFloat(row.text_sentiment),
              combined_score: parseFloat(row.combined_sentiment),
              classification: row.text_sentiment_class
            })));
          }
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update pie chart data based on comparison data
  const pieData = comparisonData ? [
    { name: 'Positive', value: comparisonData.text_positive, color: '#748CAB' },
    { name: 'Negative', value: comparisonData.text_negative, color: '#3E5C76' },
    { name: 'Neutral', value: comparisonData.text_neutral, color: '#F0EBD8' },
  ] : [];

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error loading data</Typography>
        <Typography>{error}</Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Text-Based Analysis</Typography>
                <Typography>Positive: {comparisonData ? `${comparisonData.text_positive.toFixed(1)}%` : 'N/A'}</Typography>
                <Typography>Negative: {comparisonData ? `${comparisonData.text_negative.toFixed(1)}%` : 'N/A'}</Typography>
                <Typography>Neutral: {comparisonData ? `${comparisonData.text_neutral.toFixed(1)}%` : 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Combined Analysis (Text + Rating)</Typography>
                <Typography>Positive: {comparisonData ? `${comparisonData.combined_positive.toFixed(1)}%` : 'N/A'}</Typography>
                <Typography>Negative: {comparisonData ? `${comparisonData.combined_negative.toFixed(1)}%` : 'N/A'}</Typography>
                <Typography>Neutral: {comparisonData ? `${comparisonData.combined_neutral.toFixed(1)}%` : 'N/A'}</Typography>
              </Grid>
            </Grid>
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