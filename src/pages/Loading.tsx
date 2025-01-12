const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        flexDirection: "column",
      }}
      className="dark:bg-black bg-white dark:text-white text-black"
    >
      <img src="/images/iglogo.png" alt="" className="h-20"/>
    </div>
  );
};

export default Loading;
