import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import BasicCard from "../../components/analytic/BasicCard";
import LinkGoogleCard from "../../components/analytic/LinkGoogleCard";
import WeeklyCard from "../../components/analytic/WeeklyCard";
import WeightCard from "../../components/analytic/WeightCard";
import Loader from "../../components/general/Loader";
import Sidebar from "../../components/general/Sidebar";
import TargetCard from "../../components/analytic/TargetCard";
import useAuth from "../../src/hooks/useAuth";
import GoogleFitService from "../../src/service/GoogleFitService";

interface Props {}

function index(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const queryClient = useQueryClient();
  const { user, unlinkGoogle } = useAuth();
  const [isEditTarget, setIsEditTarget] = useState<boolean>(false);
  const { t } = useTranslation("analytic");

  const {
    isError: fitDataIsError,
    isLoading: fitDataLoading,
    data: fitData,
  } = useQuery(["fitData"], GoogleFitService.getAllExceptWeight, {
    staleTime: 3000,
  });

  const {
    isError: weightDataIsError,
    isLoading: weightDataLoading,
    data: weightData,
  } = useQuery(["weightData"], GoogleFitService.getWeight, {
    staleTime: 3000,
  });

  const { data: googleFitTargets } = useQuery(
    ["googleFitTarget"],
    GoogleFitService.getGoogleFitTargets,
    {
      staleTime: 3000,
    }
  );

  const { isLoading: unlinkIsLoading, mutate: unlinkMutate } = useMutation(
    unlinkGoogle,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fitData", "weightData"]);
      },
    }
  );

  if (fitDataLoading || weightDataLoading) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Sidebar />

        <div className="flex justify-center items-center w-full h-full lg:col-span-10">
          <Head>
            <title>Health tracking diary - Analytic</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Loader />
        </div>
      </div>
    );
  }

  if (
    !fitData ||
    fitData.error ||
    fitDataIsError ||
    !weightData ||
    weightData.error ||
    weightDataIsError
  ) {
    return (
      <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
        <Head>
          <title>Health tracking diary - Analytic</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />

        <LinkGoogleCard
          failMessage={t("failMessage")}
          linkTo={t("linkTo")}
          warningMessageOne={t("warningMessageOne")}
          warningMessageTwo={t("warningMessageTwo")}
          unLinkButton={t("unLinkButton")}
          unLinkMessage={t("unLinkMessage")}
          linkButton={t("linkButton")}
          authErrorMessage={t("authErrorMessage")}
          linkSuccess={t("linkSuccess")}
          unlinkSuccess={t("unlinkSuccess")}
        />
      </div>
    );
  }

  const cardiopulmonaryTarget =
    googleFitTargets?.find((googleFitTarget) => {
      return googleFitTarget.type == "心肺強化分數";
    })?.value ?? 0;

  const stepTarget =
    googleFitTargets?.find((googleFitTarget) => {
      return googleFitTarget.type == "步數";
    })?.value ?? 0;

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Analytic</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex flex-col col-span-10 p-8 select-none dark:text-white dark:bg-[#202124]">
        <div className="flex flex-col space-y-10 justify-between h-full lg:space-y-0">
          <div className="flex flex-col space-y-10 lg:flex-row justify-between lg:space-x-10 lg:space-y-0">
            <BasicCard
              bucket={fitData?.bucket[6]!}
              cardiopulmonaryTarget={cardiopulmonaryTarget}
              stepTarget={stepTarget}
              cardiopulmonary={t("cardiopulmonary")}
              step={t("step")}
            />
            <div className="flex flex-col w-full space-y-10 lg:w-2/3 lg:justify-between">
              <div className="border-2 rounded-xl dark:text-white text-lg font-semibold max-h-fit p-2 py-5">
                <span>
                  {t("nowLink")} {user?.providerData[0].email}
                </span>
                {user?.providerData.length! > 1 && (
                  <div>
                    <button
                      className="mt-2 p-2 rounded-xl bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-300 font-semibold"
                      onClick={() => {
                        unlinkMutate();
                      }}
                    >
                      {t("unLinkButton")}
                    </button>
                  </div>
                )}
                <div className="flex flex-row justify-end">
                  <span className="text-gray-400 text-sm font-semibold">
                    {t("dataFrom")}
                  </span>
                </div>
              </div>
              <WeightCard buckets={weightData?.bucket!} weight={t("weight")} />
            </div>
          </div>
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col w-full space-y-10 lg:flex-row lg:space-x-10 lg:space-y-0">
              <WeeklyCard
                type="cardiopulmonary"
                buckets={fitData?.bucket!}
                typeString={t("cardiopulmonary")}
                pastDay={t("pastDay")}
              />
              <WeeklyCard
                type="step"
                buckets={fitData?.bucket!}
                typeString={t("step")}
                pastDay={t("pastDay")}
              />
            </div>
            <div className="flex flex-col w-full space-y-10 lg:flex-row lg:space-x-10 lg:space-y-0">
              <WeeklyCard
                type="cal"
                buckets={fitData?.bucket!}
                typeString={t("cal")}
                pastDay={t("pastDay")}
              />
              <TargetCard
                isEditTarget={isEditTarget}
                setIsEditTarget={setIsEditTarget}
                cardiopulmonaryTarget={cardiopulmonaryTarget}
                stepTarget={stepTarget}
                targetString={t("targetString")}
                cardiopulmonary={t("cardiopulmonary")}
                step={t("step")}
                editCardiopulmonary={t("editCardiopulmonary")}
                editStep={t("editStep")}
                cancelEdit={t("cancelEdit")}
                confirmEdit={t("confirmEdit")}
                editCardiopulmonarySuccess={t("editCardiopulmonarySuccess")}
                editStepSuccess={t("editStepSuccess")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["analytic"])),
  },
});

export default index;
