import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Button, 
  Stack, Group, Divider, Card, Badge, 
  Modal, TextInput, Select, ActionIcon, SimpleGrid, Box, ThemeIcon, Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { MapPin, Plus, Trash, Edit, Home, BuildingCommunity, Check, AlertCircle } from 'tabler-icons-react';
import api from '../../services/api';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    initialValues: {
      addressLine: '',
      city: '',
      pincode: '',
      type: 'HOME',
    },
    validate: {
      addressLine: (value) => (value.length < 5 ? 'Address must be at least 5 characters' : null),
      city: (value) => (value.length < 2 ? 'City is required' : null),
      pincode: (value) => (/^\d{6}$/.test(value) ? null : 'Invalid pincode (6 digits)'),
    },
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/address');
      setAddresses(response.data.data || []);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      form.setValues({
        addressLine: address.addressLine,
        city: address.city,
        pincode: address.pincode,
        type: address.type,
      });
      setEditingId(address.id);
    } else {
      form.reset();
      setEditingId(null);
    }
    setOpened(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/address/${editingId}`, values);
        notifications.show({ title: 'Success', message: 'Address updated successfully', color: 'green' });
      } else {
        await api.post('/users/address', values);
        notifications.show({ title: 'Success', message: 'Address added successfully', color: 'green' });
      }
      setOpened(false);
      loadAddresses();
    } catch (err) {
      notifications.show({ title: 'Error', message: err.response?.data?.message || 'Failed to save address', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: 'Delete Address',
      children: (
        <Text size="sm">Are you sure you want to delete this address? This action cannot be undone.</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await api.delete(`/users/address/${id}`);
          notifications.show({ title: 'Success', message: 'Address deleted successfully', color: 'blue' });
          loadAddresses();
        } catch (err) {
          notifications.show({ title: 'Error', message: 'Failed to delete address', color: 'red' });
        }
      },
    });
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={2} fw={900}>Manage Addresses</Title>
            <Text c="dimmed" size="sm">Your delivery addresses for easy checkout</Text>
          </Box>
          <Button bg="premium-orange" leftSection={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add New Address
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {addresses.map((address) => (
            <Card key={address.id} withBorder padding="xl" radius="lg" shadow="sm">
              <Group justify="space-between" mb="lg">
                <Badge 
                  variant="light"
                  color={address.type === 'HOME' ? 'blue' : 'teal'} 
                  radius="sm"
                  leftSection={address.type === 'HOME' ? <Home size={14} /> : <BuildingCommunity size={14} />}
                >
                  {address.type}
                </Badge>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue" size="lg" onClick={() => handleOpenModal(address)}>
                    <Edit size={18} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" size="lg" onClick={() => handleDelete(address.id)}>
                    <Trash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
              <Box mb="md">
                <Text fw={900} size="xl">{address.city}</Text>
                <Text size="sm" c="dimmed" fw={500}>{address.addressLine}</Text>
              </Box>
              <Divider my="sm" variant="dashed" />
              <Group justify="space-between">
                <Text size="xs" fw={800} c="dimmed">PINCODE</Text>
                <Text size="sm" fw={800}>{address.pincode}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {addresses.length === 0 && !loading && (
          <Paper withBorder p={80} radius="lg" shadow="sm" style={{ textAlign: 'center' }}>
            <Center mb="md">
              <ThemeIcon size={80} radius={100} color="gray.1" variant="light">
                <MapPin size={40} color="#adb5bd" />
              </ThemeIcon>
            </Center>
            <Title order={3} mb="xs">No addresses found</Title>
            <Text c="dimmed" mb="xl">Add your delivery address to start ordering!</Text>
            <Button variant="outline" color="orange" size="lg" radius="md" onClick={() => handleOpenModal()}>
              Add Your First Address
            </Button>
          </Paper>
        )}
      </Stack>

      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={<Text fw={900} size="lg">{editingId ? "Edit Address" : "Add New Address"}</Text>}
        radius="lg"
        padding="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Address Type"
              data={['HOME', 'OFFICE']}
              radius="md"
              {...form.getInputProps('type')}
            />
            <TextInput
              label="Address Line"
              placeholder="House No, Street, Landmark"
              required
              radius="md"
              {...form.getInputProps('addressLine')}
            />
            <Group grow>
              <TextInput
                label="City"
                placeholder="Mumbai"
                required
                radius="md"
                {...form.getInputProps('city')}
              />
              <TextInput
                label="Pincode"
                placeholder="400001"
                required
                radius="md"
                {...form.getInputProps('pincode')}
              />
            </Group>
            <Button type="submit" bg="premium-orange" fullWidth mt="xl" size="lg" radius="md" loading={loading}>
              {editingId ? 'Update Address' : 'Save Address'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default AddressPage;
