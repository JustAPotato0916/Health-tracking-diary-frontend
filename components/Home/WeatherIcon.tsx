import {
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiDaySunnyOvercast,
  WiNightCloudy,
  WiNightPartlyCloudy,
  WiRain,
} from "react-icons/wi";

interface Props {
  weatherValue: string;
  isDay: boolean;
  isSmall: boolean;
}

function WeatherIcon({ weatherValue, isDay, isSmall }: Props) {
  return (
    <div>
      {isDay && weatherValue == "晴時多雲" && (
        <WiDaySunnyOvercast
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {isDay && (weatherValue == "多雲" || weatherValue == "多雲時晴") && (
        <WiDayCloudy
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {/* Nught */}
      {!isDay && weatherValue == "晴時多雲" && (
        <WiNightPartlyCloudy
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {!isDay && (weatherValue == "多雲" || weatherValue == "多雲時晴") && (
        <WiNightCloudy
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {/* Cloudy */}
      {weatherValue == "陰天" && (
        <WiCloud
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {(weatherValue == "陰時多雲" || weatherValue == "多雲時陰") && (
        <WiCloudy
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
      {/* Rainy */}
      {(weatherValue == "陰有雨" ||
        weatherValue == "陰陣雨" ||
        weatherValue == "陰短暫雨" ||
        weatherValue == "陰時多雲有雨" ||
        weatherValue == "陰時多雲陣雨" ||
        weatherValue == "陰時多雲短暫雨" ||
        weatherValue == "陰時多雲短暫陣雨" ||
        weatherValue == "多雲短暫雨" ||
        weatherValue == "多雲短暫陣雨" ||
        weatherValue == "多雲時陰陣雨" ||
        weatherValue == "多雲時陰短暫雨") && (
        <WiRain
          className={`${isSmall && "!w-12 !h-12"} w-24 h-24 lg:w-36 lg:h-36`}
        />
      )}
    </div>
  );
}

export default WeatherIcon;
