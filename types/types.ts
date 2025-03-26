//incident types

declare interface NotificationsData {
  sentAt: string;
  type: string;
}
declare interface IncidentLogsData {
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
declare interface KeywordDensityData {
  SEO: number;
  analysis: number;
  website: number;
}
declare interface SEOResponseI {
  url: string;
  title: string;
  description: string;
  h1: string;
  imagesWithoutAlt: number;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  keywordDensity: KeywordDensityData[];
  isMobileFriendly: boolean;
  loadTime: number;
  seoScore: number;
  message: string;
  error?: string | null;
  details?: string | null;
}
