import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 character"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const bugSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  stackTrace: z.string().optional(),
  repoSnippet: z.string().optional(),
  bountyAmount: z.number().min(100, "Minimum bounty is ₹100"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z
    .enum([
      "SECURITY",
      "PERFORMANCE",
      "UI_UX",
      "FUNCTIONALITY",
      "ACCESSIBILITY",
      "COMPATIBILITY",
      "DOCUMENTATION",
      "OTHER",
    ])
    .default("FUNCTIONALITY"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  severity: z
    .enum(["MINOR", "MODERATE", "MAJOR", "BLOCKER"])
    .default("MODERATE"),
  assignedToId: z.string().optional(),
  templateId: z.string().optional(),
});

export const submissionSchema = z.object({
  description: z.string().min(20, "Description must be at least 20 characters"),
  solution: z.string().min(50, "Solution must be at least 50 characters"),
  language: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  minBounty: z.number().optional(),
  maxBounty: z.number().optional(),
});
