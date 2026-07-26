import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/uploads/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const prefix = "/api/public/uploads/";
        const encodedPath = url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) : "";
        const filePath = decodeURIComponent(encodedPath);

        if (!filePath || filePath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("uploads").download(filePath);

        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", data.type || "application/octet-stream");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return new Response(data, { headers });
      },
    },
  },
});