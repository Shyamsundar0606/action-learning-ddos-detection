import { Stack, Typography, Select, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const MonthlyEarnings = () => {
  return (
    <DashboardCard
      title="Severity"
    >
      <Stack direction="column" spacing={1} mt="-20px">
        <Typography variant="subtitle2" color="textSecondary">
          Manage the aggressiveness of the WAF
        </Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Mode"
          defaultValue={20}
        >
          <MenuItem value={10}>None</MenuItem>
          <MenuItem value={20}>Low</MenuItem>
          <MenuItem value={30}>Medium</MenuItem>
          <MenuItem value={40}>High</MenuItem>
        </Select>
      </Stack>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
