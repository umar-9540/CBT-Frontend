import { Suspense } from "react";
import AttemptClient from "../../components/AttemptClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense>
      <AttemptClient />
    </Suspense>
  );
}