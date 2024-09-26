import { config as conf } from 'dotenv';
conf();
const config = {
  port: process.env['PORT'] || 4002,
  production: process.env['PRODUCTION'],
  mongoUrl: process.env['MONGO_URL'],
  jwtSecret: process.env['JWT_SECRET'],
};

export default config;
