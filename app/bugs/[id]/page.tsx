import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BugDetails } from "@/components/bugs/bug-details";
import { BugDetailsSkeleton } from "@/components/ui/loading-skeletons";
import { Suspense } from "react";

interface BugPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Define the types for the Prisma query result
type BugWithRelations = NonNullable<
  Awaited<ReturnType<typeof getBugWithRelations>>
>;

type SubmissionWithSubmitter = {
  id: string;
  description: string;
  solution: string;
  language?: string | null;
  status: string;
  createdAt: Date;
  submitter: {
    id: string;
    name: string | null;
    image: string | null;
    reputation: number;
  };
};

// Extract the query logic into a separate function for better type inference
async function getBugWithRelations(id: string) {
  return await prisma.bug.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          reputation: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          image: true,
          reputation: true,
        },
      },
      submissions: {
        include: {
          submitter: {
            select: {
              id: true,
              name: true,
              image: true,
              reputation: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function BugPage({ params }: BugPageProps) {
  const { id } = await params;

  const bug = await getBugWithRelations(id);

  if (!bug) {
    notFound();
  }

  // Type the bug data properly
  const bugData = {
    id: bug.id,
    title: bug.title,
    description: bug.description,
    stackTrace: bug.stackTrace || undefined,
    repoSnippet: bug.repoSnippet || undefined,
    bountyAmount: bug.bountyAmount,
    tags: bug.tags,
    status: bug.status,
    category: bug.category,
    priority: bug.priority,
    severity: bug.severity,
    assignedTo: bug.assignedTo
      ? {
          id: bug.assignedTo.id,
          name: bug.assignedTo.name || "",
          image: bug.assignedTo.image || undefined,
          reputation: bug.assignedTo.reputation,
        }
      : undefined,
    createdAt: bug.createdAt.toISOString(),
    author: {
      id: bug.author.id,
      name: bug.author.name || "",
      image: bug.author.image || undefined,
      reputation: bug.author.reputation,
    },
    submissions: bug.submissions.map((submission: SubmissionWithSubmitter) => ({
      id: submission.id,
      description: submission.description,
      solution: submission.solution,
      language: submission.language || undefined,
      status: submission.status,
      createdAt: submission.createdAt.toISOString(),
      submitter: {
        id: submission.submitter.id,
        name: submission.submitter.name || "",
        image: submission.submitter.image || undefined,
        reputation: submission.submitter.reputation,
      },
    })),
  };

  return (
    <Suspense fallback={<BugDetailsSkeleton />}>
      <BugDetails bug={bugData} />
    </Suspense>
  );
}
