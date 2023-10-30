# <img src="client/public/world.png" alt="world image" width="20"/> World capitals quiz
An application to test and consolidate your geographical knowledge!
## Getting started
### With Docker:
```bash
./docker_install_and_run.sh
```
### else:
```bash
./install_and_run.sh
```
## Running tests
Run `npm test` either in the client or the server folder.
## Tech stack
- *client*: TypeScript, React and Vite, with JSX and plain CSS, and tested with Vitest + React Testing Library
- *server*: NodeJS, Express, TypeScript and Jest for testing.
## Discussion (*for reviewers*)
The application has an integration test at `client\tests\components\world-quiz\WorldQuiz.test.tsx`, which might be a good place to start, to find out about the application's three main flows:
1. Remote endpoint failure during initial load
2. Remote endpoint failure during capital guess
3. Normal flow: guessing capitals with succesful calls to the remote endpoint

The server-side flow initially consists of retrieving data from the API as part of an `initialise` call to `WorldCapitalsQuiz`, which stores all relevant data in-memory, to be accessed via `getCapital` and `getNextQuestion` throughout the server's runtime. The number of country/capital pairs is indeed only a small constant of 251 entries, which is also why I allowed each `getNextQuestion` call to run a linear search — an approach that we would most definitely want to avoid if we manipulated variable-size data.

I built the server around the following two endpoints (viewable and executable in `requests.rest` if you have the 'Rest Client' extension for Visual Studio Code):
- **GET /v1/questions/random**
- **POST /v1/questions/guess** { "country": string; "capital": string }

On the client side, it's a fairly simple React application, centred around the `WorldQuiz` component, which consists of the country to guess (`QuizQuestion`), the three associated capital options (`QuizOptions`), and the button for moving on to the next question, after choosing an answer (`QuizNextButton`). Added to this is `Modal`, which will display 'Loading...' at the start, or an error message if the server cannot be contacted.
