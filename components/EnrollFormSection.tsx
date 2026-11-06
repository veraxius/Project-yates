"use client";

import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "./CheckoutForm";

// Reads ?canceled=1 on the client so the page itself stays static
// (Cache Components: runtime data must not block the static shell).
export function EnrollFormSection() {
  const params = useSearchParams();
  return <CheckoutForm canceled={params.get("canceled") === "1"} />;
}
