const Minio = require('minio');
const dotenv = require('dotenv');

dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// bucket check 
const bucketName = process.env.MINIO_BUCKET_NAME || 'posts';

async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
  }
}

ensureBucketExists();

module.exports = minioClient;

