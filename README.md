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
- Aufgeteilte Schichten: `src/db` für Schema und Verbindung, `src/services` für Lese- und Schreiblogik, `src/routes` für HTTP, `src/schemas` für Zod-Validierung und `src/http` für gemeinsame HTTP-Helfer
- Produkt-Endpunkte:
  - `GET /` liefert `{"message":"Hello World"}` (`pnpm start`, Port 3000)
  - `GET /products?name=...&limit=20&offset=0` listet Produkte mit optionaler Namenssuche und Pagination
  - `GET /products/:productId` liefert ein Produkt samt Detaildaten
  - Beide GET-Endpunkte unterstützen `ETag` und `If-None-Match` (`304 Not Modified`)
  - `POST /products` erstellt ein Produkt und optional dessen Detail; die Antwort enthält `Location`
  - `PUT /products/:productId` aktualisiert ein Produkt samt Detail und erfordert `If-Match` gegen Lost Updates
  - `GET /products/:productId/reviews` listet Bewertungen
  - `POST /products/:productId/reviews` erstellt eine Bewertung
- Eingabevalidierung durch Zod und Fehlerantworten als Problem Details (RFC 9457)
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
