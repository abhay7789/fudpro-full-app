import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Modal, TextInput, PasswordInput, Button, 
  Text, Stack, Group, UnstyledButton, Alert,
  Box, Title, useMantineColorScheme
} from '@mantine/core';
import { Phone, Mail, Lock, User, DeviceMobile as Smartphone, AlertCircle } from 'tabler-icons-react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { notifications } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';

const LoginModal = ({ opened, onClose, mode: initialMode = 'login' }) => {
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  useEffect(() => {
    setIsRegister(initialMode === 'register');
  }, [initialMode, opened]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mode, setMode] = useState('PASSWORD'); // PASSWORD or OTP
  const [inputType, setInputType] = useState('phone'); // auto-detected
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      setInputType('email');
    } else {
      setInputType('phone');
    }
  }, [identifier]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Validation check for registration
    if (isRegister) {
      if (phone.length !== 10) {
        setError('Phone number must be exactly 10 digits');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        const payload = {
          name,
          phone,
          email: email || null,
          password
        };
        const response = await api.post('/auth/register', payload);
        const { user, token } = response.data.data;
        
        notifications.show({
          title: 'Registration Successful',
          message: `Welcome to FudPro, ${user.name}!`,
          color: 'green',
          icon: <Check size={16} />,
        });

        setAuth(user, token);
        onClose();
      } else if (mode === 'OTP' && !otpSent) {
        await api.post('/auth/login', { identifier, mode: 'OTP' });
        setOtpSent(true);
      } else {
        const payload = {
          identifier,
          mode,
          ...(mode === 'PASSWORD' ? { password } : { otp })
        };
        const response = await api.post('/auth/login', payload);
        const { user, token } = response.data.data;
        setAuth(user, token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setIsRegister(false);
    setOtpSent(false);
    setError('');
    setIdentifier('');
    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setOtp('');
  };

  return (
    <Modal
      opened={opened}
      onClose={() => { onClose(); resetState(); }}
      size="md"
      radius="lg"
      padding="xl"
      centered
      transitionProps={{ transition: 'pop', duration: 300 }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={null}
    >
      <Box p="md">
        <Title order={2} fw={900} mb={4}>
          {isRegister ? t('create_account') : t('welcome_back')}
        </Title>
        <Text size="sm" c="dimmed" mb="xl">
          {isRegister ? t('register_subtitle') : t('login_subtitle')}
        </Text>

        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" variant="light" mb="xl" radius="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleAuth}>
          <Stack gap="md">
            {isRegister ? (
              <>
                <TextInput
                  label={t('full_name')}
                  placeholder="John Doe"
                  required
                  leftSection={<User size={18} />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  radius="md"
                />
                <TextInput
                  label={t('phone_number')}
                  placeholder="9876543210"
                  required
                  leftSection={<Phone size={18} />}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                  }}
                  error={phone && phone.length !== 10 ? 'Must be 10 digits' : null}
                  radius="md"
                />
                <TextInput
                  label={t('email_optional')}
                  placeholder="john@example.com"
                  leftSection={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  radius="md"
                />
              </>
            ) : (
              <TextInput
                label={t('email_or_phone')}
                placeholder="Email or phone number"
                required
                leftSection={inputType === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                radius="md"
              />
            )}

            {(mode === 'PASSWORD' || isRegister) ? (
              <PasswordInput
                label={t('password')}
                placeholder="Your secure password"
                required
                leftSection={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                radius="md"
              />
            ) : otpSent ? (
              <TextInput
                label={t('enter_otp')}
                placeholder="6-digit OTP"
                required
                leftSection={<Smartphone size={18} />}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                radius="md"
              />
            ) : null}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              radius="md" 
              loading={loading}
              mt="md"
              color="orange"
            >
              {isRegister ? t('register') : (mode === 'OTP' && !otpSent ? t('send_otp') : t('login'))}
            </Button>
          </Stack>
        </form>

        <Stack align="center" mt="xl" gap="sm">
          {!isRegister && (
            <UnstyledButton 
              onClick={() => { setMode(mode === 'PASSWORD' ? 'OTP' : 'PASSWORD'); setOtpSent(false); }}
            >
              <Text size="sm" fw={700} c="premium-orange">
                {mode === 'PASSWORD' ? t('login_with_otp') : t('login_with_password')}
              </Text>
            </UnstyledButton>
          )}
          
          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {isRegister ? t('already_have_account') : t('dont_have_account')}
            </Text>
            <UnstyledButton onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              <Text size="sm" fw={700} c="premium-orange">
                {isRegister ? t('login') : t('create_account')}
              </Text>
            </UnstyledButton>
          </Group>

          {isRegister && (
            <Text size="xs" c="dimmed" ta="center" mt="md" px="xl">
              {t('vendor_onboarding_note')}
            </Text>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default LoginModal;
