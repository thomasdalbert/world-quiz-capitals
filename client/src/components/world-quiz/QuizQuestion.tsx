import {Country} from '@common/sharedTypes';

export const QuizQuestion: React.FC<{countryName: Country}> = ({countryName}) => {
  return (
    <h1 className="quiz-question">
      {import.meta.env.VITE_QUESTION_TITLE}
      &thinsp;<span className="country">{countryName}</span>?
    </h1>
  );
};
