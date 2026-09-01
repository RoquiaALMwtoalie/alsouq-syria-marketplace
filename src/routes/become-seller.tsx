import { createFileRoute } from "@tanstack/react-router";
import { BecomeSellerCard } from "@/components/dashboard/BecomeSellerCard";

export const Route = createFileRoute("/become-seller")({
  component: BecomeSellerPage,
});

function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <BecomeSellerCard />
      </div>
    </div>
  );
}

export default BecomeSellerPage;
