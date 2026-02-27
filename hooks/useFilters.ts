"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Job, JobFilters, SortOption } from "@/types/job";

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<JobFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "all",
      employment_types: searchParams.getAll("employment_types"),
      category: searchParams.get("category") || "all",
      is_remote: searchParams.get("is_remote") === "true",
      salary_range: [
        Number(searchParams.get("min_salary")) || 0,
        Number(searchParams.get("max_salary")) || 500000,
      ],
      min_openings: Number(searchParams.get("min_openings")) || 0,
      created_within: searchParams.get("created_within")
        ? Number(searchParams.get("created_within"))
        : null,
    };
  }, [searchParams]);

  const sort = (searchParams.get("sort") as SortOption) || "newest";

  const updateFilters = useCallback(
    (newFilters: Partial<JobFilters & { sort: SortOption }>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (key === "salary_range" && Array.isArray(value)) {
          if (value[0] === 0) params.delete("min_salary");
          else params.set("min_salary", String(value[0]));
          if (value[1] === 500000) params.delete("max_salary");
          else params.set("max_salary", String(value[1]));
        } else if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all" ||
          value === false ||
          value === 0 ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.set(key, String(value));
        }
      });

      const newQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (newQuery !== currentQuery) {
        router.push(`?${newQuery}`, { scroll: false });
      }
    },
    [router, searchParams],
  );

  const filterJobs = useCallback(
    (jobs: Job[]) => {
      return jobs
        .filter((job) => {
          const searchLower = filters.search.toLowerCase().trim();
          const matchesSearch =
            !searchLower ||
            job.title.toLowerCase().includes(searchLower) ||
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower);

          const matchesLocation =
            filters.location === "all" ||
            job.location.trim().toLowerCase() ===
              filters.location.trim().toLowerCase();

          const matchesType =
            filters.employment_types.length === 0 ||
            filters.employment_types.some(
              (t) =>
                t.trim().toLowerCase() ===
                job.employment_type.trim().toLowerCase(),
            );

          const matchesCategory =
            filters.category === "all" ||
            job.job_category.trim().toLowerCase() ===
              filters.category.trim().toLowerCase();

          const matchesRemote = !filters.is_remote || job.is_remote_work === 1;

          const matchesSalary =
            job.salary_from >= filters.salary_range[0] &&
            job.salary_to <= filters.salary_range[1];

          const matchesOpenings = job.openings >= filters.min_openings;

          let matchesDate = true;
          if (filters.created_within) {
            const date = new Date();
            date.setDate(date.getDate() - filters.created_within);
            matchesDate = new Date(job.created_at) >= date;
          }

          return (
            matchesSearch &&
            matchesLocation &&
            matchesType &&
            matchesCategory &&
            matchesRemote &&
            matchesSalary &&
            matchesOpenings &&
            matchesDate
          );
        })
        .sort((a, b) => {
          switch (sort) {
            case "newest":
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case "oldest":
              return (
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              );
            case "salary_high":
              return b.salary_to - a.salary_to;
            case "salary_low":
              return a.salary_from - b.salary_from;
            case "most_openings":
              return b.openings - a.openings;
            default:
              return 0;
          }
        });
    },
    [filters, sort],
  );

  return { filters, sort, updateFilters, filterJobs };
}
