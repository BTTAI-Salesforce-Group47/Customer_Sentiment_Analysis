import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Divider } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import Papa from 'papaparse';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

const Results = () => {
  const [outreachData, setOutreachData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load outreach timing data
        const outreachResponse = await fetch('/visuals/optimal_outreach_windows.csv');
        const outreachText = await outreachResponse.text();
        const outreachResults = await new Promise((resolve) => {
          Papa.parse(outreachText, {
            header: true,
            dynamicTyping: true,
            complete: resolve
          });
        });
        
        // Process outreach data
        const processedOutreach = outreachResults.data
          .filter(row => row.ds && row.yhat)
          .map(row => ({
            date: new Date(row.ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            engagement: Math.round(row.yhat),
            confidence: Math.round(row.confidence_interval || 0)
          }))
          .sort((a, b) => new Date(a.ds) - new Date(b.ds))
          .slice(0, 7); // Show last 7 data points
        setOutreachData(processedOutreach);

        // Load regional impact data
        const regionalResponse = await fetch('/visuals/regional_impact_summary.csv');
        const regionalText = await regionalResponse.text();
        const regionalResults = await new Promise((resolve) => {
          Papa.parse(regionalText, {
            header: true,
            dynamicTyping: true,
            complete: resolve
          });
        });
        
        // Process regional data
        const processedRegional = regionalResults.data
          .filter(row => row.Region)
          .map(row => ({
            name: row.Region,
            value: Math.round(row.Avg_Customers_Affected / 1000), // Convert to thousands
            color: getRegionColor(row.Region)
          }))
          .sort((a, b) => b.value - a.value);
        setRegionalData(processedRegional);

        // Load sentiment stats
        const sentimentResponse = await fetch('/visuals/sentiment_stats_20241130_214016.txt');
        const sentimentText = await sentimentResponse.text();
        
        // Parse sentiment distribution
        const sentimentMatch = sentimentText.match(/Combined Sentiment Classes:\ncombined_sentiment_class\nPositive\s+(\d+)\nNeutral\s+(\d+)\nNegative\s+(\d+)/);
        if (sentimentMatch) {
          const [_, positive, neutral, negative] = sentimentMatch;
          const total = parseInt(positive) + parseInt(neutral) + parseInt(negative);
          setSentimentData([
            { name: 'Positive', value: Math.round((parseInt(positive) / total) * 100), color: '#4CAF50' },
            { name: 'Neutral', value: Math.round((parseInt(neutral) / total) * 100), color: '#FFC107' },
            { name: 'Negative', value: Math.round((parseInt(negative) / total) * 100), color: '#F44336' }
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getRegionColor = (region) => {
    const colors = {
      'USA': '#1565C0',
      'Europe': '#4CAF50',
      'China': '#FFC107',
      'Japan': '#F44336',
      'India': '#9C27B0',
      'Australia': '#FF9800'
    };
    return colors[region] || '#757575';
  };

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

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <section ref={(el) => (sections.current[0] = el)}>
        <Typography variant="h4" gutterBottom>
          Results & Insights
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          How our models worked together to deliver actionable insights for Company A.
        </Typography>
        
        {/* Key Achievements */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { title: 'Sentiment Analysis', content: 'Identified negative feedback trends with 91% accuracy' },
            { title: 'Lead Prioritization', content: 'Prioritized high-value leads with ~50% and higher conversion rates' },
            { title: 'Engagement Optimization', content: 'Improved engagement timing to know when to reach out to these high-value leads' }
          ].map((achievement, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', backgroundColor: '#1D2D44' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2">
                    {achievement.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Model Flow Timeline */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44' }}>
          <Typography variant="h6" gutterBottom>
            Model Integration Flow
          </Typography>
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: '#4CAF50' }} />
                <TimelineConnector sx={{ height: 80 }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">Sentiment Analysis</Typography>
                <Typography>Customer feedback processing and sentiment scoring</Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: '#FFC107' }} />
                <TimelineConnector sx={{ height: 80 }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">Lead Scoring</Typography>
                <Typography>Conversion probability assessment using sentiment data</Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: '#F44336' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">Outreach Optimization</Typography>
                <Typography>Timing recommendations for high-potential leads</Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Paper>

        {/* Business Value Summary */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1D2D44', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Business Impact
          </Typography>
          <Typography variant="body1">
            Together, our models streamlined customer engagement, enabling data-driven decisions 
            that improved lead conversion efficiency and customer satisfaction rates.
          </Typography>
        </Paper>
      </section>

      <Grid container spacing={4}>
        <Grid item xs={12} ref={(el) => (sections.current[1] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Optimal Engagement Windows
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={outreachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis dataKey="date" stroke="#F0EBD8" />
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
                <Line type="monotone" dataKey="engagement" stroke="#748CAB" strokeWidth={3} name="Engagement Score" />
                <Line type="monotone" dataKey="confidence" stroke="#F0EBD8" strokeWidth={2} name="Confidence Interval" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} ref={(el) => (sections.current[2] = el)}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Regional Customer Impact
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}k)`}
                >
                  {regionalData.map((entry, index) => (
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
              Sentiment Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {sentimentData.map((entry, index) => (
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
      </Grid>
    </Box>
  );
};

export default Results;