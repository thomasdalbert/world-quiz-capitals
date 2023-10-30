import React from 'react';
import ReactDOM from 'react-dom/client';
import WorldCapitalsQuiz from '@components/world-quiz/WorldCapitalsQuiz';

const App = () => {
  return (
    <div>
      <WorldCapitalsQuiz />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
