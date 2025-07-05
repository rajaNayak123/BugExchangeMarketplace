import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Bug, CheckCircle, IndianRupee } from "lucide-react";

// Define types for better type safety
type UserBug = {
  id: string;
  title: string;
  bountyAmount: number;
  status: string;
  createdAt: Date;
};

type UserSubmission = {
  id: string;
  status: string;
  createdAt: Date;
  bug: {
    id: string;
    title: string;
    bountyAmount: number;
  };
};

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  reputation: number;
  bugs: UserBug[];
  submissions: UserSubmission[];
};

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bugs: {
        select: {
          id: true,
          title: true,
          bountyAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      submissions: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          bug: {
            select: {
              id: true,
              title: true,
              bountyAmount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  const stats = {
    totalBugs: user.bugs.length,
    resolvedBugs: user.bugs.filter((b: UserBug) => b.status === "RESOLVED").length,
    totalSubmissions: user.submissions.length,
    approvedSubmissions: user.submissions.filter((s: UserSubmission) => s.status === "APPROVED").length,
    totalEarnings: user.submissions
      .filter((s: UserSubmission) => s.status === "APPROVED")
      .reduce((sum: number, s: UserSubmission) => sum + s.bug.bountyAmount, 0),
  };

  return { user, stats };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const result = await getUserProfile(session.user.id);

  if (!result) {
    redirect("/auth/signin");
  }

  const { user, stats } = result;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">
                  {user.reputation} Reputation
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs Posted</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBugs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resolvedBugs} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedSubmissions} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSubmissions > 0
                ? Math.round(
                    (stats.approvedSubmissions / stats.totalSubmissions) * 100
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bugs Posted</CardTitle>
          </CardHeader>
          <CardContent>
            {user.bugs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No bugs posted yet
              </p>
            ) : (
              <div className="space-y-3">
                {user.bugs.map((bug: UserBug) => (
                  <div
                    key={bug.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {bug.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {bug.bountyAmount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          bug.status === "OPEN" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {bug.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No submissions yet
              </p>
            ) : (
              <div className="space-y-3">
                {user.submissions.map((submission: UserSubmission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {submission.bug.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {submission.bug.bountyAmount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          submission.status === "APPROVED"
                            ? "default"
                            : submission.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}