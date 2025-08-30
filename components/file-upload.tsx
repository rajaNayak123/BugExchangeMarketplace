"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  File,
  Image,
  FileText,
  Archive,
  X,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

interface FileUploadProps {
  submissionId: string;
  onUploadComplete?: (attachments: Attachment[]) => void;
  existingAttachments?: Attachment[];
  onDeleteAttachment?: (attachmentId: string) => void;
  readOnly?: boolean;
}

export function FileUpload({
  submissionId,
  onUploadComplete,
  existingAttachments = [],
  onDeleteAttachment,
  readOnly = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] =
    useState<Attachment[]>(existingAttachments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/json",
    "text/csv",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (readOnly) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} has an unsupported file type.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `/api/submissions/${submissionId}/attachments`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newAttachments = [...attachments, ...data.attachments];
        setAttachments(newAttachments);
        onUploadComplete?.(newAttachments);
        toast.success(`${validFiles.length} file(s) uploaded successfully`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (readOnly || !onDeleteAttachment) return;

    try {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedAttachments = attachments.filter(
          (a) => a.id !== attachmentId
        );
        setAttachments(updatedAttachments);
        onDeleteAttachment(attachmentId);
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    } else if (mimeType === "application/pdf") {
      return <FileText className="h-4 w-4" />;
    } else if (mimeType.includes("zip")) {
      return <Archive className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const getFileColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "text-green-600 bg-green-50";
    } else if (mimeType === "application/pdf") {
      return "text-red-600 bg-red-50";
    } else if (mimeType.includes("zip")) {
      return "text-purple-600 bg-purple-50";
    } else {
      return "text-blue-600 bg-blue-50";
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <File className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Attachments</h3>
        {attachments.length > 0 && (
          <Badge variant="secondary">{attachments.length}</Badge>
        )}
      </div>

      {!readOnly && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        >
          <CardContent className="p-6">
            <div
              className="text-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                {dragActive ? "Drop files here" : "Upload files"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Supported formats: JPG, PNG, GIF, PDF, TXT, JSON, CSV, ZIP
                <br />
                Maximum file size: 10MB
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mb-2"
              >
                {uploading ? "Uploading..." : "Choose Files"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedTypes.join(",")}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {attachments.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="grid gap-3">
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${getFileColor(
                      attachment.mimeType
                    )}`}
                  >
                    {getFileIcon(attachment.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {attachment.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)} • {attachment.mimeType}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {isImage(attachment.mimeType) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.url, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(attachment.url, "_blank")}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {!readOnly && onDeleteAttachment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(attachment.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {attachments.length === 0 && !readOnly && (
        <p className="text-center text-gray-500 py-4">
          No attachments yet. Upload files to provide additional context for
          your submission.
        </p>
      )}
    </div>
  );
}
