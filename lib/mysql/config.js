const config = {
  host: '47.94.102.17',
  port: 3306,
  user: 'root',
  password: 'lxy123',
  database: 'wiki',
  timezone: "Z", // 时间
  connectTimeout: 1000,
  connectionLimit: 10,
  useConnectionPooling: true,
};

module.exports = config;

