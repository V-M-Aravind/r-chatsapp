const LoaderScreen = () => {
  return (
    <div className="w-full h-full flex justify-center items-center opacity-70 absolute top-0 left-0 z-30">
      <div
        className={`inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoaderScreen;
