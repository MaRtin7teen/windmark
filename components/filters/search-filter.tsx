"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [text, setText] = useState(value);
  const [debouncedValue] = useDebounce(text, 500);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className="relative group max-w-xl w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        placeholder="Search jobs, companies, or keywords..."
        className="pl-10 h-12 glass border-white/10 group-hover:border-primary/50 transition-all rounded-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
