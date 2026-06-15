# Okta Topology

Interactive topology diagram for Okta's full identity platform — 50+ components across 7 categories.

## Categories

| Category | Key Components |
|---|---|
| **Core Identity** | Universal Directory, Identity Engine, SSO, Adaptive MFA, Lifecycle Management, Workflows |
| **Customer Identity** | Customer Identity Cloud (Auth0), Universal Login, Passwordless, B2C/B2B Flows, Actions |
| **Workforce Identity** | Access Gateway, FastPass, Device Trust, Desktop MFA, RADIUS |
| **Privileged Access** | Okta Privileged Access, JIT Access, Secrets Vault, Session Recording |
| **Identity Governance** | Access Requests, Access Certifications, Entitlement Management, Identity Analytics |
| **Integrations & Platform** | OIN, SCIM, SAML, OIDC, Event Hooks, Inline Hooks, Log Streaming |
| **Security & Threat** | ThreatInsight, Behavior Detection, CAEP, Entity Risk Policy |

## Features

- Drag-and-drop from sidebar onto canvas
- Directional arrows — hover a node to reveal handles
- Inline rename — double-click any node or arrow
- Per-category visibility toggles, right-click context menu
- Customer section: name + logo upload
- **Auto Layout** (dagre), **PNG / SVG / JSON export**, **Import JSON**
- `?config=<url>` — load a hosted JSON diagram on open
- `GET /api/schema` — machine-readable registry for agents/scripts
- Light / dark mode, localStorage persistence

## Local dev

```bash
npm install && npm run dev   # http://localhost:3000
```

## Deploy

Import `BigChazzza/okta-topology` at [vercel.com/new](https://vercel.com/new) — no env vars needed.

## Trademarks

All product names and logos are trademarks of their respective owners. This is an unofficial tool not affiliated with Okta, Inc.

## License

MIT
