import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import Papa from 'papaparse';

const DataOverview = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
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

        // Load feedback data
        const feedbackResponse = await fetch('/datasets/FeedbackData.csv');
        const feedbackText = await feedbackResponse.text();
        console.log('Raw Feedback Data:', feedbackText.slice(0, 200)); // Show first 200 chars

        Papa.parse(feedbackText, {
          header: true,
          complete: (results) => {
            console.log('Parsed Feedback Data:', results.data.slice(0, 2)); // Show first 2 rows
            const transformedData = results.data
              .filter(row => row.Date && row.CustomerID) // Filter out empty rows
              .map(row => ({
                Date: row.Date,
                CustomerID: row.CustomerID,
                Rating: parseInt(row.Rating),
                Category: row.Category,
                Comments: row.Comments
              }));
            console.log('Transformed Feedback Data:', transformedData.slice(0, 2)); // Show first 2 rows
            setFeedbackData(transformedData);
          },
          error: (error) => {
            console.error('Error parsing feedback data:', error);
          }
        });

        // Load leads data
        const leadsResponse = await fetch('/datasets/LeadsData.csv');
        const leadsText = await leadsResponse.text();

        Papa.parse(leadsText, {
          header: true,
          complete: (results) => {
            setLeadsData(results.data.filter(row => row.Date));
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

      <Grid container spacing={4}>

        {/* Feedback Data Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Feedback Data
            </Typography>
            <Typography variant="body2" paragraph>
              Analysis of 130,000 customer feedback entries. The dataset includes Date, CustomerID,
              Rating (1-5), Category (Product/Service/Support), and Comments.
            </Typography>

            {/* Sample Data Table */}
            <Box sx={{ mb: 3, overflowX: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#F0EBD8' }}>
                Sample Feedback Entries: {feedbackData.length ? `(${feedbackData.length} entries loaded)` : '(No data loaded)'}
              </Typography>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: '#F0EBD8',
                  borderColor: '#3E5C76'
                },
                mb: 2  // Add margin bottom to separate table from image
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>CustomerID</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Comments</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Box component="img"
                src="/datasets/feedbackdata.png"
                alt="Feedback Data"
                sx={{
                  width: '100%',
                  mt: 1,
                  borderRadius: 1,
                  backgroundColor: 'transparent'
                }}
              />
            </Box>


          </Paper>
        </Grid>



        {/* Leads Data Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Leads Data
            </Typography>
            <Typography variant="body2" paragraph>
              Collection of 1,276 sales leads with their current status. The dataset includes Company Name, Status, LeadId,
              Date, and Contact Email.
            </Typography>

            <Box sx={{ mb: 3, overflowX: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#F0EBD8' }}>
                Sample Lead Entries: {leadsData.length ? `(${leadsData.length} entries loaded)` : '(No data loaded)'}
              </Typography>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: '#F0EBD8',
                  borderColor: '#3E5C76'
                },
                mb: 2
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>LeadId</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>User Email</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Box component="img"
                src="/datasets/leadsdata.png"
                alt="Leads Data"
                sx={{
                  width: '100%',
                  mt: 1,
                  borderRadius: 1,
                  backgroundColor: 'transparent'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Availability Data Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Availability Data
            </Typography>
            <Typography variant="body2" paragraph>
              System availability metrics across 169 days. The dataset tracks Downtime Duration, Affected Customers,
              and Impacted Regions.
            </Typography>

            <Box sx={{ mb: 3, overflowX: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#F0EBD8' }}>
                Sample Availability Records: {availabilityData.length ? `(${availabilityData.length} entries loaded)` : '(No data loaded)'}
              </Typography>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: '#F0EBD8',
                  borderColor: '#3E5C76'
                },
                mb: 2
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Downtime (hours)</TableCell>
                    <TableCell>Customers Affected</TableCell>
                    <TableCell>Regions Affected</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Box component="img"
                src="/datasets/availabilitydata.png"
                alt="Availability Data"
                sx={{
                  width: '100%',
                  mt: 1,
                  borderRadius: 1,
                  backgroundColor: 'transparent'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Company Details Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Company Details
            </Typography>
            <Typography variant="body2" paragraph>
              Detailed information on 3,793 companies including employee counts and regions served. Essential for
              market analysis and segmentation.
            </Typography>

            <Box sx={{ mb: 3, overflowX: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#F0EBD8' }}>
                Sample Company Records: {companyData.length ? `(${companyData.length} entries loaded)` : '(No data loaded)'}
              </Typography>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  color: '#F0EBD8',
                  borderColor: '#3E5C76'
                },
                mb: 2
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Employee Count</TableCell>
                    <TableCell>Region Served</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Box component="img"
                src="/datasets/companydetails.png"
                alt="Company Details"
                sx={{
                  width: '100%',
                  mt: 1,
                  borderRadius: 1,
                  backgroundColor: 'transparent'
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataOverview; 