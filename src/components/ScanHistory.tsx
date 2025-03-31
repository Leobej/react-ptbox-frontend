import React, { useEffect, useState } from 'react';
import { List, ListItem, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ScanResult } from '../types';

const ScanCard: React.FC<{ scan: ScanResult; openScanResults: (scan: ScanResult) => void }> = ({ scan, openScanResults }) => {
    return (
        <Card sx={{ width: '100%', mb: 2, p: 2, backgroundColor: '#f5f5f5' }}>
            <CardContent>
                <Typography variant="h6" color="primary">{scan.domain}</Typography>
                <Typography>Status: {scan.status}</Typography>
                <Typography variant="body2" color="textSecondary">Started: {scan.startTime}</Typography>
                <Typography variant="body2" color="textSecondary">Ended: {scan.endTime}</Typography>

                {scan.status === 'COMPLETED' ? (
                    <Button size="small" onClick={() => openScanResults(scan)} variant="contained" color="secondary">
                        View Results
                    </Button>
                ) : scan.status === 'RUNNING' ? (
                    <CircularProgress size={20} />
                ) : (
                    <Typography>No Results</Typography>
                )}
            </CardContent>
        </Card>
    );
};

interface ScanHistoryProps {
    scanHistory: ScanResult[];
    openScanResults: (scan: ScanResult) => void;
    setScanHistory: (scans: ScanResult[]) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ scanHistory, openScanResults, setScanHistory }) => {
    const [orderedScanHistory, setOrderedScanHistory] = useState<ScanResult[]>(scanHistory);

    useEffect(() => {
        const savedOrder = localStorage.getItem('scanHistoryOrder');
        if (savedOrder) {
            const orderedIds: string[] = JSON.parse(savedOrder);

            const orderedScans = orderedIds
                .map((id) => scanHistory.find((scan) => scan.id === id))
                .filter((scan): scan is ScanResult => !!scan);

            const missingScans = scanHistory.filter(scan => !orderedIds.includes(scan.id));
            setOrderedScanHistory([...orderedScans, ...missingScans]);
        } else {
            setOrderedScanHistory(scanHistory);
        }
    }, [scanHistory]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedScans = Array.from(orderedScanHistory);
        const [movedItem] = reorderedScans.splice(result.source.index, 1);
        reorderedScans.splice(result.destination.index, 0, movedItem);

        setOrderedScanHistory(reorderedScans);
        localStorage.setItem('scanHistoryOrder', JSON.stringify(reorderedScans.map(scan => scan.id)));
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Scan History
                </Typography>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="scans">
                        {(provided) => (
                            <List ref={provided.innerRef} {...provided.droppableProps}>
                                {orderedScanHistory.map((scan, index) => (
                                    <Draggable key={scan.id} draggableId={scan.id} index={index}>
                                        {(provided) => (
                                            <ListItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <ScanCard scan={scan} openScanResults={openScanResults} />
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>
        </Card>
    );
};

export default ScanHistory;
