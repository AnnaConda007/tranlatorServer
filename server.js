const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());



app.post('/getIAMToken', async (req, res) => {
  const endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  try {
    const response = await axios.post(endpoint, {
      yandexPassportOauthToken: "y0_AgAAAAAm8rfnAATuwQAAAADrbscQxsO9b1M3TImbZqUB1rIytXPfuHQ",
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
  const sourceLanguageCode= req.body.sourceLanguage
  const texts = req.body.word
  const IAM_TOKEN = req.body.IAM_TOKEN
   try {
    const responseAPI = await axios.post(apiUrl, {
      sourceLanguageCode : sourceLanguageCode,
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
 
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});