const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const getIAMToken = async () => {
  const endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  try {
    const response = await axios.post(endpoint, {
      yandexPassportOauthToken: "y0_AgAAAAAm8rfnAATuwQAAAADrbscQxsO9b1M3TImbZqUB1rIytXPfuHQ"
    });
    console.log("response.data.iamToken", response );
  } catch (error) {
    console.error("Ошибка при обмене OAuth-токена на IAM-токен:", error);
  }
};

async function start() {
  await getIAMToken();
  // Добавьте остальной код здесь, который должен выполняться после получения IAM-токена
}

start();
