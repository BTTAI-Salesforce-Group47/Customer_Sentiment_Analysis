import React, { useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, 
  TextField, CircularProgress 
} from '@mui/material';
import { Upload, CloudUpload } from '@mui/icons-material';

const ComingSoon = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      alert('This is a demo feature. File upload will be available soon!');
      setFile(null);
    }, 2000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Coming Soon
      </Typography>
      <Typography variant="body1" paragraph>
        We're looking to work on personalization features to deliver insights tailored to custom business data.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Upload Your Data
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              Soon you'll be able to upload your own data and see insights tailored to your business.
            </Typography>
            
            <Box
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'grey.500',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: isDragging ? 'rgba(116, 140, 171, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                mt: 2
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
              <Typography gutterBottom>
                Drag and drop your CSV file here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to select file
              </Typography>
              {file && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="primary">{file.name}</Typography>
                  <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={isUploading}
                    sx={{ mt: 2 }}
                  >
                    {isUploading ? (
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                    ) : (
                      <Upload sx={{ mr: 1 }} />
                    )}
                    Upload File
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1D2D44', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Features
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                {
                  title: 'Personalized Insights',
                  description: 'Get custom analytics and recommendations specifically designed for your business needs.'
                },
                {
                  title: 'Real-time Model Integration',
                  description: 'Connect directly to our ML models for instant analysis and continuous learning from your data.'
                },
                {
                  title: 'Advanced Visualization Studio',
                  description: 'Create and customize interactive dashboards that highlight the metrics that matter most to you.'
                }
              ].map((feature, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComingSoon; 