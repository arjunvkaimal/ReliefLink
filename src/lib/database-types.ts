export interface Report {
  id: string;
  user_id: string;
  report: string;
  report_type: string | null;
  report_date: string;
  request_id: string | null;
  volunteer_id: string | null;
}

export interface Profile {
  id: string;
  name: string;
  contact: string | null;
}
