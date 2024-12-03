import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const sampleData = [
    { date: '2023-01', positive: 65, negative: 35 },
    { date: '2023-02', positive: 70, negative: 30 },
    { date: '2023-03', positive: 75, negative: 25 },
    { date: '2023-04', positive: 72, negative: 28 },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Customer Sentiment Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              backgroundColor: '#1D2D44',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sentiment Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sampleData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#3E5C76" 
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#F0EBD8"
                  style={{ fontSize: '0.9rem' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#F0EBD8"
                  style={{ fontSize: '0.9rem' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1D2D44',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    color: '#F0EBD8'
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: '#F0EBD8',
                    fontWeight: 'bold'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#748CAB" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  name="Positive Sentiment"
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#F0EBD8" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  name="Negative Sentiment"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
