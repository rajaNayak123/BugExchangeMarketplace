"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DuplicateBug {
  id: string;
  title: string;
  description: string;
  status: string;
  bountyAmount: number;
  similarityScore: number;
  createdAt: string;
  author: {
    name: string;
    image?: string;
    reputation: number;
  };
  _count: {
    submissions: number;
  };
}

interface DuplicateDetectorProps {
  title: string;
  description: string;
  tags: string[];
  stackTrace?: string;
  onDuplicateFound: (duplicateId: string) => void;
}

export function DuplicateDetector({
  title,
  description,
  tags,
  stackTrace,
  onDuplicateFound,
}: DuplicateDetectorProps) {
  const [duplicates, setDuplicates] = useState<DuplicateBug[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkForDuplicates = async () => {
    if (!title && !description && tags.length === 0 && !stackTrace) {
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch("/api/bugs/duplicates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags,
          stackTrace,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDuplicates(data.duplicates || []);
        setHasChecked(true);
      }
    } catch (error) {
      console.error("Failed to check for duplicates:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDuplicateFound = (duplicateId: string) => {
    onDuplicateFound(duplicateId);
  };

  if (!hasChecked && !isChecking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Check for Duplicates
          </CardTitle>
          <p className="text-sm text-gray-600">
            Before posting, check if a similar bug has already been reported
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={checkForDuplicates}
            disabled={
              !title && !description && tags.length === 0 && !stackTrace
            }
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            Check for Duplicates
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isChecking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checking for Duplicates...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Searching for similar bugs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {duplicates.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          Duplicate Check Results
        </CardTitle>
        <p className="text-sm text-gray-600">
          {duplicates.length > 0
            ? `Found ${duplicates.length} potential duplicate(s)`
            : "No potential duplicates found"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {duplicates.length > 0 ? (
          <>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Potential duplicates detected! Please review before posting.
              </p>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {duplicates.map((duplicate) => (
                <div
                  key={duplicate.id}
                  className="border rounded-lg p-3 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-1">
                      {duplicate.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        duplicate.similarityScore > 70
                          ? "text-red-700 border-red-300 bg-red-50"
                          : duplicate.similarityScore > 50
                          ? "text-orange-700 border-orange-300 bg-orange-50"
                          : "text-yellow-700 border-yellow-300 bg-yellow-50"
                      }`}
                    >
                      {duplicate.similarityScore}% Match
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {duplicate.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>₹{duplicate.bountyAmount.toLocaleString()}</span>
                      <span>{duplicate._count.submissions} submissions</span>
                      <span>{duplicate.status}</span>
                    </div>
                    <span>{formatDate(duplicate.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={duplicate.author.image} />
                        <AvatarFallback className="text-xs">
                          {duplicate.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">
                        {duplicate.author.name} ({duplicate.author.reputation}{" "}
                        rep)
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateFound(duplicate.id)}
                      >
                        View Bug
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          window.open(`/bugs/${duplicate.id}`, "_blank")
                        }
                      >
                        Mark as Duplicate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">No duplicates found!</p>
            <p className="text-sm text-gray-600">
              You can proceed with posting your bug
            </p>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setHasChecked(false);
            setDuplicates([]);
          }}
          className="w-full"
        >
          Check Again
        </Button>
      </CardContent>
    </Card>
  );
}
