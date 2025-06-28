export const ButtonLoading = () => {
  return (
    <div className="absolute left-0 top-0 w-full h-full cursor-default inset-0 flex items-center justify-center bg-black/30 rounded-md">
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};


export const PageLoading = () => {
  return (
    <div className=" fixed left-0 top-0 bg-[#fff] w-full z-[100] flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-t-transparent border-[#0400ff] rounded-full animate-spin" />
    </div>
  );
};


export const FetchLoading = () => {
  return (
    <div className="absolute left-0 top-0 z-50 w-full h-full bg-[#fff] cursor-default inset-0 flex items-center justify-center rounded-md">
      <div className="w-10 h-10 border-4 border-[#0400ff] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export const HomeFetchLoading = () => {
  return (
    <div className="absolute left-0 top-0 z-50 w-full h-full cursor-default inset-0 flex items-center justify-center bg-transparent rounded-md">
      <div className="w-10 h-10 border-4 border-[#0400ff] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};