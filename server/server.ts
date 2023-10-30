import 'dotenv/config';
import express from 'express';
import path from 'path';
import * as quiz from './app/WorldCapitalsQuiz';
import {router as questionsRouter} from './routes/questions';

(async function() {
  try {
    await quiz.initialise();
  } catch (e) {
    console.error(e, 'Failed to initialise the application');
    process.exit(1);
  }
})();

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.use(questionsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = Number(process.argv[2] ?? process.env.PORT);
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}…`);
});
server.keepAliveTimeout = 30_000;
