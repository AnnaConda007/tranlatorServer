const axios = require('axios');  // Импорт axios
const dotenv = require('dotenv').config();


const translate = async ({ res, IAM_TOKEN, texts, sourceLanguageCode }) => {
  const apiUrl = "https://translate.api.cloud.yandex.net/translate/v2/translate";
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
}

module.exports = { translate };
