"use client";

import { JobFilters } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import React from "react";

interface FilterSummaryProps {
  filters: JobFilters;
  count: number;
  removeFilter: (key: keyof JobFilters, value?: any) => void;
}

export const FilterSummary = React.memo(
  ({ filters, count, removeFilter }: FilterSummaryProps) => {
    const activeFilters = [];

    if (filters.search)
      activeFilters.push({ key: "search", label: `Search: ${filters.search}` });
    if (filters.category !== "all")
      activeFilters.push({ key: "category", label: filters.category });
    if (filters.location !== "all")
      activeFilters.push({ key: "location", label: filters.location });
    filters.employment_types.forEach((type) =>
      activeFilters.push({ key: "employment_types", value: type, label: type }),
    );
    if (filters.is_remote)
      activeFilters.push({ key: "is_remote", label: "Remote only" });
    if (filters.min_openings > 0)
      activeFilters.push({
        key: "min_openings",
        label: `Min ${filters.min_openings} openings`,
      });
    if (filters.created_within)
      activeFilters.push({
        key: "created_within",
        label: `Last ${filters.created_within} days`,
      });
    if (filters.salary_range[0] > 0 || filters.salary_range[1] < 500000) {
      activeFilters.push({
        key: "salary_range",
        label: `₹${filters.salary_range[0].toLocaleString()} - ₹${filters.salary_range[1].toLocaleString()}`,
      });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
        <span className="text-sm text-muted-foreground mr-2">
          {count} results found:
        </span>
        {activeFilters.map((filter, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="pl-3 pr-2 py-1 rounded-full bg-primary/5 border-primary/10 text-primary flex items-center gap-1 group"
          >
            {filter.label}
            <button
              onClick={() =>
                removeFilter(
                  filter.key as keyof JobFilters,
                  (filter as any).value,
                )
              }
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  },
);

FilterSummary.displayName = "FilterSummary";
