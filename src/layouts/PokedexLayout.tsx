import { Outlet } from 'react-router';

export const PokedexLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600">
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};
