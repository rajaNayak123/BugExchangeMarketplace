"use client";

import { useState, useMemo } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Eye, X, ArrowLeft, ArrowRight } from "lucide-react";

interface DiffViewerProps {
  originalCode: string;
  newCode: string;
  language?: string;
  className?: string;
}

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  content: string;
  lineNumber: number;
  originalLineNumber?: number;
  newLineNumber?: number;
}

export function DiffViewer({
  originalCode,
  newCode,
  language = "text",
  className = "",
}: DiffViewerProps) {
  const [showDiff, setShowDiff] = useState(false);

  const diffLines = useMemo(() => {
    if (!showDiff) return [];

    const originalLines = originalCode.split("\n");
    const newLines = newCode.split("\n");

    // Simple diff algorithm - can be enhanced with more sophisticated diffing
    const diff: DiffLine[] = [];
    let originalIndex = 0;
    let newIndex = 0;
    let lineNumber = 1;

    while (originalIndex < originalLines.length || newIndex < newLines.length) {
      const originalLine = originalLines[originalIndex];
      const newLine = newLines[newIndex];

      if (originalLine === newLine) {
        // Lines are identical
        diff.push({
          type: "unchanged",
          content: originalLine || "",
          lineNumber,
          originalLineNumber: originalIndex + 1,
          newLineNumber: newIndex + 1,
        });
        originalIndex++;
        newIndex++;
      } else if (
        originalIndex < originalLines.length &&
        newIndex < newLines.length
      ) {
        // Lines are different - show both
        diff.push({
          type: "removed",
          content: originalLine || "",
          lineNumber,
          originalLineNumber: originalIndex + 1,
        });
        diff.push({
          type: "added",
          content: newLine || "",
          lineNumber: lineNumber + 1,
          newLineNumber: newIndex + 1,
        });
        originalIndex++;
        newIndex++;
        lineNumber += 2;
      } else if (originalIndex < originalLines.length) {
        // Only original lines remain
        diff.push({
          type: "removed",
          content: originalLine || "",
          lineNumber,
          originalLineNumber: originalIndex + 1,
        });
        originalIndex++;
        lineNumber++;
      } else {
        // Only new lines remain
        diff.push({
          type: "added",
          content: newLine || "",
          lineNumber,
          newLineNumber: newIndex + 1,
        });
        newIndex++;
        lineNumber++;
      }
    }

    return diff;
  }, [originalCode, newCode, showDiff]);

  const getLineClass = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-50 border-l-4 border-green-500";
      case "removed":
        return "bg-red-50 border-l-4 border-red-500";
      default:
        return "bg-gray-50 border-l-4 border-gray-300";
    }
  };

  const getLineIcon = (type: string) => {
    switch (type) {
      case "added":
        return <ArrowRight className="w-4 h-4 text-green-600" />;
      case "removed":
        return <ArrowLeft className="w-4 h-4 text-red-600" />;
      default:
        return <span className="w-4 h-4" />;
    }
  };

  const getLineNumber = (line: DiffLine) => {
    if (line.type === "added") {
      return line.newLineNumber;
    } else if (line.type === "removed") {
      return line.originalLineNumber;
    } else {
      return line.originalLineNumber;
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDiff(!showDiff)}
        className="mb-3"
      >
        <Eye className="w-4 h-4 mr-2" />
        {showDiff ? "Hide Diff" : "View Changes"}
      </Button>

      {showDiff && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Code Changes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDiff(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-900 text-gray-100 font-mono text-sm overflow-x-auto">
              <div className="min-w-full">
                {diffLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex items-start px-4 py-1 ${getLineClass(
                      line.type
                    )}`}
                  >
                    {/* Line number */}
                    <div className="flex-shrink-0 w-16 text-right text-gray-500 mr-4 select-none">
                      {getLineNumber(line)}
                    </div>

                    {/* Change indicator */}
                    <div className="flex-shrink-0 w-6 flex justify-center mr-2">
                      {getLineIcon(line.type)}
                    </div>

                    {/* Code content */}
                    <div className="flex-1 min-w-0">
                      <pre className="whitespace-pre-wrap break-words">
                        {line.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Added</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Removed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Unchanged</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

