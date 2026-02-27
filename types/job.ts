export interface Job {
  id: string; // UUID
  title: string;
  description: string;
  company: string;
  location: string;
  salary_from: number;
  salary_to: number;
  employment_type: string;
  application_deadline: string;
  qualifications: string; // stringified JSON array
  contact: string;
  job_category: string;
  is_remote_work: number;
  created_at: string;
  openings: number;
}

export type JobFilters = {
  search: string;
  location: string;
  employment_types: string[];
  category: string;
  is_remote: boolean;
  salary_range: [number, number];
  min_openings: number;
  created_within: number | null; // 7 or 30
};

export type SortOption =
  | "newest"
  | "oldest"
  | "salary_high"
  | "salary_low"
  | "most_openings";
