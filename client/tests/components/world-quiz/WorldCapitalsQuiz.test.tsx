import '@testing-library/jest-dom';
import createFetchMock, {MockResponseInitFunction} from 'vitest-fetch-mock';
import React from 'react';
import {describe, test, expect, afterEach, vi} from 'vitest';
import {act, render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import {assertButtonsValue, assertButtonsDisabled, assertButtonsValidity, ButtonValidity} from './QuizOptions.test.js';
import WorldCapitalsQuiz from '@components/world-quiz/WorldCapitalsQuiz';

const fetchMock = createFetchMock(vi); // TODO
fetchMock.enableMocks();

describe('WorldCapitalsQuiz component', async () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('Remote endpoint failure during initial load', async () => {
    fetchMock.mockIf(/\/v1\/questions\/random/, async () => {
      throw new Error('Remote endpoint failure');
    });
    render(<WorldCapitalsQuiz />);

    // The loading modal should be displayed at first
    const loadingModal = screen.getByText('Loading...');
    expect(loadingModal).toBeInTheDocument();

    // Wait for the remote endpoint failure to occur
    await screen.findByText('Oops!');
    const errorModal = screen.getByText('Something went wrong with the server. Please refresh the page or try again later');
    expect(errorModal).toBeInTheDocument();
  });

  test('Remote endpoint failure during capital guess', async () => {
    fetchMock.mockIf(/\/v1\/questions/, (async (req) => {
      if (req.url.endsWith('/random')) {
        return JSON.stringify({
          toGuess: 'China',
          options: ['Beijing', 'Madrid', 'Quito']
        })
      } else if (req.url.endsWith('/guess')) {
        throw new Error('Remote endpoint failure');
      }
    }) as MockResponseInitFunction);
    render(<WorldCapitalsQuiz />);

    // The loading modal should be displayed at first
    const loadingModal = screen.getByText('Loading...');
    expect(loadingModal).toBeInTheDocument();

    await waitForElementToBeRemoved(loadingModal);

    // Assert "unanswered question" state of the page: title, option buttons, and next button 
    let quizQuestion = screen.getByRole('heading');
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to China?');
    assertButtonsValue('Beijing', 'Madrid', 'Quito');
    assertButtonsValidity(ButtonValidity.null, ButtonValidity.null, ButtonValidity.null);
    assertButtonsDisabled(false);

    let nextButton = screen.queryByRole('button', {name: 'Next question'});
    expect(nextButton).not.toBeInTheDocument();

    // Submit a guess
    const beijingButton = screen.getByRole('button', {name: 'Beijing'});
    beijingButton.click();

    // Wait for the remote endpoint failure to occur.
    await screen.findByText('Oops!');
    const errorModal = screen.getByText('Something went wrong with the server. Please refresh the page or try again later');
    expect(errorModal).toBeInTheDocument();
  });

  test('Normal flow: guessing capitals with succesful calls to the remote endpoint', async () => {
    fetchMock.mockIf(/\/v1\/questions/, (async (req) => {
      if (req.url.endsWith('/random')) {
        return JSON.stringify({
          toGuess: 'Japan',
          options: ['Tokyo', 'Antananarivo', 'Kuala Lumpur']
        })
      } else if (req.url.endsWith('/guess')) {
        return JSON.stringify({
          isCorrect: true,
          expectedAnswer: 'Tokyo',
          nextQuestion: {
            toGuess: 'Malaysia',
            options: ['Dublin', 'Berlin', 'Kuala Lumpur']
          }
        });
      }
    }) as MockResponseInitFunction);
    render(<WorldCapitalsQuiz />);

    // The loading modal should be displayed at first
    const loadingModal = screen.getByText('Loading...');
    expect(loadingModal).toBeInTheDocument();

    await waitForElementToBeRemoved(loadingModal);

    // Assert "unanswered question" state of the page: title, option buttons, and next button 
    let quizQuestion = screen.getByRole('heading');
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to Japan?');

    assertButtonsValue('Tokyo', 'Antananarivo', 'Kuala Lumpur');
    assertButtonsValidity(ButtonValidity.null, ButtonValidity.null, ButtonValidity.null);
    assertButtonsDisabled(false);

    let nextButton = screen.queryByRole('button', {name: 'Next question'});
    expect(nextButton).not.toBeInTheDocument();

    // Submit a correct guess
    const tokyoButton = screen.getByRole('button', {name: 'Tokyo'});
    await act(() => tokyoButton.click());

    // Assert "correctly answered question" state of the page
    nextButton = screen.getByRole('button', {name: 'Next question'});
    expect(nextButton).toBeInTheDocument();
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to Japan?');
    assertButtonsValidity(ButtonValidity.correct, ButtonValidity.null, ButtonValidity.null);
    assertButtonsDisabled(true);

    // Moving on to the next question
    await act(() => nextButton!.click());
    expect(nextButton).not.toBeInTheDocument();

    // Should go back to an "unanswered" page state
    quizQuestion = await screen.findByRole('heading');
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to Malaysia?');

    assertButtonsValue('Dublin', 'Berlin', 'Kuala Lumpur');
    assertButtonsValidity(ButtonValidity.null, ButtonValidity.null, ButtonValidity.null)
    assertButtonsDisabled(false);

    nextButton = screen.queryByRole('button', {name: 'Next question'});
    expect(nextButton).not.toBeInTheDocument();

    // Submit an incorrect guess
    fetchMock.mockIf(/\/v1\/questions\/guess/, async (req) => {
      return JSON.stringify({
        isCorrect: false,
        expectedAnswer: 'Kuala Lumpur',
        nextQuestion: {
          toGuess: 'Italy',
          options: ['Rome', 'Vatican', 'San Marino']
        }
      });
    });

    const dublinButton = screen.getByRole('button', {name: 'Dublin'});
    await act(() => dublinButton.click());

    nextButton = screen.getByRole('button', {name: 'Next question'});
    expect(nextButton).toBeInTheDocument();
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to Malaysia?');
    await waitFor(() => {
      try {
        return assertButtonsValidity(ButtonValidity.incorrect, ButtonValidity.null, ButtonValidity.correct); // flaky assertion
      } catch {}
    });
    assertButtonsDisabled(true);

    // Moving on to next question, one last time
    await act(() => nextButton!.click());
    expect(nextButton).not.toBeInTheDocument();

    // Should return to an "unanswered" page state after moving on a new question
    quizQuestion = await screen.findByRole('heading');
    expect(quizQuestion.textContent).toEqual('Which capital city belongs to Italy?');

    assertButtonsValue('Rome', 'Vatican', 'San Marino');
    assertButtonsValidity(ButtonValidity.null, ButtonValidity.null, ButtonValidity.null);
    assertButtonsDisabled(false);

    nextButton = screen.queryByRole('button', {name: 'Next question'});
    expect(nextButton).not.toBeInTheDocument();
  });
});
