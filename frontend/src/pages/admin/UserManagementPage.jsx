import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Button, 
  Stack, Group, Table, Badge, ActionIcon, 
  Modal, TextInput, Select, Switch, Alert, Avatar, FileInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserPlus, Edit, Trash, Check, AlertCircle, Search, Power } from 'tabler-icons-react';
import api from '../../services/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
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
      setMessage('User created successfully');
      setOpened(false);
      form.reset();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
      setMessage(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage('User deleted successfully');
      loadUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      // Reusing update endpoint for password reset
      await api.patch(`/admin/users/${editingUser.id}/status`, { password: newPassword });
      setMessage('Password reset successfully');
      setResetPasswordOpened(false);
      setNewPassword('');
    } catch (err) {
      setError('Failed to reset password');
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
        <Group justify="space-between">
          <div>
            <Title order={2}>User Management</Title>
            <Text c="dimmed">Manage all system users, vendors, and roles</Text>
          </div>
          <Button 
          leftSection={<UserPlus size={18} />} 
          color="orange" 
          radius="md" 
          onClick={() => {
            form.reset();
            setOpened(true);
          }}
        >
          Add New User
        </Button>
        </Group>

        {message && (
          <Alert icon={<Check size={16} />} title="Success" color="green" withCloseButton onClose={() => setMessage(null)} mb="md">
            {message}
          </Alert>
        )}
        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" withCloseButton onClose={() => setError(null)} mb="md">
            {error}
          </Alert>
        )}

        <Paper withBorder p="md" radius="md">
          <TextInput
            placeholder="Search by name, email, or phone..."
            mb="md"
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Role / Profile</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="orange" radius="xl" size="sm">
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="sm" fw={500}>{user.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Badge variant="outline" color={user.roleData?.name === 'SUPER_ADMIN' ? 'red' : 'blue'}>
                        {user.roleData?.name || 'USER'}
                      </Badge>
                      {user.vendorProfile && (
                        <Text size="xs" fw={700} c="orange">
                          {user.vendorProfile.restaurantName}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">{user.email || 'N/A'}</Text>
                    <Text size="xs" c="dimmed">{user.phone}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.isActive ? 'green' : 'gray'} variant="filled">
                      {user.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="light" 
                        color="blue" 
                        onClick={() => {
                          setEditingUser(user);
                          setResetPasswordOpened(true);
                        }}
                        title="Reset Password"
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="light" 
                        color={user.isActive ? 'red' : 'green'} 
                        onClick={() => toggleStatus(user.id, user.isActive)}
                        title={user.isActive ? 'Suspend User' : 'Activate User'}
                      >
                        <Power size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red" onClick={() => handleDelete(user.id)} title="Delete User">
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Create New User" radius="md">
        <form onSubmit={form.onSubmit(handleCreateUser)}>
          <Stack gap="md">
            <TextInput label="Full Name" placeholder="Jane Doe" required {...form.getInputProps('name')} />
            <TextInput label="Email Address" placeholder="jane@example.com" {...form.getInputProps('email')} />
            <TextInput label="Phone Number" placeholder="9876543210" required {...form.getInputProps('phone')} />
            <TextInput label="Password" type="password" placeholder="••••••••" required {...form.getInputProps('password')} />
            <Select 
              label="Role" 
              data={['USER', 'VENDOR', 'ADMIN', 'SUPER_ADMIN']} 
              required 
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
