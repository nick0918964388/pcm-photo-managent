export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'ems_dev',
    password: process.env.DB_PASSWORD || 'ems_password',
    name: process.env.DB_NAME || 'ems_db',
  },

  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
    bucket: process.env.MINIO_DEFAULT_BUCKET || 'ems-photos',
  },

  imgproxy: {
    baseUrl: process.env.IMGPROXY_BASE_URL || 'http://localhost:8080',
    key: process.env.IMGPROXY_KEY || '',
    salt: process.env.IMGPROXY_SALT || '',
  },
});
