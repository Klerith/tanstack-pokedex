import { HashRouter, Route, Routes } from 'react-router';

import { PokedexLayout } from './layouts/PokedexLayout';
import { PaginatedPage } from './pages/PaginatedPage';

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PokedexLayout />}>
          <Route path="/" element={<PaginatedPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
