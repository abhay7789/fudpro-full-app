import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Button, 
  Stack, Group, Divider, Card, Badge, 
  Modal, TextInput, Select, ActionIcon, Alert, SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { MapPin, Plus, Trash, Edit, Home, BuildingCommunity, Check, AlertCircle } from 'tabler-icons-react';
import api from '../../services/api';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
      setAddresses(response.data.data);
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
        setMessage('Address updated successfully');
      } else {
        await api.post('/users/address', values);
        setMessage('Address added successfully');
      }
      setOpened(false);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/address/${id}`);
      setMessage('Address deleted successfully');
      loadAddresses();
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>Manage Addresses</Title>
            <Text c="dimmed">Your delivery addresses for easy checkout</Text>
          </div>
          <Button color="orange" onClick={() => handleOpenModal()}>
            Add New Address
          </Button>
        </Group>

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

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {addresses.map((address) => (
            <Card key={address.id} withBorder padding="lg" radius="md">
              <Group justify="space-between" mb="xs">
                <Badge 
                  color={address.type === 'HOME' ? 'blue' : 'teal'} 
                  leftSection={address.type === 'HOME' ? <Home size={14} /> : <BuildingCommunity size={14} />}
                >
                  {address.type}
                </Badge>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => handleOpenModal(address)}>
                    <Edit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => handleDelete(address.id)}>
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <Text fw={700} size="lg">{address.city}</Text>
              <Text size="sm" c="dimmed" mb="md">{address.addressLine}</Text>
              <Text size="xs" fw={700}>PIN: {address.pincode}</Text>
            </Card>
          ))}
        </SimpleGrid>

        {addresses.length === 0 && !loading && (
          <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
            <MapPin size={48} color="#dee2e6" style={{ marginBottom: 15 }} />
            <Text fw={700}>No addresses found</Text>
            <Text size="sm" c="dimmed" mb="xl">You haven't added any delivery addresses yet.</Text>
            <Button variant="outline" color="orange" onClick={() => handleOpenModal()}>
              Add Your First Address
            </Button>
          </Paper>
        )}
      </Stack>

      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={editingId ? "Edit Address" : "Add New Address"}
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Address Type"
              data={['HOME', 'OFFICE']}
              {...form.getInputProps('type')}
            />
            <TextInput
              label="Address Line"
              placeholder="House No, Street, Landmark"
              required
              {...form.getInputProps('addressLine')}
            />
            <Group grow>
              <TextInput
                label="City"
                placeholder="Mumbai"
                required
                {...form.getInputProps('city')}
              />
              <TextInput
                label="Pincode"
                placeholder="400001"
                required
                {...form.getInputProps('pincode')}
              />
            </Group>
            <Button type="submit" color="orange" fullWidth mt="md" loading={loading}>
              {editingId ? 'Update Address' : 'Save Address'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default AddressPage;
