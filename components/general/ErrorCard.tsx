function ErrorCard() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full dark:text-white font-semibold">
      <div className="flex flex-col h-72  w-1/2 rounded-xl border-2 p-5">
        <span className="text-3xl text-red-500">發生了未知的錯誤!</span>
        <div className="flex flex-col h-full justify-center items-center text-lg space-y-5">
          <span className="text-xl">
            假如此情況持續發生的話，請嘗試進行重新登入的動作
          </span>
        </div>
      </div>
    </div>
  );
}

export default ErrorCard;
