import { z } from "zod";

const categoryEnum = z.enum([
  "customer",
  "resources",
  "core-identity",
  "customer-identity",
  "workforce",
  "privileged-access",
  "governance",
  "integrations",
  "security",
  "okta-logo",
]);

const nodeDataSchema = z
  .object({
    componentId: z.string(),
    category: categoryEnum,
    label: z.string(),
  })
  .passthrough();

const edgeDataSchema = z
  .object({ label: z.string().optional() })
  .passthrough();

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: nodeDataSchema,
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  data: edgeDataSchema.optional(),
  label: z.string().optional(),
});

const visibilitySchema = z.object({
  customer: z.boolean().default(true),
  resources: z.boolean().default(true),
  "core-identity": z.boolean().default(true),
  "customer-identity": z.boolean().default(true),
  workforce: z.boolean().default(true),
  "privileged-access": z.boolean().default(true),
  governance: z.boolean().default(true),
  integrations: z.boolean().default(true),
  security: z.boolean().default(true),
  "okta-logo": z.boolean().default(true),
});

const customerSchema = z
  .object({
    name: z.string().optional(),
    logoDataUrl: z.string().optional(),
    logoUrl: z.string().url().optional(),
  })
  .optional();

export const serializedDiagramSchema = z.object({
  version: z.literal(1),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  visibility: visibilitySchema,
  customer: customerSchema,
});
