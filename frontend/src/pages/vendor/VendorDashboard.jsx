import React, { useEffect, useState } from 'react';
import { Card, Title, Text, Button, Table, Group, Badge, Modal, TextInput, NumberInput, Select, Switch, Stack, SimpleGrid, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const VendorDashboard = () => {
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ startTime: '', endTime: '' });
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isAvailable: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes, profileRes] = await Promise.all([
        api.get('/vendors/menu'),
        api.get('/vendors/categories'),
        api.get('/vendors/profile')
      ]);
      setMenuItems(menuRes.data.data);
      setCategories(catRes.data.data.map(c => ({ value: String(c.id), label: c.name })));
      setProfile({
        startTime: profileRes.data.data.startTime?.substring(0, 5) || '08:00',
        endTime: profileRes.data.data.endTime?.substring(0, 5) || '22:00'
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/vendors/profile', profile);
      alert('Timing updated successfully');
    } catch (error) {
      console.error('Failed to update timing', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await api.get('/vendors/menu');
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Failed to load menu', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendors/menu', form);
      close();
      loadMenu();
      setForm({ name: '', description: '', price: 0, categoryId: '', isAvailable: true });
    } catch (error) {
      console.error('Failed to add menu item', error);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/vendors/menu/${id}`, { isAvailable: !currentStatus });
      loadMenu();
    } catch (error) {
      console.error('Failed to update availability', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/vendors/menu/${id}`);
      loadMenu();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>{t('vendor_dashboard')}</Title>
        <Button onClick={open}>{t('add_menu_item')}</Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card shadow="sm" padding="lg" withBorder radius="md">
          <Title order={4} mb="md">Operational Hours</Title>
          <Group align="flex-end">
            <TextInput 
              label="Opening Time" 
              type="time" 
              value={profile.startTime} 
              onChange={(e) => setProfile({ ...profile, startTime: e.target.value })} 
            />
            <TextInput 
              label="Closing Time" 
              type="time" 
              value={profile.endTime} 
              onChange={(e) => setProfile({ ...profile, endTime: e.target.value })} 
            />
            <Button variant="light" color="orange" onClick={handleUpdateProfile}>Update Timing</Button>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">Orders will only be visible to customers during these hours.</Text>
        </Card>
        
        <Card shadow="sm" padding="lg" withBorder radius="md">
          <Title order={4} mb="md">Store Status</Title>
          <Group justify="space-between">
            <Box>
              <Text fw={500}>Store Visibility</Text>
              <Text size="xs" c="dimmed">Toggle whether your store is currently visible to customers.</Text>
            </Box>
            <Badge size="xl" color="green" variant="filled">ONLINE</Badge>
          </Group>
        </Card>
      </SimpleGrid>

      <Card shadow="sm" padding="lg" withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Available</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {menuItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.category?.name || '-'}</Table.Td>
                <Table.Td>₹{item.price}</Table.Td>
                <Table.Td>
                  <Badge color={item.isAvailable ? 'green' : 'red'}>
                    {item.isAvailable ? 'Yes' : 'No'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={() => toggleAvailability(item.id, item.isAvailable)}>
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="xs" color="red" variant="light" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {menuItems.length === 0 && <Text p="lg" c="dimmed" style={{ textAlign: 'center' }}>No menu items yet. Add your first item!</Text>}
      </Card>

      <Modal opened={opened} onClose={close} title={t('add_menu_item')}>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            mb="sm"
          />
          <TextInput
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            mb="sm"
          />
          <NumberInput
            label="Price (₹)"
            value={form.price}
            onChange={(val) => setForm({ ...form, price: val })}
            min={0}
            required
            mb="sm"
          />
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(val) => setForm({ ...form, categoryId: val })}
            data={categories}
            required
            mb="sm"
          />
          <Switch
            label="Available"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            mb="md"
          />
          <Button type="submit" fullWidth>{t('save')}</Button>
        </form>
      </Modal>
    </Stack>
  );
};

export default VendorDashboard;