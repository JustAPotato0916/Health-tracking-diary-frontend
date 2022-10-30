import { useQuery } from "@tanstack/react-query";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import { BiBookmarkAltPlus, BiCheckSquare, BiClipboard } from "react-icons/bi";
import { useRecoilState } from "recoil";
import ErrorCard from "../../components/general/ErrorCard";
import Loader from "../../components/general/Loader";
import Sidebar from "../../components/general/Sidebar";
import CreateTargetModal from "../../components/target/CreateTargetModal";
import DeleTargetModal from "../../components/target/DeleTargetModal";
import EditTargetModal from "../../components/target/EditTargetModal";
import TargetCard from "../../components/target/TargetCard";
import { modalState } from "../../src/atoms/modalAtom";
import TargetService from "../../src/service/TargetService";
import { Target } from "../../typing";

interface Props {}

function index(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("target");
  const [type, setType] = useState<"create" | "edit" | "delete">("create");
  const [target, setTarget] = useState<Target | null>(null);
  const [showModal, setShowModal] = useRecoilState(modalState);

  const { isError, isLoading, data, error } = useQuery(
    ["targets"],
    TargetService.getAll,
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

  console.log({ isError, isLoading, data, error });

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Target</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="col-span-10 p-8 select-none dark:text-white dark:bg-[#202124]">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="flex flex-col lg:!w-[32rem]">
            <div className="flex flex-col border-2 !rounded-t-xl lg:!rounded-r-none">
              <div className="block h-1/2">
                <div className="flex flex-row pt-5 justify-end">
                  <div className="flex flex-row mb-5 w-full justify-center items-center">
                    <BiClipboard className="w-8 h-8" />
                    <span className="text-3xl font-semibold">
                      {t("target")}
                    </span>
                  </div>
                  <div className="inline-flex items-center mb-5 mr-2">
                    <BiBookmarkAltPlus
                      className="w-8 h-8 hover:text-purple-500"
                      onClick={() => {
                        setType("create");
                        setShowModal(true);
                      }}
                    />
                  </div>
                </div>
                <div className="inline-flex flex-col h-24 lg:h-96 w-full lg:mr-5 overflow-x-hidden overflow-y-scroll !scrollbar-thin !scrollbar-track-slate-400 !scrollbar-thumb-purple-500">
                  {data?.map((target) => {
                    if (target.state == false) {
                      return (
                        <div
                          key={target.id}
                          className="inline-flex flex-row justify-between text-lg font-semibold mx-5 hover:text-purple-400"
                          onClick={() => {
                            setTarget(target);
                          }}
                        >
                          <span>{target.title}</span>
                          <span className="hidden lg:block">{target.time}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            <div className="block h-1/2 border-x-2 border-b-2 rounded-b-xl lg:!rounded-r-none">
              <div className="inline-flex flex-row w-full mt-5 mb-2 justify-center items-center">
                <BiCheckSquare className="w-8 h-8" />
                <span className="text-3xl font-semibold">
                  {t("completedTarget")}
                </span>
              </div>
              <div className="inline-flex flex-col h-24 lg:h-96 w-full mr-5 overflow-x-hidden overflow-y-scroll !scrollbar-thin !scrollbar-track-slate-400 !scrollbar-thumb-purple-500">
                {data?.map((target) => {
                  if (target.state == true) {
                    return (
                      <div
                        key={target.id}
                        className="inline-flex flex-row justify-between text-lg font-semibold mx-5 hover:text-purple-400"
                        onClick={() => {
                          setTarget(target);
                        }}
                      >
                        <span>{target.title}</span>
                        <span className="hidden lg:block">
                          {new Date(target.time).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <TargetCard
            target={target}
            setType={setType}
            setTarget={setTarget}
            title={t("cardTitle")}
            number={t("cardNumber")}
            content={t("cardContent")}
            deleteButton={t("deleteButton")}
            editButton={t("editButton")}
            completeButton={t("completeButton")}
            completeMessage={t("completeMessage")}
            completeTime={t("completeTime")}
            lastEditedTime={t("lastEditedTime")}
          />
        </div>
      </div>

      {type == "delete" && showModal && (
        <DeleTargetModal
          target={target!}
          setTarget={setTarget}
          deleteTarget={t("deleteTarget")}
          deleteWarning={t("deleteWarning")}
          cancelDelete={t("cancelDelete")}
          confirmDelete={t("confirmDelete")}
          deleteSuccess={t("deleteSuccess")}
        />
      )}

      {type == "edit" && showModal && (
        <EditTargetModal
          target={target!}
          setTarget={setTarget}
          editTarget={t("editTarget")}
          title={t("title")}
          titleLimit={t("titleLimit")}
          titleError={t("titleError")}
          content={t("content")}
          contentLimit={t("contentLimit")}
          contentError={t("contentError")}
          cancel={t("cancel")}
          confirmEdit={t("confirmEdit")}
          editSuccess={t("editSuccess")}
        />
      )}

      {type == "create" && showModal && (
        <CreateTargetModal
          addTarget={t("addTarget")}
          titleLimit={t("titleLimit")}
          titleError={t("titleError")}
          content={t("content")}
          contentLimit={t("contentLimit")}
          contentError={t("contentError")}
          title={t("title")}
          cancel={t("cancel")}
          confirm={t("confirm")}
          addSuccess={t("addSuccess")}
        />
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["target"])),
  },
});

export default index;
