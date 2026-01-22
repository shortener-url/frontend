interface Data<T> {
  status: string;
  message: string | null;
  data: T | null;
}

interface Click {
    id: number;
    url_ID: number;
    ip: string;
    browser: string;
    referer: string;
    created_at: string;
  }
  
  interface UrlData {
    url_ID: number;
    original_url: string;
    short_url: string;
    clicks: Click[];
    created_at: string;
  }

// Para una respuesta que contiene un array de UrlData
type UrlStatsResponse = Data<UrlData[]>;

type UrlResponse = Data<string>;


type TimeInterval = 'hour' | 'day' | 'week' | 'month';

interface GroupedData {
  date: string;
  clicks:number;
}

