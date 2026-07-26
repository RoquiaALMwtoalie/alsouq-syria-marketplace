// src/routes/favorites.tsx
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/FavoritesPage";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "المفضلة - Souqi" },
      { name: "description", content: "قائمة منتجاتك المفضلة" },
    ],
  }),
});