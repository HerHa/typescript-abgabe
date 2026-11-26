# Abgabe Typescript Server

## Checkliste

### Vorbereitet

- Node 26.13.1 oder 27...alpha
- pnpm 12.21.0 oder Bun 1.4.4 
- Relationale DB mit PostgreSQL 18 oder 19 als Docker Container
- 1:1 und 1:N-Beziehung
- DB-Browser
- Keycloak als Docker Container:
1 Realm mit 1 Client und dazu mind. 1 User und 1 Rolle
- GIT-Repository mit generiertem Drizzle-Code (schema.mts, relations.mts):
"Commit early, Commit often" → inkementelle Entwicklung durch Prompts

### Infrastruktur

- package.json und pnpm / Bun
- oxlint und oxfmt zzgl. Konfiguration

### Appserver

- TypeScript "State-of-the-Art" (s. Features aus den beiden Vorlesungen)
- REST-Schnittstelle durch Hono einschl. HTTP/2
- GET-Requests:
  - `GET /` liefert `{"message":"Hello World"}` (`pnpm start`, Port 3000)
  - `GET /products` liefert die Produkte aus `web_shop.public.product` als JSON
- POST-Request
Pfad- oder Query-Parameter
bedingte GET-Requests ("If-None-Match")
Validierung durch Zod
"Location" im Response-Header
- PUT- / PATCH-Request Validierung durch Zod
Vermeidung von Lost-Updates ("If-Match")
- QUERY,  DELETE
- Problem Details (RFC 9457) für Fehlerbehandlung
- DB-Zugriff durch Drizzle: Pagination
- 1:1 und 1:N Beziehung
- generierte Primärschlüssel
- keine Lost Updates
- Zeitstempel für INSERT und UPDATE
- Security: 1 User mit 1 Rolle für 1 geschützte Methode
- Integrations- und Unit-Tests durch Vitest

### Abnahme

- Requests mit Bruno / Postman / Thunder Client
oder: Integrationstests mit Vitest und Axios für HTTP/2
- Visualisierung durch DB-Browser oder Drizzle Studio
- oxlint
- oxfmt

### Guter TypeScript-Code:

- Named Exports
- const / let
- Template strings
- Shorthand properties
- Destructuring
- Lint / Format