import { useQuery } from "@tanstack/react-query";
import { MarkdownPreviewProps } from "@uiw/react-markdown-preview";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import {
  BiBookContent,
  BiCalendarPlus,
  BiFolderPlus,
  BiX,
} from "react-icons/bi";
import { useRecoilState } from "recoil";
import CreateDiaryModal from "../../components/diary/CreateDiaryModal";
import CreateFolderModal from "../../components/diary/CreateFolderModal";
import DeleteDiaryModal from "../../components/diary/DeleteDiaryModal";
import DeleteFolderModal from "../../components/diary/DeleteFolderModal";
import EditDiaryModal from "../../components/diary/EditDiaryModal";
import ErrorCard from "../../components/general/ErrorCard";
import Loader from "../../components/general/Loader";
import Sidebar from "../../components/general/Sidebar";
import { modalState } from "../../src/atoms/modalAtom";
import DiaryService from "../../src/service/DiaryService";
import { Diary, DiaryFolder } from "../../typing";

interface Props {}

interface ModalTypes {
  type:
    | "createFolder"
    | "deleteFolder"
    | "createDiary"
    | "editDiary"
    | "deleteDiary";
}

function index(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("diary");
  const [diary, setDiary] = useState<Diary | null>(null);
  const [folder, setFolder] = useState<DiaryFolder | null>(null);
  const [type, setType] = useState<ModalTypes["type"]>("createFolder");
  const [showModal, setShowModal] = useRecoilState(modalState);

  const { isError, isLoading, data } = useQuery(
    ["diaryData"],
    DiaryService.getAll,
    { staleTime: 3000 }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Sidebar />

        <div className="flex justify-center items-center w-full h-full lg:col-span-10">
          <Head>
            <title>Health tracking diary - Target</title>
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
            <title>Health tracking diary- Target</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <ErrorCard />
        </div>
      </div>
    );
  }

  const Markdown = dynamic<MarkdownPreviewProps>(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
  );

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Diary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="col-span-10 p-8 select-none dark:text-white dark:bg-[#202124]">
        <div className="flex flex-col lg:flex-row h-full w-full">
          <div className="flex flex-col border-2 !rounded-xl lg:!rounded-r-none lg:w-1/3">
            <div className="flex flex-row justify-end m-2 lg:mt-5">
              <div className="flex flex-row w-full justify-start items-center lg:justify-center">
                <BiBookContent className="w-8 h-8" />
                <span className="text-3xl font-semibold">{t("diary")}</span>
              </div>
              <div className="absolute flex flex-row items-center mr-2 space-x-2">
                <BiCalendarPlus
                  className="w-8 h-8 hover:text-purple-500"
                  onClick={() => {
                    setType("createDiary");
                    setShowModal(true);
                  }}
                />
                <span className="font-semibold text-xl">|</span>
                <BiFolderPlus
                  className="w-8 h-8 hover:text-purple-500"
                  onClick={() => {
                    setType("createFolder");
                    setShowModal(true);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col h-48 lg:h-96 w-full mb-5 mr-5 overflow-x-hidden overflow-y-scroll !scrollbar-thin !scrollbar-track-slate-400 !scrollbar-thumb-purple-500 lg:mb-0">
              {data?.diaryFolders.map((folder) => {
                return (
                  <div
                    className="flex flex-col font-semibold mx-5"
                    key={folder.name}
                  >
                    <div className="inline-flex flex-row justify-between my-2 border-b-2">
                      <span className="text-2xl">{folder.name}</span>
                      <div className="flex flex-row space-x-2">
                        <BiX
                          className="w-8 h-8 hover:text-red-500"
                          onClick={() => {
                            setFolder(folder);
                            setType("deleteFolder");
                            setShowModal(true);
                          }}
                        />
                      </div>
                    </div>
                    {folder.diaries.map((diary) => {
                      return (
                        <div
                          className="inline-flex flex-row justify-between text-lg hover:text-purple-400"
                          key={diary.title}
                          onClick={() => {
                            setFolder(folder);
                            setDiary(diary);
                          }}
                        >
                          <span>{diary.title}</span>
                          <span className="hidden lg:block">{diary.date}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 h-96 border-2 mt-5 rounded-xl lg:w-2/3 lg:h-full lg:mt-0 lg:rounded-l-none lg:border-l-0">
            {diary && (
              <div className="flex flex-col h-[21rem] w-full lg:h-full">
                <div className="flex flex-row justify-between">
                  <span className="text-2xl mb-2 h-12">{diary!.title}</span>
                  <span className="text-lg mb-2 h-12">{diary!.date}</span>
                </div>
                <Markdown
                  className="!h-[48rem] w-full !overflow-y-scroll !scrollbar-thin !scrollbar-track-slate-400 !scrollbar-thumb-purple-500 !text-black !bg-white dark:!bg-[#202124] dark:!text-white mb-2"
                  source={diary?.content ? diary?.content : t("emptyTip")}
                />
                <div className="flex flex-row justify-end h-12">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-semibold rounded-lg text-lg w-1/2 lg:w-1/4 px-5 text-center mr-5"
                    onClick={() => {
                      setType("editDiary");
                      setShowModal(true);
                    }}
                  >
                    {t("editDiaryButton")}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-lg w-1/2 lg:w-1/4 px-5 text-center"
                    onClick={() => {
                      setType("deleteDiary");
                      setShowModal(true);
                    }}
                  >
                    {t("deleteDiaryButton")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {type == "createFolder" && showModal && (
        <CreateFolderModal
          createFolder={t("createFolder")}
          createFolderSuccess={t("createFolderSuccess")}
          folder={t("folder")}
          folderLimit={t("folderLimit")}
          folderError={t("folderError")}
          cancel={t("cancel")}
          confirm={t("confirm")}
        />
      )}

      {type == "deleteFolder" && showModal && (
        <DeleteFolderModal
          folder={folder!}
          deleteFolder={t("deleteFolder")}
          deletFolderWarning={t("deletDiaryWarning")}
          deleteFolderSuccess={t("deleteFolderSuccess")}
          cancelDelete={t("cancelDelete")}
          confirmDelete={t("confirmDelete")}
        />
      )}

      {type == "createDiary" && showModal && (
        <CreateDiaryModal
          folders={data!.diaryFolders}
          createDiary={t("createDiary")}
          createDiaryWarning={t("createDiaryWarning")}
          createDiarySuccess={t("createDiarySuccess")}
          folder={t("folder")}
          chooseFolder={t("chooseFolder")}
          diaryName={t("diaryName")}
          diaryNameLimit={t("diaryNameLimit")}
          diaryNameError={t("diaryNameError")}
          cancel={t("cancel")}
          confirm={t("confirm")}
        />
      )}

      {type == "editDiary" && showModal && (
        <EditDiaryModal
          folder={folder!}
          diary={diary!}
          setDiary={setDiary}
          editDiary={t("editDiary")}
          editDiarySuccess={t("editDiarySuccess")}
          diaryContent={t("diaryContent")}
          cancelEdit={t("cancelEdit")}
          confirmEdit={t("confirmEdit")}
        />
      )}

      {type == "deleteDiary" && showModal && (
        <DeleteDiaryModal
          folder={folder!}
          diary={diary!}
          setDiary={setDiary}
          deleteDiary={t("deleteDiary")}
          deletDiaryWarning={t("deletDiaryWarning")}
          deleteDiarySuccess={t("deleteDiarySuccess")}
          cancelDelete={t("cancelDelete")}
          confirmDelete={t("confirmDelete")}
        />
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["diary"])),
  },
});

export default index;
