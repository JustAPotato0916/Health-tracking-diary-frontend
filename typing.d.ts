// Weather
export interface WeatherResponse {
  success: string;
  result: {
    resource_id: string;
    fields: Array<WeatherDataType>;
  };
  records: {
    datasetDescription: string;
    locations: Array<Locations>;
  };
}

interface WeatherDataType {
  id: string;
  type: string;
}

interface Locations {
  dataid: string;
  datasetDescription: string;
  location: Array<Location>;
  locationsName: string;
}

interface Location {
  locationName: string;
  weatherElement: Array<WeatherElement>;
}

interface WeatherElement {
  elementName: string;
  description: string;
  time: Array<Time>;
}

interface Time {
  startTime: Date;
  endTime: Date;
  elementValue: Array<ElementValue>;
}

interface ElementValue {
  value: string;
  measures: string;
}
