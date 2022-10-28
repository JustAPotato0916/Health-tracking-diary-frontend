import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { BiSun, BiMoon } from "react-icons/bi";

function ModeToggle({
  setIsDarkMode,
}: {
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const changeTo = router.locale === "zh-TW" ? "en" : "zh-TW";

  return (
    <div className="absolute top-0 right-0 flex flex-row items-center space-x-2 select-none z-20 dark:text-white">
      <div className="flex flex-row space-x-1 font-semibold text-lg">
        <span
          className={`${
            router.locale == "zh-TW" && "text-slate-400 hover:text-slate-300"
          }`}
          onClick={() => onToggleLanguageClick(changeTo)}
        >
          EN
        </span>
        <span>/</span>
        <span
          className={`${
            router.locale == "en" && "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => onToggleLanguageClick(changeTo)}
        >
          TW
        </span>
      </div>
      <div className="flex flex-row space-x-1">
        <BiSun
          className="h-6 w-6 dark:hover:text-slate-200 dark:text-slate-400"
          onClick={() => {
            setIsDarkMode(false);
          }}
        />
        <span className="text-xl font-extrabold">|</span>
        <BiMoon
          className="h-6 w-6 text-slate-400 hover:text-slate-300 dark:text-white"
          onClick={() => {
            setIsDarkMode(true);
          }}
        />
      </div>
    </div>
  );
}

export default ModeToggle;
