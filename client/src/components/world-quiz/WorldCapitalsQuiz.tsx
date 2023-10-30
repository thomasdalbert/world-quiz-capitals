import '@components/world-quiz/WorldQuiz.css';
import type {Capital, Question, GuessResponse} from '@common/sharedTypes';
import {useState, useEffect} from 'react';
import {Modal} from '@components/world-quiz/Modal.tsx';
import {QuizNextButton} from '@components/world-quiz/QuizNextButton';
import {QuizOptions} from '@components/world-quiz/QuizOptions';
import {QuizQuestion} from '@components/world-quiz/QuizQuestion';

type Guess = {userAnswer: Capital} & GuessResponse;

const WorldCapitalsQuiz: React.FC<{defaultTimeout?: number}> = ({defaultTimeout = 30}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [fetchQuestionFailed, setFetchQuestionFailed] = useState<boolean>(false);

  const loadInitialQuestion = async () => {
    let response: Response;
    try {
      response = await fetch(import.meta.env.VITE_RANDOM_QUESTION_API, {
        headers: {
          'Content-Type': 'application/json',
          'keep-alive': `timeout=${defaultTimeout}`
        }
      });
    } catch {
      setFetchQuestionFailed(true);
      return;
    }

    setCurrentQuestion(await response.json());
  };

  const submitGuess = async (guess: Capital): Promise<void> => {
    let response: Response;
    try {
      response = await fetch(import.meta.env.VITE_GUESS_QUESTION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'keep-alive': `timeout=${defaultTimeout}`
        },
        body: JSON.stringify({
          country: currentQuestion?.toGuess,
          capital: guess,
        }),
      });
    } catch {
      setFetchQuestionFailed(true);
      return;
    }

    const data: GuessResponse = await response.json();
    setGuess({userAnswer: guess, ...data});
  };

  const loadNextQuestion = () => setCurrentQuestion(guess?.nextQuestion ?? null);

  useEffect(() => {
    loadInitialQuestion();
  }, []);

  useEffect(() => {
    setGuess(null);
  }, [currentQuestion]);

  if (fetchQuestionFailed) {
    return <Modal
      title={import.meta.env.VITE_LOADING_ERROR_MODAL_TITLE}
      content={import.meta.env.VITE_LOADING_ERROR_MODAL_CONTENT}
    />
  } else if (currentQuestion === null) {
    return <Modal title={import.meta.env.VITE_LOADING_MODAL_TITLE} />;
  }
  return (
    <div className="quiz-container">
      <QuizQuestion countryName={currentQuestion.toGuess} />
      <QuizOptions capitalOptions={currentQuestion.options} isCorrectGuess={guess?.isCorrect} userAnswer={guess?.userAnswer} expectedAnswer={guess?.expectedAnswer} submitGuess={submitGuess} />
      <QuizNextButton isCorrectGuess={guess?.isCorrect} loadNextQuestion={loadNextQuestion} />
    </div>
  );
};

export default WorldCapitalsQuiz;
