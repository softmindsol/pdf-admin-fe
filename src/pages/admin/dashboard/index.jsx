import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLatestTicketsQuery } from "@/store/GlobalApi";
import { format } from "date-fns";

// --- UI Imports ---
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTicketTitle,
  getTicketIcon,
  getBadgeVariant,
  getTicketUrl,
} from "@/lib/ticket"; // Adjust path if needed

export default function RecentActivity() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Show 5 items per page on the dashboard

  // --- RTK Query Hook ---
  const {
    data: response,
    isLoading, // True only on the first fetch
    isFetching, // True on first fetch AND subsequent refetches
    isError,
  } = useLatestTicketsQuery({ page, limit });

  const tickets = response?.data?.tickets || [];
  const pagination = response?.data?.pagination || {};

  const renderSkeletons = () => {
    return Array(limit)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex items-center space-x-4 py-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ));
  };

  return (
    <>
      <h1 className=" text-black font-bold text-2xl py-6">Recent Activity</h1>
      <Card>
        <CardHeader>
          <CardDescription>
            A log of the most recent tickets and profiles created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeletons()
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              Failed to load recent activity.
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No recent activity found.
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    {getTicketIcon(ticket.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getTicketTitle(ticket)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getBadgeVariant(ticket.type)}>
                        {ticket.type}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        Created on {format(new Date(ticket.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(getTicketUrl(ticket))}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {pagination.totalItems > 0
              ? `Page ${pagination.currentPage} of ${pagination.totalPages}`
              : "Page 0 of 0"}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
