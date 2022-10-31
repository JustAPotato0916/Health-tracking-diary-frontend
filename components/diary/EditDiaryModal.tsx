import MuiModal from "@mui/material/Modal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { modalState } from "../../src/atoms/modalAtom";
import toastStyle from "../../src/lib/toastStyle";
import DiaryService from "../../src/service/DiaryService";
import { DiaryFolder, Diary } from "../../typing";
import ButtonLoader from "../general/ButtonLoader";

interface Props extends i18nContext {
  folder: DiaryFolder;
  diary: Diary;
  setDiary: Dispatch<SetStateAction<Diary | null>>;
}

interface i18nContext {
  editDiary: string;
  editDiarySuccess: string;
  diaryContent: string;
  cancelEdit: string;
  confirmEdit: string;
}

interface Inputs {
  title: string;
}

const MDEditor = dynamic<MDEditorProps>(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

function EditDiaryModal({
  folder,
  diary,
  setDiary,
  editDiary,
  editDiarySuccess,
  diaryContent,
  cancelEdit,
  confirmEdit,
}: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [newContent, setNewContent] = useState<string>(diary.content);

  const { isLoading, mutate } = useMutation(DiaryService.update, {
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
      <div className="flex flex-col border-2 p-5 rounded-xl bg-[#303134] select-none">
        <span className="text-4xl font-bold mb-5 text-white">
          {editDiary} <br className="block lg:hidden" /> {diary.title}
        </span>
        <label className="flex flex-row justify-between items-center">
          <span className="text-xl text-white">{diaryContent}</span>
        </label>
        <MDEditor
          className="w-full !h-[12rem] lg:!h-[38rem] mt-2"
          value={newContent}
          onChange={(value) => {
            setNewContent(value!);
          }}
          hideToolbar={true}
          key="MDEditor"
        />
        <div className="flex flex-row items-center justify-end h-12 space-x-5 mt-5">
          <button
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
            disabled={isLoading && true}
            type="button"
            onClick={handleClose}
          >
            {cancelEdit}
          </button>
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 lg:w-1/4 px-5 py-2.5 text-center"
            disabled={isLoading && true}
            onClick={() => {
              mutate({
                folderName: folder.name,
                title: diary.title,
                content: newContent,
                date: new Date(Date.now()).toLocaleDateString(),
              });

              setDiary({
                title: diary.title,
                content: newContent,
                date: new Date(Date.now()).toLocaleDateString(),
              });

              toast(`${editDiarySuccess} - ${diary.title}`, {
                duration: 8000,
                style: toastStyle,
              });

              setShowModal(false);
            }}
          >
            {!isLoading ? confirmEdit : <ButtonLoader />}
          </button>
        </div>
      </div>
    </MuiModal>
  );
}

export default EditDiaryModal;
