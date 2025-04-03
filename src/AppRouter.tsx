import { HashRouter, Route, Routes } from 'react-router';

import App from './App';
import { PokedexLayout } from './layouts/PokedexLayout';

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PokedexLayout />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
