"use client";
import { useEffect, useRef, useState } from "react";
import GraphClicks from "@/components/stats/graph-clicks";
import { GetStatsByShortCode } from "@/lib/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "@/components/stats/clicks-stats.module.css";
import { DateTime } from "luxon";
import Link from "next/link";

export default function ClicksStats({
  keyShort,
  initialClicks,
  timeZone,
  originURL,
}: {
  keyShort: string;
  initialClicks: Click[];
  timeZone: string;
  originURL: string;
}) {
  const [clicksData, setClicksData] = useState(initialClicks);
  const [totalClicks, setTotalClicks] = useState(initialClicks.length);
  const [refreshInterval, setRefreshInterval] = useState(0); // Default to no refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);

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
      if (rest.status === "success" && rest.data !== null) {
        // console.log("Data fetched successfully", rest.data);
        const newData = rest.data[0]?.clicks || [];
        setClicksData(newData);
        setTotalClicks(newData.length);
      }

      setTimeout(() => setIsRefreshing(false), 1000); // Asegurarse de que el pulso se complete
    };

    if (refreshInterval > 0) {
      fetchData(); // Fetch data initially
      const interval = setInterval(fetchData, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [keyShort, refreshInterval]);

  // Highlight effect when totalClicks changes
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.classList.add(styles.highlight);
      const timer = setTimeout(() => {
        if (highlightRef.current) {
          highlightRef.current.classList.remove(styles.highlight);
        }
      }, 1000); // Duration of the highlight effect

      return () => clearTimeout(timer);
    }
  }, [totalClicks]);

  const handleSelectChange = (value: string) => {
    const valueParse = parseInt(value, 10);
    setRefreshInterval(valueParse);
  };

  return (
    <div className="flex flex-col min-h-screen items-center gap-10 w-full">
      <div>
        <div className="text-center">
          <Link href="/" className="text-3xl" title="home" data-umami-event={`Stats to home`}>
            <span className="icon-[material-symbols--home]"></span>
          </Link>
        </div>
        <Select onValueChange={handleSelectChange}  data-umami-event={`Change refresh interval`}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Refresh Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">No refresh</SelectItem>
              <SelectItem value="30000">very 30 seconds</SelectItem>
              <SelectItem value="60000">Every 1 minute</SelectItem>
              <SelectItem value="180000">Every 3 minutes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        ref={highlightRef}
        className={`flex flex-col items-center justify-center w-48 h-48 bg-rose-700 rounded-full text-7xl border-4 border-rose-300 hover:bg-rose-500 ${
          isRefreshing ? styles.pulse : ""
        }`}
      >
        <label>{totalClicks}</label>
        <label className="text-xs">total clicks</label>
      </div>
      <div className="w-full">
        <p className="break-words text-center">{originURL}</p>
      </div>
      <div className="w-full">
        <GraphClicks clicksData={clicksData} timeZone={timeZone} />
      </div>
    </div>
  );
}
