import { useQuery } from "@tanstack/react-query";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { BiCloudUpload } from "react-icons/bi";
import { v4 } from "uuid";
import ErrorCard from "../../components/general/ErrorCard";
import Loader from "../../components/general/Loader";
import Sidebar from "../../components/general/Sidebar";
import { storage } from "../../src/config/firebase.config";
import toastStyle from "../../src/lib/toastStyle";
import UserDataService from "../../src/service/UserDataService";
import ButtonLoader from "../../components/general/ButtonLoader";
import { useTranslation } from "next-i18next";

interface Props {}

interface Inputs {
  name: string;
  facebookUID: string;
  twitterUID: string;
}

function index(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [imageUpload, setImageUpload] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { t } = useTranslation("user");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { isError, isSuccess, isLoading, data, error } = useQuery(
    ["userData"],
    UserDataService.get,
    { staleTime: 3000 }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Sidebar />

        <div className="flex justify-center items-center w-full h-full lg:col-span-10">
          <Head>
            <title>Health tracking diary - Edit User</title>
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

        <div className="flex justify-center items-center w-full h-full lg:col-span-10">
          <Head>
            <title>Health tracking diary - Edit User</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <ErrorCard />
        </div>
      </div>
    );
  }

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload?.name! + v4()}`);
    const imageURL = uploadBytes(imageRef, imageUpload).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return url;
      });
    });
    return imageURL;
  };

  const onSubmit: SubmitHandler<Inputs> = async ({
    name,
    facebookUID,
    twitterUID,
  }) => {
    let newImageUrl;
    setUpdateIsLoading(true);

    if (imageUrl && data.profilePhotoUrl !== imageUrl) {
      newImageUrl = await uploadFile();
    }

    let updateData = {
      profilePhotoUrl: newImageUrl ?? data.profilePhotoUrl,
      name,
      facebookUID,
      twitterUID,
    };

    await UserDataService.updateUserData(updateData)
      .then(() => {
        setUpdateIsLoading(false);
        router.push("/user");
      })
      .catch((error) => {
        setUpdateIsLoading(false);
        console.log(error);
      });

    toast(t("editUserSuccess"), {
      duration: 8000,
      style: toastStyle,
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Edit User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex col-span-10 m-8 select-none dark:text-white">
        <div className="flex flex-col w-full h-full p-2 lg-p-6">
          <div className="flex flex-row items-center">
            <div className="text-4xl font-bold">{t("editUser")}</div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between w-full h-full"
          >
            <div className="flex flex-col space-y-5 lg:space-y-10 w-full">
              <div className="flex flex-row space-x-5 mt-5">
                <div className="relative w-12 h-12 lg:w-24 lg:h-24">
                  <Image
                    src={imageUrl ?? data.profilePhotoUrl}
                    fill
                    sizes="100%"
                    alt={""}
                  />
                </div>
                <div className="flex flex-col justify-center h-full">
                  <div className="flex flex-row justify-center items-center border-2 rounded-md w-56 h-10 bg-purple-400 pointer-events-none z-10">
                    {isUploadLoading ? (
                      <ButtonLoader />
                    ) : (
                      <div className="flex flex-row items-center">
                        <BiCloudUpload className="h-8 w-8" />
                        <span>{t("uploadImg")}</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    className={`absolute w-56 ${isUploadLoading && "!hidden"}`}
                    onChange={(event) => {
                      if (isUploadLoading) return;
                      setIsUploadLoading(true);
                      if (
                        event.target.files! &&
                        event.target.files[0] !== null
                      ) {
                        setTimeout(() => {
                          if (event.target.files!)
                            setImageUrl(
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
                </div>
              </div>
              <div>
                <label>
                  <span className="text-lg">{t("name")}</span>
                  <span className="text-sm ml-2 text-gray-400">
                    {t("nameLimit")}
                  </span>
                </label>
                <input
                  type="text"
                  className="input w-full mt-2"
                  {...register("name", { value: data.name, maxLength: 12 })}
                />
                {errors.name && (
                  <p className="p-1 text-[13px] font-light  text-orange-500 mb-2">
                    {t("nameError")}
                  </p>
                )}
              </div>
              <div>
                <label>
                  <span className="text-lg">{t("facebookUId")}</span>
                  <span className="text-sm ml-2 text-gray-400">
                    {t("uIdLimit")}
                  </span>
                </label>
                <input
                  type="text"
                  className="input w-full mt-2"
                  {...register("facebookUID", {
                    value: data.facebookUID!,
                    maxLength: 16,
                  })}
                />
                {errors.facebookUID && (
                  <p className="p-1 text-[13px] font-light  text-orange-500 mb-2">
                    {t("facebookUIdError")}
                  </p>
                )}
              </div>
              <div>
                <label>
                  <span className="text-lg">{t("twitterUId")}</span>
                  <span className="text-sm ml-2 text-gray-400">
                    {t("uIdLimit")}
                  </span>
                </label>
                <input
                  type="text"
                  className="input w-full mt-2"
                  {...register("twitterUID", {
                    value: data.twitterUID!,
                    maxLength: 16,
                  })}
                />
                {errors.twitterUID && (
                  <p className="p-1 text-[13px] font-light  text-orange-500 mb-2">
                    {t("twitterUIdError")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-end w-full mt-10 space-x-2 lg:space-x-5">
              <div className="flex justify-center text-white w-1/2 lg:w-1/3 focus:ring-4 text-lg font-semibold rounded-lg p-5 py-2.5 bg-green-600 hover:bg-green-700 outline-none focus:ring-green-800">
                <Link href={"/user"}>
                  <span>{t("cancel")}</span>
                </Link>
              </div>
              <button
                type="submit"
                className="flex justify-center text-white w-1/2 lg:w-1/3 focus:ring-4 text-lg font-semibold rounded-lg p-5 py-2.5 bg-blue-600 hover:bg-blue-700 outline-none focus:ring-blue-800"
              >
                {updateIsLoading ? <ButtonLoader /> : t("confirm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["user"])),
  },
});

export default index;
