export type Country = string;
export type Capital = string;

export type Question = {
  toGuess: Country;
  options: [Capital, Capital, Capital];
};

export type GuessResponse = {
  isCorrect: boolean,
  expectedAnswer?: Capital,
  nextQuestion: Question
};
