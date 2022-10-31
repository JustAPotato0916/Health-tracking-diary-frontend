import { getCookie } from "cookies-next";
import { DiaryData, Target } from "../../typing";

interface CreateProps {
  folderName: string;
  title: string;
  date: string;
}

interface UpdateProps extends CreateProps {
  content: string;
}

interface DeleteProps {
  folderName: string;
  diaryName: string;
}

class DiaryService {
  async getAll(): Promise<DiaryData> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/diaries`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());
  }

  async create({ folderName, title, date }: CreateProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/diaries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName, title, date }),
    });
  }

  async update({
    folderName,
    title,
    content,
    date,
  }: UpdateProps): Promise<Target> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/diaries`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName, title, content, date }),
    }).then((res) => res.json());
  }

  async remove({ folderName, diaryName }: DeleteProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/diaries/${folderName}/${diaryName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((res) => res.json());
  }
}

export default new DiaryService();
