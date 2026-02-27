"use client";

import { Job, JobFilters } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Download, FileDown, FileText } from "lucide-react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  jobs: Job[];
  filters: JobFilters;
}

export function ExportButtons({ jobs, filters }: ExportButtonsProps) {
  const exportCSV = () => {
    const data = jobs.map((job) => ({
      Title: job.title,
      Company: job.company,
      Location: job.location,
      "Salary From": job.salary_from,
      "Salary To": job.salary_to,
      "Employment Type": job.employment_type,
      Category: job.job_category,
      Remote: job.is_remote_work ? "Yes" : "No",
      Openings: job.openings,
      "Created At": new Date(job.created_at).toLocaleDateString(),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `jobs_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Filtered Job Results", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const filterInfo = [
      filters.search && `Search: ${filters.search}`,
      filters.category !== "all" && `Category: ${filters.category}`,
      filters.location !== "all" && `Location: ${filters.location}`,
      filters.is_remote && "Remote Only",
    ]
      .filter(Boolean)
      .join(" | ");

    doc.text(filterInfo, 14, 30);
    doc.text(`Total results: ${jobs.length}`, 14, 35);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

    const tableData = jobs.map((job) => [
      job.title,
      job.company,
      job.location,
      `₹${job.salary_from.toLocaleString()} - ₹${job.salary_to.toLocaleString()}`,
      job.employment_type,
      job.is_remote_work ? "Yes" : "No",
    ]);

    autoTable(doc, {
      startY: 45,
      head: [
        ["Title", "Company", "Location", "Salary Range", "Type", "Remote"],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [100, 100, 100] as any },
    });

    doc.save(`jobs_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="glass border-white/10 gap-2"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportPDF}
        className="glass border-white/10 gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
