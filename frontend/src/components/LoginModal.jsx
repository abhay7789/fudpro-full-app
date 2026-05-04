import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { X, Phone, Mail, Lock, DeviceMobile as Smartphone } from 'tabler-icons-react';

const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
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

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      setInputType('email');
    } else {
      setInputType('phone');
    }
  }, [identifier]);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-2 dark:text-white">{isRegister ? t('create_account') : t('welcome_back')}</h2>
        <p className="text-gray-500 mb-8 dark:text-gray-400">{isRegister ? t('register_subtitle') : t('login_subtitle')}</p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister ? (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Smartphone size={18} />
                </div>
                <input
                  type="text"
                  placeholder={t('full_name')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  placeholder={t('phone_number')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder={t('email_optional')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {inputType === 'email' ? <Mail size={18} /> : <Phone size={18} />}
              </div>
              <input
                type="text"
                placeholder={t('email_or_phone')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          )}

          {(mode === 'PASSWORD' || isRegister) ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder={t('password')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          ) : otpSent ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Smartphone size={18} />
              </div>
              <input
                type="text"
                placeholder={t('enter_otp')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-premium-orange outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          ) : null}

          <button type="submit" className="w-full bg-premium-orange text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
            {isRegister ? t('register') : (mode === 'OTP' && !otpSent ? t('send_otp') : t('login'))}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-2">
          {!isRegister && (
            <button 
              onClick={() => { setMode(mode === 'PASSWORD' ? 'OTP' : 'PASSWORD'); setOtpSent(false); }}
              className="text-sm font-semibold text-premium-orange hover:underline"
            >
              {mode === 'PASSWORD' ? t('login_with_otp') : t('login_with_password')}
            </button>
          )}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-premium-orange"
          >
            {isRegister ? t('already_have_account') : t('dont_have_account')}
          </button>
          {isRegister && (
            <p className="text-xs text-gray-400 mt-4 text-center px-4">
              {t('vendor_onboarding_note')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
