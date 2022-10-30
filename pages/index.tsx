import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import {
  BiClipboard,
  BiBookContent,
  BiBarChartSquare,
  BiUser,
} from "react-icons/bi";
import Sidebar from "../components/general/Sidebar";
import WeatherDashboard from "../components/home/WeatherDashboard";

interface Props {}

const Home: NextPage = (
  _props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col w-screen h-screen lg:grid lg:grid-cols-12 lg:grid-flow-col dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <section className="col-span-10 p-8 select-none dark:bg-[#202124]">
        <div className="flex flex-col space-y-10 h-full w-full">
          <WeatherDashboard
            temperatureString={t("temperature")}
            probabilityOfPrecipitationString={t("probabilityOfPrecipitation")}
            humidityString={t("humidity")}
            windSpeedString={t("windSpeed")}
            windSpeedUnit={t("windSpeedUnit")}
            cityName={t("city")}
          />

          <div className="flex flex-col space-y-5 w-full lg:flex-row lg:space-x-5 lg:space-y-0 lg:h-2/5 dark:text-white">
            <div className="linkCard">
              <Link href={"/target"}>
                <span className="w-full flex flex-row justify-center text-3xl font-semibold">
                  {t("target")}
                </span>
                <div className="w-full flex flex-row justify-center">
                  <BiClipboard className="h-24 w-24 lg:h-48 lg:w-48" />
                </div>
              </Link>
            </div>
            <div className="linkCard">
              <Link href={"/diary"}>
                <span className="w-full flex flex-row justify-center text-3xl font-semibold">
                  {t("diary")}
                </span>
                <div className="w-full flex flex-row justify-center">
                  <BiBookContent className="h-24 w-24 lg:h-48 lg:w-48" />
                </div>
              </Link>
            </div>
            <div className="linkCard">
              <Link href={"/analytic"}>
                <span className="w-full flex flex-row justify-center text-3xl font-semibold">
                  {t("googleFit")}{" "}
                </span>
                <div className="w-full flex flex-row justify-center">
                  <BiBarChartSquare className="h-24 w-24 lg:h-48 lg:w-48" />
                </div>
              </Link>
            </div>
            <div className="linkCard">
              <Link href={"/user"}>
                <span className="w-full flex flex-row justify-center text-3xl font-semibold">
                  {t("user")}
                </span>
                <div className="w-full flex flex-row justify-center">
                  <BiUser className="h-24 w-24 lg:h-48 lg:w-48" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["common"])),
  },
});

export default Home;
