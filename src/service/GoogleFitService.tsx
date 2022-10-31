import { getCookie } from "cookies-next";
import { GoogleFitBucket, GoogleFitTarget } from "../../typing";

interface Data {
  bucket: Array<GoogleFitBucket>;
  error: string | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

interface UpdateProps {
  id: number;
  type: "心肺強化分數" | "步數";
  value: number;
}
class GoogleFitService {
  async getAllExceptWeight(): Promise<Data | null> {
    const googleAccessToken = getCookie("googleAccessToken");

    if (!googleAccessToken) return null;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    const startTime = Date.parse(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(startDate)
    );

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const endTime = Date.parse(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(endDate)
    );

    return await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
        body: JSON.stringify({
          aggregateBy: [
            // 心肺強化分數
            {
              dataTypeName: "com.google.heart_minutes",
              dataSourceId:
                "derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes",
            },
            // 步數
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId:
                "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            },
            // Cal
            {
              dataTypeName: "com.google.calories.expended",
            },
            // Km
            {
              dataTypeName: "com.google.distance.delta",
              dataSourceId:
                "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta",
            },
            // 活動時間
            {
              dataTypeName: "com.google.active_minutes",
              dataSourceId:
                "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        }),
      }
    ).then((res) => res.json());
  }

  async getWeight(): Promise<Data | null> {
    const googleAccessToken = getCookie("googleAccessToken");

    if (!googleAccessToken) return null;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(0);

    const startTime = Date.parse(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(startDate)
    );

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const endTime = Date.parse(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(endDate)
    );

    return await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
        body: JSON.stringify({
          aggregateBy: [
            // 體重
            {
              dataTypeName: "com.google.weight.summary",
              dataSourceId:
                "derived:com.google.weight:com.google.android.gms:merge_weight",
            },
          ],
          bucketByTime: { durationMillis: 2629746000 },
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        }),
      }
    ).then((res) => res.json());
  }

  async getGoogleFitTargets(): Promise<Array<GoogleFitTarget>> {
    const authToken = getCookie("authToken");

    const googleFitTargets = fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/google-fit-target`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((res) => res.json());

    return googleFitTargets;
  }

  async updateGoogleFitTarget({
    id,
    type,
    value,
  }: UpdateProps): Promise<Response> {
    const authToken = getCookie("authToken");

    return await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/google-fit-target/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, value }),
      }
    );
  }
}

export default new GoogleFitService();
