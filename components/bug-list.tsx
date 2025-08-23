"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, IndianRupee, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { BugListSkeleton } from "@/components/ui/loading-skeletons";
import { Pagination } from "@/components/ui/pagination";

interface Bug {
  id: string;
  title: string;
  description: string;
  bountyAmount: number;
  tags: string[];
  status: string;
  createdAt: string;
  author: {
    name: string;
    image?: string;
    reputation: number;
  };
  _count: {
    submissions: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface BugsResponse {
  bugs: Bug[];
  pagination: PaginationInfo;
}

export function BugList() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBugs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        // Add search parameters
        if (searchParams.get("query")) {
          params.append("query", searchParams.get("query")!);
        }
        if (searchParams.get("tags")) {
          params.append("tags", searchParams.get("tags")!);
        }
        if (searchParams.get("minBounty")) {
          params.append("minBounty", searchParams.get("minBounty")!);
        }
        if (searchParams.get("maxBounty")) {
          params.append("maxBounty", searchParams.get("maxBounty")!);
        }
        if (searchParams.get("status")) {
          params.append("status", searchParams.get("status")!);
        }
        if (searchParams.get("sortBy")) {
          params.append("sortBy", searchParams.get("sortBy")!);
        }
        if (searchParams.get("sortOrder")) {
          params.append("sortOrder", searchParams.get("sortOrder")!);
        }
        if (searchParams.get("page")) {
          params.append("page", searchParams.get("page")!);
        }

        const response = await fetch(`/api/bugs?${params.toString()}`);
        if (response.ok) {
          const data: BugsResponse = await response.json();
          setBugs(data.bugs);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching bugs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, [searchParams]);

  if (loading) {
    return <BugListSkeleton />;
  }

  if (bugs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No bugs found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    window.history.pushState({}, "", `?${params.toString()}`);
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {bugs.length} of {pagination.totalCount} bugs
        {pagination.totalPages > 1 &&
          ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
      </div>

      {/* Bug List */}
      <div className="space-y-4">
        {bugs.map((bug) => (
          <Card key={bug.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Link
                      href={`/bugs/${bug.id}`}
                      className="hover:text-blue-600"
                    >
                      {bug.title}
                    </Link>
                  </CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {bug.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {bug.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center text-green-600 font-semibold text-lg mb-2">
                    <IndianRupee className="w-4 h-4" />
                    {bug.bountyAmount.toLocaleString()}
                  </div>
                  <Badge
                    variant={bug.status === "OPEN" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {bug.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={bug.author.image || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {bug.author.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{bug.author.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {bug.author.reputation} rep
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{bug._count.submissions} submissions</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(bug.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
