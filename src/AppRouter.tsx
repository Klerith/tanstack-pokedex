import { HashRouter, Navigate, Route, Routes } from 'react-router';

import { PokedexLayout } from './layouts/PokedexLayout';
import { PaginatedPage } from './pages/PaginatedPage';
import { PokemonPage } from './pages/pokemon-page/PokemonPage';

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PokedexLayout />}>
          <Route path="/" element={<PaginatedPage />} />
          <Route path="/pokemons/:nameOrId" element={<PokemonPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
