import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Papa from 'papaparse';

const LeadScoring = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [conversionRate, setConversionRate] = useState(null);
  const [highPotentialLeads, setHighPotentialLeads] = useState([]);
  const [companyInsights, setCompanyInsights] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load leads data
        const leadsResponse = await fetch('/datasets/LeadsData.csv');
        const leadsText = await leadsResponse.text();
        
        // Load company details
        const companyResponse = await fetch('/datasets/CompanyDetails.csv');
        const companyText = await companyResponse.text();
        
        // Load high potential leads
        const potentialResponse = await fetch('/visuals/high_potential_leads.csv');
        const potentialText = await potentialResponse.text();
        
        // Parse all data
        const [leadsResults, companyResults, potentialResults] = await Promise.all([
          new Promise((resolve) => Papa.parse(leadsText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: resolve
          })),
          new Promise((resolve) => Papa.parse(companyText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: resolve
          })),
          new Promise((resolve) => Papa.parse(potentialText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: resolve
          }))
        ]);
        
        // Process leads data
        const statusCounts = {};
        const monthlyData = {};
        let convertedLeads = 0;
        let totalLeads = 0;
        
        leadsResults.data.forEach(row => {
          if (!row['Company Name'] && !row.Status) return; // Skip invalid rows
          totalLeads++;
          
          // Status distribution
          const status = row.Status || 'Unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
          
          // Monthly trends
          if (row.Date) {
            const date = new Date(row.Date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { month: monthKey, total: 0, converted: 0 };
            }
            monthlyData[monthKey].total++;
            if (status === 'Closed-Won') {
              monthlyData[monthKey].converted++;
              convertedLeads++;
            }
          }
        });
        
        // Set status distribution
        const distribution = Object.entries(statusCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        setStatusDistribution(distribution);
        
        // Set monthly trends
        const trends = Object.values(monthlyData)
          .sort((a, b) => a.month.localeCompare(b.month))
          .map(data => ({
            ...data,
            conversionRate: data.total > 0 ? ((data.converted / data.total) * 100).toFixed(1) : '0.0'
          }));
        setMonthlyTrends(trends);
        
        // Set conversion rate
        setConversionRate(totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0');
        
        // Process high potential leads
        setHighPotentialLeads(potentialResults.data
          .map(lead => ({
            CompanyName: lead['Company Name'] || lead.CompanyName,
            Score: (lead.conversion_probability * 100).toFixed(1) + '%',
            Status: lead.Status
          }))
          .sort((a, b) => parseFloat(b.Score) - parseFloat(a.Score))
          .slice(0, 5));
        
        // Process company insights
        const companyMap = new Map(companyResults.data.map(company => [
          company['Company Name'],
          { size: company['Employee Count'] > 10000 ? 'Large' : company['Employee Count'] > 1000 ? 'Medium' : 'Small' }
        ]));
        
        const sizeInsights = {
          'Small': { size: 'Small', count: 0, converted: 0 },
          'Medium': { size: 'Medium', count: 0, converted: 0 },
          'Large': { size: 'Large', count: 0, converted: 0 }
        };
        
        leadsResults.data.forEach(lead => {
          const companyInfo = companyMap.get(lead['Company Name']);
          if (companyInfo) {
            const { size } = companyInfo;
            sizeInsights[size].count++;
            if (lead.Status === 'Closed-Won') {
              sizeInsights[size].converted++;
            }
          }
        });
        
        const processedInsights = Object.values(sizeInsights)
          .map(insight => ({
            ...insight,
            conversionRate: insight.count > 0 ? ((insight.converted / insight.count) * 100).toFixed(1) : '0.0'
          }))
          .sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate));

        setCompanyInsights(processedInsights);
        
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
        Lead Scoring Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Conversion Rate Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Overall Conversion Rate</Typography>
            <Typography variant="h3" color="primary">
              {conversionRate}%
            </Typography>
          </Paper>
        </Grid>
        
        {/* Status Distribution */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lead Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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
          </Paper>
        </Grid>
        
        {/* Monthly Trends */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Conversion Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversionRate" stroke="#8884d8" name="Conversion Rate %" />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total Leads" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* High Potential Leads */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              High Potential Leads
            </Typography>
            {highPotentialLeads.map((lead, index) => (
              <Card key={index} sx={{ mb: 1, backgroundColor: '#1D2D44' }}>
                <CardContent>
                  <Typography variant="subtitle1">{lead.CompanyName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score: {lead.Score}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
        
        {/* Company Size Insights */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Conversion by Company Size
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyInsights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadScoring;