import MuiModal from "@mui/material/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiXCircle } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { modalState } from "../../src/atoms/modalAtom";
import toastStyle from "../../src/lib/toastStyle";
import DiaryFolderService from "../../src/service/DiaryFolderService";
import ButtonLoader from "../general/ButtonLoader";

interface Inputs {
  name: string;
}

interface Props extends i18nContext {}

interface i18nContext {
  createFolder: string;
  createFolderSuccess: string;
  folder: string;
  folderLimit: string;
  folderError: string;
  cancel: string;
  confirm: string;
}

function CreateFolderModal({
  createFolder,
  createFolderSuccess,
  folder,
  folderLimit,
  folderError,
  cancel,
  confirm,
}: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useRecoilState(modalState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { isLoading, mutate } = useMutation(DiaryFolderService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(["diaryData"]);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
    mutate({ name });

    toast(`${createFolderSuccess} - ${name}`, {
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
          <span className="text-3xl text-white">{createFolder}</span>
          <BiXCircle className="w-8 h-8 text-white" onClick={handleClose} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          <div>
            <label className="flex flex-row justify-between items-center">
              <span className="text-xl text-white">{folder}</span>
              <span className="text-sm text-gray-400">{folderLimit}</span>
            </label>
            <input
              type="text"
              className="input w-full"
              {...register("name", { required: true, maxLength: 12 })}
            />
            {errors.name && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {folderError}
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
              {!isLoading ? confirm : <ButtonLoader />}
            </button>
          </div>
        </form>
      </div>
    </MuiModal>
  );
}

export default CreateFolderModal;
