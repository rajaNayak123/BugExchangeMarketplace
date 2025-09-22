import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Bug, Users, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Leaderboard } from "@/components/features/leaderboard";

async function getStats() {
  const [totalBugs, totalUsers, totalBounty] = await Promise.all([
    prisma.bug.count(),
    prisma.user.count(),
    prisma.bug.aggregate({
      _sum: {
        bountyAmount: true,
      },
    }),
  ]);

  return {
    totalBugs,
    totalUsers,
    totalBounty: totalBounty._sum.bountyAmount || 0,
  };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bug Exchange Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect developers worldwide. Post bugs with bounties, claim fixes,
            and earn rewards. Build your reputation in the developer community.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/bugs">
                <Search className="w-5 h-5 mr-2" />
                Browse Bugs
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/bugs/new">
                <Bug className="w-5 h-5 mr-2" />
                Post a Bug
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Bug className="w-12 h-12 mx-auto text-blue-600" />
              <CardTitle className="text-3xl font-bold">
                {stats.totalBugs}
              </CardTitle>
              <CardDescription>Active Bugs</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-green-600" />
              <CardTitle className="text-3xl font-bold">
                {stats.totalUsers}
              </CardTitle>
              <CardDescription>Developers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Trophy className="w-12 h-12 mx-auto text-yellow-600" />
              <CardTitle className="text-3xl font-bold">
                ₹{stats.totalBounty.toLocaleString()}
              </CardTitle>
              <CardDescription>Total Bounties</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* How it Works */}
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <CardTitle>Post Your Bug</CardTitle>
                  <CardDescription>
                    Describe your bug with details, stack trace, and set a
                    bounty amount
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <CardTitle>Developers Claim</CardTitle>
                  <CardDescription>
                    Skilled developers review and claim bugs they can fix
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-yellow-600">
                      3
                    </span>
                  </div>
                  <CardTitle>Get Paid</CardTitle>
                  <CardDescription>
                    Submit your fix, get approved, and receive the bounty
                    payment
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div>
            <Leaderboard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers earning money by fixing bugs
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/signup">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
