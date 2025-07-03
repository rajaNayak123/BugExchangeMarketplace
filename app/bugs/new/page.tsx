"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { bugSchema } from "@/lib/validations";

export default function NewBugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stackTrace: "",
    repoSnippet: "",
    bountyAmount: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");

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
        alert("Success: Bug posted successfully");
        router.push(`/bugs/${bug.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Something went wrong"}`);
      }
    } catch (error) {
      alert("Error: Please check your input");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Bug</CardTitle>
        </CardHeader>
        <CardContent>
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
