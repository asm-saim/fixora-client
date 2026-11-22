"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pressable } from "@/components/motion/Pressable";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABEL } from "@/lib/roles";
import RequestRepairForm, { RequestRepairService } from "./RequestRepairForm";

export default function RequestRepairButton({ service }: { service: RequestRepairService }) {
  const { user, isPending } = useCurrentUser();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (isPending) return <Skeleton className="h-12 w-full rounded-lg" />;

  // Logged out: go to sign-in and come back to this page afterwards
  if (!user) {
    return (
      <div className="space-y-2">
        <Button
          render={<Link href={`/sign-in?redirect=${encodeURIComponent(pathname)}`} />}
          nativeButton={false}
          className="h-12 w-full text-base"
        >
          Request Repair
        </Button>
        <p className="text-center text-xs text-muted-foreground">You will be asked to sign in first.</p>
      </div>
    );
  }

  // Technicians and admins cannot send repair requests
  if (user.role !== "customer") {
    return (
      <div className="space-y-3">
        <Button disabled className="h-12 w-full text-base">Request Repair</Button>
        <div className="flex gap-2 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 p-3 text-sm text-amber-800 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Only customers can request a repair. You are signed in as a {ROLE_LABEL[user.role].toLowerCase()}.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Pressable className="w-full">
        <Button onClick={() => setOpen(true)} className="h-12 w-full text-base">Request Repair</Button>
      </Pressable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request a repair</DialogTitle>
            <DialogDescription>{service.title}</DialogDescription>
          </DialogHeader>
          <RequestRepairForm service={service} user={user} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}