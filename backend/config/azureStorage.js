const { BlobServiceClient } = require('@azure/storage-blob');

/**
 * Azure Storage Configuration
 * Handles cloud storage container clients initialization
 * @module config/azureStorage
 */

// Configuration Constants
const CONTAINER_NAMES = {
  ENTREPRENEUR_PROFILES: 'entrepreneur-profile-pictures',
  INVESTOR_PROFILES: 'investor-profiles-pictures',
  STARTUP_LOGOS: 'startup-logos'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// Initialize Storage Client
let blobServiceClient;
let entrepreneurContainerClient;
let investorContainerClient;
let startupLogosContainerClient;

try {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('Azure Storage Connection string not found in environment variables');
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  // Initialize container clients
  entrepreneurContainerClient = blobServiceClient.getContainerClient(CONTAINER_NAMES.ENTREPRENEUR_PROFILES);
  investorContainerClient = blobServiceClient.getContainerClient(CONTAINER_NAMES.INVESTOR_PROFILES);
  startupLogosContainerClient = blobServiceClient.getContainerClient(CONTAINER_NAMES.STARTUP_LOGOS);

  // Verify container existence
  const initializeContainers = async () => {
    try {
      await Promise.all([
        entrepreneurContainerClient.createIfNotExists({ access: 'blob' }),
        investorContainerClient.createIfNotExists({ access: 'blob' }),
        startupLogosContainerClient.createIfNotExists({ access: 'blob' })
      ]);
    } catch (error) {
      console.error('Failed to initialize storage containers:', error.message);
      throw error;
    }
  };

  // Initialize containers on startup
  initializeContainers().catch(error => {
    console.error('Storage initialization failed:', error.message);
    process.exit(1);
  });

} catch (error) {
  console.error('Azure Storage Configuration Error:', error.message);
  // Don't exit process, let the application handle the error
}

/**
 * Validate file upload
 * @param {Object} file - File object from multer
 * @returns {Object} Validation result
 */
const validateFileUpload = (file) => {
  if (!file) {
    return { 
      isValid: false, 
      error: 'No file provided' 
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Only JPEG and PNG are allowed' 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: 'File size exceeds 5MB limit' 
    };
  }

  return { isValid: true };
};

module.exports = {
  entrepreneurContainerClient,
  investorContainerClient,
  startupLogosContainerClient,
  validateFileUpload,
  CONTAINER_NAMES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES
};