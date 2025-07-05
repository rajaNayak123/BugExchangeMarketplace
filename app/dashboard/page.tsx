import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bug, IndianRupee, Trophy, User } from "lucide-react"
import Link from "next/link"
import { EmailTest } from "@/components/email-test"
import { DashboardPaymentButton } from "@/components/dashboard-client"
import { Prisma } from "@prisma/client"

// Define types for better type safety
type UserBug = Prisma.BugGetPayload<{
  include: {
    _count: {
      select: { submissions: true };
    };
    payments: {
      select: {
        status: true;
      };
    };
  };
}>;

type UserSubmission = Prisma.SubmissionGetPayload<{
  include: {
    bug: {
      select: {
        id: true;
        title: true;
        bountyAmount: true;
        author: {
          select: { name: true };
        };
      };
    };
  };
}>;

async function getUserData(userId: string) {
  const [user, userBugs, userSubmissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.bug.findMany({
      where: { authorId: userId },
      include: {
        _count: {
          select: { submissions: true },
        },
        payments: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      where: { submitterId: userId },
      include: {
        bug: {
          select: {
            id: true,
            title: true,
            bountyAmount: true,
            author: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const stats = {
    totalBugsPosted: userBugs.length,
    totalSubmissions: userSubmissions.length,
    approvedSubmissions: userSubmissions.filter((s: UserSubmission) => s.status === "APPROVED").length,
    totalEarnings: userSubmissions
      .filter((s: UserSubmission) => s.status === "APPROVED")
      .reduce((sum: number, s: UserSubmission) => sum + s.bug.bountyAmount, 0),
  }

  return { user, userBugs, userSubmissions, stats }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { user, userBugs, userSubmissions, stats } = await getUserData(session.user.id)

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.reputation}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs Posted</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBugsPosted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">{stats.approvedSubmissions} approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Email Test Component */}
      <div className="mb-8">
        <EmailTest />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-bugs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-bugs">My Bugs</TabsTrigger>
          <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="my-bugs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Posted Bugs</h2>
            <Button asChild>
              <Link href="/bugs/new">Post New Bug</Link>
            </Button>
          </div>

          {userBugs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">You haven't posted any bugs yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/bugs/new">Post Your First Bug</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userBugs.map((bug: UserBug) => {
                const isPaid = bug.payments.some((payment) => payment.status === "COMPLETED")
                const needsPayment = bug.status === "OPEN" && !isPaid

                return (
                  <Card key={bug.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            <Link href={`/bugs/${bug.id}`} className="hover:text-blue-600">
                              {bug.title}
                            </Link>
                          </CardTitle>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{bug.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center text-green-600 font-semibold mb-2">
                            <IndianRupee className="w-4 h-4" />
                            {bug.bountyAmount.toLocaleString()}
                          </div>
                          <Badge variant={bug.status === "OPEN" ? "default" : "secondary"}>{bug.status}</Badge>
                          {!isPaid && (
                            <Badge variant="outline" className="ml-2">
                              Unfunded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>{bug._count.submissions} submissions • </span>
                          <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                        </div>
                        {needsPayment && <DashboardPaymentButton bugId={bug.id} amount={bug.bountyAmount} />}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-submissions" className="space-y-4">
          <h2 className="text-xl font-semibold">My Submissions</h2>

          {userSubmissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">You haven't made any submissions yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/bugs">Browse Bugs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userSubmissions.map((submission: UserSubmission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          <Link href={`/bugs/${submission.bug.id}`} className="hover:text-blue-600">
                            {submission.bug.title}
                          </Link>
                        </CardTitle>
                        <p className="text-gray-600 text-sm mt-1">by {submission.bug.author.name}</p>
                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{submission.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center text-green-600 font-semibold mb-2">
                          <IndianRupee className="w-4 h-4" />
                          {submission.bug.bountyAmount.toLocaleString()}
                        </div>
                        <Badge
                          variant={
                            submission.status === "APPROVED"
                              ? "default"
                              : submission.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}