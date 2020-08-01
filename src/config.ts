import dotenv from 'dotenv';

dotenv.config();

const { HOST, PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRY, IS_PROD } = process.env;

const config = {
  host: HOST || '0.0.0.0',
  port: Number(PORT) || 4000,
  db: {
    username: DB_USERNAME || 'sih-backend',
    password: DB_PASSWORD || '7uY7u5JAeP1jIbMt',
    dbName: DB_NAME || 'primal-6-db',
  },
  JWTSecret: JWT_SECRET || 'thisIsABackendServiceForPrimal6App',
  JWTExpiry: JWT_EXPIRY || '30d',
  frontendOrigins: [/localhost/, /127\.0\.0\.1/, /0\.0\.0\.0/],
  isProd: IS_PROD || false,
};

export default config;
