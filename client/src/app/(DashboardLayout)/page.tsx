'use client'
import api from '@/service/api';
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import WorldMap from 'react-svg-worldmap';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [dailyStats, setdailyStats] = useState([]);
  const fetchData = async () => {
    try {
      const { data: req } = await api.get('/api/v1/fetch-map');
      if(!req.success)
        throw new Error(req.message);
      setData(req.requests);
      setdailyStats(req.dailyStats)
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <SalesOverview magicalData={dailyStats} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <YearlyBreakup />
              </Grid>
              <Grid size={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}
          >
            <DashboardCard
              title="Global Distribution of DDoS attacks"
            >
              <Box sx={{ maxWidth: '100%' }}>
                <WorldMap
                  color="red"
                  value-suffix="people"
                  size="responsive"
                  data={data}
                />
              </Box>
            </DashboardCard>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <RecentTransactions />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
