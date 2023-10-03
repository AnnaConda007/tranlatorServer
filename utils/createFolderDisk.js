const dotenv = require('dotenv').config();
const axios = require('axios');

const createFolder = async ({ res, userId }) => {
 
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const API_ENDPOINT_CREATE_FOLDER = `https://cloud-api.yandex.net/v1/disk/resources`;
  try {
    await axios.put(API_ENDPOINT_CREATE_FOLDER, null, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: `books/${userId}`,
      }
    });
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { createFolder };