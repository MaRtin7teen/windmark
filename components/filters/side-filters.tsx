"use client";

import { JobFilters, SortOption } from "@/types/job";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from "react";

interface SideFiltersProps {
  filters: JobFilters;
  sort: SortOption;
  updateFilters: (filters: Partial<JobFilters & { sort: SortOption }>) => void;
  dynamicOptions?: {
    categories: string[];
    locations: string[];
    employmentTypes: string[];
  };
}

export const SideFilters = React.memo(
  ({ filters, sort, updateFilters, dynamicOptions }: SideFiltersProps) => {
    return (
      <div className="space-y-6">
        <Card className="glass border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={() =>
                  updateFilters({
                    location: "all",
                    category: "all",
                    employment_types: [],
                    is_remote: false,
                    salary_range: [0, 500000],
                    min_openings: 0,
                    created_within: null,
                  })
                }
              >
                Reset
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Sort By</Label>
              <Select
                value={sort}
                onValueChange={(v) => updateFilters({ sort: v as SortOption })}
              >
                <SelectTrigger className="glass border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary_high">
                    Salary: High to Low
                  </SelectItem>
                  <SelectItem value="salary_low">
                    Salary: Low to High
                  </SelectItem>
                  <SelectItem value="most_openings">Most Openings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Job Category</Label>
              <Select
                value={filters.category}
                onValueChange={(v) => updateFilters({ category: v })}
              >
                <SelectTrigger className="glass border-white/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(dynamicOptions?.categories || []).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Location</Label>
              <Select
                value={filters.location}
                onValueChange={(v) => updateFilters({ location: v })}
              >
                <SelectTrigger className="glass border-white/10">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {(dynamicOptions?.locations || [])
                    .filter((l) => l !== "all")
                    .map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Employment Type</Label>
              <div className="space-y-2">
                {(dynamicOptions?.employmentTypes || []).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.employment_types.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...filters.employment_types, type]
                          : filters.employment_types.filter((t) => t !== type);
                        updateFilters({ employment_types: newTypes });
                      }}
                    />
                    <Label
                      htmlFor={type}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label>Salary Range (₹)</Label>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {filters.salary_range[0].toLocaleString()} -{" "}
                  {filters.salary_range[1].toLocaleString()}
                </span>
              </div>
              <Slider
                value={filters.salary_range}
                max={500000}
                step={10000}
                onValueChange={(v) =>
                  updateFilters({ salary_range: v as [number, number] })
                }
                className="py-4"
              />
            </div>

            <div className="space-y-3">
              <Label>Minimum Openings</Label>
              <Input
                type="number"
                min={0}
                placeholder="Min openings"
                className="glass border-white/10"
                value={filters.min_openings || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFilters({ min_openings: Number(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Created Within</Label>
              <Select
                value={filters.created_within?.toString() || "all"}
                onValueChange={(v) =>
                  updateFilters({
                    created_within: v === "all" ? null : Number(v),
                  })
                }
              >
                <SelectTrigger className="glass border-white/10">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="remote-toggle" className="cursor-pointer">
                Remote Only
              </Label>
              <Switch
                id="remote-toggle"
                checked={filters.is_remote}
                onCheckedChange={(v) => updateFilters({ is_remote: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

SideFilters.displayName = "SideFilters";
