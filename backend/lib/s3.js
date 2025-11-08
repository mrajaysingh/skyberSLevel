const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

let s3Client;

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.REGION || process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

async function uploadBufferToS3({ bucket, key, buffer, contentType }) {
  const client = getS3Client();
  const params = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
  };
  // Only set ACL if explicitly enabled (some buckets disallow ACLs)
  if (process.env.S3_USE_ACL === 'true') {
    params.ACL = 'public-read';
  }
  const cmd = new PutObjectCommand(params);
  await client.send(cmd);
  const region = process.env.REGION || 'ap-south-1';
  // Use path-style URL to avoid SSL CN issues with buckets containing dots
  return `https://s3.${region}.amazonaws.com/${bucket}/${key}`;
}

module.exports = { getS3Client, uploadBufferToS3 };

async function deleteObjectFromS3({ bucket, key }) {
  const client = getS3Client();
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await client.send(cmd);
}

module.exports.deleteObjectFromS3 = deleteObjectFromS3;

async function getObjectAsBase64({ bucket, key }) {
  const client = getS3Client();
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const resp = await client.send(cmd);
  const stream = resp.Body; // Node.js Readable stream
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString('base64');
}

module.exports.getObjectAsBase64 = getObjectAsBase64;

