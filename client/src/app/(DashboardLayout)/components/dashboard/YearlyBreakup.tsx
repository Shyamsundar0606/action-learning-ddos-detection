
import { Stack, Typography, Select, MenuItem } from '@mui/material';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const YearlyBreakup = () => {

  return (
    <DashboardCard title="Mode">
      <Stack direction="column" spacing={1} mt="-20px">
        <Typography variant="subtitle2" color="textSecondary">
          Manage the autonomy of the AI model
        </Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Mode"
          defaultValue={30}
        >
          <MenuItem value={10}>Manual</MenuItem>
          <MenuItem value={20}>Semi-Automatic</MenuItem>
          <MenuItem value={30}>Automatic</MenuItem>
        </Select>
      </Stack>
    </DashboardCard>
  );
};

export default YearlyBreakup;
