//incident types

interface NotificationsData {
  sentAt: string;
  type: string;
}
interface IncidentLogsData {
  id: string;
  siteId: string;
  startTime: string;
  endTime: string | null;
  resolved: boolean;
  error?: string | null;
  details?: string | null;
  url: string;
  email: string;
  monitorType: string;
  interval: number;
  up: boolean;
  notifications: NotificationsData[] | null;
}

//incident types end

// seo data types
type SEOResponseI = {
  description: {
    length: number;
    optimal: boolean;
    text: string;
  };
  finalUrl: string;
  headings: {
    h1: { count: number; texts: string[] };
    h2: { count: number; texts: string[] };
    h3: { count: number; texts: string[] };
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  keywords: {
    density: Record<string, number>;
    prominent: string[];
  };
  links: {
    broken: number;
    external: number;
    internal: number;
    ratio: number;
    total: number;
  };
  mobile: {
    friendly: boolean;
    tapTargets: boolean;
    viewport: boolean;
  };
  performance: {
    loadTime: number;
    pageSize: number;
    requests: number;
  };
  seoScore: number;
  structure: {
    canonical: string | null;
    lang: string;
    schemaMarkup: boolean;
  };
  suggestions: string[];
  title: {
    length: number;
    optimal: boolean;
    text: string;
  };
  url: string;
  warnings: string[];
  serpPreview: {
    title: string;
    description: string;
    url: string;
    favicon: string;
  };
};
// analyze performance types

interface PerformanceResponseI {
  url: string;
  loadTime: number;
  timeToFirstByte: number;
  pageSize: number;
  numberOfRequests: number;
  domContentLoadedTime: number;
  fullyLoadedTime: number;
  performanceScore: number;
  message: string;
  error?: string;
  details?: string;
}
