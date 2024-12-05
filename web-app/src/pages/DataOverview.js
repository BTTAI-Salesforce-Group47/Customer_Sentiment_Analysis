import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import Papa from 'papaparse';

const DataOverview = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load availability data
        const availabilityResponse = await fetch('/datasets/AvailabilityData.csv');
        const availabilityText = await availabilityResponse.text();
        console.log('Raw Availability Data:', availabilityText.slice(0, 200)); // Show first 200 chars
        
        Papa.parse(availabilityText, {
          header: true,
          complete: (results) => {
            console.log('Parsed Availability Data:', results.data.slice(0, 2)); // Show first 2 rows
            const transformedData = results.data
              .filter(row => row.Date && row['Availability DownTime Duration in hours']) // Filter out empty rows
              .map(row => ({
                date: row.Date,
                downtime: parseFloat(row['Availability DownTime Duration in hours']),
                affected: parseInt(row['Count of Customers Affected']),
                regions: (row['Regions Affected'] || '').split(',').map(region => region.trim())
              }));
            console.log('Transformed Availability Data:', transformedData.slice(0, 2)); // Show first 2 rows
            setAvailabilityData(transformedData);
          }
        });

        // Load company details data
        const companyResponse = await fetch('/datasets/CompanyDetails.csv');
        const companyText = await companyResponse.text();
        console.log('Raw Company Data:', companyText.slice(0, 200)); // Show first 200 chars
        
        Papa.parse(companyText, {
          header: true,
          complete: (results) => {
            console.log('Parsed Company Data:', results.data.slice(0, 2)); // Show first 2 rows
            // Count companies per region
            const regionCounts = {};
            results.data.forEach(row => {
              if (row['Region Served']) {
                const regions = row['Region Served'].split(',').map(r => r.trim());
                regions.forEach(region => {
                  regionCounts[region] = (regionCounts[region] || 0) + 1;
                });
              }
            });
            
            // Transform to chart format
            const transformedRegionData = Object.entries(regionCounts)
              .map(([region, companies]) => ({
                region,
                companies
              }))
              .filter(item => item.region && item.companies); // Remove any empty entries
            
            console.log('Transformed Region Data:', transformedRegionData); // Show all region data
            setRegionData(transformedRegionData);
          }
        });
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Data Overview
      </Typography>
      <Typography variant="body1" paragraph>
        Analysis of system availability and company distribution across regions.
      </Typography>

      <Grid container spacing={4}>
        {/* Downtime vs Affected Users */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              System Downtime Impact
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E5C76" opacity={0.3} />
                <XAxis 
                  dataKey="downtime" 
                  name="Downtime (hours)" 
                  stroke="#F0EBD8"
                  label={{ value: 'Downtime (hours)', position: 'bottom', fill: '#F0EBD8' }}
                />
                <YAxis 
                  dataKey="affected" 
                  name="Affected Users" 
                  stroke="#F0EBD8"
                  label={{ value: 'Affected Users', angle: -90, position: 'insideLeft', fill: '#F0EBD8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Scatter data={availabilityData} fill="#748CAB" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Companies by Region */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Company Distribution by Region
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="companies"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        {/* Monthly Downtime Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Downtime Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={availabilityData}>
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
                <Bar dataKey="downtime" fill="#748CAB" name="Downtime (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataOverview; 