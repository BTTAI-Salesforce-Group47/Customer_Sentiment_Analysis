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
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const expandedWidth = 240;
  const collapsedWidth = 65;
  const drawerWidth = isCollapsed ? collapsedWidth : expandedWidth;

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
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          '& .MuiListItem-root': {
            px: 2,
            py: 1.5,
          },
        },
      }}
    >
      <List>
        {/* Collapse/Expand Button */}
        <ListItem button onClick={() => setIsCollapsed(!isCollapsed)} sx={{ justifyContent: 'flex-end', py: 1 }}>
          <ListItemIcon sx={{ color: '#F0EBD8', minWidth: 'auto' }}>
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </ListItemIcon>
        </ListItem>
        {menuItems.map((item) => (
          item.subItems ? (
            <React.Fragment key={item.text}>
              <ListItem 
                button 
                onClick={() => setOpenAnalytics(!openAnalytics)}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                }}
              >
                <ListItemIcon sx={{ color: '#F0EBD8', minWidth: isCollapsed ? 0 : 40, justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <>
                    <ListItemText primary={item.text} />
                    {openAnalytics ? <ExpandLess /> : <ExpandMore />}
                  </>
                )}
              </ListItem>
              {!isCollapsed && (
                <Collapse in={openAnalytics} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem 
                        button 
                        key={subItem.text}
                        onClick={() => navigate(subItem.path)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon sx={{ color: '#F0EBD8' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ) : (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
              }}
            >
              <ListItemIcon sx={{ color: '#F0EBD8', minWidth: isCollapsed ? 0 : 40, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          )
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;
