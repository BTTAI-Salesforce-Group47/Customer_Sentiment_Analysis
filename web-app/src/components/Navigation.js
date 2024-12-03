import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Group as LeadsIcon,
  ExpandLess,
  ExpandMore,
  Assessment as AssessmentIcon,
  Schedule,
  Home as HomeIcon,
  NewReleases as NewReleasesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [openAnalytics, setOpenAnalytics] = React.useState(false);
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Start Here', icon: <HomeIcon />, path: '/' },
    { text: 'Business Overview', icon: <BusinessIcon />, path: '/business-overview' },
    { text: 'Data Overview', icon: <AssessmentIcon />, path: '/data-overview' },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      subItems: [
        { text: 'Sentiment Analysis', icon: <AssessmentIcon />, path: '/sentiment-analysis' },
        { text: 'Lead Scoring', icon: <LeadsIcon />, path: '/lead-scoring' },
        { text: 'Outreach Timing', icon: <Schedule />, path: '/outreach-timing' },
      ]
    },
    { text: 'Results & Insights', icon: <TimelineIcon />, path: '/results' },
    { text: 'Coming Soon', icon: <NewReleasesIcon />, path: '/coming-soon' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1D2D44',
          color: '#F0EBD8',
          borderRadius: 0,
        },
      }}
    >
      <div style={{ 
        padding: '24px',
        borderBottom: 'none',
        marginBottom: '8px'
      }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            color: '#F0EBD8',
            fontWeight: 'bold',
          }}
        >
          Lead Analysis
        </Typography>
      </div>
      <List>
        {menuItems.map((item) => (
          item.subItems ? (
            <React.Fragment key={item.text}>
              <ListItem
                button
                onClick={() => setOpenAnalytics(!openAnalytics)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(62, 92, 118, 0.6)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ color: '#748CAB' }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: 'bold',
                      color: '#F0EBD8',
                    }
                  }}
                />
                {openAnalytics ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openAnalytics} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.text}
                      onClick={() => navigate(subItem.path)}
                      sx={{
                        pl: 4,
                        mx: 2,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(62, 92, 118, 0.6)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemIcon sx={{ color: '#748CAB' }}>{subItem.icon}</ListItemIcon>
                      <ListItemText 
                        primary={subItem.text}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontWeight: 'bold',
                            color: '#F0EBD8',
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(62, 92, 118, 0.6)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: '#748CAB' }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: '#F0EBD8',
                  }
                }}
              />
            </ListItem>
          )
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;
