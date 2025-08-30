"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface BugTransition {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  assignedToId: string | null;
  notes: string | null;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    image?: string;
  };
}

interface BugLifecycleProps {
  bugId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

const statusConfig = {
  OPEN: {
    label: "Open",
    icon: AlertCircle,
    color: "bg-blue-500",
    textColor: "text-blue-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Play,
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
  },
  CLAIMED: {
    label: "Claimed",
    icon: User,
    color: "bg-purple-500",
    textColor: "text-purple-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: MessageSquare,
    color: "bg-orange-500",
    textColor: "text-orange-700",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-700",
  },
  VERIFIED: {
    label: "Verified",
    icon: CheckCircle,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  CLOSED: {
    label: "Closed",
    icon: CheckCircle,
    color: "bg-gray-500",
    textColor: "text-gray-700",
  },
  REOPENED: {
    label: "Reopened",
    icon: RotateCcw,
    color: "bg-red-500",
    textColor: "text-red-700",
  },
  DUPLICATE: {
    label: "Duplicate",
    icon: XCircle,
    color: "bg-gray-500",
    textColor: "text-gray-700",
  },
};

export function BugLifecycle({
  bugId,
  currentStatus,
  onStatusChange,
}: BugLifecycleProps) {
  const { data: session } = useSession();
  const [transitions, setTransitions] = useState<BugTransition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [statusNotes, setStatusNotes] = useState("");

  useEffect(() => {
    fetchTransitions();
  }, [bugId]);

  const fetchTransitions = async () => {
    try {
      const response = await fetch(`/api/bugs/${bugId}/transitions`);
      if (response.ok) {
        const data = await response.json();
        setTransitions(data);
      }
    } catch (error) {
      console.error("Failed to fetch transitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (newStatus === currentStatus) {
      setShowStatusForm(false);
      return;
    }

    try {
      const response = await fetch(`/api/bugs/${bugId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes,
        }),
      });

      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`);
        setShowStatusForm(false);
        setStatusNotes("");
        onStatusChange();
        fetchTransitions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return AlertCircle;
    return config.icon;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return "bg-gray-500";
    return config.color;
  };

  const getStatusTextColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return "text-gray-700";
    return config.textColor;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bug Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading lifecycle...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Bug Lifecycle
        </CardTitle>
        <p className="text-sm text-gray-600">
          Track the complete history of this bug's status changes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Current Status:</span>
            <Badge
              variant="outline"
              className={`${getStatusTextColor(currentStatus)} border-current`}
            >
              {statusConfig[currentStatus as keyof typeof statusConfig]
                ?.label || currentStatus}
            </Badge>
          </div>

          {session?.user && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowStatusForm(!showStatusForm)}
            >
              Change Status
            </Button>
          )}
        </div>

        {/* Status Change Form */}
        {showStatusForm && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add notes about this status change..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" onClick={handleStatusChange}>
                  Update Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowStatusForm(false);
                    setNewStatus(currentStatus);
                    setStatusNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transitions Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium">Status History</h4>

          {transitions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No status changes recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {transitions.map((transition, index) => (
                <div key={transition.id} className="flex items-start space-x-3">
                  {/* Timeline Dot */}
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(
                      transition.toStatus
                    )}`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusTextColor(
                            transition.toStatus
                          )} border-current`}
                        >
                          {statusConfig[
                            transition.toStatus as keyof typeof statusConfig
                          ]?.label || transition.toStatus}
                        </Badge>

                        {transition.fromStatus && (
                          <>
                            <span className="text-gray-400">→</span>
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-600"
                            >
                              {statusConfig[
                                transition.fromStatus as keyof typeof statusConfig
                              ]?.label || transition.fromStatus}
                            </Badge>
                          </>
                        )}
                      </div>

                      <span className="text-xs text-gray-500">
                        {formatDate(transition.createdAt)}
                      </span>
                    </div>

                    {transition.notes && (
                      <p className="text-sm text-gray-600 mb-2">
                        {transition.notes}
                      </p>
                    )}

                    {transition.assignedTo && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>Assigned to {transition.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
