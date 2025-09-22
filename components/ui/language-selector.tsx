"use client";

import { useState } from "react";
import { Label } from "./label";
import { Button } from "./button";
import { Code, ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  value?: string;
  onChange: (language: string) => void;
  className?: string;
}

const PROGRAMMING_LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "⚡" },
  { value: "typescript", label: "TypeScript", icon: "🔷" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "csharp", label: "C#", icon: "🎯" },
  { value: "php", label: "PHP", icon: "🐘" },
  { value: "ruby", label: "Ruby", icon: "💎" },
  { value: "go", label: "Go", icon: "🐹" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "swift", label: "Swift", icon: "🍎" },
  { value: "kotlin", label: "Kotlin", icon: "🔸" },
  { value: "scala", label: "Scala", icon: "🔴" },
  { value: "html", label: "HTML", icon: "🌐" },
  { value: "css", label: "CSS", icon: "🎨" },
  { value: "sql", label: "SQL", icon: "🗄️" },
  { value: "bash", label: "Bash", icon: "💻" },
  { value: "yaml", label: "YAML", icon: "📄" },
  { value: "json", label: "JSON", icon: "📋" },
  { value: "xml", label: "XML", icon: "📝" },
  { value: "markdown", label: "Markdown", icon: "📝" },
  { value: "dockerfile", label: "Dockerfile", icon: "🐳" },
  { value: "text", label: "Plain Text", icon: "📄" },
];

export function LanguageSelector({
  value,
  onChange,
  className = "",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedLanguage = PROGRAMMING_LANGUAGES.find(
    (lang) => lang.value === value
  );
  const filteredLanguages = PROGRAMMING_LANGUAGES.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (languageValue: string) => {
    onChange(languageValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      <Label className="block text-sm font-medium mb-2">
        Programming Language
      </Label>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            {selectedLanguage ? (
              <>
                <span>{selectedLanguage.icon}</span>
                <span>{selectedLanguage.label}</span>
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                <span>Select Language</span>
              </>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Language list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredLanguages.map((language) => (
                <button
                  key={language.value}
                  type="button"
                  onClick={() => handleLanguageSelect(language.value)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 ${
                    value === language.value ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span className="text-lg">{language.icon}</span>
                  <span className="text-sm">{language.label}</span>
                </button>
              ))}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No languages found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

