import { getCookie } from "cookies-next";
import { Target } from "../../typing";

interface CreateProps {
  id: string;
  title: string;
  content: string;
  state: boolean;
  time: string;
}

interface UpdateProps extends CreateProps {}

class TargetService {
  async getAll(): Promise<Array<Target>> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/targets`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());
  }

  async create({
    id,
    title,
    content,
    state,
    time,
  }: CreateProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/targets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, content, state, time }),
    });
  }

  async update({
    id,
    title,
    content,
    state,
    time,
  }: UpdateProps): Promise<Target> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/targets`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, content, state, time }),
    }).then((res) => res.json());
  }

  async remove(id: string): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/targets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());
  }
}

export default new TargetService();
