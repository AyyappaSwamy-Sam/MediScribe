require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CLIENT_URL:process.env.CLIENT_URL,
  dropboxAccessToken: process.env.DROPBOX_ACCESS_TOKEN,
  dropboxFolderPath: process.env.DROPBOX_FOLDER_PATH || '/doctor-photos'
  // NODE_ENV: process.env.NODE_ENV || 'development',
  // API_KEY: process.env.API_KEY,
  // MAX_AGE: 60 * 60 * 24 * 30, // 30 days
};

