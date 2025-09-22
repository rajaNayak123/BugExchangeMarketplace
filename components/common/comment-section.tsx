"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Reply, Send, User } from "lucide-react";
import { toast } from "sonner";
import { MentionInput } from "./mention-input";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  mentions: string[];
  replies: Comment[];
}

interface CommentSectionProps {
  bugId?: string;
  submissionId?: string;
}

export function CommentSection({ bugId, submissionId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [bugId, submissionId]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams();
      if (bugId) params.append("bugId", bugId);
      if (submissionId) params.append("submissionId", submissionId);

      const response = await fetch(`/api/comments?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          bugId,
          submissionId,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
        toast.success("Comment added successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          bugId,
          submissionId,
          parentId,
        }),
      });

      if (response.ok) {
        const reply = await response.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, reply] }
              : comment
          )
        );
        setReplyContent("");
        setShowReplyForm(null);
        toast.success("Reply added successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.image || ""} />
              <AvatarFallback>
                {comment.author.name ? (
                  comment.author.name[0].toUpperCase()
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setShowReplyForm(
                    showReplyForm === comment.id ? null : comment.id
                  )
                }
                className="h-6 px-2"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {comment.content}
          </div>
          {comment.mentions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {comment.mentions.map((mention, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  @{mention}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showReplyForm === comment.id && (
        <div className="mb-4 ml-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitReply(comment.id);
            }}
          >
            <div className="flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
                rows={2}
              />
              <Button type="submit" disabled={loading || !replyContent.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            Please sign in to view and add comments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments</h3>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-3">
        <MentionInput
          value={newComment}
          onChange={setNewComment}
          placeholder="Add a comment... Use @username to mention someone"
          className="min-h-[100px]"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <Separator />

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
