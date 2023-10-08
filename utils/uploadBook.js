const dotenv = require('dotenv').config();
const axios = require('axios');

const uploadBook = async ({ res, text, bookTitle, userId }) => {
  try {
    const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
    const API_ENDPOINT_UPLOAD = `https://cloud-api.yandex.net/v1/disk/resources/upload`;
    const getUploadLinkResponse = await axios.get(API_ENDPOINT_UPLOAD, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: `books/${userId}/${bookTitle}.txt`,
        overwrite: true
      }
    });
    await axios.put(getUploadLinkResponse.data.href, text, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    res.status(200).send('Book uploaded successfully');
  } catch (error) {
    console.error('Error uploading book:', error.response?.data || error.message);
    res.status(500).send('Error uploading book');
  }
}

module.exports = { uploadBook };
