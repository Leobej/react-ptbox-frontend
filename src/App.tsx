import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { ScanResult } from './types';

import ScanHistory from './components/ScanHistory';
import ScanResultsModal from './components/ScanResultsModal';
import StartScanDialog from './components/StartScanDialog';
import ScanDetails from './components/ScanDetails';

const App: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await axios.get<ScanResult[]>('http://localhost:8081/scans');
      setScanHistory(response.data);
    } catch (err) {
      console.error('Error fetching scan history:', err);
    }
  };

  const openScanResults = (scan: ScanResult) => {
    setSelectedScan(scan);
    setOpenResultsModal(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/scan/:id" element={<ScanDetails />} />
        <Route path="/" element={
          <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
              PTBOX Scanner
            </Typography>

            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
              Start New Scan
            </Button>

            <StartScanDialog open={openModal} onClose={() => setOpenModal(false)} refreshScans={fetchScanHistory} setError={setError} />

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
              <Alert severity="error">{error}</Alert>
            </Snackbar>

            {loading ? <CircularProgress /> : <ScanHistory scanHistory={scanHistory} openScanResults={openScanResults} setScanHistory={setScanHistory} />}

            {selectedScan && selectedScan.results && (
              <ScanResultsModal open={openResultsModal} onClose={() => setOpenResultsModal(false)} scan={selectedScan} />
            )}
          </Container>
        } />
      </Routes>
    </Router>
  );
};

export default App;