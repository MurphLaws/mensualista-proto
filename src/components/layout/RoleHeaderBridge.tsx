"use client";
import { useEffect } from "react";
import { ensureCookieSync } from "@/lib/role-client";

export function RoleHeaderBridge() {
  useEffect(() => {
    ensureCookieSync();
  }, []);
  return null;
}
