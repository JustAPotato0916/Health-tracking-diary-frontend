import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../src/hooks/useAuth";
import toastStyle from "../../src/lib/toastStyle";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {}

interface i18nContext {
  failMessage: string;
  linkTo: string;
  warningMessageOne: string;
  warningMessageTwo: string;
  unLinkButton: string;
  unLinkMessage: string;
  linkButton: string;
  authErrorMessage: string;
  linkSuccess: string;
  unlinkSuccess: string;
}

function LinkGoogleCard({
  failMessage,
  linkTo,
  warningMessageOne,
  warningMessageTwo,
  unLinkButton,
  unLinkMessage,
  linkButton,
  authErrorMessage,
  linkSuccess,
  unlinkSuccess,
}: Props) {
  const {
    user,
    isLoading: authLoading,
    unlinkGoogle,
    linkGoogle,
    error: authError,
  } = useAuth();
  const queryClient = useQueryClient();
  const [isLinkGoogle, setIsLinkGoogle] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation(linkGoogle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fitData", "weightData"]);
      setIsLinkGoogle(true);
    },
  });

  useEffect(() => {
    user?.providerData.map((providerData) => {
      if (providerData.providerId == "google.com") setIsLinkGoogle(true);
    });
  }, []);

  return (
    <div className="flex flex-col h-full justify-center items-center col-span-10 p-8 select-none dark:text-white">
      <div className="flex flex-col min-h-fit w-full lg:h-72  lg:w-2/3 rounded-xl border-2">
        <span className="p-2 text-2xl lg:text-3xl text-red-500">
          {failMessage}
        </span>
        {isLinkGoogle && (
          <div className="flex flex-col h-full p-2 justify-center items-center lg:text-lg space-y-5 lg:p-0">
            <span className="text-lg lg:text-2xl">
              {linkTo}
              {
                user?.providerData.find((provider) => {
                  return provider.providerId == "google.com";
                })?.email
              }
            </span>
            <span className="text-red-500">{warningMessageOne}</span>
            <span>{warningMessageTwo}</span>
            {!(user?.providerData.length == 1) && (
              <button
                className="mt-2 p-2 w-1/5 rounded-xl bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-300 font-semibold"
                onClick={() => {
                  unlinkGoogle();
                  setIsLinkGoogle(false);
                  toast(unlinkSuccess, {
                    duration: 8000,
                    style: toastStyle,
                  });
                }}
              >
                {authLoading ? <ButtonLoader /> : unLinkButton}
              </button>
            )}
          </div>
        )}

        {!isLinkGoogle && (
          <div className="flex flex-col h-full justify-center items-center text-lg space-y-5">
            <div className="flex flex-row justify-center w-full">
              <span className="text-xl">{unLinkMessage}</span>
            </div>
            <button
              className="text-white w-2/3 lg:w-1/5 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg p-2 text-center"
              onClick={() => {
                mutate();
                toast(linkSuccess, {
                  duration: 8000,
                  style: toastStyle,
                });
              }}
            >
              {isLoading ? <ButtonLoader /> : linkButton}
            </button>
            {authError && (
              <span className="text-lg text-red-500">{authErrorMessage}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkGoogleCard;
