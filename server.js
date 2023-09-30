const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Используйте миддлвары только один раз и установите лимиты тела запроса сразу
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.post('/getIAMToken', async (req, res) => {
  const endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  try {
    const response = await axios.post(endpoint, {
      yandexPassportOauthToken: process.env.YANDEX_QAUTH_TOKEN__TRANSLATOR,
    });
    const iamToken = response.data.iamToken

    res.json({ iamToken: iamToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Ошибка при обмене OAuth-токена на IAM-токен:", error);
  }
});


app.post('/translate', async (req, res) => {
  const apiUrl = "https://translate.api.cloud.yandex.net/translate/v2/translate";
  const sourceLanguageCode = req.body.sourceLanguage
  const texts = req.body.word
  const IAM_TOKEN = req.body.IAM_TOKEN
  try {
    const responseAPI = await axios.post(apiUrl, {
      sourceLanguageCode: sourceLanguageCode,
      targetLanguageCode: "ru",
      texts: texts,
      folderId: "b1g6r35d5lttlhqid35i",
      IAM_TOKEN: IAM_TOKEN
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${IAM_TOKEN}`,
      },
    });
    if (responseAPI.status !== 200) {
      throw new Error(`API responded with HTTP ${responseAPI.status}`);
    }
    const data = responseAPI.data;
    const translatedWord = data.translations?.[0]?.text || null;
    if (!translatedWord) return;
    res.json({ translatedWord: translatedWord });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Ошибка при обращении к API Яндекс.Переводчик", error);

  }
});



app.post('/sendDoubleAuthenticationCode', async (req, res) => {
  const { senderMail, senderPassword, recipientMail, textWithCode } = req.body
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: senderMail,//'annahrulkova@yandex.ru'
      pass: senderPassword //'fzgciuxqsdferloj'
    }
  });
  const mailOptions = {
    from: senderMail,
    to: recipientMail,
    subject: "Код для подтвержения почты при регистрации",
    text: textWithCode
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error.response });
    } else {
      res.json({ sended: true });
    }
  });
})







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




app.post('/sendDoubleAuthenticationCode', async (req, res) => {
  const { senderMail, senderPassword, recipientMail, textWithCode } = req.body
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: senderMail,//'annahrulkova@yandex.ru'
      pass: senderPassword //'fzgciuxqsdferloj'
    }
  });
  const mailOptions = {
    from: senderMail,
    to: recipientMail,
    subject: "Код для подтвержения почты при регистрации",
    text: textWithCode
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error.response });
    } else {
      res.json({ sended: true });
    }
  });
})




app.post('/getBookTitles', async (req, res) => {
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const FOLDER_PATH = "books";
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
})



app.post('/getBookText', async (req, res) => {
  const { titleBook } = req.body;
  const formattedTitles = `${titleBook}.txt`
  const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;
  const FOLDER_PATH = `disk:/books/${formattedTitles}`
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
    //  console.error("Error", error);
    res.status(500).json({ error: error.message });
  }
});
















app.post('/uploadBook', async (req, res) => {
  try {
    const { text, bookTitle } = req.body;
    const TOKEN = process.env.YANDEX_QAUTH_TOKEN__DISK;

    const API_ENDPOINT_UPLOAD = `https://cloud-api.yandex.net/v1/disk/resources/upload`;
    const getUploadLinkResponse = await axios.get(API_ENDPOINT_UPLOAD, {
      headers: {
        'Authorization': `OAuth ${TOKEN}`
      },
      params: {
        path: `books/${bookTitle}.txt`,
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
});


