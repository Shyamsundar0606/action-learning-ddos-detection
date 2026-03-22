'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ProductPerformance from '../components/dashboard/ProductPerformance';

const SamplePage = () => {
  return (
    <PageContainer title="Inspect" description="this is Sample page">
      <DashboardCard title="Inspect Traffic">
        <ProductPerformance />
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
