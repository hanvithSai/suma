export interface Room {
  id: string;
  code: string;
  host_id: string;
  created_at?: string;
  status: string;
  current_pdf_url: string | null;
  current_pdf_page: number;
  co_hosts: string[];
}
