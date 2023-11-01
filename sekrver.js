const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

const getIAMToken = async () => {
  const endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  try {
    const response = await axios.post(endpoint, {
      yandexPassportOauthToken:
        "y0_AgAAAAAm8rfnAATuwQAAAADrbscQxsO9b1M3TImbZqUB1rIytXPfuHQ",
    });
    return response.data.iamToken;
  } catch (error) {
    console.error("Ошибка при обмене OAuth-токена на IAM-токен:", error);
  }
};

const translator = async (props) => {
  const apiUrl =
    "https://translate.api.cloud.yandex.net/translate/v2/translate";
  console.log(props.IAM_TOKEN);
  try {
    const responseAPI = await axios.post(apiUrl, {
      targetLanguageCode: props.targetLanguage,
      texts: [props.word],
      folderId: props.folderId,
      iamToken: props.IAM_TOKEN, // Передаем IAM токен как параметр запроса
    });

    const data = responseAPI.data;
    console.log(data.translations?.[0]?.text);
    return data.translations;
  } catch (error) {
    //console.error("Ошибка при обращении к API Яндекс.Переводчик", error);
  }
};

app.post("/getIAMToken", async (req, res) => {
  try {
    const IAM_TOKEN = await getIAMToken();
    res.json({ iamToken: IAM_TOKEN });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/translate", async (req, res) => {
  try {
    const translatedWord = await translator(req.body);
    res.json({ translatedWord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
