import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => api<any>("/agents"),
  });
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => api<any>("/items"),
  });
}

export function useAddItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      api("/items", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
