import { Outlet } from 'react-router';

export const PokedexLayout = () => {
  return (
    <div className="min-h-screen bg-[#C5413A]">
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};
