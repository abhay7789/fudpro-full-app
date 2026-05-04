import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Button, 
  Stack, Group, Table, Badge, ActionIcon, 
  Modal, TextInput, Select, Avatar, FileInput,
  Box, PasswordInput, ScrollArea, useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { UserPlus, Trash, Check, AlertCircle, Search, Power, Mail, Phone, Lock, BuildingStore, User } from 'tabler-icons-react';
import api from '../../services/api';

const UserManagementPage = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      roleName: 'USER',
      restaurantName: '',
      description: '',
      coverImage: null,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid phone (10 digits)'),
      password: (value) => (value.length < 6 ? 'Password too short' : null),
      restaurantName: (value, values) => (values.roleName === 'VENDOR' && !value ? 'Restaurant name is required for vendor' : null),
    },
  });

  const [editingUser, setEditingUser] = useState(null);
  const [resetPasswordOpened, setResetPasswordOpened] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values) => {
    setLoading(true);
    try {
      await api.post('/admin/users', values);
      notifications.show({
        title: 'Success',
        message: 'User created successfully',
        color: 'green',
        icon: <Check size={16} />,
      });
      setOpened(false);
      form.reset();
      loadUsers();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to create user',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
      notifications.show({
        title: 'Status Updated',
        message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        color: !currentStatus ? 'green' : 'orange',
      });
      loadUsers();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update user status',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: 'Confirm deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
        </Text>
      ),
      labels: { confirm: 'Delete User', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await api.delete(`/admin/users/${id}`);
          notifications.show({
            title: 'Deleted',
            message: 'User deleted successfully',
            color: 'blue',
          });
          loadUsers();
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete user',
            color: 'red',
          });
        }
      },
    });
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      notifications.show({ title: 'Error', message: 'Password must be at least 6 characters', color: 'red' });
      return;
    }
    try {
      // Reusing update endpoint for password reset
      await api.patch(`/admin/users/${editingUser.id}/status`, { password: newPassword });
      notifications.show({ title: 'Success', message: 'Password reset successfully', color: 'green', icon: <Check size={16} /> });
      setResetPasswordOpened(false);
      setNewPassword('');
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to reset password', color: 'red', icon: <AlertCircle size={16} /> });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search)
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2} fw={900}>User Management</Title>
            <Text c="dimmed" size="sm">Manage all system users, vendors, and roles</Text>
          </Box>
          <Button 
            leftSection={<UserPlus size={18} />} 
            bg="premium-orange" 
            radius="md" 
            size="md"
            onClick={() => {
              form.reset();
              setOpened(true);
            }}
          >
            Add New User
          </Button>
        </Group>

        <Paper withBorder p="0" radius="lg" shadow="sm" style={{ overflow: 'hidden' }}>
          <Box p="md">
            <TextInput
              placeholder="Search by name, email, or phone..."
              leftSection={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              radius="md"
            />
          </Box>

          <Table.ScrollContainer minWidth={1000}>
            <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
              <Table.Thead bg={isDark ? 'dark.6' : 'gray.0'}>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Role / Profile</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="orange" radius="xl" size="md">
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={700}>{user.name}</Text>
                          <Text size="xs" c="dimmed">ID: #{user.id.substring(0, 8)}</Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        <Badge 
                          variant="light" 
                          color={user.roleData?.name === 'SUPER_ADMIN' ? 'red' : user.roleData?.name === 'ADMIN' ? 'indigo' : user.roleData?.name === 'VENDOR' ? 'orange' : 'gray'}
                          radius="sm"
                        >
                          {user.roleData?.name || 'USER'}
                        </Badge>
                        {user.vendorProfile && (
                          <Group gap={4}>
                            <BuildingStore size={12} color="#FC8019" />
                            <Text size="xs" fw={700} c="orange">
                              {user.vendorProfile.restaurantName}
                            </Text>
                          </Group>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" mb={4}>
                        <Mail size={12} color="gray" />
                        <Text size="xs" fw={500}>{user.email || 'N/A'}</Text>
                      </Group>
                      <Group gap="xs">
                        <Phone size={12} color="gray" />
                        <Text size="xs" c="dimmed">{user.phone}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={user.isActive ? 'green' : 'gray'} variant="dot" fw={700}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon 
                          variant="light" 
                          color="blue" 
                          size="lg"
                          radius="md"
                          onClick={() => {
                            setEditingUser(user);
                            setResetPasswordOpened(true);
                          }}
                          title="Reset Password"
                        >
                          <Lock size={18} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="light" 
                          color={user.isActive ? 'orange' : 'green'} 
                          size="lg"
                          radius="md"
                          onClick={() => toggleStatus(user.id, user.isActive)}
                          title={user.isActive ? 'Suspend User' : 'Activate User'}
                        >
                          <Power size={18} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="light" 
                          color="red" 
                          size="lg"
                          radius="md"
                          onClick={() => handleDelete(user.id)} 
                          title="Delete User"
                        >
                          <Trash size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </Stack>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Create New User" radius="md">
        <form onSubmit={form.onSubmit(handleCreateUser)}>
          <Stack gap="md">
            <TextInput 
              label="Full Name" 
              placeholder="Jane Doe" 
              required 
              leftSection={<User size={16} />}
              radius="md"
              {...form.getInputProps('name')} 
            />
            <TextInput 
              label="Email Address" 
              placeholder="jane@example.com" 
              leftSection={<Mail size={16} />}
              radius="md"
              {...form.getInputProps('email')} 
            />
            <TextInput 
              label="Phone Number" 
              placeholder="9876543210" 
              required 
              leftSection={<Phone size={16} />}
              radius="md"
              {...form.getInputProps('phone')} 
            />
            <PasswordInput 
              label="Password" 
              placeholder="••••••••" 
              required 
              leftSection={<Lock size={16} />}
              radius="md"
              {...form.getInputProps('password')} 
            />
            <Select 
              label="Role" 
              data={['USER', 'VENDOR', 'ADMIN', 'SUPER_ADMIN']} 
              required 
              radius="md"
              {...form.getInputProps('roleName')} 
            />

            {form.values.roleName === 'VENDOR' && (
              <>
                <TextInput 
                  label="Restaurant Name" 
                  placeholder="The Gourmet Kitchen" 
                  required 
                  {...form.getInputProps('restaurantName')} 
                />
                <TextInput 
                  label="Restaurant Description" 
                  placeholder="Authentic local flavors..." 
                  {...form.getInputProps('description')} 
                />
                <FileInput
                  label="Restaurant Cover Image"
                  placeholder="Upload image"
                  accept="image/*"
                  onChange={async (file) => {
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        form.setFieldValue('coverImage', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </>
            )}

            <Button type="submit" color="orange" fullWidth mt="md" loading={loading}>
              Create User
            </Button>
          </Stack>
        </form>
      </Modal>

      <Modal opened={resetPasswordOpened} onClose={() => setResetPasswordOpened(false)} title="Reset User Password" radius="md">
        <Stack gap="md">
          <Text size="sm">Resetting password for <b>{editingUser?.name}</b></Text>
          <TextInput 
            label="New Password" 
            type="password" 
            placeholder="••••••••" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button color="orange" fullWidth onClick={handleResetPassword}>Reset Password</Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default UserManagementPage;
