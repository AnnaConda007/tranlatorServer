const { Interface } = require("readline");
const axios = require("axios");

interface IData {
  translations: [{ text: string; detectedLanguageCode: string }];
}
interface ITranslatorProps {
  IAM_TOKEN: string;
  folderId: string;
  targetLanguage: string;
  word: string;
}
 

const getIAMToken = async ({ oAuthToken }: { oAuthToken: string }):  Promise< string|void> => { 
  const endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  try {
    const response = await axios.post(endpoint, {
      yandexPassportOauthToken: oAuthToken,
    });
    console.log(response.data.iamToken)
    return response.data.iamToken;
  } catch (error) {
    console.error("Ошибка при обмене OAuth-токена на IAM-токен:", error);
  }
};

 
 
const translator = async ({
  IAM_TOKEN,
  folderId,
  targetLanguage,
  word,
}: ITranslatorProps): Promise<string | void> => {
  const apiUrl =
    "https://translate.api.cloud.yandex.net/translate/v2/translate";
  try {
    const responseAPI = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IAM_TOKEN}`,
      },
      body: JSON.stringify({
        targetLanguageCode: targetLanguage,
        texts: word,
        folderId: folderId,
      }),
    });
    if (!responseAPI.ok) {
      throw new Error(`API responded with HTTP ${responseAPI.status}`);
    }

    const data: IData = await responseAPI.json();
    const translatedWord = data.translations?.[0]?.text || null;
    if (!translatedWord) return;
    return translatedWord;
  } catch (error) {
    console.error("Ошибка при обращении к API Яндекс.Переводчик", error);
  }
};
 
