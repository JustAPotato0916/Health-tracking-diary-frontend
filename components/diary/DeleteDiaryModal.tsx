import MuiModal from "@mui/material/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { BiXCircle } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { modalState } from "../../src/atoms/modalAtom";
import toastStyle from "../../src/lib/toastStyle";
import DiaryService from "../../src/service/DiaryService";
import { Diary, DiaryFolder } from "../../typing";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  folder: DiaryFolder;
  diary: Diary;
  setDiary: Dispatch<SetStateAction<Diary | null>>;
}

interface i18nContext {
  deleteDiary: string;
  deletDiaryWarning: string;
  deleteDiarySuccess: string;
  cancelDelete: string;
  confirmDelete: string;
}

function DeleteDiaryModal({
  folder,
  diary,
  setDiary,
  deleteDiary,
  deletDiaryWarning,
  deleteDiarySuccess,
  cancelDelete,
  confirmDelete,
}: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useRecoilState(modalState);

  const { isLoading, mutate } = useMutation(DiaryService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries(["diaryData"]);
    },
  });

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
          <span className="text-3xl text-white">
            {deleteDiary} {diary!.title}
          </span>
          <BiXCircle className="w-8 h-8 text-white" onClick={handleClose} />
        </div>
        <div className="flex flex-col space-y-5">
          <span className="text-xl text-red-500 font-semibold">
            {deletDiaryWarning}
          </span>
          <div className="flex flex-row justify-center space-x-5 text-lg">
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
              disabled={isLoading && true}
              onClick={handleClose}
            >
              {cancelDelete}
            </button>
            <button
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
              disabled={isLoading && true}
              onClick={() => {
                mutate({ folderName: folder.name, diaryName: diary.title });
                toast(`${deleteDiarySuccess} - ${diary?.title!}`, {
                  duration: 8000,
                  style: toastStyle,
                });

                setDiary(null);
                setShowModal(false);
              }}
            >
              {!isLoading ? confirmDelete : <ButtonLoader />}
            </button>
          </div>
        </div>
      </div>
    </MuiModal>
  );
}

export default DeleteDiaryModal;
