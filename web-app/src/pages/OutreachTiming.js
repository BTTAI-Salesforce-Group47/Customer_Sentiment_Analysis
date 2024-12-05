import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

const OutreachTiming = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [optimalWindows, setOptimalWindows] = useState([]);
  const [regionalImpact, setRegionalImpact] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load availability data
        const availabilityResponse = await fetch('/datasets/AvailabilityData.csv');
        const availabilityText = await availabilityResponse.text();
        
        // Process availability data
        Papa.parse(availabilityText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(row => ({
              date: new Date(row.Date).toLocaleDateString(),
              availability: 100 - (parseFloat(row['Availability DownTime Duration in hours']) / 24 * 100),
              engagement: parseFloat(row['Count of Customers Affected']) / 1000,
              regions: row['Regions Affected']
            }));
            setAvailabilityData(processedData.slice(0, 30)); // Show last 30 days
          }
        });

        // Load optimal windows data
        const windowsResponse = await fetch('/visuals/optimal_outreach_windows.csv');
        const windowsText = await windowsResponse.text();
        
        Papa.parse(windowsText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedWindows = results.data
              .filter(row => row.ds && row.yhat)
              .map(row => ({
                date: new Date(row.ds).toLocaleDateString(),
                score: parseFloat(row.yhat).toFixed(2),
                confidence: parseFloat(row.confidence_interval).toFixed(2)
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 5); // Top 5 optimal windows
            setOptimalWindows(processedWindows);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading data: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Outreach Timing Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* System Availability vs. Engagement */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Availability vs. Engagement
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="availability"
                  stroke="#8884d8"
                  name="System Availability %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#82ca9d"
                  name="Customer Engagement (K)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recommended Outreach Windows */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Outreach Windows
            </Typography>
            <Box>
              {optimalWindows.map((window, index) => (
                <Card key={index} sx={{ mb: 2, backgroundColor: '#1D2D44' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {window.date}
                    </Typography>
                    <Typography variant="body1">
                      Optimal Score: {window.score}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confidence Interval: ±{window.confidence}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Regional Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Regional Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {availabilityData.slice(0, 5).map((day, index) => (
                <Card key={index} sx={{ mb: 2, backgroundColor: '#1D2D44' }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {day.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Regions: {day.regions}
                    </Typography>
                    <Typography variant="body2">
                      Engagement: {day.engagement.toFixed(1)}K customers
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OutreachTiming;