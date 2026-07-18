"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Search, FileText, HardDrive, Calendar, User, ExternalLink, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  sourceFileName: string;
  sourceFileType: string;
  rowCount: number;
  ownerId: { _id: string; name: string; email: string };
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ItemsResponse {
  success: boolean;
  items: Item[];
  pagination: PaginationInfo;
}

const agents = [
  { name: "Content Creator", category: "Writing", desc: "Generate blogs, social posts, and product descriptions.", rating: 4.8 },
  { name: "Chat Assistant", category: "Conversation", desc: "Intelligent chat with context-aware responses.", rating: 4.9 },
  { name: "Data Analyzer", category: "Analytics", desc: "Analyze data with natural language.", rating: 4.6 },
  { name: "Document Summarizer", category: "Productivity", desc: "Summarize long documents instantly.", rating: 4.7 },
];

export default function ExplorePage() {
  const { isAuthenticated } = useAuthContext();

  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (fileType !== "all") queryParams.set("fileType", fileType);
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (sort) queryParams.set("sort", sort);
  queryParams.set("page", String(page));
  queryParams.set("limit", "12");

  const { data: recData, isLoading: recLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<any>("/recommendations"),
    enabled: isAuthenticated,
  });

  const { data: itemsData, isLoading } = useQuery<ItemsResponse>({
    queryKey: ["explore-items", search, fileType, dateFrom, dateTo, sort, page],
    queryFn: () => api<ItemsResponse>(`/items?${queryParams.toString()}`),
  });

  const items = itemsData?.items ?? [];
  const pagination = itemsData?.pagination;

  function handleFilterChange(updates: Record<string, string>) {
    Object.entries(updates).forEach(([key, value]) => {
      if (key === "search") setSearch(value);
      if (key === "fileType") { setFileType(value); setPage(1); }
      if (key === "dateFrom") { setDateFrom(value); setPage(1); }
      if (key === "dateTo") { setDateTo(value); setPage(1); }
      if (key === "sort") { setSort(value); setPage(1); }
    });
  }

  return (
    <div className="w-full px-4 md:px-20 py-10 space-y-10">
      {/* Recommended for You */}
      {isAuthenticated && recLoading && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </section>
      )}

      {recData?.recommendations?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recData.recommendations.map((agent: any) => (
              <Card key={agent._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{agent.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Explore Reports */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Explore Analysis Reports</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="pl-9"
            />
          </div>

          <Select value={fileType} onValueChange={(v) => handleFilterChange({ fileType: v })}>
            <SelectTrigger className="w-[130px]">
              <FileText className="h-4 w-4 mr-1" />
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">XLSX</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => handleFilterChange({ sort: v })}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="mostRows">Most Rows</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
            className="w-[150px]"
            placeholder="From"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
            className="w-[150px]"
            placeholder="To"
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link key={item._id} href={`/items/${item._id}`}>
                  <Card className="h-full hover:bg-muted/50 transition cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                        <Badge variant="secondary" className="shrink-0 text-xs">{item.sourceFileType.toUpperCase()}</Badge>
                      </div>
                      {item.shortDescription && (
                        <CardDescription className="text-sm line-clamp-2 mt-1">
                          {item.shortDescription}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {item.rowCount.toLocaleString()} rows
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.ownerId && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.ownerId.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-indigo-500 font-medium">
                        <ExternalLink className="h-3 w-3" /> View Report
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* All Agents */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Explore AI Agents</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge>{agent.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{agent.desc}</CardDescription>
                <p className="text-sm text-muted-foreground">Rating: {agent.rating}/5</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
