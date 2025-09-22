"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Save, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface SearchFilters {
  query: string;
  tags: string[];
  minBounty: number;
  maxBounty: number;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-bounty", label: "Highest Bounty" },
  { value: "lowest-bounty", label: "Lowest Bounty" },
  { value: "most-submissions", label: "Most Submissions" },
  { value: "least-submissions", label: "Least Submissions" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "CLAIMED", label: "Claimed" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const COMMON_TAGS = [
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Dart",
  "Flutter",
  "Frontend",
  "Backend",
  "Full-stack",
  "Mobile",
  "Web",
  "API",
  "Database",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "CSS",
  "HTML",
  "SASS",
  "Tailwind",
  "Bootstrap",
  "Material-UI",
  "Ant Design",
];

export function AdvancedSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("query") || "",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    minBounty: Number(searchParams.get("minBounty")) || 0,
    maxBounty: Number(searchParams.get("maxBounty")) || 10000,
    status: searchParams.get("status") || "all",
    sortBy: searchParams.get("sortBy") || "newest",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved searches:", error);
      }
    }
  }, []);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: SearchFilters) => {
      const params = new URLSearchParams();

      if (newFilters.query) params.set("query", newFilters.query);
      if (newFilters.tags.length > 0)
        params.set("tags", newFilters.tags.join(","));
      if (newFilters.minBounty > 0)
        params.set("minBounty", newFilters.minBounty.toString());
      if (newFilters.maxBounty < 10000)
        params.set("maxBounty", newFilters.maxBounty.toString());
      if (newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.sortBy !== "newest")
        params.set("sortBy", newFilters.sortBy);
      if (newFilters.sortOrder !== "desc")
        params.set("sortOrder", newFilters.sortOrder);

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  // Handle search input with autocomplete
  const handleSearchInput = async (value: string) => {
    setFilters((prev) => ({ ...prev, query: value }));

    if (value.length > 1) {
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(value)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        // Fallback to local filtering
        const filtered = COMMON_TAGS.filter((tag) =>
          tag.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Add tag to filters
  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      const newFilters = { ...filters, tags: [...filters.tags, tag] };
      setFilters(newFilters);
      updateURL(newFilters);
    }
  };

  // Remove tag from filters
  const removeTag = (tag: string) => {
    const newFilters = {
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    updateURL(filters);
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters: SearchFilters = {
      query: "",
      tags: [],
      minBounty: 0,
      maxBounty: 10000,
      status: "all",
      sortBy: "newest",
      sortOrder: "desc",
    };
    setFilters(newFilters);
    updateURL(newFilters);
    toast.success("Filters cleared");
  };

  // Save current search
  const saveSearch = () => {
    const searchName = prompt("Enter a name for this search:");
    if (!searchName) return;

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updatedSearches = [...savedSearches, newSavedSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
    toast.success("Search saved successfully!");
  };

  // Load saved search
  const loadSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    updateURL(savedSearch.filters);
    toast.success(`Loaded search: ${savedSearch.name}`);
  };

  // Delete saved search
  const deleteSavedSearch = (id: string) => {
    const updatedSearches = savedSearches.filter((search) => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
    toast.success("Search deleted");
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Bugs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input with Autocomplete */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search bugs by title, description, or tags..."
                  value={filters.query}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() =>
                    filters.query.length > 1 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          addTag(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={applyFilters} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </Button>
            </div>
          </div>

          {/* Selected Tags */}
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
            </Button>
            <Button
              variant="outline"
              onClick={saveSearch}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Search
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bounty Range */}
            <div className="space-y-2">
              <Label>
                Bounty Range: ₹{filters.minBounty} - ₹{filters.maxBounty}
              </Label>
              <Slider
                value={[filters.minBounty, filters.maxBounty]}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({
                    ...prev,
                    minBounty: min,
                    maxBounty: max,
                  }))
                }
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value: string) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: string) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: string) =>
                  setFilters((prev) => ({ ...prev, sortOrder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Tag Selection */}
            <div className="space-y-2">
              <Label>Quick Add Tags</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.slice(0, 12).map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    disabled={filters.tags.includes(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{search.name}</div>
                    <div className="text-sm text-gray-500">
                      {search.filters.query && `"${search.filters.query}"`}
                      {search.filters.tags.length > 0 &&
                        ` • ${search.filters.tags.join(", ")}`}
                      {search.filters.status !== "all" &&
                        ` • ${search.filters.status}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => loadSearch(search)}>
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSavedSearch(search.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
