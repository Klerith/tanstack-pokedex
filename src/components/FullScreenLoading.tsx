export const FullScreenLoading = () => {
  return (
    <div className="fixed z-10 top-0 left-0 bg-black w-screen h-screen opacity-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-white"></div>
    </div>
  );
};
