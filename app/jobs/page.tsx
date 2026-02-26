"use client";

import { useJobs } from "@/hooks/useJobs";
import { useFilters } from "@/hooks/useFilters";
import { JobCard, JobCardSkeleton } from "@/components/job-card";
import { SearchFilter } from "@/components/filters/search-filter";
import { SideFilters } from "@/components/filters/side-filters";
import { FilterSummary } from "@/components/filters/filter-summary";
import { ExportButtons } from "@/components/export/export-buttons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Menu,
  Info,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JobFilters, SortOption } from "@/types/job";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function JobsContent() {
  const [isInfiniteMode, setIsInfiniteMode] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const { filters, sort, updateFilters, filterJobs } = useFilters();

  const { data: allData, isLoading } = useJobs();
  const allJobs = allData?.jobs || [];

  const { ref, inView } = useInView();

  const dynamicOptions = useMemo(() => {
    const categories = new Set<string>();
    const locations = new Set<string>();
    const employmentTypes = new Set<string>();

    allJobs.forEach((job) => {
      if (job.job_category) categories.add(job.job_category);
      if (job.location) locations.add(job.location);
      if (job.employment_type) employmentTypes.add(job.employment_type);
    });

    return {
      categories: Array.from(categories).sort(),
      locations: ["all", ...Array.from(locations).sort()],
      employmentTypes: Array.from(employmentTypes).sort(),
    };
  }, [allJobs]);

  const filteredJobs = useMemo(
    () => filterJobs(allJobs),
    [allJobs, filterJobs],
  );

  const displayedJobs = useMemo(() => {
    if (isInfiniteMode) {
      return filteredJobs.slice(0, page * itemsPerPage);
    }
    const startIndex = (page - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, page, isInfiniteMode, itemsPerPage]);

  const hasNextPage = isInfiniteMode
    ? displayedJobs.length < filteredJobs.length
    : page * itemsPerPage < filteredJobs.length;

  useEffect(() => {
    if (inView && isInfiniteMode && hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [inView, isInfiniteMode, hasNextPage]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, isInfiniteMode]);

  const handleSearchChange = useCallback(
    (v: string) => updateFilters({ search: v }),
    [updateFilters],
  );

  const handleRemoveFilter = useCallback(
    (key: keyof JobFilters, val?: any) => {
      if (key === "employment_types") {
        updateFilters({
          employment_types: filters.employment_types.filter((t) => t !== val),
        });
      } else if (key === "salary_range") {
        updateFilters({ salary_range: [0, 500000] });
      } else {
        updateFilters({
          [key]:
            key === "location" || key === "category"
              ? "all"
              : key === "is_remote"
                ? false
                : key === "min_openings"
                  ? 0
                  : null,
        });
      }
    },
    [filters.employment_types, updateFilters],
  );

  const clearAllFilters = useCallback(() => {
    updateFilters({
      search: "",
      location: "all",
      category: "all",
      employment_types: [],
      is_remote: false,
      salary_range: [0, 500000],
      min_openings: 0,
      created_within: null,
    });
  }, [updateFilters]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 premium-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block">Windmark</h1>
          </div>

          <SearchFilter value={filters.search} onChange={handleSearchChange} />

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden glass border-white/10"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] glass">
                <SideFilters
                  filters={filters}
                  sort={sort}
                  updateFilters={updateFilters}
                  dynamicOptions={dynamicOptions}
                />
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex items-center gap-4 ml-4">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="mode-toggle"
                  className="text-xs text-muted-foreground"
                >
                  Infinite Scroll
                </Label>
                <Switch
                  id="mode-toggle"
                  checked={isInfiniteMode}
                  onCheckedChange={setIsInfiniteMode}
                />
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <SideFilters
              filters={filters}
              sort={sort}
              updateFilters={updateFilters}
              dynamicOptions={dynamicOptions}
            />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <FilterSummary
              filters={filters}
              count={filteredJobs.length}
              removeFilter={handleRemoveFilter}
            />
            <div className="flex items-center gap-4 self-end">
              <ExportButtons jobs={filteredJobs} filters={filters} />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {displayedJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <LayoutGrid className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No jobs found</h3>
                <p className="text-muted-foreground max-w-xs">
                  Try adjusting your filters or search keywords to find what
                  you're looking for.
                </p>
                <Button variant="link" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination or Loading More */}
          {!isLoading && filteredJobs.length > 0 && (
            <div className="mt-12 py-8 flex justify-center">
              {isInfiniteMode ? (
                <div ref={ref} className="text-center">
                  {hasNextPage ? (
                    <span className="text-sm text-muted-foreground">
                      Scroll for more
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      You've reached the end
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="glass border-white/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filteredJobs.length < 12}
                    onClick={() => setPage((p) => p + 1)}
                    className="glass border-white/10"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground font-medium">
            Loading Portal...
          </p>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
