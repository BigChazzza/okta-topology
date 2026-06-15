import type { CategoryKey } from "./types";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  description: string;
  color: string;
}

export const SIDEBAR_CATEGORIES: CategoryMeta[] = [
  {
    key: "resources",
    label: "Resources",
    description: "Applications and API endpoints that Okta secures",
    color: "#059669",
  },
  {
    key: "core-identity",
    label: "Core Identity",
    description: "Universal Directory, SSO, MFA, Lifecycle, Workflows",
    color: "#007DC1",
  },
  {
    key: "customer-identity",
    label: "Customer Identity",
    description: "CIAM — Auth0 / Customer Identity Cloud",
    color: "#EB5424",
  },
  {
    key: "workforce",
    label: "Workforce Identity",
    description: "Desktop MFA, FastPass, Device Trust, Access Gateway",
    color: "#007DC1",
  },
  {
    key: "privileged-access",
    label: "Privileged Access",
    description: "OPA — JIT, Secrets, Session Recording",
    color: "#7C3AED",
  },
  {
    key: "governance",
    label: "Identity Governance",
    description: "OIG — Access Requests, Certifications, Entitlements",
    color: "#0F766E",
  },
  {
    key: "integrations",
    label: "Integrations & Platform",
    description: "OIN, SCIM, SAML, OIDC, Hooks, Log Streaming",
    color: "#0EA5E9",
  },
  {
    key: "security",
    label: "Security & Threat",
    description: "ThreatInsight, Behavior Detection, CAEP, Risk",
    color: "#DC2626",
  },
];
