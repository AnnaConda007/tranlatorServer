const dotenv = require('dotenv').config();
const axios = require('axios');  // Импорт axios


const getIAMToken = async (res) => {
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

}

module.exports = {getIAMToken};
