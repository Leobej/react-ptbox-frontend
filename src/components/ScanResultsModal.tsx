import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Divider, Chip, ListItem, ListItemText } from '@mui/material';
import { Domain, Email, Security, Link as LinkIcon, Dns, Warning, Public } from '@mui/icons-material';
import { ScanResult } from '../types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ListItemIcon } from '@mui/material';

interface ScanResultsModalProps {
  scan: ScanResult | null;
  open: boolean;
  onClose: () => void;
}

const ScanDetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon} {title}
      </Typography>
      {children}
      <Divider sx={{ my: 2 }} />
    </>
  );
  
  const ScanTable: React.FC<{ headers: string[]; data: string[] }> = ({ headers, data }) => (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell key={i}><strong>{header}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  

const ScanResultsModal: React.FC<ScanResultsModalProps> = ({ scan, open, onClose }) => {
  if (!scan) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Scan Results for <strong>{scan.domain}</strong></DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Status:</strong> {scan.status}
        </Typography>

        {scan.results?.hosts?.length && (
          <ScanDetailSection title="Subdomains Found" icon={<Domain color="primary" />}>
            <ScanTable headers={["Subdomain"]} data={scan.results.hosts} />
          </ScanDetailSection>
        )}

        {scan.results?.emails?.length && (
          <ScanDetailSection title="Emails Found" icon={<Email color="secondary" />}>
            {scan.results.emails.map((email, index) => (
              <Chip key={index} label={email} color="primary" sx={{ m: 0.5 }} />
            ))}
          </ScanDetailSection>
        )}

        {scan.results?.shodan?.length && (
          <ScanDetailSection title="Shodan IPs" icon={<Public color="success" />}>
            {scan.results.shodan.map((ip, index) => (
              <Chip key={index} label={ip} color="success" sx={{ m: 0.5 }} />
            ))}
          </ScanDetailSection>
        )}

        {scan.results?.dns?.length && (
          <ScanDetailSection title="DNS Records" icon={<Dns color="info" />}>
            <ListItem>
              <ListItemText primary={scan.results.dns.join(', ')} />
            </ListItem>
          </ScanDetailSection>
        )}

        {scan.results?.urls?.length && (
          <ScanDetailSection title="Found URLs" icon={<LinkIcon color="action" />}>
            {scan.results.urls.map((url, index) => (
              <ListItem key={index}>
                <ListItemText primary={url} />
              </ListItem>
            ))}
          </ScanDetailSection>
        )}

        {scan.results?.vulnerabilities?.length && (
          <ScanDetailSection title="Vulnerabilities" icon={<Warning color="error" />}>
            {scan.results.vulnerabilities.map((vuln, index) => (
              <Chip key={index} label={vuln} color="error" sx={{ m: 0.5 }} />
            ))}
          </ScanDetailSection>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanResultsModal;