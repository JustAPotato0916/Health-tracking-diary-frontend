import { UserData } from "./../../typing.d";
import { getCookie } from "cookies-next";

interface CreateProps {
  uid: string;
  name: string;
  email: string;
}

interface UpdateProps {
  profilePhotoUrl?: string;
  name: string;
  facebookUID: string;
  twitterUID: string;
}

class UserDataService {
  async get(): Promise<UserData> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());
  }

  async create({ uid, name, email }: CreateProps): Promise<Response> {
    const userData = {
      uid: uid,
      email: email,
      name: name,
      profilePhotoUrl:
        "https://firebasestorage.googleapis.com/v0/b/health-tracking-diary.appspot.com/o/head.png?alt=media&token=cd195d77-bf4e-493e-a51b-2078078af690",
      profileCoverUrl:
        "https://firebasestorage.googleapis.com/v0/b/health-tracking-diary.appspot.com/o/cover.png?alt=media&token=12854e9d-0bf5-4bd5-bb39-3616cd925595",
      facebookUID: "",
      twitterUID: "",
    };

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  }

  async updateUserData({
    profilePhotoUrl,
    name,
    facebookUID,
    twitterUID,
  }: UpdateProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-data`, {
      method: "PATCH",
      body: JSON.stringify({
        profilePhotoUrl,
        name,
        facebookUID,
        twitterUID,
      }),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async updateCover(profileCoverUrl: string): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-data/banner`, {
      method: "PATCH",
      body: JSON.stringify({
        profileCoverUrl,
      }),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export default new UserDataService();
