const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile:path.join(__dirname, '../config/credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file']  
});

const drive = google.drive({ version: 'v3', auth });

const uploadToGoogleDrive = async (file) => {
  const fileMetadata = {
    name: file.originalname,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
  };
  const media = {
   mimeType: file.mimetype,
   body: fs.createReadStream(file.path), 
  };
  
  try{
    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    const fileId = response.data.id;
    await drive.permissions.create({
        fileId,
        requestBody:{
            role: 'reader',
            type: 'anyone'
        }
    });
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    fs.unlinkSync(file.path);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
  }
};

module.exports = {uploadToGoogleDrive};