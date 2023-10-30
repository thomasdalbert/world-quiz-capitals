type Quiz = typeof import('../../app/WorldCapitalsQuiz.ts');

describe('WorldCapitalQuiz', () => {
  let quiz: Quiz;

  beforeEach(() => {
    quiz = require('../../app/WorldCapitalsQuiz.ts');
  });

  afterEach(() => {
    jest.resetModules();
  });

  function mock_endpoint(data = {
    error: false,
    msg: 'countries and capitals retrieved',
    data: [{
      name: 'Afghanistan',
      capital: 'Kabul',
      iso2: 'AF',
      iso3: 'AFG'
    }, {
      name: 'Lithuania',
      capital: 'Vilnius',
      iso2: 'LT',
      iso3: 'LTU'
    }, {
      name: 'Croatia',
      capital: 'Zagreb',
      iso2: 'HR',
      iso3: 'HRV'
    }]
  }) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data)
      }),
    ) as jest.Mock;
  }

  it('rejects during initialisation when the remote endpoint returns an unexpected number of countries', async () => {
    mock_endpoint();
    await expect(async () => {
      await quiz.initialise(7);
    }).rejects.toEqual('The remote endpoint returned 3 countries instead of the 7 expected.');
  });

  it('returns the correct capital for a given country', async () => {
    mock_endpoint();
    await quiz.initialise(3);

    expect(quiz.getCapital('Afghanistan')).toBe('Kabul');
    expect(quiz.getCapital('Lithuania')).toBe('Vilnius');
    expect(quiz.getCapital('Croatia')).toBe('Zagreb');
    expect(quiz.getCapital('Bulgaria')).toBe(undefined);
  });

  it('returns a random question', async () => {
    mock_endpoint();
    await quiz.initialise(3);

    const nextQuestion = quiz.getNextQuestion();

    expect(nextQuestion.options.toSorted()).toEqual(['Kabul', 'Vilnius', 'Zagreb']);
    expect(['Afghanistan', 'Lithuania', 'Croatia']).toContain(nextQuestion.toGuess);
  });

  it('returns a random question whose country is different than the previous one', async () => {
    mock_endpoint({
      error: false,
      msg: 'countries and capitals retrieved',
      data: [{
        name: 'Afghanistan',
        capital: 'Kabul',
        iso2: 'AF',
        iso3: 'AFG'
      }, {
        name: 'Lithuania',
        capital: 'Vilnius',
        iso2: 'LT',
        iso3: 'LTU'
      }, {
        name: 'Croatia',
        capital: 'Zagreb',
        iso2: 'HR',
        iso3: 'HRV'
      }, {
        name: 'Brazil',
        capital: 'Brasilia',
        iso2: 'BR',
        iso3: 'BRA'
      }]
    });
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.1356980753242849);
    await quiz.initialise(4);

    const nextQuestion = quiz.getNextQuestion('Afghanistan');

    expect(nextQuestion.toGuess).not.toEqual(['Afghanistan']);
    expect(['Lithuania', 'Croatia', 'Brazil']).toContain(nextQuestion.toGuess);
  });
});
