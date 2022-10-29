import { useState } from "react";
import { weekdays } from "../../src/lib/weekdays";
import { WeatherElement } from "../../typing";
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";

interface Props {
  temperatureString: string;
  probabilityOfPrecipitationString: string;
  temperature: WeatherElement;
  probabilityOfPrecipitation: WeatherElement;
}

interface lineData {
  name: string;
  temperature?: string;
  probabilityOfPrecipitation?: string;
}

function WeatherChart({
  temperatureString,
  probabilityOfPrecipitationString,
  temperature,
  probabilityOfPrecipitation,
}: Props) {
  const router = useRouter();
  const [type, setType] = useState<number>(1);

  let temperatureArrayData: Array<lineData> = [];
  temperature.time.map((data) => {
    let weekday;
    if (router.locale == "zh-TW") {
      weekday = weekdays[new Date(data.startTime).getDay()];
    } else {
      weekday = new Date(data.startTime)
        .toLocaleTimeString("en-us", { weekday: "long" })
        .split(" ")[0];
    }

    if (temperatureArrayData[temperatureArrayData.length - 1]?.name !== weekday)
      temperatureArrayData.push({
        name: weekday,
        temperature: data.elementValue[0].value,
      });
  });

  const probabilityOfPrecipitationArrayData: Array<lineData> = [];
  probabilityOfPrecipitation.time.map((data) => {
    let weekday;
    if (router.locale == "zh-TW") {
      weekday = weekdays[new Date(data.startTime).getDay()];
    } else {
      weekday = new Date(data.startTime)
        .toLocaleTimeString("en-us", { weekday: "long" })
        .split(" ")[0];
    }

    if (
      probabilityOfPrecipitationArrayData[
        probabilityOfPrecipitationArrayData.length - 1
      ]?.name !== weekday
    )
      probabilityOfPrecipitationArrayData.push({
        name: weekday,
        probabilityOfPrecipitation: data.elementValue[0].value,
      });
  });

  return (
    <div className="hidden lg:flex lg:flex-col w-full pr-12">
      <div className="flex flex-row ml-16 space-x-2 pb-2 text-gray-400 text-lg">
        <span
          onClick={() => {
            setType(1);
          }}
          className={`${type == 1 && "!text-white"} hover:text-purple-400`}
        >
          {temperatureString}
        </span>
        <span>|</span>
        <span
          onClick={() => {
            setType(2);
          }}
          className={`${type == 2 && "!text-white"} hover:text-purple-400`}
        >
          {probabilityOfPrecipitationString}
        </span>
      </div>
      <div className="h-64 w-full">
        {type == 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={temperatureArrayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )}
        {type == 2 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={probabilityOfPrecipitationArrayData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="probabilityOfPrecipitation"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default WeatherChart;
