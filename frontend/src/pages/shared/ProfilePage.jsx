import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, TextInput, Button, 
  Stack, Group, Divider, Avatar, Box, Alert 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { User, Lock, Mail, Phone, Check, AlertCircle } from 'tabler-icons-react';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';

const ProfilePage = () => {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const profileForm = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const passwordForm = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (value !== values.newPassword ? 'Passwords do not match' : null),
    },
  });

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await api.put('/users/profile', values);
      setAuth(response.data.data, useAuthStore.getState().token);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await api.put('/users/profile/password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      setMessage('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={2}>Account Settings</Title>

        {message && (
          <Alert icon={<Check size={16} />} title="Success" color="green" withCloseButton onClose={() => setMessage(null)}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" withCloseButton onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper withBorder p="xl" radius="md">
          <Group mb="xl">
            <Avatar size={80} radius={80} color="orange">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text size="xl" fw={700}>{user?.name}</Text>
              <Text size="sm" c="dimmed">{user?.role?.replace('_', ' ')}</Text>
            </div>
          </Group>

          <Divider mb="xl" />

          <form onSubmit={profileForm.onSubmit(handleUpdateProfile)}>
            <Stack gap="md">
              <Title order={4}>Profile Information</Title>
              <Group grow>
                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  leftSection={<User size={16} />}
                  {...profileForm.getInputProps('name')}
                />
                <TextInput
                  label="Email Address"
                  placeholder="john@example.com"
                  leftSection={<Mail size={16} />}
                  {...profileForm.getInputProps('email')}
                />
              </Group>
              <TextInput
                label="Phone Number"
                placeholder="9876543210"
                leftSection={<Phone size={16} />}
                {...profileForm.getInputProps('phone')}
              />
              <Button type="submit" color="orange" loading={loading} style={{ alignSelf: 'flex-start' }}>
                Update Profile
              </Button>
            </Stack>
          </form>
        </Paper>

        <Paper withBorder p="xl" radius="md">
          <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
            <Stack gap="md">
              <Title order={4}>Change Password</Title>
              <TextInput
                type="password"
                label="Current Password"
                placeholder="••••••••"
                leftSection={<Lock size={16} />}
                {...passwordForm.getInputProps('oldPassword')}
              />
              <Group grow>
                <TextInput
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  leftSection={<Lock size={16} />}
                  {...passwordForm.getInputProps('newPassword')}
                />
                <TextInput
                  type="password"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  leftSection={<Lock size={16} />}
                  {...passwordForm.getInputProps('confirmPassword')}
                />
              </Group>
              <Button type="submit" variant="light" color="orange" loading={loading} style={{ alignSelf: 'flex-start' }}>
                Change Password
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
