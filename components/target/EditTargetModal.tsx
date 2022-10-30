import MuiModal from "@mui/material/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiXCircle } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { modalState } from "../../src/atoms/modalAtom";
import toastStyle from "../../src/lib/toastStyle";
import TargetService from "../../src/service/TargetService";
import { Target } from "../../typing";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  target: Target;
  setTarget: Dispatch<SetStateAction<Target | null>>;
}

interface i18nContext {
  editTarget: string;
  title: string;
  titleLimit: string;
  titleError: string;
  content: string;
  contentLimit: string;
  contentError: string;
  cancel: string;
  confirmEdit: string;
  editSuccess: string;
}

interface Inputs {
  title: string;
  content: string;
  time: string;
}

function EditTargetModal({
  target,
  setTarget,
  editTarget,
  title,
  titleLimit,
  titleError,
  content,
  contentLimit,
  contentError,
  cancel,
  confirmEdit,
  editSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useRecoilState(modalState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { isLoading, isError, error, mutate } = useMutation(
    TargetService.update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["targets"]);
      },
    }
  );

  const onSubmit: SubmitHandler<Inputs> = async ({ title, content }) => {
    const newTarget = {
      id: target.id,
      title,
      content,
      state: false,
      time: new Date(Date.now()).toLocaleDateString(),
    };

    mutate(newTarget);
    setTarget(newTarget);

    toast(`${editSuccess} - ${title}!`, {
      duration: 8000,
      style: toastStyle,
    });

    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="flex flex-col justify-center z-50 m-auto h-full w-full max-w-5xl rounded-md"
    >
      <div className="flex flex-col border-2 p-5 rounded-xl bg-[#303134]">
        <div className="flex flex-row justify-between mb-2">
          <span className="text-3xl text-white">{editTarget}</span>
          <BiXCircle className="w-8 h-8 text-white" onClick={handleClose} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          <div>
            <label className="flex flex-row justify-between items-center">
              <span className="text-xl text-white">{title}</span>
              <span className="text-sm text-gray-400">{titleLimit}</span>
            </label>
            <input
              type="text"
              className="input w-full"
              {...register("title", {
                value: target.title,
                required: true,
                maxLength: 12,
              })}
            />
            {errors.title && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {titleError}
              </p>
            )}
          </div>
          <div>
            <label className="flex flex-row justify-between items-center">
              <span className="text-xl text-white">{content}</span>
              <span className="text-sm text-gray-400">{contentLimit}</span>
            </label>
            <textarea
              className="input w-full resize-none h-48"
              {...register("content", {
                value: target.content,
                maxLength: 128,
              })}
            />
            {errors.content && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {contentError}
              </p>
            )}
          </div>
          <div className="flex flex-row justify-end space-x-5">
            <button
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
              onClick={handleClose}
              disabled={isLoading && true}
            >
              {cancel}
            </button>
            <button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
              disabled={isLoading && true}
            >
              {!isLoading ? confirmEdit : <ButtonLoader />}
            </button>
          </div>
        </form>
      </div>
    </MuiModal>
  );
}

export default EditTargetModal;
