import type {Country, Capital, Question} from '@common/sharedTypes';

type CountryCapitalPair = {
  country: Country;
  capital: Capital;
};

let countriesCapitals: CountryCapitalPair[] = [];

/**
 * Must be called first, prior to any other function. Initialises the quiz by populating country-capital
 * pairs via our third-party API endpoint.
 * @returns Promise that rejects if the remote call fails or returns unexpected data, and resolves if
 * the initialisation succeeds.
 */
function initialise(expectedCountriesNumber = 251): Promise<void> {
  return new Promise((resolve, reject) => {
    if (countriesCapitals.length) {
      reject('Quiz already initialised');
      return;
    }
    fetch(process.env.WORLD_COUNTRIES_AND_CAPITALS_ENDPOINT, {headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          reject(data.msg);
          return;
        } else if (data.data.length !== expectedCountriesNumber) {
          reject(`The remote endpoint returned ${data.data.length} countries instead of the ${expectedCountriesNumber} expected.`);
          return;
        }
        data.data.forEach((element: {name: Country; capital: Capital; iso2?: string; iso3?: string}, index: number) => {
          data.data[index].country = element.name;
          delete data.data[index].name;
          delete element.iso2;
          delete element.iso3
        });
        countriesCapitals = data.data;
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * @warn runs forever if the remote endpoint ever returned <= 3 countries and `previousCountry` is
 * supplied — which this function assumes can never happen.
 * @param previousCountry previously asked country, to avoid asking it twice in a row
 * @returns question for a new random country, that's different from `previousCountry` if supplied.
 */
function getNextQuestion(previousCountry?: Country): Question {
  let newCountryCapitalPair: CountryCapitalPair;
  do {
    newCountryCapitalPair = countriesCapitals[getRandomIndex()];
  } while (newCountryCapitalPair.country === previousCountry);

  const capitalOptions = new Set<Capital>([newCountryCapitalPair.capital]);
  while (capitalOptions.size < 3) {
    const randomCountryCapitalPair = countriesCapitals[getRandomIndex()];
    if (![previousCountry, newCountryCapitalPair.country].includes(randomCountryCapitalPair.country)) {
      capitalOptions.add(randomCountryCapitalPair.capital);
    }
  }
  return {
    toGuess: newCountryCapitalPair.country,
    // @ts-ignore TS2322: Type 'string[]' is not assignable to type '[string, string, string]'
    // Using this workaround as capitalOptions size is bound to be 3 at this point
    options: Array.from(capitalOptions)
  };
}

function getRandomIndex(): number {
  return Math.floor(Math.random() * countriesCapitals.length);
}

function getCapital(country: Country): Capital | undefined {
  return countriesCapitals.find(({country: name}) => name === country)?.capital;
}

export {initialise, getNextQuestion, getCapital};
