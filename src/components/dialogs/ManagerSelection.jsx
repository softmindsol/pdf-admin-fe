import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "@/store/GlobalApi";
import { useDebounce } from "@/hooks/useBounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export function ManagerSelectionDialog({
  open,
  id,
  onOpenChange,
  initialSelectedIds = [],
  onSave,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: usersResponse, isLoading } = useGetUsersQuery(
    {
      search: debouncedSearchTerm,
      page: 0,
      department: id,
    },
    { skip: !id }
  );
  const users = usersResponse?.data?.users || [];
  console.log("🚀 ~ ManagerSelectionDialog ~ users:", users);

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(initialSelectedIds));
    }
  }, [open, initialSelectedIds]);

  const handleSelectUser = (userId, isChecked) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleSaveChanges = () => {
    onSave(Array.from(selectedIds));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Select Managers</DialogTitle>
          <DialogDescription>
            Search for users and select them to assign as managers. Click save
            when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] w-full rounded-md border">
          <div className="p-4 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`user-${user._id}`}
                    checked={selectedIds.has(user._id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user._id, !!checked)
                    }
                  />
                  <label
                    htmlFor={`user-${user._id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 grid gap-1.5"
                  >
                    <div>{`${user.firstName} ${user.lastName}`}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.username}
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground pt-4">
                No users found.
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
