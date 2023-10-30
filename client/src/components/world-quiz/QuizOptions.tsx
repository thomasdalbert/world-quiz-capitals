import {Capital, Question} from '@common/sharedTypes';

export const QuizOptions: React.FC<{
  capitalOptions: Question['options'];
  isCorrectGuess?: boolean;
  userAnswer?: Capital;
  expectedAnswer?: Capital;
  submitGuess: (guess: Capital) => Promise<void>;
}> = ({capitalOptions, isCorrectGuess, userAnswer, expectedAnswer, submitGuess}) => {
  const optionsDisabled = userAnswer !== undefined;
  return (
    <ul className="quiz-options">
      {capitalOptions.map((capitalOption: Capital, index: number) => (
        <li key={index}>
          <button
            disabled={optionsDisabled}
            className={'quiz-option' +
              (isCorrectGuess && userAnswer === capitalOption ? ' correct' : '') +
              (!isCorrectGuess && expectedAnswer === capitalOption ? ' correct' : '') +
              (!isCorrectGuess && userAnswer === capitalOption ? ' incorrect' : '')
            }
            onClick={() => submitGuess(capitalOption)}
          >
            {capitalOption}
          </button>
        </li>
      ))}
    </ul>
  );
};
