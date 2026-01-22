import { GetStatsByShortCode } from "@/lib/action";
import ClicksStats from "./click-stats";
import { DateTime } from "luxon";
import Link from "next/link";

export default async function ContainerStats({
  keyShort,
}: {
  keyShort: string;
}) {
  // Obtener la zona horaria del cliente
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log("ContainerStats: ", keyShort);
  const now = DateTime.now().setZone(timeZone);
  const threeMonthsAgo = now.minus({ months: 3 });

  // Convertir a formato ISO y asegurar que no sea null
  const nowFormatted = now.toFormat("yyyy/MM/dd");
  const threeMonthsAgoFormatted = threeMonthsAgo.toFormat("yyyy/MM/dd");
  const rest = await GetStatsByShortCode(
    keyShort,
    threeMonthsAgoFormatted,
    nowFormatted
  );
  if (rest.status === "error") {
    return <div>{rest.message}</div>;
  } else if (rest.status === "success" && rest.data === null) {
    return <div>short URL not found!</div>;
  }
  // console.log("ContainerStats: ", rest.data);
  const initialClicks =
    rest.data && rest.data?.length > 0 ? rest.data[0].clicks : [];
  return (
    <div>            
      <div className="flex flex-col pt-5 min-h-screen items-center gap-10">
        <ClicksStats
          keyShort={keyShort}
          initialClicks={initialClicks}
          timeZone={timeZone}
          originURL={rest.data?.[0]?.original_url || "Not Found"}
        />
      </div>
    </div>
  );
}
