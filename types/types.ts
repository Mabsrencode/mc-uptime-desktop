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
