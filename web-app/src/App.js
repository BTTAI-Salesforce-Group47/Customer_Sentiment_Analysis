import logo from './logo.svg';
import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import { Box } from '@mui/material';
import BusinessOverview from './pages/BusinessOverview';
import SentimentAnalysis from './pages/SentimentAnalysis';
import LeadScoring from './pages/LeadScoring';
import OutreachTiming from './pages/OutreachTiming';
import Results from './pages/Results';
import DataOverview from './pages/DataOverview';
import StartHere from './pages/StartHere';
import ComingSoon from './pages/ComingSoon';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#748CAB',
    },
    secondary: {
      main: '#F0EBD8',
    },
    background: {
      default: '#0D1321',
      paper: '#1D2D44',
    },
    text: {
      primary: '#F0EBD8',
      secondary: '#748CAB',
    },
  },
  typography: {
    fontWeight: 500,
    h4: {
      fontWeight: 700,
      color: '#F0EBD8',
    },
    h6: {
      fontWeight: 600,
      color: '#F0EBD8',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1D2D44',
          borderRight: 'none',
          boxShadow: '4px 0 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<StartHere />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/business-overview" element={<BusinessOverview />} />
              <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
              <Route path="/lead-scoring" element={<LeadScoring />} />
              <Route path="/outreach-timing" element={<OutreachTiming />} />
              <Route path="/results" element={<Results />} />
              <Route path="/data-overview" element={<DataOverview />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
