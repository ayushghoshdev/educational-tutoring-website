"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

type DeleteAccountButtonProps = {
  className?: string;
};

export default function DeleteAccountButton({
  className,
}: DeleteAccountButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setDialogOpen(true)}
        className={`flex items-center gap-2 cursor-pointer ${className || ""}`}
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete Account</span>
      </Button>

      <DeleteAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

export { DeleteAccountButton };

