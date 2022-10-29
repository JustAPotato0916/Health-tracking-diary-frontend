import { Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import {
  BiBarChartSquare,
  BiBookContent,
  BiClipboard,
  BiHomeAlt,
  BiLogOut,
  BiUser,
} from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import useAuth from "../../src/hooks/useAuth";

function MobileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="lg:!hidden">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="!capitalize dark:!text-white"
      >
        <HiMenu className="h-6 w-6" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="menu"
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div className="flex flex-row justify-start w-full items-center p-4 text-xl font-normal rounded-lg bg-[#f8f9fa] !shadow-lg">
            <Link href={"/"}>
              <div className="flex items-center">
                <BiHomeAlt className="w-6 h-6" />
                <span className="ml-3">首頁 Home</span>
              </div>
            </Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="flex flex-row justify-start w-full items-center p-4 text-xl font-normal rounded-lg bg-[#f8f9fa] !shadow-lg">
            <Link href={"/target"}>
              <div className="flex items-center">
                <BiClipboard className="w-6 h-6" />
                <span className="ml-3">目標 Target</span>
              </div>
            </Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="flex flex-row justify-start w-full items-center p-4 text-xl font-normal rounded-lg bg-[#f8f9fa] !shadow-lg">
            <Link href={"/diary"}>
              <div className="flex items-center">
                <BiBookContent className="w-6 h-6" />
                <span className="ml-3">日記 Diary</span>
              </div>
            </Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="flex flex-row justify-start w-full items-center p-4 text-xl font-normal rounded-lg bg-[#f8f9fa] !shadow-lg">
            <Link href={"/analytic"}>
              <div className="flex items-center">
                <BiBarChartSquare className="w-6 h-6" />
                <span className="ml-3">Google Fit</span>
              </div>
            </Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="flex flex-row justify-start w-full items-center p-4 text-xl font-normal rounded-lg bg-[#f8f9fa] !shadow-lg">
            <Link href={"/user"}>
              <div className="flex items-center">
                <BiUser className="w-6 h-6" />
                <span className="ml-3">會員資料 User</span>
              </div>
            </Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div
            onClick={logout}
            className="w-full text-xl font-normal justify-start rounded-lg text-white border-2 p-4 border-red-500 hover:text-red-500 hover:border-red-600"
          >
            <Link href={"/user"}>
              <div className="flex w-full items-center">
                <BiLogOut />
                <span className="ml-3">登出 Logout</span>
              </div>
            </Link>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default MobileMenu;
