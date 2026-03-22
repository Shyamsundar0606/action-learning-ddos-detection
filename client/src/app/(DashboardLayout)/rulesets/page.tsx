'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import api from '@/service/api';
import SettingsIcon from '@mui/icons-material/Settings';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import toast from 'react-hot-toast';

// Define the structure for a Rule
interface Rule {
  id: string;
  name: string;
  timestamp: string;
  status: 'active' | 'inactive';
  createdBy: string;
  conditionType: string;
  conditionValue: string;
  httpHeader?: string; // Optional for HTTP Headers condition
  action: string;
}

const RulesetPage = () => {
  // State to manage the visibility of the "Add New Rule" modal
  const [open, setOpen] = useState(false);
  // State to store the new rule's name
  const [ruleName, setRuleName] = useState('');
  // State to store the selected rule condition type (e.g., 'HTTP Body', 'Bot Score')
  const [ruleConditionType, setRuleConditionType] = useState('');
  // State to store the value associated with the rule condition (e.g., regex, number, country codes)
  const [ruleConditionValue, setRuleConditionValue] = useState('');
  // State to store the selected HTTP header if 'HTTP Headers' condition is chosen
  const [httpHeader, setHttpHeader] = useState('');
  // State to store the selected action for the rule (e.g., 'Block', 'Forward')
  const [ruleAction, setRuleAction] = useState('');
  const [rulePriority, setPriority] = useState(1)

  // Dummy data for the rules table
  const [rules, setRules] = useState<Rule[]>([]);

  const fetchRulesets = async () => {
    try {
      const { data: req } = await api.get('/api/v1/fetch-rulesets');
      const rulesets = req.rulesets.map( (r: any) => {
        return {
          id: r.simpleId,
          name: r.name,
          timestamp: r.timestamp,
          status: r.status,
          createdBy: 'admin'
        }
      })
      setRules(rulesets);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchRulesets()
  }, [])
  // Handler to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Handler to close the modal and reset form fields
  const handleClose = () => {
    setOpen(false);
    // Reset form fields
    setRuleName('');
    setRuleConditionType('');
    setRuleConditionValue('');
    setHttpHeader('');
    setRuleAction('');
    setPriority(1);
  };

  // Handler to add a new rule to the table
  const handleAddRule = async () => {
    try {
      if (!ruleName || !ruleConditionType || !ruleConditionValue || !ruleAction || !rulePriority) {
        throw new Error('Please fill in all required fields.')
      }
      const newRule: any = {
        simpleId: `AU-${String(rules.length + 1).padStart(4, '0')}`, // Simple ID generation
        name: ruleName,
        timestamp: new Date(),
        status: 'active', // New rules are active by default
        createdBy: 'admin', // Placeholder for current user
        condition: [ { 
          field: ruleConditionType,
          key: httpHeader,
          value: ruleConditionValue,
          filter: 'regex'
        }],
        action: ruleAction,
      };
      handleClose();
      const { data: req } = await api.post('/api/v1/add-rulesets', { newRule });
      if(!req.success)
        throw new Error(req.message);
      toast.success(`Rule #${newRule.simpleId} has been added!`)
      await fetchRulesets();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <PageContainer title="Ruleset Management" description="Manage your security rulesets">
      <DashboardCard
        title="Ruleset Overview"
        // Action button to add a new rule, placed in the DashboardCard's action area
        action={
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Rule
          </Button>
        }
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page allows you to view and manage your security rules.
        </Typography>

        {/* Rules Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="rules table">
            <TableHead>
              <TableRow>
                <TableCell>Rule ID</TableCell>
                <TableCell>Rule Name</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Configure</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.id}</TableCell>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.timestamp}</TableCell>
                  <TableCell>
                    {/* Switch to toggle rule status */}
                    <FormControlLabel
                      control={<Switch checked={rule.status === 'active'} />}
                      label={rule.status === 'active' ? 'Active' : 'Inactive'}
                      // In a real app, this would trigger an update to the rule's status
                    />
                  </TableCell>
                  <TableCell>{rule.createdBy}</TableCell>
                  <TableCell>
                    <IconButton aria-label="configure">
                      <SettingsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>

      {/* Add New Rule Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Rule</DialogTitle>
        <DialogContent>
          {/* Rule Name Input */}
          <TextField
            autoFocus
            margin="dense"
            id="rule-name"
            label="Rule Name"
            type="text"
            fullWidth
            variant="outlined"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Rule Condition Select */}
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="rule-condition-label">Rule Condition</InputLabel>
            <Select
              labelId="rule-condition-label"
              id="rule-condition"
              value={ruleConditionType}
              label="Rule Condition"
              onChange={(e) => {
                setRuleConditionType(e.target.value as string);
                // Reset condition value and HTTP header when condition type changes
                setRuleConditionValue('');
                setHttpHeader('');
              }}
            >
              <MenuItem value="body">HTTP Body</MenuItem>
              <MenuItem value="query">HTTP Query</MenuItem>
              <MenuItem value="header">HTTP Headers</MenuItem>
              <MenuItem value="path">HTTP Path</MenuItem>
              <MenuItem value="httpVersion">HTTP Version</MenuItem>
              <MenuItem value="botscore">Bot Score</MenuItem>
              <MenuItem value="asn">ASN</MenuItem>
              <MenuItem value="country">Country</MenuItem>
              <MenuItem value="fingerprint">Browser Fingerprint</MenuItem>
            </Select>
          </FormControl>

          {/* Conditional Input for HTTP Headers */}
          {ruleConditionType === 'HTTP Headers' && (
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="http-header-label">HTTP Header</InputLabel>
              <Select
                labelId="http-header-label"
                id="http-header"
                value={httpHeader}
                label="HTTP Header"
                onChange={(e) => setHttpHeader(e.target.value as string)}
              >
                <MenuItem value="User-Agent">User-Agent</MenuItem>
                <MenuItem value="Referer">Referer</MenuItem>
                <MenuItem value="Accept-Language">Accept-Language</MenuItem>
                <MenuItem value="Host">Host</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Conditional Input for Rule Condition Value */}
          {ruleConditionType && (
            <TextField
              margin="dense"
              id="condition-value"
              label={
                ruleConditionType === 'Bot Score'
                  ? 'Bot Score (0-100)'
                  : ruleConditionType === 'Country'
                  ? 'Country Codes (e.g., US, GB)'
                  : 'Regex (e.g., .*malicious.*)'
              }
              type={ruleConditionType === 'Bot Score' ? 'number' : 'text'}
              fullWidth
              variant="outlined"
              value={ruleConditionValue}
              onChange={(e) => setRuleConditionValue(e.target.value)}
              inputProps={
                ruleConditionType === 'Bot Score'
                  ? { min: 0, max: 100 }
                  : {}
              }
              sx={{ mb: 2 }}
            />
          )}

          {/* Action Select */}
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="rule-action-label">Action</InputLabel>
            <Select
              labelId="rule-action-label"
              id="rule-action"
              value={ruleAction}
              label="Action"
              onChange={(e) => setRuleAction(e.target.value as string)}
            >
              <MenuItem value="block">Block</MenuItem>
              <MenuItem value="forward">Forward</MenuItem>
              <MenuItem value="js_challenge">JS Challenge</MenuItem>
              <MenuItem value="captcha">Captcha</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="rule-priority"
            label="Priorty"
            type="number"
            fullWidth
            variant="outlined"
            value={rulePriority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddRule} variant="contained">
            Add Rule
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default RulesetPage;
