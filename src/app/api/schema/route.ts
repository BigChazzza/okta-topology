import { NextResponse } from "next/server";
import { COMPONENT_REGISTRY } from "@/lib/componentRegistry";
const COMPONENTS = COMPONENT_REGISTRY.filter((c) => c.category !== "okta-logo").map((c) => ({ componentId: c.id, label: c.label, category: c.category, nodeType: c.nodeType }));
export const dynamic = "force-static";
export function GET() {
  return NextResponse.json({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Okta Topology Diagram",
    description: "Schema for the Okta component topology diagram tool.",
    version: 1, components: COMPONENTS,
    categories: ["core-identity", "customer-identity", "workforce", "privileged-access", "governance", "integrations", "security"],
    nodeShape: { fields: { id: "string", type: "okta-component | okta-logo | customer", position: { x: "number", y: "number" }, data: { componentId: "string — from components[] above", category: "string", label: "string — visible title (honoured from JSON)" } } },
    edgeShape: { fields: { id: "string", source: "string", target: "string", sourceHandle: "top|right|bottom|left", targetHandle: "top|right|bottom|left", label: "string (optional)", type: "labeled" } },
    customerShape: { fields: { name: "string", logoDataUrl: "base64 data URL", logoUrl: "public image URL" } },
  }, { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}
