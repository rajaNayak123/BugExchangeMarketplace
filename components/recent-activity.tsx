"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Bug, CheckCircle, IndianRupee } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: "bug_posted" | "submission_made" | "submission_approved";
  createdAt: string;
  user: {
    name: string | null;
    image?: string | null;
  };
  bug: {
    id: string;
    title: string;
    bountyAmount: number;
  };
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("/api/activity");
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading activity...</div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bug_posted":
        return <Bug className="w-4 h-4 text-blue-500" />;
      case "submission_made":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "submission_approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "bug_posted":
        return "posted a new bug";
      case "submission_made":
        return "submitted a solution";
      case "submission_approved":
        return "got their solution approved";
      default:
        return "performed an action";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.image || ""} />
                  <AvatarFallback>
                    {activity.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.user.name || "Anonymous"}
                      </span>{" "}
                      {getActivityText(activity)}
                    </p>
                  </div>

                  <Link
                    href={`/bugs/${activity.bug.id}`}
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    {activity.bug.title}
                  </Link>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <IndianRupee className="w-3 h-3" />
                      {activity.bug.bountyAmount.toLocaleString()}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
