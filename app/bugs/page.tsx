import { Suspense } from "react";
import { BugList } from "@/components/bugs/bug-list";
import { AdvancedSearch } from "@/components/common/advanced-search";
import { RecentActivity } from "@/components/features/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BugListSkeleton } from "@/components/ui/loading-skeletons";

export default function BugsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Bugs</h1>
        <p className="text-gray-600">Find bugs to fix and earn bounties</p>
      </div>

      <div className="space-y-6">
        <AdvancedSearch />
        <Suspense fallback={<BugListSkeleton />}>
          <BugList />
        </Suspense>
      </div>
    </div>
  );
}
