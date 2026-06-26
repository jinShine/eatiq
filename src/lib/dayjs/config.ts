import dayjs from "dayjs";
import "dayjs/locale/ko";
import duration from "dayjs/plugin/duration";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetweenPlugin);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);
dayjs.extend(duration);
dayjs.extend(updateLocale);

dayjs.locale("ko");
dayjs.updateLocale("ko", {
  weekStart: 1,
});
// 한국 시간대로 기본 설정
dayjs.tz.setDefault("Asia/Seoul");
