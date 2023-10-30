export const QuizNextButton: React.FC<{
  isCorrectGuess?: boolean;
  loadNextQuestion: () => void;
}> = ({isCorrectGuess, loadNextQuestion}) => {
  return isCorrectGuess === undefined ? null : (
    <button className="quiz-next-button" onClick={loadNextQuestion}>
      {import.meta.env.VITE_NEXT_QUESTION_BUTTON}
    </button>
  );
};
