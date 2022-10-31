export interface UserData {
  uid: string;
  email: string;
  name: string;
  profilePhotoUrl: string;
  profileCoverUrl: string;
  facebookUID: string | null;
  twitterUID: string | null;
  info: string | null;
}

export interface Target {
  id: string;
  title: string;
  content: string;
  state: boolean;
  time: string;
}

export interface GoogleFitTarget {
  type: "心肺強化分數" | "步數";
  value: number;
}

export interface DiaryData {
  diaryFolders: DiaryFolder[];
}

export interface DiaryFolder {
  name: string;
  diaries: Diary[];
}

export interface Diary {
  title: string;
  content: string;
  date: string;
}

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

// Google Fit
interface GoogleFitBucket {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: Array<GoogleFitDataSet>;
}

interface GoogleFitDataSet {
  dataSourceId: string;
  point: Array<GoogleFitPoint>;
}

interface GoogleFitPoint {
  dataTypeName: string;
  endTimeNanos: string;
  startTimeNanos: string;
  value: Array<GoogleFitValue>;
}

interface GoogleFitValue {
  intVal?: number;
  fpVal: number;
  mapVal: Array<any>;
}
