"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, UserCheck, UserX } from "lucide-react";

interface BugAssignmentProps {
  bugId: string;
  assignedTo?: {
    id: string;
    name: string;
    image?: string;
    reputation: number;
  };
  authorId: string;
  onAssignmentChange: () => void;
}

export function BugAssignment({
  bugId,
  assignedTo,
  authorId,
  onAssignmentChange,
}: BugAssignmentProps) {
  const { data: session } = useSession();
  const [isAssigning, setIsAssigning] = useState(false);

  const canAssign =
    session?.user?.id === authorId || (session?.user?.reputation ?? 0) >= 100;

  const handleAssign = async (userId: string | null) => {
    if (!canAssign) return;

    setIsAssigning(true);
    try {
      const response = await fetch(`/api/bugs/${bugId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedToId: userId,
          notes: userId ? `Bug assigned to user` : `Bug unassigned`,
        }),
      });

      if (response.ok) {
        toast.success(
          userId ? "Bug assigned successfully!" : "Bug unassigned successfully!"
        );
        onAssignmentChange();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update assignment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!canAssign) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Assignment</h3>
        {assignedTo ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAssign(null)}
            disabled={isAssigning}
          >
            <UserX className="w-4 h-4 mr-2" />
            Unassign
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAssign(session?.user?.id || "")}
            disabled={isAssigning}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Assign to Me
          </Button>
        )}
      </div>

      {assignedTo ? (
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <Avatar className="w-10 h-10">
            <AvatarImage src={assignedTo.image} />
            <AvatarFallback>
              {assignedTo.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-green-800">{assignedTo.name}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Reputation: {assignedTo.reputation}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-green-700 border-green-300"
              >
                Assigned
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <User className="w-10 h-10 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-600">No one assigned</p>
            <p className="text-sm text-gray-500">
              This bug is currently unassigned
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
