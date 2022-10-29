import Image from "next/image";
import Link from "next/link";
import {
  BiHomeAlt,
  BiClipboard,
  BiBookContent,
  BiBarChartSquare,
  BiUser,
  BiLogOut,
} from "react-icons/bi";
import useAuth from "../../src/hooks/useAuth";
import MobileMenu from "./MobileMenu";

function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="select-none lg:col-span-2 lg:col-start-1 lg:pl-8 lg:py-8 dark:bg-[#202124]">
      <div className="h-full border-b-2 dark:text-white p-4 dark:border-white lg:rounded-3xl lg:border-4">
        <div>
          <MobileMenu />
        </div>
        <div className="hidden lg:flex lg:flex-col justify-between h-full">
          <div>
            <div className="flex items-center pl-2.5 mb-4 pb-2 border-b-2">
              <Image
                src="/images/icon.png"
                className="mr-3"
                width={32}
                height={32}
                alt=""
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap hidden xl:inline">
                健康追蹤日記
              </span>
            </div>
            <ul className="space-y-4 dark:text-white">
              <li>
                <Link href={"/"}>
                  <div className="flex items-center p-2 text-xl font-normal rounded-lg text-[##3c4043] bg-[#f8f9fa] hover:shadow-lg border-2 border-[#f8f9fa] dark:border-[#303134] hover:dark:border-[#5f6368]  dark:bg-[#303134]">
                    <BiHomeAlt className="w-6 h-6" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      首頁 Home
                    </span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href={"/target"}>
                  <div className="flex items-center p-2 text-xl font-normal rounded-lg text-[##3c4043] bg-[#f8f9fa] hover:shadow-lg border-2 border-[#f8f9fa] dark:border-[#303134] hover:dark:border-[#5f6368]  dark:bg-[#303134]">
                    <BiClipboard className="w-6 h-6" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      目標 Target
                    </span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href={"/diary"}>
                  <div className="flex items-center p-2 text-xl font-normal rounded-lg text-[##3c4043] bg-[#f8f9fa] hover:shadow-lg border-2 border-[#f8f9fa] dark:border-[#303134] hover:dark:border-[#5f6368]  dark:bg-[#303134]">
                    <BiBookContent className="w-6 h-6" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      日記 Diary
                    </span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href={"/analytic"}>
                  <div className="flex items-center p-2 text-xl font-normal rounded-lg text-[##3c4043] bg-[#f8f9fa] hover:shadow-lg border-2 border-[#f8f9fa] dark:border-[#303134] hover:dark:border-[#5f6368]  dark:bg-[#303134]">
                    <BiBarChartSquare className="w-6 h-6" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Google Fit
                    </span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href={"/user"}>
                  <div className="flex items-center p-2 text-xl font-normal rounded-lg text-[##3c4043] bg-[#f8f9fa] hover:shadow-lg border-2 border-[#f8f9fa] dark:border-[#303134] hover:dark:border-[#5f6368]  dark:bg-[#303134]">
                    <BiUser className="w-6 h-6" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      會員資料 User
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="bottom-0">
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="flex flex-row w-full items-center p-2 text-xl font-normal rounded-lg dark:text-white border-2 border-red-500 hover:text-red-500 hover:border-red-600"
                >
                  <BiLogOut />
                  <span className="ml-3">登出 Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
