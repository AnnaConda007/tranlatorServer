const axios = require('axios');
const dotenv = require('dotenv').config();

const deleteBook = async ({ res, bookTitle, userId }) => {
  try {
    const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;

    const API_ENDPOINT_DELETE = `https://cloud-api.yandex.net/v1/disk/resources`;

    await axios.delete(API_ENDPOINT_DELETE, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: `books/${userId}/${bookTitle}.txt`,
        permanently: true
      }
    });
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    console.error('Error deleting book:', error.response?.data || error.message);
    res.status(500).send('Error deleting book');
  }
}

module.exports = { deleteBook };


