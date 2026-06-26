import { useEffect } from "react";
import { initCalNamespaces } from "@/lib/cal";

export function CalInit() {
  useEffect(() => {
    void initCalNamespaces();
  }, []);

  return null;
}
