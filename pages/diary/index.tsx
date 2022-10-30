import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Sidebar from "../../components/general/Sidebar";

interface Props {}

function index(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Diary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex flex-col justify-between col-span-10 m-8 select-none dark:text-white"></div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["common"])),
  },
});

export default index;
