import express from 'express';
import {getNextQuestion, getCapital} from '../app/WorldCapitalsQuiz';
import type {GuessResponse} from '@common/sharedTypes';

const router = express.Router();

router.get('/v1/questions/random', (req, res) => {
  res.send({...getNextQuestion()});
});

router.post('/v1/questions/guess', (req, res) => {
  const expectedAnswer = getCapital(req.body.country);
  if (expectedAnswer === undefined) {
    res.status(422).send({
      error: {
        code: 'UNRECOGNISED_CAPITAL_COUNTRY',
        message: `The provided capital country '${req.body.country}' is not recognised.`,
        details: {
          field: 'country',
          value: req.body.country,
          suggestion: 'Check the spelling and try again.'
        }
      }
    });
    return;
  }
  const isCorrectGuess = req.body.capital === expectedAnswer;
  const response: GuessResponse = {
    isCorrect: isCorrectGuess,
    ...!isCorrectGuess && {expectedAnswer},
    nextQuestion: getNextQuestion(req.body.country)
  };
  res.send(response);
});

export {router};
