import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonLoader from "../../components/general/ButtonLoader";
import ParticlesBackground from "../../components/general/ParticlesBackground";
import useAuth from "../../src/hooks/useAuth";

interface Inputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {}

function signup(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isLoading, signUp, error, loginWithGoogle } = useAuth();
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({
    email,
    password,
    confirmPassword,
  }) => {
    if (password !== confirmPassword) {
      return setConfirmPasswordError(true);
    }

    setConfirmPasswordError(false);
    await signUp(email, password);
  };

  return (
    <div className="flex flex-col w-full h-full select-none dark:bg-[#202124]">
      <Head>
        <title>Health tracking diary - Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ParticlesBackground />
      <div className="absolute m-12 items-center !hidden md:!inline">
        <div className="flex items-center">
          <Image src="/images/icon.png" alt="" width={48} height={48} />
          <span className="dark:text-white text-4xl font-medium">
            {t("title")}
          </span>
        </div>
      </div>

      <div className="flex flex-row-reverse h-screen dark:text-white">
        <div className="flex flex-col items-center justify-center w-full border-[#dadce0] lg:w-1/3 lg:border-x-2 dark:border-white lg:mr-48">
          <div className="text-2xl md:text-3xl font-semibold dark:text-white my-10">
            {t("welcomeMessage")}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 w-2/3"
          >
            <div className="flex flex-col">
              <label className="inputLabel">{t("email")}</label>
              <input
                type="email"
                placeholder="Name@gm.pu.edu.tw"
                className="input"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="p-1 text-[13px] font-light  text-orange-500">
                  {t("emailError")}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="inputLabel">{t("password")}</label>
              <input
                type="password"
                placeholder="Password"
                className="input"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 16,
                })}
              />
              {errors.password && (
                <p className="p-1 text-[13px] font-light  text-orange-500">
                  {t("passwordError")}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="inputLabel">{t("confirmPassword")}</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="input"
                {...register("confirmPassword", { required: true })}
              />
              {confirmPasswordError && (
                <p className="p-1 text-[13px] font-light  text-orange-500">
                  {t("confirmPasswordError")}
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-600">
                <div>{t("signupError")}</div>
              </div>
            )}

            <button
              type="submit"
              className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
            >
              {isLoading ? <ButtonLoader /> : t("signup")}
            </button>
          </form>

          <div className="flex flex-row my-4 dark:text-white text-lg font-semibold">
            <span>{t("oldUser")}</span>
            <Link href={"/auth/login"}>
              <span className="px-2 text-purple-500 hover:text-purple-600">
                {t("turnLoginPage")}
              </span>
            </Link>
          </div>

          <div className="mt-2 flex flex-row justify-center w-full">
            <div className="w-1/3 mt-3 border-t-2 border-purple-500"> </div>
            <div className="mx-2 text-purple-600 font-semibold">
              {t("anotherFunction")}
            </div>
            <div className="w-1/3 mt-3 border-t-2 border-purple-500"></div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh-TW", ["common"])),
  },
});

export default signup;
