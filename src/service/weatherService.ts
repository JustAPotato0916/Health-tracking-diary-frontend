import { WeatherElement, WeatherResponse } from "../../typing";

class WeatherService {
  async getWeather(): Promise<Array<WeatherElement>> {
    const data: WeatherResponse = await fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.NEXT_PUBLIC_WEATHER_API}&format=JSON&locationName=臺中市&elementName=PoP12h,T,RH,Wx,WS`
    ).then((response) => response.json());

    const weather = data.records.locations[0].location[0].weatherElement;

    return weather;
  }
}

export default new WeatherService();
