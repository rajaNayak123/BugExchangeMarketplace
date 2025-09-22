"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

const POPULAR_TAGS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Next.js",
  "MongoDB",
  "PostgreSQL",
  "API",
  "Frontend",
  "Backend",
  "Database",
  "Authentication",
  "Performance",
];

export function BugFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    tags: searchParams.get("tags")?.split(",") || [],
    minBounty: searchParams.get("minBounty") || "",
    maxBounty: searchParams.get("maxBounty") || "",
    category: searchParams.get("category") || "",
    priority: searchParams.get("priority") || "",
    severity: searchParams.get("severity") || "",
  });

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.query) params.append("query", filters.query);
    if (filters.tags.length > 0) params.append("tags", filters.tags.join(","));
    if (filters.minBounty) params.append("minBounty", filters.minBounty);
    if (filters.maxBounty) params.append("maxBounty", filters.maxBounty);
    if (filters.category) params.append("category", filters.category);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.severity) params.append("severity", filters.severity);

    router.push(`/bugs?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      tags: [],
      minBounty: "",
      maxBounty: "",
      category: "",
      priority: "",
      severity: "",
    });
    router.push("/bugs");
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search bugs..."
          value={filters.query}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, query: e.target.value }))
          }
        />
      </div>

      <div>
        <Label>Bounty Range (₹)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.minBounty}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minBounty: e.target.value }))
            }
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.maxBounty}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxBounty: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="SECURITY">Security</option>
          <option value="PERFORMANCE">Performance</option>
          <option value="UI_UX">UI/UX</option>
          <option value="FUNCTIONALITY">Functionality</option>
          <option value="ACCESSIBILITY">Accessibility</option>
          <option value="COMPATIBILITY">Compatibility</option>
          <option value="DOCUMENTATION">Documentation</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <Label>Priority</Label>
        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div>
        <Label>Severity</Label>
        <select
          value={filters.severity}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, severity: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          <option value="MINOR">Minor</option>
          <option value="MODERATE">Moderate</option>
          <option value="MAJOR">Major</option>
          <option value="BLOCKER">Blocker</option>
        </select>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {POPULAR_TAGS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={tag}
                checked={filters.tags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              />
              <Label htmlFor={tag} className="text-sm font-normal">
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
