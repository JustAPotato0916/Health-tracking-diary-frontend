import { useRouter } from "next/router";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { GoogleFitBucket } from "../../typing";

interface Props extends i18nContext {
  buckets: Array<GoogleFitBucket>;
}

interface i18nContext {
  weight: string;
}

function WeightCard({ buckets, weight }: Props) {
  const data: Array<any> = [];
  const router = useRouter();

  buckets.map((bucket) => {
    const startDate = new Date(parseInt(bucket.startTimeMillis));
    const endDate = new Date(parseInt(bucket.endTimeMillis));

    if (router.locale == "zh-TW") {
      data.push({
        startDate: `${startDate.getMonth() + 1}月${startDate.getDate()}日`,
        endDate: `${endDate.getMonth() + 1}月${endDate.getDate()}日`,
        month: `${endDate.getMonth() + 1} 月`,
        Kg: bucket?.dataset[0]?.point[0]?.value[1]?.fpVal ?? null,
      });
    } else {
      data.push({
        startDate: `${startDate.getMonth() + 1}/${startDate.getDate()}`,
        endDate: `${endDate.getMonth() + 1}/${endDate.getDate()}`,
        month: `${endDate.getMonth() + 1} `,
        Kg: bucket?.dataset[0]?.point[0]?.value[1]?.fpVal ?? null,
      });
    }
  });

  return (
    <div className="rounded-xl border-2 p-2">
      <div className="flex flex-col space-y-5">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col font-semibold">
            <span className="text-lg dark:text-white">{weight}</span>
            <span className="text-sm text-gray-400">
              {data[0].startDate} ~ {data[1].endDate}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col text-blue-500">
            <div className="font-semibold">
              <span className="text-lg">{data[0].Kg}</span>
              <span className="text-sm">kg</span>
            </div>
            <span className="text-xs">{data[1].month}</span>
          </div>
          <div className="w-full h-36 lg:w-2/3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="Kg" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeightCard;
