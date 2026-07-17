"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import Link from "next/link";

export default function ManageItemsPage() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Items</h1>
        <Button asChild>
          <Link href="/items/add">Add Item</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No items yet. Click &quot;Add Item&quot; to create one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
