const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const { uploadBook } = require('./utils/uploadBook');
const { getBookText } = require('./utils/getBookText');
const { getBookTitles } = require('./utils/getBookTitles');
const { deleteBook } = require('./utils/deliteBook');
const { sendDoubleAuthenticationCode } = require('./utils/sendDoubleAuthenticationCode');
const { createFolder } = require('./utils/createFolderDisk');
const { translate } = require('./utils/translate');
const { getIAMToken } = require('./utils/getIAMToken');
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.post('/getIAMToken', async (req, res) => {
  await getIAMToken(res)
});

app.post('/translate', async (req, res) => {
  const sourceLanguageCode = req.body.sourceLanguage
  const texts = req.body.word
  const IAM_TOKEN = req.body.IAM_TOKEN
  translate({ res, sourceLanguageCode, texts, IAM_TOKEN })
});

app.post('/sendDoubleAuthenticationCode', async (req, res) => {
  const { recipientMail, textWithCode } = req.body
  await sendDoubleAuthenticationCode({ res, recipientMail, textWithCode })
})

app.post('/getBookTitles', async (req, res) => {
  const { userId } = req.body
  await getBookTitles(res, userId)

})

app.post('/createFolder', async (req, res) => {
  const { userId } = req.body
  await createFolder({ res, userId })

})

app.post('/getBookText', async (req, res) => {
  const { titleBook, userId } = req.body;
  await getBookText({ res, titleBook, userId })
});

app.post('/uploadBook', async (req, res) => {
  const { text, bookTitle, userId } = req.body;
  uploadBook({ res, text, bookTitle, userId })
});


app.post('/deliteBook', async (req, res) => {
  const { bookTitle, userId } = req.body;
  deleteBook({ res, bookTitle, userId })
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


