import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { ScanResult } from '../types';

const ScanDetails = () => {
  const { id } = useParams();
  const [scan, setScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/scans/${id}`)
      .then(res => setScan(res.data as ScanResult))
      .catch(() => setScan(null));
  }, [id]);

  return scan ? (
    <Container>
      <Typography variant="h5">Scan for {scan.domain}</Typography>
      <Typography>Status: {scan.status}</Typography>
      <List>
        {scan.results?.hosts?.map((host, i) => (
          <ListItem key={i}><ListItemText primary={host} /></ListItem>
        )) || <Typography>No hosts found</Typography>}
      </List>
    </Container>
  ) : (
    <CircularProgress />
  );
};

export default ScanDetails;
