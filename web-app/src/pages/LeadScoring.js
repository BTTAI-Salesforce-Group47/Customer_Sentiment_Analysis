import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';

const LeadScoring = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [conversionRate, setConversionRate] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching leads data...');
        const response = await fetch('/datasets/LeadsData.csv');
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
            console.log('Total leads:', results.data.length);
            
            // Process status distribution
            const statusCounts = {};
            results.data.forEach(row => {
              const status = row.Status || 'Unknown';
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            
            const distribution = Object.entries(statusCounts)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value);
            
            setStatusDistribution(distribution);
            
            // Process monthly trends
            const monthlyData = {};
            results.data.forEach(row => {
              if (!row.Date) return;
              const date = new Date(row.Date);
              const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
              
              if (!monthlyData[month]) {
                monthlyData[month] = { month, total: 0, qualified: 0, closed: 0 };
              }
              
              monthlyData[month].total++;
              if (row.Status === 'Qualified') monthlyData[month].qualified++;
              if (row.Status === 'Closed-Won') monthlyData[month].closed++;
            });
            
            const trends = Object.values(monthlyData)
              .sort((a, b) => new Date(a.month) - new Date(b.month));
            
            setMonthlyTrends(trends);
            
            // Calculate conversion rate
            const totalLeads = results.data.length;
            const closedWon = results.data.filter(row => row.Status === 'Closed-Won').length;
            setConversionRate((closedWon / totalLeads * 100).toFixed(1));
            
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Lead Scoring Dashboard</Typography>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6">Conversion Rate</Typography>
            <Typography variant="h4">{conversionRate}%</Typography>
            <Typography variant="body2">of leads converted to customers</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Lead Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>Lead Status Distribution</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>Monthly Lead Trends</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Leads" fill="#8884d8" />
                  <Bar dataKey="qualified" name="Qualified" fill="#82ca9d" />
                  <Bar dataKey="closed" name="Closed Won" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadScoring;