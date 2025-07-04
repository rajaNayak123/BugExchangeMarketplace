import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BugDetails } from "@/components/bug-details";

interface BugPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Define the types for the Prisma query result
type BugWithRelations = NonNullable<Awaited<ReturnType<typeof getBugWithRelations>>>;

type SubmissionWithSubmitter = {
  id: string;
  description: string;
  solution: string;
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

  return <BugDetails bug={bugData} />;
}