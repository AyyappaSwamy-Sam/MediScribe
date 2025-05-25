const Dropbox = require('dropbox').Dropbox;
const config = require('../config/Config');

const dropboxClient = new Dropbox({ accessToken: config.dropboxAccessToken });

exports.uploadToDropbox = async (req, res) => {
  try {
    const file = req.file;
    
    const fileName = 'new-doctor';
    const filePath = `${config.dropboxFolderPath}/${fileName}`;

    await dropboxClient.filesUpload({ path: filePath, contents: file.buffer });

    const fileUrl = `https://www.dropbox.com/s${filePath}?dl=0`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading to Dropbox:', error);
    res.status(500).json({ error: 'Error uploading file to Dropbox' });
  }
};

