import React, { useState } from 'react';
import { 
  Container, Paper, Title, Text, TextInput, Button, 
  Stack, Group, Divider, Avatar, Box, PasswordInput,
  ThemeIcon, Badge, SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { User, Lock, Mail, Phone, Check, AlertCircle, ShieldCheck } from 'tabler-icons-react';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';

const ProfilePage = () => {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

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
    try {
      const response = await api.put('/users/profile', values);
      setAuth(response.data.data, useAuthStore.getState().token);
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
        icon: <Check size={16} />,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update profile',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await api.put('/users/profile/password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      notifications.show({
        title: 'Success',
        message: 'Password changed successfully',
        color: 'green',
        icon: <Check size={16} />,
      });
      passwordForm.reset();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to change password',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Box>
          <Title order={2} fw={900}>Account Settings</Title>
          <Text c="dimmed" size="sm">Manage your personal information and security preferences</Text>
        </Box>

        <Paper withBorder p="xl" radius="lg" shadow="sm">
          <Group mb="xl" gap="xl">
            <Avatar size={100} radius={100} bg="orange.1" color="orange" variant="light">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Title order={3} fw={800}>{user?.name}</Title>
              <Text size="md" c="dimmed" fw={500}>{user?.role?.replace('_', ' ')}</Text>
              <Badge mt="xs" color="orange" variant="light">Verified Account</Badge>
            </Box>
          </Group>

          <Divider mb="xl" />

          <form onSubmit={profileForm.onSubmit(handleUpdateProfile)}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue" radius="md">
                  <User size={18} />
                </ThemeIcon>
                <Title order={4}>Profile Information</Title>
              </Group>
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  leftSection={<User size={16} />}
                  {...profileForm.getInputProps('name')}
                  radius="md"
                />
                <TextInput
                  label="Email Address"
                  placeholder="john@example.com"
                  required
                  leftSection={<Mail size={16} />}
                  {...profileForm.getInputProps('email')}
                  radius="md"
                />
              </SimpleGrid>
              
              <TextInput
                label="Phone Number"
                placeholder="9876543210"
                required
                leftSection={<Phone size={16} />}
                {...profileForm.getInputProps('phone')}
                radius="md"
              />
              
              <Button 
                type="submit" 
                bg="premium-orange"
                loading={loading} 
                size="md"
                radius="md"
                style={{ alignSelf: 'flex-start' }}
              >
                Update Profile
              </Button>
            </Stack>
          </form>
        </Paper>

        <Paper withBorder p="xl" radius="lg" shadow="sm">
          <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="red" radius="md">
                  <ShieldCheck size={18} />
                </ThemeIcon>
                <Title order={4}>Security & Password</Title>
              </Group>
              
              <PasswordInput
                label="Current Password"
                placeholder="••••••••"
                required
                leftSection={<Lock size={16} />}
                {...passwordForm.getInputProps('oldPassword')}
                radius="md"
              />
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <PasswordInput
                  label="New Password"
                  placeholder="••••••••"
                  required
                  leftSection={<Lock size={16} />}
                  {...passwordForm.getInputProps('newPassword')}
                  radius="md"
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="••••••••"
                  required
                  leftSection={<Lock size={16} />}
                  {...passwordForm.getInputProps('confirmPassword')}
                  radius="md"
                />
              </SimpleGrid>
              
              <Button 
                type="submit" 
                variant="light" 
                color="orange" 
                loading={loading} 
                size="md"
                radius="md"
                style={{ alignSelf: 'flex-start' }}
              >
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
