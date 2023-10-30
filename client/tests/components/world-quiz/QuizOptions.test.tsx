import '@testing-library/jest-dom';
import React from 'react';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {QuizOptions} from '@components/world-quiz/QuizOptions';
import {Question} from '@common/sharedTypes';

const capitalOptions: Question['options'] = ['Rome', 'Riga', 'Luxembourg'];
const submitGuess = vi.fn();

export enum ButtonValidity {'correct', 'incorrect', null}

function getButtons(): HTMLButtonElement[] {
  return screen.getAllByRole<HTMLButtonElement>('button').filter(button => {
    return button.classList.contains('quiz-option');
  });
}

export function assertButtonsValue(...values: Question['options']): void {
  const quizOptionsText = getButtons().map(quizOption => quizOption.textContent);
  expect(quizOptionsText).toEqual(values);
}

export function assertButtonsValidity(...states: [ButtonValidity, ButtonValidity, ButtonValidity]): void {
  const quizOptionButtons = getButtons();
  for (let i = 0; i < states.length; ++i) {
    if (states[i] === ButtonValidity.null) {
      expect(quizOptionButtons[i]).not.toHaveClass(ButtonValidity[0], ButtonValidity[1]);
    } else {
      expect(quizOptionButtons[i]).toHaveClass(ButtonValidity[i]);
      expect(quizOptionButtons[i]).not.toHaveClass(ButtonValidity[i ^ 1]);
    }
  }
}

export function assertButtonsDisabled(disabled = true): void {
  for (const quizOption of getButtons()) {
    expect(quizOption.disabled).toBe(disabled);
  }
}

describe('QuizOptions component', () => {
  beforeEach(() => {
    submitGuess.mockReset();
  });

  it('matches quiz options text to `capitalOptions`', () => {
    render(<QuizOptions
      capitalOptions={capitalOptions}
      isCorrectGuess={null}
      userAnswer={null}
      expectedAnswer={null}
      submitGuess={submitGuess}
    />);

    assertButtonsValue(...capitalOptions);
    expect(submitGuess).not.toHaveBeenCalled();
  });

  it('disables quiz options with non-undefined `userAnswer`', () => {
    render(<QuizOptions
      capitalOptions={capitalOptions}
      userAnswer={''}
      submitGuess={submitGuess}
    />);
    assertButtonsDisabled();
    expect(submitGuess).not.toHaveBeenCalled();
  });

  it('sets the user quiz option to valid on correct guess', () => {
    render(<QuizOptions
      capitalOptions={capitalOptions}
      isCorrectGuess={true}
      userAnswer={'Rome'}
      expectedAnswer={'Rome'}
      submitGuess={submitGuess}
    />);

    assertButtonsValidity(ButtonValidity.correct, ButtonValidity.null, ButtonValidity.null);
    expect(submitGuess).not.toHaveBeenCalled();
  });

  it('sets the user quiz option to invalid and the expected one to valid on incorrect guess', () => {
    render(<QuizOptions
      capitalOptions={capitalOptions}
      isCorrectGuess={false}
      userAnswer={'Riga'}
      expectedAnswer={'Rome'}
      submitGuess={submitGuess}
    />);

    assertButtonsValidity(ButtonValidity.correct, ButtonValidity.incorrect, ButtonValidity.null);
    expect(submitGuess).not.toHaveBeenCalled();
  });

  it('calls #submitGuess on quiz option click', () => {
    render(<QuizOptions
      capitalOptions={capitalOptions}
      submitGuess={submitGuess}
    />);
    const quizOption = screen.getByText('Rome');

    quizOption.click();

    expect(submitGuess).toHaveBeenCalledWith('Rome');
  });
});
