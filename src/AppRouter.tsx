import { HashRouter, Route, Routes } from 'react-router';

import App from './App';

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </HashRouter>
  );
};
