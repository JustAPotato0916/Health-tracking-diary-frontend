import { BiHeart, BiWalk } from "react-icons/bi";
import { GoogleFitBucket } from "../../typing";

interface Props extends i18nContext {
  bucket: GoogleFitBucket;
  cardiopulmonaryTarget: number;
  stepTarget: number;
}

interface i18nContext {
  cardiopulmonary: string;
  step: string;
}

function BasicCard({
  bucket,
  cardiopulmonaryTarget,
  stepTarget,
  cardiopulmonary,
  step,
}: Props) {
  const strokeWidth = 10;

  const heartMinuteSummary = bucket.dataset[0].point[0]?.value[0]?.fpVal ?? 0;
  const stepCountDelta = bucket.dataset[1].point[0]?.value[0]?.intVal ?? 0;
  const caloriesExpended = bucket.dataset[2].point[0]?.value[0]?.fpVal
    ? Math.round(bucket.dataset[2].point[0]?.value[0]?.fpVal)
    : 0;
  const distanceDelta = bucket.dataset[3].point[0]?.value[0]?.fpVal
    ? Math.round(bucket.dataset[3].point[0]?.value[0]?.fpVal) / 1000
    : 0;
  const activeMinutes = bucket.dataset[4].point[0]?.value[0]?.intVal ?? 0;

  return (
    <div className="w-full lg:w-1/3 rounded-xl border-2 p-10">
      <div className="flex flex-col items-center justify-center rounded-2xl">
        <svg className="inline-block m-auto w-48 h-48">
          <circle
            className="text-blue-500 opacity-10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={50}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-blue-500"
            strokeWidth={strokeWidth}
            strokeDasharray={`${
              (Math.round((stepCountDelta / stepTarget) * 100) *
                50 *
                2 *
                Math.PI) /
              100
            } 999`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={50}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-green-500 opacity-10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={70}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-green-500"
            strokeWidth={strokeWidth}
            strokeDasharray={`${
              ((heartMinuteSummary / cardiopulmonaryTarget) *
                100 *
                70 *
                2 *
                Math.PI) /
              100
            } 999`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={70}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute">
          <div className="flex flex-col items-center font-semibold mb-20">
            <span className="text-3xl text-green-500">
              {heartMinuteSummary}
            </span>
            <span className="text-base text-blue-500">{stepCountDelta}</span>
          </div>
        </div>
        <div className="flex flex-row space-x-5 dark:text-white">
          <span className="flex flex-row items-center">
            <BiHeart className="!text-green-500 mr-1" /> {cardiopulmonary}
          </span>
          <span className="flex flex-row items-center">
            <BiWalk className="!text-blue-500 mr-1" /> {step}
          </span>
        </div>
        <div className="flex flex-row font-semibold space-x-8 justify-center mt-5">
          <div className="flex flex-col items-center">
            <span className="text-lg text-blue-500">{caloriesExpended}</span>
            <span className="text-sm dark:text-white">Cal</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg text-blue-500">{distanceDelta}</span>
            <span className="text-sm dark:text-white">Km</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg text-blue-500">{activeMinutes}</span>
            <span className="text-sm dark:text-white">Move Min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicCard;
