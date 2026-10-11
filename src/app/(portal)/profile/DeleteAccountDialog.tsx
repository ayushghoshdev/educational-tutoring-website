"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteUserAccount } from "@/app/actions/authActions";
import { LoaderCircle } from "lucide-react";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteUserAccount();
      if (res.success) {
        onOpenChange(false);
        router.push("/login");
        router.refresh();
      } else {
        setError(res.error || "Failed to delete account. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      setError(
        err?.message ||
          "An unexpected error occurred while deleting your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (loading) return;
    if (!isOpen) {
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg ring-0! [&_button:focus]:ring-0! [&_button:focus]:ring-offset-0!">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            Delete Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete your account? This action is
            permanent and cannot be undone. All of your profile data will be
            permanently removed.
          </p>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="destructive"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, delete account"
              )}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              No, don't delete account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
