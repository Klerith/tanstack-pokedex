import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { PokedexApp } from './PokedexApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <AppRouter /> */}
    <PokedexApp />
  </StrictMode>
);
