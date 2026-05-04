const dotenv = require('dotenv');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

dotenv.config({ path: envPath });

module.exports = {
  port: process.env.PORT || 8090,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'postgres',
    schema: process.env.DB_SCHEMA || 'public',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  email: {
    enableOtp: process.env.ENABLE_EMAIL_OTP === 'true',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    defaultOtp: process.env.DEFAULT_OTP || '1133',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
};
