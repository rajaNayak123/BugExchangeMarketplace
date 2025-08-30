"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Search } from "lucide-react";

interface BugTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  severity: string;
  tags: string[];
}

interface BugTemplateSelectorProps {
  onTemplateSelect: (template: BugTemplate) => void;
  selectedCategory?: string;
}

export function BugTemplateSelector({
  onTemplateSelect,
  selectedCategory,
}: BugTemplateSelectorProps) {
  const [templates, setTemplates] = useState<BugTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<BugTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(
    selectedCategory || "all"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategoryFilter]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/bug-templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategoryFilter && selectedCategoryFilter !== "all") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategoryFilter
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: BugTemplate) => {
    onTemplateSelect(template);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bug Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Bug Templates
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose a template to pre-fill your bug report with common fields
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategoryFilter("all")}
            >
              All
            </Button>
            <Button
              variant={
                selectedCategoryFilter === "SECURITY" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategoryFilter("SECURITY")}
            >
              Security
            </Button>
            <Button
              variant={
                selectedCategoryFilter === "PERFORMANCE" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategoryFilter("PERFORMANCE")}
            >
              Performance
            </Button>
            <Button
              variant={
                selectedCategoryFilter === "UI_UX" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategoryFilter("UI_UX")}
            >
              UI/UX
            </Button>
            <Button
              variant={
                selectedCategoryFilter === "FUNCTIONALITY"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategoryFilter("FUNCTIONALITY")}
            >
              Functionality
            </Button>
          </div>
        </div>

        {/* Templates List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No templates found matching your criteria
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <Button size="sm" variant="outline">
                    <Check className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.severity} Severity
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
