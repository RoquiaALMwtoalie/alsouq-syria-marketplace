// src/routes/settings.tsx
import { createFileRoute } from "@tanstack/react-router";
import { UserSettingsPage } from "@/components/settings/UserSettingsPage";

export const Route = createFileRoute("/settings")({
  component: UserSettingsPage,
});