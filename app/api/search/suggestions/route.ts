import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get unique tags from bugs
    const bugs = await prisma.bug.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
        ],
      },
      select: {
        tags: true,
        title: true,
      },
      take: 50,
    });

    // Extract unique tags and titles
    const suggestions = new Set<string>();

    bugs.forEach((bug) => {
      // Add matching tags
      bug.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });

      // Add matching words from title
      const titleWords = bug.title.split(/\s+/);
      titleWords.forEach((word) => {
        if (
          word.toLowerCase().includes(query.toLowerCase()) &&
          word.length > 2
        ) {
          suggestions.add(word);
        }
      });
    });

    // Common programming terms
    const commonTerms = [
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
      "Bug",
      "Error",
      "Crash",
      "Performance",
      "Security",
      "Authentication",
      "Authorization",
      "Validation",
      "Testing",
      "Deployment",
      "CI/CD",
    ];

    commonTerms.forEach((term) => {
      if (term.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(term);
      }
    });

    const sortedSuggestions = Array.from(suggestions)
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.toLowerCase() === query.toLowerCase();
        const bExact = b.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then by length (shorter first)
        return a.length - b.length;
      })
      .slice(0, 10);

    return NextResponse.json({ suggestions: sortedSuggestions });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
