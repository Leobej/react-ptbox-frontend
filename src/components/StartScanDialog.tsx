import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ScanResult } from '../types';

interface StartScanDialogProps {
    open: boolean;
    onClose: () => void;
    refreshScans: () => Promise<void>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const StartScanDialog: React.FC<StartScanDialogProps> = ({ open, onClose, refreshScans, setError }) => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);

    const onStartScan = async (domain: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<ScanResult>('http://localhost:8081/scans', { domain });
            const newScan = response.data;

            await refreshScans();
            pollScanStatus(newScan.id);

            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };


    const handleStartScan = () => {
        if (domain.trim()) {
            onStartScan(domain);
        }
    };

    const pollScanStatus = async (scanId: string) => {
        const pollInterval = 5000;

        const checkStatus = async () => {
            try {
                const response = await axios.get<ScanResult>(`http://localhost:8081/scans/${scanId}`);

                if (response.data.status === 'COMPLETED') {
                    await refreshScans();
                } else {
                    setTimeout(checkStatus, pollInterval);
                }
            } catch (error: any) {
                if (error.response?.status === 404) {
                    console.warn(`Scan ${scanId} not found yet. Retrying...`);
                } else {
                    console.error('Error polling scan status:', error);
                }
                setTimeout(checkStatus, pollInterval);
            }
        };

        checkStatus();
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Start a New Scan</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Domain to scan"
                    variant="outlined"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleStartScan} disabled={loading || !domain.trim()} variant="contained">
                    {loading ? <CircularProgress size={20} /> : 'Scan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StartScanDialog;
