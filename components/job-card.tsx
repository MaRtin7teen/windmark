"use client";

import { Job } from "@/types/job";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

import React, { useMemo } from "react";

interface JobCardProps {
  job: Job;
  index: number;
}

export const JobCard = React.memo(({ job, index }: JobCardProps) => {
  const qualifications = useMemo(() => {
    try {
      const parsed = JSON.parse(job.qualifications);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [job.qualifications]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="premium-card group h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {job.company}
            </p>
          </div>
          <Badge
            variant={job.is_remote_work ? "default" : "secondary"}
            className="rounded-full"
          >
            {job.is_remote_work ? "Remote" : "On-site"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {job.employment_type}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center text-primary font-semibold">
            <IndianRupee className="h-4 w-4" />
            <span>
              {job.salary_from.toLocaleString()} -{" "}
              {job.salary_to.toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {qualifications.map((q: string, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[10px] font-normal px-2 py-0"
              >
                {q}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

JobCard.displayName = "JobCard";

export function JobCardSkeleton() {
  return (
    <Card className="h-full animate-pulse border-white/5">
      <CardHeader className="space-y-2">
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-muted rounded-full" />
          <div className="h-4 w-20 bg-muted rounded-full" />
        </div>
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </CardContent>
    </Card>
  );
}
