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

            //  pie chart data from sentiment analysis stats
            const pieData = [
              { name: 'Positive', value: 80161, color: '#748CAB' },
              { name: 'Neutral', value: 33989, color: '#F0EBD8' },
              { name: 'Negative', value: 19074, color: '#3E5C76' }
            ];

            //  example reviews data from sample_reviews.csv
            const examples = [
              {
                feedback_text: "Our experience with this service has been extremely frustrating. The software is riddled with bugs, and the performance is inconsistent at best. We frequently encounter errors that disrupt our work, and the promised features often don't function as advertised. The lack of proper documentation has made troubleshooting a nightmare, and the support team has been less than helpful, providing generic responses that don't address our specific issues. It's clear that this product is not ready for the market, and I would advise others to stay away.",
                rating: 1,
                text_sentiment: 2.33,
                combined_score: 2.23,
                classification: 'negative'
              },
              {
                feedback_text: "Product is okay, but could be more reliable.",
                rating: 6,
                text_sentiment: 3.08,
                combined_score: 5.76,
                classification: 'neutral'
              },
              {
                feedback_text: "The service is decent, but it's not without its flaws. There have been occasional glitches and bugs that, while not deal-breakers, are a bit annoying. The features are pretty standard, and while it gets the job done, it doesn't offer anything particularly unique or groundbreaking. It's a solid choice if you don't need anything fancy.",
                rating: 5,
                text_sentiment: 1.90,
                combined_score: 4.33,
                classification: 'negative'
              },
              {
                feedback_text: "Not bad, but lacks some important features.",
                rating: 5,
                text_sentiment: 3.12,
                combined_score: 5.18,
                classification: 'neutral'
              },
              {
                feedback_text: "I've been using this product for over a year now, and I am continually impressed by the consistent updates and new features that make my work easier and more efficient. The support team is always quick to respond and very helpful, which makes me feel valued as a customer. Overall, this has been an excellent investment for our company.",
                rating: 8,
                text_sentiment: 7.08,
                combined_score: 9.76,
                classification: 'positive'
              },
              {
                feedback_text: "The new features are incredibly useful and easy to use.",
                rating: 9,
                text_sentiment: 6.80,
                combined_score: 10.16,
                classification: 'positive'
              },
              {
                feedback_text: "While the product generally meets our needs, there are a few areas where it falls short. The interface is somewhat outdated and could benefit from a modern overhaul. It's functional and does what it needs to do, but it doesn't stand out in any particular way. Overall, it's an adequate solution, but there's room for improvement.",
                rating: 6,
                text_sentiment: 7.15,
                combined_score: 8.61,
                classification: 'positive'
              },
              {
                feedback_text: "Service is decent, no major complaints.",
                rating: 5,
                text_sentiment: 6.57,
                combined_score: 7.60,
                classification: 'positive'
              },
              {
                feedback_text: "Usable, but there's room for improvement.",
                rating: 5,
                text_sentiment: 6.94,
                combined_score: 7.86,
                classification: 'positive'
              }
            ];
            setExamples(examples);
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

  // // Update pie chart data based on comparison data
  // const pieData = comparisonData ? [
  //   { name: 'Positive', value: comparisonData.text_positive, color: '#748CAB' },
  //   { name: 'Negative', value: comparisonData.text_negative, color: '#3E5C76' },
  //   { name: 'Neutral', value: comparisonData.text_neutral, color: '#F0EBD8' },
  // ] : [];

  const pieData = [
    { name: 'Positive', value: 80161, color: '#748CAB' },
    { name: 'Neutral', value: 33989, color: '#F0EBD8' },
    { name: 'Negative', value: 19074, color: '#3E5C76' }
  ];

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

  const modelMetrics = {
    accuracy: 0.9886,
    f1Score: 0.9889,
    rocAuc: 0.9990,
    classificationMetrics: [
      { class: 'Negative (0)', precision: 1.00, recall: 0.97, f1Score: 0.98 },
      { class: 'Neutral (1)', precision: 1.00, recall: 1.00, f1Score: 1.00 },
      { class: 'Positive (2)', precision: 0.97, recall: 1.00, f1Score: 0.98 }
    ]
  };

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

  // Sort the sentimentByCategory data by  sum
  const sortedSentimentByCategory = [...sentimentByCategory].sort((a, b) => {
    const totalA = a.positive + a.negative;
    const totalB = b.positive + b.negative;
    return totalA - totalB;
  });

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
        <Typography variant="h4" gutterBottom>
          Sentiment Analysis
        </Typography>
        <Typography variant="subtitle1">
          We trained a sentiment analysis model to classify feedback into positive, neutral, or negative categories, 
          using TF-IDF for feature extraction and random forest for classification. Take a look at the model's performance 
          and the results of the analysis below.
        </Typography>
      </Paper>

      {/* Dataset Overview */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
        <Typography variant="h5" gutterBottom>
          Dataset Overview
        </Typography>
        <Typography variant="body1">
          Classified 130,000 feedback entries across three sentiment categories (positive, neutral, negative).
        </Typography>
      </Paper>

      {/* Model Metrics */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
        <Typography variant="h5" gutterBottom>
          Model Performance
        </Typography>
        
        <Grid container spacing={4}>
          {/* Overall Metrics */}
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ backgroundColor: '#2B3F5C' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>Metric</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#F0EBD8' }}>Accuracy</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(modelMetrics.accuracy * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#F0EBD8' }}>F1 Score</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(modelMetrics.f1Score * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#F0EBD8' }}>ROC-AUC</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(modelMetrics.rocAuc * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Per-Class Metrics */}
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ backgroundColor: '#2B3F5C' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>Class</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>Precision</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>Recall</TableCell>
                    <TableCell align="right" sx={{ color: '#F0EBD8', fontWeight: 'bold' }}>F1 Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelMetrics.classificationMetrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#F0EBD8' }}>{metric.class}</TableCell>
                      <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(metric.precision * 100).toFixed(2)}%</TableCell>
                      <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(metric.recall * 100).toFixed(2)}%</TableCell>
                      <TableCell align="right" sx={{ color: '#F0EBD8' }}>{(metric.f1Score * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Visualizations */}
      <Grid container spacing={4}>
        {/* Confusion Matrix */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
            <Typography variant="h6" gutterBottom>
              Confusion Matrix
            </Typography>
            <Box sx={{ 
              mt: 2, 
              '& img': { 
                width: '100%', 
                height: 'auto', 
                borderRadius: 2,
                border: '1px solid #3E5C76'
              } 
            }}>
              <img 
                src="/visuals/tf-idf_class/confusion_text_only.png" 
                alt="Confusion Matrix"
                loading="lazy"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Feature Importance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', color: '#F0EBD8' }}>
            <Typography variant="h6" gutterBottom>
              Feature Importance
            </Typography>
            <Box sx={{ 
              mt: 2, 
              '& img': { 
                width: '100%', 
                height: 'auto', 
                borderRadius: 2,
                border: '1px solid #3E5C76'
              } 
            }}>
              <img 
                src="/visuals/tf-idf_class/feature_importance_text.png" 
                alt="Feature Importance"
                loading="lazy"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>


      <Grid container spacing={4}>
        {/*
        <Grid item xs={12} ref={(el) => (sections.current[0] = el)}>
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
*/}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ color: '#F0EBD8', mt: 4, mb: 2 }}>
            Insights
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sentiment by Company
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedSentimentByCategory}>
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

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
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

        {/* Key Insights Section (Temporarily Commented Out)
        <Grid item xs={12} ref={(el) => (sections.current[3] = el)}>
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
        */}

        <Grid item xs={12} ref={(el) => (sections.current[4] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
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