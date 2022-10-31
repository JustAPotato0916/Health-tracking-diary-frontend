import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { BiMinus, BiPlus } from "react-icons/bi";
import toastStyle from "../../src/lib/toastStyle";
import GoogleFitService from "../../src/service/GoogleFitService";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  isEditTarget: boolean;
  setIsEditTarget: Dispatch<SetStateAction<boolean>>;
  cardiopulmonaryTarget: number;
  stepTarget: number;
}

interface i18nContext {
  targetString: string;
  cardiopulmonary: string;
  step: string;
  editCardiopulmonary: string;
  editStep: string;
  cancelEdit: string;
  confirmEdit: string;
  editCardiopulmonarySuccess: string;
  editStepSuccess: string;
}

function TargetCard({
  isEditTarget,
  setIsEditTarget,
  cardiopulmonaryTarget,
  stepTarget,
  targetString,
  cardiopulmonary,
  step,
  editCardiopulmonary,
  editStep,
  cancelEdit,
  confirmEdit,
  editCardiopulmonarySuccess,
  editStepSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const [editType, setEditType] = useState<"cardiopulmonary" | "step">();
  const [previewCardiopulmonaryValue, setPreviewCardiopulmonaryValue] =
    useState(0);
  const [previewStepValue, setPreviewStepValue] = useState(0);

  const { isLoading, mutate } = useMutation(
    GoogleFitService.updateGoogleFitTarget,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["googleFitTarget"]);
      },
    }
  );

  return (
    <div className="flex flex-col w-full border-2 dark:text-white rounded-xl lg:!w-96">
      <div className="flex flex-row justify-start pt-2 pl-2">
        <span className="font-semibold text-2xl">{targetString}</span>
      </div>
      {!isEditTarget && (
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-row h-full justify-between items-center w-2/3 pl-2 space-x-5">
            <div className="flex flex-col space-y-2 font-semibold">
              <span className="text-xl">{cardiopulmonary}</span>
              <span>{cardiopulmonaryTarget}</span>
            </div>
            <div className="flex flex-col space-y-2 font-semibold">
              <span className="text-xl">{step}</span>
              <span>{stepTarget}</span>
            </div>
          </div>
          <div className="flex flex-row ">
            <button
              className="rounded-xl m-2 p-2 border-2 hover:border-purple-500 hover:text-purple-500"
              onClick={() => {
                setIsEditTarget(true);
                setEditType("cardiopulmonary");
                setPreviewCardiopulmonaryValue(cardiopulmonaryTarget);
              }}
            >
              {editCardiopulmonary}
            </button>
            <button
              className="rounded-xl m-2 p-2 border-2 hover:border-purple-500 hover:text-purple-500"
              onClick={() => {
                setIsEditTarget(true);
                setEditType("step");
                setPreviewStepValue(stepTarget);
              }}
            >
              {editStep}
            </button>
          </div>
        </div>
      )}

      {isEditTarget && editType == "cardiopulmonary" && (
        <div className="flex flex-col justify-center h-full">
          <div className="flex flex-row space-x-5 justify-center items-center h-2/3">
            <BiMinus
              className="h-12 w-12"
              onClick={() => {
                if (
                  !(
                    previewCardiopulmonaryValue == 0 ||
                    previewCardiopulmonaryValue == 5
                  )
                )
                  setPreviewCardiopulmonaryValue((prev) => prev - 5);
              }}
            />
            <span className="text-xl font-semibold">
              {previewCardiopulmonaryValue}
            </span>
            <BiPlus
              className="h-12 w-12"
              onClick={() => {
                if (previewCardiopulmonaryValue !== 200)
                  setPreviewCardiopulmonaryValue((prev) => prev + 5);
              }}
            />
          </div>
          <div className="flex flex-row justify-end space-x-5 mr-2 my-2">
            <button
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg p-2 text-sm text-center"
              onClick={() => {
                setIsEditTarget(false);
              }}
            >
              {cancelEdit}
            </button>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg p-2 text-sm text-center"
              onClick={() => {
                mutate({
                  id: 0,
                  type: "心肺強化分數",
                  value: previewCardiopulmonaryValue,
                });

                setIsEditTarget(false);

                toast(editCardiopulmonarySuccess, {
                  duration: 8000,
                  style: toastStyle,
                });
              }}
            >
              {!isLoading ? confirmEdit : <ButtonLoader />}
            </button>
          </div>
        </div>
      )}

      {isEditTarget && editType == "step" && (
        <div className="flex flex-col justify-center h-full">
          <div className="flex flex-row space-x-5 justify-center items-center h-2/3">
            <BiMinus
              className="h-12 w-12"
              onClick={() => {
                if (!(previewStepValue == 0 || previewStepValue == 500))
                  setPreviewStepValue((prev) => prev - 500);
              }}
            />
            <span className="text-xl font-semibold">{previewStepValue}</span>
            <BiPlus
              className="h-12 w-12"
              onClick={() => {
                if (previewStepValue !== 200000)
                  setPreviewStepValue((prev) => prev + 500);
              }}
            />
          </div>
          <div className="flex flex-row justify-end space-x-5 mr-2 my-2">
            <button
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg p-2 text-sm text-center"
              onClick={() => {
                setIsEditTarget(false);
              }}
            >
              {cancelEdit}
            </button>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg p-2 text-sm text-center"
              onClick={() => {
                mutate({
                  id: 1,
                  type: "步數",
                  value: previewStepValue,
                });

                setIsEditTarget(false);

                toast(editStepSuccess, {
                  duration: 8000,
                  style: toastStyle,
                });
              }}
            >
              {!isLoading ? confirmEdit : <ButtonLoader />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TargetCard;
