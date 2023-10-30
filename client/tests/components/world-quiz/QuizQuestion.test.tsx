import '@testing-library/jest-dom';
import React from 'react';
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {QuizQuestion} from '@components/world-quiz/QuizQuestion';

describe('QuizQuestion component', () => {
  it('renders the question title and country name', () => {
    render(<QuizQuestion countryName={'United Kingdom'} />);
    const quizQuestionEl = screen.getByRole('heading');
    expect(quizQuestionEl.textContent).toEqual('Which capital city belongs to United Kingdom?');
  });
});
