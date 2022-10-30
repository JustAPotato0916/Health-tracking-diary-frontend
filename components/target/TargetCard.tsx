import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { BiX, BiEdit, BiCheck } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { modalState } from "../../src/atoms/modalAtom";
import toastStyle from "../../src/lib/toastStyle";
import TargetService from "../../src/service/TargetService";
import { Target } from "../../typing";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  target: Target | null;
  setType: Dispatch<SetStateAction<"create" | "edit" | "delete">>;
  setTarget: Dispatch<SetStateAction<Target | null>>;
}

interface i18nContext {
  title: string;
  number: string;
  content: string;
  deleteButton: string;
  editButton: string;
  completeButton: string;
  completeMessage: string;
  completeTime: string;
  lastEditedTime: string;
}

function TargetCard({
  title,
  number,
  content,
  deleteButton,
  editButton,
  completeButton,
  completeMessage,
  completeTime,
  lastEditedTime,
  setType,
  setTarget,
  target,
}: Props) {
  if (!target)
    return (
      <div className="flex flex-col w-full lg:w-[67rem] h-36 border-2 rounded-xl mt-5 lg:!h-full lg:border-l-0 lg:rounded-r-xl lg:!rounded-l-none lg:mt-0"></div>
    );

  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useRecoilState(modalState);

  const { isLoading, isError, error, mutate } = useMutation(
    TargetService.update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["targets"]);
      },
    }
  );

  return (
    <div
      className={`${
        !target.state && "justify-between"
      } flex flex-col w-full lg:w-[67rem] border-2 rounded-xl mt-5 lg:border-l-0 lg:rounded-r-xl lg:!rounded-l-none lg:mt-0`}
    >
      <div className="flex flex-col lg:h-[calc(100%/3)] justify-between border-b-2 p-5">
        <span className="text-3xl">
          {title}
          <br className="lg:hidden" />
          {target.title}
        </span>
        <div className="flex flex-row justify-end">
          <div className="flex flex-col">
            <span>
              {target.state ? completeTime : lastEditedTime}
              <br className="lg:hidden" />
              {target.time}
            </span>

            <span className="text-sm text-gray-300">
              {number}
              <br className="lg:hidden" />
              {target.id}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-5 p-5 lg:h-[calc(100%/3)]">
        <span className="text-3xl">{content}</span>
        <span className="break-words">{target.content}</span>
      </div>
      {!target.state && (
        <div className="flex flex-row justify-end items-end h-[calc(100%/3)] space-x-5 p-5">
          <button
            className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-lg w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
            disabled={isLoading && true}
            onClick={() => {
              setType("delete");
              setShowModal(true);
            }}
          >
            <div className="flex flex-row items-center justify-center">
              <BiX className="w-8 h-8" />
              <span className="hidden lg:block">{deleteButton}</span>
            </div>
          </button>
          <button
            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-semibold rounded-lg text-lg w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
            onClick={() => {
              setType("edit");
              setShowModal(true);
            }}
            disabled={isLoading && true}
          >
            <div className="flex flex-row items-center justify-center">
              <BiEdit className="w-8 h-8" />
              <span className="hidden lg:block">{editButton}</span>
            </div>
          </button>
          <button
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-lg w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
            onClick={() => {
              const completedTarget = {
                id: target!.id,
                title: target?.title!,
                content: target?.content!,
                state: true,
                time: new Date(Date.now()).toLocaleDateString(),
              };
              mutate(completedTarget);
              setTarget(completedTarget);
              toast(`${completeMessage} - ${target?.title}!`, {
                duration: 8000,
                style: toastStyle,
              });
            }}
          >
            <div className="flex flex-row items-center justify-center">
              {isLoading ? (
                <ButtonLoader />
              ) : (
                <div className="flex flex-row items-center">
                  <BiCheck className="w-8 h-8" />
                  <span className="hidden lg:block">{completeButton}</span>
                </div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default TargetCard;
