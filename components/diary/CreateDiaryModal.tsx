import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import MuiModal from "@mui/material/Modal";
import { modalState } from "../../src/atoms/modalAtom";
import DiaryService from "../../src/service/DiaryService";
import { DiaryFolder } from "../../typing";
import { BiXCircle } from "react-icons/bi";
import toast from "react-hot-toast";
import toastStyle from "../../src/lib/toastStyle";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  folders: DiaryFolder[];
}

interface i18nContext {
  createDiary: string;
  createDiaryWarning: string;
  createDiarySuccess: string;
  folder: string;
  chooseFolder: string;
  diaryName: string;
  diaryNameLimit: string;
  diaryNameError: string;
  cancel: string;
  confirm: string;
}

interface Inputs {
  folderName: string;
  title: string;
}

function CreateDiaryModal({
  folders,
  createDiary,
  createDiaryWarning,
  createDiarySuccess,
  folder,
  chooseFolder,
  diaryName,
  diaryNameLimit,
  diaryNameError,
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

  const { isLoading, mutate } = useMutation(DiaryService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(["diaryData"]);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ folderName, title }) => {
    mutate({
      folderName,
      title,
      date: new Date(Date.now()).toLocaleDateString(),
    });

    toast(`${createDiarySuccess} - ${title}`, {
      duration: 8000,
      style: toastStyle,
    });

    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!folders)
    return (
      <MuiModal
        open={showModal}
        onClose={handleClose}
        className="flex flex-col justify-center z-50 m-auto h-full w-full max-w-5xl rounded-md"
      >
        <div className="flex flex-col border-2 p-5 rounded-xl bg-[#303134]">
          <div className="flex flex-row justify-between mb-2">
            <span className="text-3xl text-white">{createDiary}</span>
            <BiXCircle className="w-8 h-8 text-white" onClick={handleClose} />
          </div>
          <span className="text-2xl text-red-500 font-semibold">
            {createDiaryWarning}
          </span>
        </div>
      </MuiModal>
    );

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="flex flex-col justify-center z-50 m-auto h-full w-full max-w-5xl rounded-md"
    >
      <div className="flex flex-col border-2 p-5 rounded-xl bg-[#303134]">
        <div className="flex flex-row justify-between mb-2">
          <span className="text-3xl text-white">{createDiary}</span>
          <BiXCircle className="w-8 h-8 text-white" onClick={handleClose} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          <div className="flex flex-col">
            <label className="text-xl text-white">{folder}</label>
            <select
              className="w-full lg:w-1/3 border-2 mt-2 text-lg p-2 text-white bg-[#303134]"
              {...register("folderName", { required: true })}
            >
              {folders.map((folder) => {
                return (
                  <option value={folder.name} key={folder.name}>
                    {folder.name}
                  </option>
                );
              })}
            </select>
            {errors.folderName && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {chooseFolder}
              </p>
            )}
          </div>
          <div>
            <label className="flex flex-row justify-between items-center">
              <span className="text-xl text-white">{diaryName}</span>
              <span className="text-sm text-gray-400">{diaryNameLimit}</span>
            </label>
            <input
              type="text"
              className="input w-full mt-2"
              {...register("title", { required: true, maxLength: 12 })}
            />
            {errors.title && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {diaryNameError}
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

export default CreateDiaryModal;
