'use client';
import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    Grid, 
    Chip,
    CircularProgress,
    Alert 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import RuleIcon from '@mui/icons-material/Rule';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import toast from 'react-hot-toast';
import api from '@/service/api';

// Define the structure of a single AI decision
interface AiDecision {
    id: number;
    cpuUsage: string;
    memUsage: string;
    overview: string;
    reason: string;
    timestamp: string;
    numberOfRulesMade: number;
    numberofDataAnalysed: number;
}

const SamplePage = () => {
    const [aiData, setAiData] = useState<AiDecision[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAiData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using the mock API here. Replace 'mockApi' with your 'api' object.
            const { data: req }: any = await api.get('/api/v1/fetch-overviews');
            
            if (!req.overviews || req.overviews.length === 0) {
                 setAiData([]);
                 return;
            }

            const overview = req.overviews.map((o: any, i: number): AiDecision => {
                return {
                    id: i,
                    cpuUsage: o.cpuUsage,
                    memUsage: o.memUsage,
                    overview: o.overview,
                    reason: o.reason,
                    timestamp: new Date(o.timestamp).toLocaleString(), // Format timestamp
                    numberOfRulesMade: o.rules.length,
                    numberofDataAnalysed: o.dataAnalysed.length
                };
            });
            setAiData(overview);
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAiData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading AI Decisions...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                 <Alert severity="error" sx={{m: 2}}>
                    Failed to load data: {error}
                </Alert>
            );
        }
        
        if(aiData.length === 0) {
            return (
                <Alert severity="info" sx={{m: 2}}>
                    No AI decisions found.
                </Alert>
            )
        }

        return aiData.map((item) => (
            <Accordion key={item.id} sx={{ mb: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${item.id}-content`}
                    id={`panel${item.id}-header`}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
                            {item.overview}
                        </Typography>
                        <Chip label={item.timestamp} size="small" />
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'action.hover', p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Reason for Action
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {item.reason}
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                        System Metrics at Time of Decision
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>CPU Usage: <strong>{item.cpuUsage}</strong></Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MemoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>Memory Usage: <strong>{item.memUsage}</strong></Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <RuleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>Rules Created: <strong>{item.numberOfRulesMade}</strong></Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DataUsageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>Data Points Analysed: <strong>{item.numberofDataAnalysed}</strong></Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        ));
    };

    return (
        <PageContainer title="Artificial Intelligence Overview" description="A log of all decisions made by the AI system.">
            <DashboardCard title="AI Decision Log">
                <Box>
                    {renderContent()}
                </Box>
            </DashboardCard>
        </PageContainer>
    );
};

export default SamplePage;