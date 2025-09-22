"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { X } from "lucide-react";
import { bugSchema } from "@/lib/validations";
import { BugCreationPaymentButton } from "@/components/bugs/bug-creation-client";
import { BugTemplateSelector } from "@/components/bugs/bug-template-selector";
import { DuplicateDetector } from "@/components/bugs/duplicate-detector";
import { toast } from "sonner";

export default function NewBugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdBugId, setCreatedBugId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stackTrace: "",
    repoSnippet: "",
    bountyAmount: "",
    category: "FUNCTIONALITY",
    priority: "MEDIUM",
    severity: "MODERATE",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (createdBugId && showPayment) {
      const handlePaymentSuccess = () => {
        router.push(`/bugs/${createdBugId}`);
      };
    }
  }, [createdBugId, router, showPayment]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTemplateSelect = (template: any) => {
    setFormData((prev) => ({
      ...prev,
      title: template.name,
      description: template.description,
      category: template.category,
      priority: template.priority,
      severity: template.severity,
      tags: template.tags,
    }));
    setShowTemplates(false);
    toast.success(`Template "${template.name}" applied successfully!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = bugSchema.parse({
        ...formData,
        bountyAmount: Number.parseFloat(formData.bountyAmount),
      });

      const response = await fetch("/api/bugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        const bug = await response.json();
        toast.success("Bug posted successfully!");
        setCreatedBugId(bug.id);
        setShowPayment(true);
      } else {
        const error = await response.json();
        console.log(error);

        toast.error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Please check your input");
    } finally {
      setIsLoading(false);
    }
  };

  const skipPayment = () => {
    router.push(`/bugs/${createdBugId}`);
  };

  if (showPayment && createdBugId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Fund Your Bug Bounty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Your bug has been posted!
              </h3>
              <p className="text-gray-600 mb-4">
                Now fund your bounty to make it active. Developers will be able
                to claim and fix your bug once payment is confirmed.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-semibold">
                  Bounty Amount: ₹
                  {Number.parseFloat(formData.bountyAmount).toLocaleString()}
                </p>
              </div>
            </div>

            <BugCreationPaymentButton
              bugId={createdBugId}
              amount={Number.parseFloat(formData.bountyAmount)}
            />

            <div className="text-center">
              <Button variant="outline" onClick={skipPayment}>
                Skip Payment (Fund Later)
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                You can fund your bounty later from the bug details page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Bug</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Template Selector */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full"
            >
              {showTemplates ? "Hide Templates" : "Show Bug Templates"}
            </Button>

            {showTemplates && (
              <div className="mt-4">
                <BugTemplateSelector
                  onTemplateSelect={handleTemplateSelect}
                  selectedCategory={formData.category}
                />
              </div>
            )}

            {/* Duplicate Detector */}
            <div className="mt-4">
              <DuplicateDetector
                title={formData.title}
                description={formData.description}
                tags={formData.tags}
                stackTrace={formData.stackTrace}
                onDuplicateFound={(duplicateId) => {
                  window.open(`/bugs/${duplicateId}`, "_blank");
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the bug"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="stackTrace">Stack Trace</Label>
              <Textarea
                id="stackTrace"
                placeholder="Paste your stack trace here (if applicable)"
                rows={4}
                value={formData.stackTrace}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stackTrace: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="repoSnippet">Code Snippet</Label>
              <div className="space-y-2">
                <Textarea
                  id="repoSnippet"
                  placeholder="Relevant code snippet or repository link"
                  rows={4}
                  value={formData.repoSnippet}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repoSnippet: e.target.value,
                    }))
                  }
                />
                {formData.repoSnippet && (
                  <div className="text-sm text-gray-600">
                    <CodeBlock code={formData.repoSnippet} className="mt-2" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bountyAmount">Bounty Amount (₹) *</Label>
              <Input
                id="bountyAmount"
                type="number"
                min="100"
                placeholder="Minimum ₹100"
                value={formData.bountyAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bountyAmount: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="FUNCTIONALITY">Functionality</option>
                  <option value="SECURITY">Security</option>
                  <option value="PERFORMANCE">Performance</option>
                  <option value="UI_UX">UI/UX</option>
                  <option value="ACCESSIBILITY">Accessibility</option>
                  <option value="COMPATIBILITY">Compatibility</option>
                  <option value="DOCUMENTATION">Documentation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <select
                  id="priority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <Label htmlFor="severity">Severity *</Label>
                <select
                  id="severity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="MINOR">Minor</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="MAJOR">Major</option>
                  <option value="BLOCKER">Blocker</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a tag (e.g., JavaScript, React)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Posting..." : "Post Bug"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
