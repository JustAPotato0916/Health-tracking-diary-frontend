import { useRouter } from "next/router";
import { BiChevronRight } from "react-icons/bi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shortWeekdays } from "../../src/lib/shortWeekdays";
import { GoogleFitBucket } from "../../typing";

interface Props extends i18nContext {
  type: "cardiopulmonary" | "step" | "cal";
  buckets: Array<GoogleFitBucket>;
}

interface i18nContext {
  typeString: string;
  pastDay: string;
}

function WeeklyCard({ type, buckets, typeString, pastDay }: Props) {
  const router = useRouter();
  const data: Array<any> = [];

  if (type == "step") {
    buckets.map((bucket) => {
      const endDate = new Date(parseInt(bucket.endTimeMillis));
      endDate.setDate(endDate.getDate() - 1);

      if (router.locale == "zh-TW") {
        data.push({
          weekDay: shortWeekdays[endDate.getDay()],
          Steps: bucket.dataset[1].point[0]?.value[0]?.intVal ?? 0,
        });
      } else {
        data.push({
          weekDay: endDate.getDay(),
          Steps: bucket.dataset[1].point[0]?.value[0]?.intVal ?? 0,
        });
      }
    });
  }

  if (type == "cal") {
    buckets.map((bucket) => {
      const endDate = new Date(parseInt(bucket.endTimeMillis));
      endDate.setDate(endDate.getDate() - 1);

      if (router.locale == "zh-TW") {
        data.push({
          weekDay: shortWeekdays[endDate.getDay()],
          Cal: Math.round(bucket.dataset[2].point[0]?.value[0]?.fpVal) ?? 0,
        });
      } else {
        data.push({
          weekDay: endDate.getDay(),
          Cal: Math.round(bucket.dataset[2].point[0]?.value[0]?.fpVal) ?? 0,
        });
      }
    });
  }

  if (type == "cardiopulmonary") {
    buckets.map((bucket) => {
      const endDate = new Date(parseInt(bucket.endTimeMillis));
      endDate.setDate(endDate.getDate() - 1);

      if (router.locale == "zh-TW") {
        data.push({
          weekDay: shortWeekdays[endDate.getDay()],
          Points: bucket.dataset[0].point[0]?.value[0]?.fpVal ?? 0,
        });
      } else {
        data.push({
          weekDay: endDate.getDay(),
          Points: bucket.dataset[0].point[0]?.value[0]?.fpVal ?? 0,
        });
      }
    });
  }

  return (
    <div className="w-full rounded-xl border-2 p-2">
      <div className="flex flex-col space-y-5">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col font-semibold">
            <span className="text-lg dark:text-white">{typeString}</span>
            <span className="text-sm text-gray-400">{pastDay}</span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div
            className={`flex flex-col ${
              type == "cardiopulmonary" && "text-green-500"
            } ${(type == "step" || type == "cal") && "text-blue-500"}`}
          >
            <div className="font-semibold">
              <span className="text-lg">
                {type == "cardiopulmonary" && data[6].Points}
                {type == "step" && data[6].Steps}
                {type == "cal" && data[6].Cal}
              </span>
              <span className="text-sm">
                {type == "cardiopulmonary" && " pts"}
                {type == "cal" && " Cal"}
              </span>
            </div>
            <span className="text-xs">今天</span>
          </div>
          <div className="w-full lg:w-2/3 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <XAxis dataKey="weekDay" />
                <YAxis />
                {type == "cardiopulmonary" && (
                  <Bar dataKey="Points" fill="#8884d8" />
                )}
                {type == "step" && <Bar dataKey="Steps" fill="#8884d8" />}
                {type == "cal" && <Bar dataKey="Cal" fill="#8884d8" />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyCard;
