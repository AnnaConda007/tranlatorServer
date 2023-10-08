const axios = require('axios');  // Импорт axios
const dotenv = require('dotenv').config();

const getBookText = async ({ res, titleBook, userId }) => {
  const formattedTitles = `${titleBook}.txt`
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const FOLDER_PATH = userId ? `disk:/books/${userId}/${formattedTitles}` : `books/general_books/${formattedTitles}`


    ;
  const API_ENDPOINT = 'https://cloud-api.yandex.net/v1/disk/resources/download';
  try {
    const downloadLinkResponse = await axios.get(API_ENDPOINT, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: FOLDER_PATH
      }
    });
    if (!(downloadLinkResponse.data && downloadLinkResponse.data.href)) { res.status(404).json({ error: 'File not found or no download link provided' }) }
    const fileResponse = await axios.get(downloadLinkResponse.data.href, {
      responseType: 'text'
    });
    res.json({
      content: fileResponse.data
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getBookText };
