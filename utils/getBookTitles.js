const dotenv = require('dotenv').config();
const axios = require('axios');  // Импорт axios


const getBookTitles = async (res, userId) => {
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const FOLDER_PATH = userId ? `books/${userId}` : "books/general_books/";
  const API_ENDPOINT = 'https://cloud-api.yandex.net/v1/disk/resources';
  try {
    const folderResponse = await axios.get(API_ENDPOINT, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: FOLDER_PATH
      }
    });
    const fileNames = folderResponse.data._embedded.items
    const titles = []
    fileNames.forEach((file) => (titles.push(file.name)))
    const formattedTitles = titles.map((title) => title.split(".txt")[0]);
    res.json({ bookTitles: formattedTitles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getBookTitles };

