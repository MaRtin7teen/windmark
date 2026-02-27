import { Job } from "@/types/job";

const API_BASE_URL = "https://jsonfakery.com/jobs";

export async function fetchJobs(): Promise<{ jobs: Job[]; total: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.statusText}`);
    }

    const data = await res.json();

    // Map API fields to our Job interface
    const jobs: Job[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      company: item.company,
      location: item.location,
      salary_from: item.salary_from,
      salary_to: item.salary_to,
      employment_type: item.employment_type,
      application_deadline: item.application_deadline,
      qualifications: item.qualifications,
      contact: item.contact,
      job_category: item.job_category,
      is_remote_work: item.is_remote_work,
      created_at: item.created_at,
      openings: item.number_of_opening,
    }));

    return {
      jobs,
      total: data.total,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      jobs: [],
      total: 0,
    };
  }
}
