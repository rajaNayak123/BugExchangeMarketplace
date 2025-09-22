"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "./button";
import { Copy, Check, Code } from "lucide-react";
import React from "react"; // Added missing import

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>(
    language
  );

  // Auto-detect language if not provided
  React.useEffect(() => {
    if (!language && code) {
      const detected = detectLanguage(code);
      setDetectedLanguage(detected);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {detectedLanguage ? detectedLanguage.toUpperCase() : "TEXT"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="relative">
        <SyntaxHighlighter
          language={detectedLanguage || "text"}
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 8px 8px",
            fontSize: "13px",
            lineHeight: "1.5",
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Language detection function
function detectLanguage(code: string): string {
  const codeLower = code.toLowerCase();

  // Common language patterns
  if (codeLower.includes("function") && codeLower.includes("=>"))
    return "javascript";
  if (codeLower.includes("function") && codeLower.includes("{"))
    return "javascript";
  if (
    codeLower.includes("const") ||
    codeLower.includes("let") ||
    codeLower.includes("var")
  )
    return "javascript";
  if (codeLower.includes("import") && codeLower.includes("from"))
    return "typescript";
  if (codeLower.includes("interface") || codeLower.includes("type"))
    return "typescript";
  if (codeLower.includes("def ") || codeLower.includes("import "))
    return "python";
  if (codeLower.includes("public class") || codeLower.includes("private "))
    return "java";
  if (codeLower.includes("<?php") || codeLower.includes("$")) return "php";
  if (codeLower.includes("using ") && codeLower.includes("namespace"))
    return "csharp";
  if (codeLower.includes("fn ") || codeLower.includes("let mut")) return "rust";
  if (codeLower.includes("package ") || codeLower.includes("import "))
    return "go";
  if (codeLower.includes("html") || codeLower.includes("<div>")) return "html";
  if (codeLower.includes("css") || codeLower.includes("{")) return "css";
  if (codeLower.includes("sql") || codeLower.includes("select")) return "sql";

  return "text";
}

