"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"

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
]

export function BugFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    tags: searchParams.get("tags")?.split(",") || [],
    minBounty: searchParams.get("minBounty") || "",
    maxBounty: searchParams.get("maxBounty") || "",
  })

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.query) params.append("query", filters.query)
    if (filters.tags.length > 0) params.append("tags", filters.tags.join(","))
    if (filters.minBounty) params.append("minBounty", filters.minBounty)
    if (filters.maxBounty) params.append("maxBounty", filters.maxBounty)

    router.push(`/bugs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      tags: [],
      minBounty: "",
      maxBounty: "",
    })
    router.push("/bugs")
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search bugs..."
          value={filters.query}
          onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
        />
      </div>

      <div>
        <Label>Bounty Range (₹)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.minBounty}
            onChange={(e) => setFilters((prev) => ({ ...prev, minBounty: e.target.value }))}
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.maxBounty}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxBounty: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {POPULAR_TAGS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox id={tag} checked={filters.tags.includes(tag)} onCheckedChange={() => handleTagToggle(tag)} />
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
  )
}
