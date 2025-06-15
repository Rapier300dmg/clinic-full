const { Storage } = require('@google-cloud/storage');
const path = require('path');

const keyPath = path.join(__dirname, '../../your-service-account-key.json');

const storage = new Storage({
  keyFilename: keyPath,
});

const bucketName = 'your-bucket-name'; 

class GoogleCloudStorageService {
  async uploadFile(file, folder = 'uploads') {
    const destination = `${folder}/${Date.now()}_${file.originalname}`;
    await storage.bucket(bucketName).upload(file.path, {
      destination,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  }
}

module.exports = new GoogleCloudStorageService();
