import '@testing-library/jest-dom';
import React from 'react';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {QuizNextButton} from '@components/world-quiz/QuizNextButton';

describe('QuizNextButton component', () => {
  const loadNextQuestion = vi.fn();

  beforeEach(() => {
    loadNextQuestion.mockReset();
  });

  it('renders the next question button with non-undefined guess', () => {
    render(<QuizNextButton isCorrectGuess={true} loadNextQuestion={loadNextQuestion} />);

    const nextQuestionButton = screen.getByText('Next question');

    expect(nextQuestionButton).toBeInTheDocument();
    expect(loadNextQuestion).not.toHaveBeenCalled;
  });

  it('does not render the next question button with undefined guess', () => {
    render(<QuizNextButton loadNextQuestion={loadNextQuestion} />);

    const nextQuestionButton = screen.queryByText('Next question');

    expect(nextQuestionButton).toBeNull();
    expect(loadNextQuestion).not.toHaveBeenCalled;
  });

  it('calls #loadNextQuestion on next question button click', () => {
    render(<QuizNextButton isCorrectGuess={true} loadNextQuestion={loadNextQuestion} />);

    const nextQuestionButton = screen.getByText('Next question');
    nextQuestionButton.click();

    expect(loadNextQuestion).toHaveBeenCalledOnce();
  });
});
