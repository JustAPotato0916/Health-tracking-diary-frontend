import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ButtonLoader from "../../components/general/ButtonLoader";
import ErrorCard from "../../components/general/ErrorCard";
import Loader from "../../components/general/Loader";
import Sidebar from "../../components/general/Sidebar";
import { storage } from "../../src/config/firebase.config";
import useAuth from "../../src/hooks/useAuth";
import UserDataService from "../../src/service/UserDataService";
import userDataService from "../../src/service/UserDataService";

function index() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newCoverURL, setNewCoverURL] = useState<string>();
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [imageUpload, setImageUpload] = useState<File | null>();

  const { isError, isSuccess, isLoading, data, error } = useQuery(
    ["userData"],
    userDataService.getUserData,
    { staleTime: 3000 }
  );

  const { mutate } = useMutation(updateCover, {
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Sidebar />

        <div className="flex justify-center items-center col-span-10">
          <Head>
            <title>Health tracking diary</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Loader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Sidebar />

        <div className="flex justify-center items-center col-span-10">
          <Head>
            <title>Health tracking diary</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <ErrorCard />
        </div>
      </div>
    );
  }

  async function updateCover() {
    if (imageUpload == null) return;

    let imageURL: string | undefined;
    if (newCoverURL && data?.profileCoverUrl !== newCoverURL) {
      const imageRef = ref(storage, `images/${imageUpload?.name! + v4()}`);
      imageURL = await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        const imageURL = getDownloadURL(snapshot.ref).then((url) => {
          return url;
        });
        return imageURL;
      });
    }

    if (!imageURL) return;

    await UserDataService.updateCover(imageURL);
    setNewCoverURL("");
  }

  console.log({ isError, isSuccess, isLoading, data, error });

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex flex-col justify-between col-span-10 m-8 select-none dark:text-white">
        <div>
          <div className="flex flex-col justify-end items-end relative h-36 md:h-48 lg:h-64">
            {newCoverURL ? (
              <Image
                src={newCoverURL}
                className="relative rounded object-cover select-none"
                fill
                sizes="100%"
                alt="圖片無法讀取成功，請試著重新整理頁面!"
              />
            ) : (
              <Image
                src={data.profileCoverUrl}
                className="relative rounded object-cover select-none"
                fill
                priority
                sizes="100%"
                alt="圖片無法讀取成功，請試著重新整理頁面!"
              />
            )}

            <div className="hidden absolute mr-24 mb-8 lg:flex flex-row">
              <button className="absolute w-36 bg-green-500 hover:bg-green-600 p-2 pointer-events-none z-10 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium">
                {isUploadLoading ? <ButtonLoader /> : "上傳新圖片"}
              </button>
              <input
                type="file"
                className="w-24"
                onChange={(event) => {
                  if (isUploadLoading) return;
                  setIsUploadLoading(true);
                  if (event.target.files!) {
                    if (event.target.files[0] == null) {
                      setIsUploadLoading(false);
                      return;
                    }
                    setTimeout(() => {
                      if (event.target.files!)
                        setNewCoverURL(
                          URL.createObjectURL(event.target.files[0])
                        );
                    }, 2000);

                    setImageUpload(event.target.files[0]);
                  }
                  setTimeout(() => {
                    setIsUploadLoading(false);
                  }, 2000);
                }}
              />
              {newCoverURL && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium p-2 ml-24 w-36"
                  onClick={() => {
                    mutate();
                  }}
                >
                  確認修改
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-row ml-4 mt-4">
            <div className="relative w-16 h-16 lg:w-24 lg:h-24">
              <Image
                src={data.profilePhotoUrl}
                fill
                sizes="100%"
                priority
                alt="圖片無法讀取成功，請試著重新整理頁面!"
              />
            </div>
            <div className="flex flex-col text-base font-semibold m-2 lg:font-extrabold lg:text-2xl lg:m-4">
              <div>{data.name}</div>
              <div>{data.email}</div>
              <div className="mt-1">
                {data.facebookUID && (
                  <button
                    type="button"
                    className="text-blue-700 focus:outline-none text-center inline-flex items-center mr-4"
                    onClick={() =>
                      (window.location.href = `https://www.facebook.com/${data.facebookUID}`)
                    }
                  >
                    <svg
                      className="w-5 h-5 lg:w-8 lg:h-7"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="facebook-f"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                      ></path>
                    </svg>
                  </button>
                )}
                {data.twitterUID && (
                  <button
                    type="button"
                    className="text-blue-500 focus:outline-none text-center inline-flex items-center mr-4"
                    onClick={() =>
                      (window.location.href = `https://twitter.com/${data.twitterUID}`)
                    }
                  >
                    <svg
                      className="w-5 h-5 lg:w-8 lg:h-8"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="twitter"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 font-extrabold text-3xl">Action 動作</div>
          <div className="flex flex-row mt-2">
            {user?.providerData[0].providerId !== "google.com" && (
              <Link href={"/user/editPassword"}>
                <button
                  type="button"
                  className="text-white w-32 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-green-600 hover:bg-green-700 outline-none focus:ring-green-800"
                >
                  修改密碼
                </button>
              </Link>
            )}

            <Link href={"/user/edit"}>
              <div className="text-white w-32 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-blue-600 hover:bg-blue-700 outline-none focus:ring-blue-800">
                編輯用戶資料
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
function v4() {
  throw new Error("Function not implemented.");
}