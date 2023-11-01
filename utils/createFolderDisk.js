const dotenv = require('dotenv').config();
const axios = require('axios');

const createFolder = async ({ res, userId }) => {
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const API_ENDPOINT_CREATE_FOLDER = `https://cloud-api.yandex.net/v1/disk/resources`;
  const API_ENDPOINT_COPY_FILE = `https://cloud-api.yandex.net/v1/disk/resources/copy`;

  try {
    // создание папки
    await axios.put(API_ENDPOINT_CREATE_FOLDER, null, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: `books/${userId}`,
      }
    });

    // копирование файла
    const from = 'general_books/Harry Potter and the Philosopher\'s Stone.txt';
    const to = 'Harry Potter and the Philosopher\'s Stone.txt';
    await axios.post(API_ENDPOINT_COPY_FILE, null, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        from: `books/${from}`,
        path: `books/${userId}/${to}`,
      }
    });

    res.status(200).send('Folder created and file copied successfully');
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { createFolder };
