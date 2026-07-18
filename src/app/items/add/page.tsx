"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AddItemPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api("/items", {
        method: "POST",
        body: JSON.stringify({ title, shortDesc, fullDesc, price: Number(price) }),
      });
      toast.success("Item added");
      router.push("/items/manage");
    } catch (err: any) {
      toast.error(err.message || "Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="w-full px-4 md:px-20 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input id="shortDesc" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullDesc">Full Description</Label>
              <Input id="fullDesc" value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
