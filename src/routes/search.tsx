// src/routes/search.tsx
import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/pages/SearchPage";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: search.q as string | undefined,
    gov: search.gov as string | undefined,
  }),
});