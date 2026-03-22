'use client';

import React, { useState } from 'react';
import { Typography, TextField, Button, Stack, Box, Alert } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const UserSettingsPage = () => {
  // State for user data (simulated)
  const [username, setUsername] = useState<string>('admin');
  const [email, setEmail] = useState<string>('admin@epita.fr');

  // State for password change
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  // State for messages
  const [usernameMessage, setUsernameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Handlers for updating settings ---

  const handleUpdateUsername = () => {
    setUsernameMessage(null); // Clear previous messages
    if (username.trim() === '') {
      setUsernameMessage({ type: 'error', text: 'Username cannot be empty.' });
      return;
    }
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send this to your backend
      console.log('Updating username to:', username);
      setUsernameMessage({ type: 'success', text: 'Username updated successfully!' });
    }, 500);
  };

  const handleUpdateEmail = () => {
    setEmailMessage(null); // Clear previous messages
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send this to your backend
      console.log('Updating email to:', email);
      setEmailMessage({ type: 'success', text: 'Email updated successfully!' });
    }, 500);
  };

  const handleUpdatePassword = () => {
    setPasswordMessage(null); // Clear previous messages

    if (currentPassword.trim() === '') {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send currentPassword, newPassword to your backend
      console.log('Attempting to change password...');
      // Simulate success or failure based on some condition (e.g., currentPassword validation)
      if (currentPassword === 'correctPassword123') { // Replace with actual backend validation
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: 'Incorrect current password.' });
      }
    }, 500);
  };

  return (
    <PageContainer title="User Settings" description="Manage your user profile settings">
      <DashboardCard title="User Settings">
        <Stack spacing={4}>
          {/* Username Section */}
          <Box>
            <Typography variant="h6" gutterBottom>Change Username</Typography>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateUsername}
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Update Username
            </Button>
            {usernameMessage && (
              <Alert severity={usernameMessage.type} sx={{ mt: 2, borderRadius: 2 }}>
                {usernameMessage.text}
              </Alert>
            )}
          </Box>

          {/* Email Section */}
          <Box>
            <Typography variant="h6" gutterBottom>Change Email</Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateEmail}
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Update Email
            </Button>
            {emailMessage && (
              <Alert severity={emailMessage.type} sx={{ mt: 2, borderRadius: 2 }}>
                {emailMessage.text}
              </Alert>
            )}
          </Box>

          {/* Password Section */}
          <Box>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdatePassword}
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Update Password
            </Button>
            {passwordMessage && (
              <Alert severity={passwordMessage.type} sx={{ mt: 2, borderRadius: 2 }}>
                {passwordMessage.text}
              </Alert>
            )}
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default UserSettingsPage;