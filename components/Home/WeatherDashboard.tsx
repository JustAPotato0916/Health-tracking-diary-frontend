import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { weekdays } from "../../src/lib/weekdays";
import WeatherService from "../../src/service/WeatherService";
import Loader from "../general/Loader";
import WeatherChart from "./WeatherChart";
import WeatherIcon from "./WeatherIcon";

interface Props {
  temperatureString: string;
  probabilityOfPrecipitationString: string;
  humidityString: string;
  windSpeedString: string;
  windSpeedUnit: string;
  cityName: string;
}

interface WeekdayData {
  weekday: string;
  isDay: boolean;
  time: string;
  weather: string;
  temperature: string;
}

function WeatherDashboard({
  temperatureString,
  probabilityOfPrecipitationString,
  humidityString,
  windSpeedString,
  windSpeedUnit,
  cityName,
}: Props) {
  const router = useRouter();
  const [arrayIndex, setArrayIndex] = useState<number>(0);

  const {
    isError,
    isSuccess,
    isLoading,
    data: weatherElements,
    error,
  } = useQuery(["weather"], WeatherService.getWeather, { staleTime: 3600000 });

  if (isLoading)
    return (
      <div className="flex flex-col rounded-xl justify-center items-center border-2 lg:h-2/3 lg:px-2">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col rounded-xl justify-center items-center border-2 lg:h-2/3 lg:px-2">
        <span className="text-3xl font-semibold text-red-500">
          目前無法取得天氣資料，請確認已授權定位權限以及開啟定位功能。
        </span>
      </div>
    );

  // WeatherElement Property
  const probabilityOfPrecipitation = weatherElements[0];
  const temperature = weatherElements[1];
  const humidity = weatherElements[2];
  const windSpeed = weatherElements[3];
  const weather = weatherElements[4];

  // Weekday Data
  let weekdayData: Array<WeekdayData> = [];
  temperature.time.map((data, index) => {
    let weekday;
    if (router.locale == "zh-TW") {
      weekday = weekdays[new Date(data.startTime).getDay()];
    } else {
      weekday = new Date(data.startTime)
        .toLocaleTimeString("en-us", { weekday: "long" })
        .split(" ")[0];
    }

    const time = `${
      new Date(data.startTime)
        .toLocaleString("zh-TW")
        .split(" ")[1]
        .split(":")[0]
    }:${
      new Date(data.startTime)
        .toLocaleString("zh-TW")
        .split(" ")[1]
        .split(":")[1]
    }`;
    const isDay =
      new Date(data.startTime)
        .toLocaleString("zh-TW")
        .split(" ")[1]
        .slice(0, 2) == "下午"
        ? false
        : true;
    if (weekdayData[weekdayData.length - 1]?.weekday !== weekday) {
      weekdayData.push({
        weekday,
        time,
        isDay,
        weather: weather.time[index].elementValue[0].value,
        temperature: data.elementValue[0].value,
      });
    }
  });

  return (
    <div className="flex flex-col rounded-xl border-2 lg:h-2/3 lg:px-2">
      <div className="flex flex-row justify-center lg:justify-between">
        <div className="flex flex-row justify-center lg:justify-start dark:text-white">
          <WeatherIcon
            isDay={weekdayData[arrayIndex].isDay}
            weatherValue={weekdayData[arrayIndex].weather}
            isSmall={false}
          />
          <span className="flex flex-col justify-center text-4xl mr-4 lg:mr-0 lg:text-8xl lg:mt-2 lg:justify-start ">
            <div className="flex flex-row">
              {temperature.time[arrayIndex].elementValue[0].value}
              <span className="font-semibold lg:text-5xl lg:mt-2">°C</span>
            </div>
          </span>
          <div className="hidden lg:flex lg:flex-col ml-5 mt-4">
            <span className="text-gray-400 text-sm">
              {probabilityOfPrecipitationString}：
              {
                probabilityOfPrecipitation.time[arrayIndex].elementValue[0]
                  .value
              }
              %
            </span>
            <span className="text-gray-400 text-sm">
              {humidityString}：
              {humidity.time[arrayIndex].elementValue[0].value}%
            </span>
            <span className="text-gray-400 text-sm">
              {windSpeedString}：
              {Math.round(
                ((parseInt(windSpeed.time[arrayIndex].elementValue[0].value) *
                  1000) /
                  2400) *
                  100
              ) / 100}{" "}
              {windSpeedUnit}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:justify-start lg:mt-4 lg:mr-8">
          <span className="flex flex-row justify-end text-xl dark:text-white">
            {cityName}
          </span>
          <span className="hidden lg:flex lg:flex-row justify-end text-gray-400">
            {weekdayData[arrayIndex].weekday} {weekdayData[arrayIndex].time}
          </span>
          <span className="flex flex-row justify-end text-gray-400">
            {weekdayData[arrayIndex].weather}
          </span>
        </div>
      </div>
      <WeatherChart
        temperatureString={temperatureString}
        probabilityOfPrecipitationString={probabilityOfPrecipitationString}
        temperature={temperature}
        probabilityOfPrecipitation={probabilityOfPrecipitation}
      />
      <div className="hidden lg:flex lg:flex-row justify-between mx-10">
        {weekdayData.map((data, index) => {
          return (
            <div
              className={`flex flex-col text-gray-400 dark:text-gray-400 ${
                !(index == arrayIndex) && "hover:!text-purple-400"
              }
               ${index == arrayIndex && "!text-black dark:!text-white"}`}
              key={index}
              onClick={() => {
                setArrayIndex(index);
              }}
            >
              <span>{data.weekday}</span>
              <div className="!h-12 !w-12">
                <WeatherIcon
                  isDay={data.isDay}
                  weatherValue={data.weather}
                  isSmall={true}
                />
              </div>
              <span className="flex flex-row justify-center">
                {data.temperature}°C
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherDashboard;
