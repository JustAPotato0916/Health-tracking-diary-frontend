import { getCookie } from "cookies-next";

interface CreateFolderProps {
  name: string;
}

interface DeleteFolderProps extends CreateFolderProps {}

class DiaryFolderService {
  async create({ name }: CreateFolderProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/diary-folder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  }

  async remove({ name }: DeleteFolderProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/diary-folder/${name}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }
}

export default new DiaryFolderService();
