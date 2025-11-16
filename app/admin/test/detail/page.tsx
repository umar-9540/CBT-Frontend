import { Suspense } from "react";
import TestDetailClient from ".//../../../../components/TestDetailClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading test...</div>}>
      <TestDetailClient />
    </Suspense>
  );
}
