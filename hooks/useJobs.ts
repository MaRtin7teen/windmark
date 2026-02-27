"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs", "all"],
    queryFn: () => fetchJobs(),
  });
}
