"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { CustomerConfig } from "@/lib/types";
const CustomerContext = createContext<CustomerConfig>({});
export function CustomerProvider({ value, children }: { value: CustomerConfig; children: ReactNode }) {
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}
export function useCustomer(): CustomerConfig { return useContext(CustomerContext); }
