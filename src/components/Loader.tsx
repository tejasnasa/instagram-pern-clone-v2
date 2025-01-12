const Loader= () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        zIndex: 9999,
      }}
      className="dark:bg-black bg-white dark:text-white text-black w-full h-full"
    ><div className="w-[25px] h-[25px] border-[3px] dark:border-white/30 border-black/30 border-t-[3px] dark:border-t-white border-t-black rounded-[50%] animate-spin "/>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
