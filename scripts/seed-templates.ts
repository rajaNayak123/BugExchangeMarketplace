import {
  PrismaClient,
  BugCategory,
  BugPriority,
  BugSeverity,
} from "@prisma/client";

const prisma = new PrismaClient();

const bugTemplates = [
  {
    name: "SQL Injection Vulnerability",
    description:
      "SQL injection occurs when untrusted user input is directly concatenated into SQL queries without proper sanitization.",
    category: BugCategory.SECURITY,
    priority: BugPriority.HIGH,
    severity: BugSeverity.BLOCKER,
    tags: ["security", "sql-injection", "database", "vulnerability"],
    isActive: true,
  },
  {
    name: "XSS (Cross-Site Scripting)",
    description:
      "XSS allows attackers to inject malicious scripts into web pages viewed by other users.",
    category: BugCategory.SECURITY,
    priority: BugPriority.HIGH,
    severity: BugSeverity.BLOCKER,
    tags: ["security", "xss", "javascript", "vulnerability"],
    isActive: true,
  },
  {
    name: "Memory Leak",
    description:
      "Memory leaks occur when a program fails to release memory that is no longer needed.",
    category: BugCategory.PERFORMANCE,
    priority: BugPriority.MEDIUM,
    severity: BugSeverity.MAJOR,
    tags: ["performance", "memory", "leak", "optimization"],
    isActive: true,
  },
  {
    name: "Slow Database Query",
    description:
      "Database queries that take an excessive amount of time to execute, causing performance issues.",
    category: BugCategory.PERFORMANCE,
    priority: BugPriority.MEDIUM,
    severity: BugSeverity.MAJOR,
    tags: ["performance", "database", "query", "optimization"],
    isActive: true,
  },
  {
    name: "UI Responsiveness Issue",
    description:
      "User interface elements that are slow to respond or freeze during user interactions.",
    category: BugCategory.UI_UX,
    priority: BugPriority.MEDIUM,
    severity: BugSeverity.MODERATE,
    tags: ["ui", "ux", "responsiveness", "performance"],
    isActive: true,
  },
  {
    name: "Accessibility Violation",
    description:
      "Issues that prevent users with disabilities from accessing or using the application effectively.",
    category: BugCategory.ACCESSIBILITY,
    priority: BugPriority.MEDIUM,
    severity: BugSeverity.MAJOR,
    tags: ["accessibility", "a11y", "wcag", "inclusive-design"],
    isActive: true,
  },
  {
    name: "API Rate Limiting",
    description:
      "Missing or improperly configured rate limiting that can lead to abuse or service degradation.",
    category: BugCategory.SECURITY,
    priority: BugPriority.MEDIUM,
    severity: BugSeverity.MAJOR,
    tags: ["security", "api", "rate-limiting", "abuse-prevention"],
    isActive: true,
  },
  {
    name: "Input Validation Bypass",
    description:
      "Security controls that can be bypassed through various input manipulation techniques.",
    category: BugCategory.SECURITY,
    priority: BugPriority.HIGH,
    severity: BugSeverity.BLOCKER,
    tags: ["security", "input-validation", "bypass", "vulnerability"],
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Seeding bug templates...");

  for (const template of bugTemplates) {
    const created = await prisma.bugTemplate.create({
      data: template,
    });
    console.log(`✅ Created template: ${created.name}`);
  }

  console.log("🎉 Bug templates seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding templates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
