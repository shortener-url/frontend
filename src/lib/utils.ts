import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from 'luxon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchAPI(url: string, options: RequestInit): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {      
      console.error(`❗❗❗ Failed to fetch data ❗❗❗ Status: ${res.status} - ${res.statusText}`);
    }
    return res;
  } catch (error) {    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`❌ An error occurred while fetching data from ${url}: ${errorMessage}`);
  }
}


const groupByDay = (clicks: Click[], timeZone: string): GroupedData[] => {
  const grouped: { [key: string]: number } = {};
  clicks.forEach(click => {
    const date = DateTime.fromISO(click.created_at, { zone: timeZone }).toISODate();
    if (date) {
      grouped[date] = (grouped[date] || 0) + 1;
    } else {
      console.warn(`Failed to parse date for click with id ${click.id}`);
    }
  });

  return Object.keys(grouped).map(date => ({
    date,
    clicks: grouped[date],
  }));
};


const groupByHour = (clicks: Click[], timeZone: string): GroupedData[] => {
  const grouped: { [key: string]: number } = {};
  clicks.forEach(click => {
    const date = DateTime.fromISO(click.created_at, { zone: timeZone }).toFormat('yyyy-MM-dd HH');
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.keys(grouped).map(date => ({
    date,
    clicks: grouped[date],
  }));
};

const groupByWeek = (clicks: Click[], timeZone: string): GroupedData[] => {
  const grouped: { [key: string]: number } = {};
  clicks.forEach(click => {
    const week = DateTime.fromISO(click.created_at, { zone: timeZone }).toFormat('yyyy-\'W\'WW');
    grouped[week] = (grouped[week] || 0) + 1;
  });

  return Object.keys(grouped).map(week => ({
    date: week,
    clicks: grouped[week],
  }));
};

const groupByMonth = (clicks: Click[], timeZone: string): GroupedData[] => {
  const grouped: { [key: string]: number } = {};
  clicks.forEach(click => {
    const month = DateTime.fromISO(click.created_at, { zone: timeZone }).toFormat('yyyy-MM');
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.keys(grouped).map(month => ({
    date: month,
    clicks: grouped[month],
  }));
};

// Función principal para agrupar según el intervalo
export const groupByInterval = (
  clicks: Click[],
  interval: "hour" | "day" | "week" | "month",
  timeZone: string
): GroupedData[] => {
  const grouped: { [key: string]: number } = {};
  clicks.forEach((click) => {
    let date;
    switch (interval) {
      case "hour":
        date = DateTime.fromISO(click.created_at, { zone: timeZone }).toFormat("yyyy-MM-dd HH:00");
        break;
      case "day":
        date = DateTime.fromISO(click.created_at, { zone: timeZone }).toISODate();
        break;
      case "week":
        const startOfWeek = DateTime.fromISO(click.created_at, { zone: timeZone }).startOf("week");
        date = startOfWeek.toISODate();
        break;
      case "month":
        const startOfMonth = DateTime.fromISO(click.created_at, { zone: timeZone }).startOf("month");
        date = startOfMonth.toISODate();
        break;
    }
    if (date) {
      grouped[date] = (grouped[date] || 0) + 1;
    }
  });

  return Object.keys(grouped).map((date) => ({
    date,
    clicks: grouped[date],
  }));
};