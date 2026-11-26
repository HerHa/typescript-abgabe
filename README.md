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

### Bruno-Collection

Die OpenCollection liegt unter `bruno/web-shop-api`. In Bruno **Open Collection** wählen und diesen Ordner öffnen; anschließend die Umgebung **Local** aktivieren. Sie verwendet standardmäßig `http://localhost:3000` und enthält Requests für alle Endpunkte, inklusive ETag/304- und If-Match-Ablauf.

Zum Durchspielen des Schreibablaufs zuerst den Server mit `pnpm start` starten und dann in Bruno die Requests der Reihe nach ausführen. Die Collection erstellt ein Testprodukt, aktualisiert es und legt eine Testbewertung an. Diese Daten bleiben in der Datenbank bestehen; es gibt derzeit keinen Delete-Endpunkt. Für eine reine Leseprobe können die GET-Requests einzeln ausgeführt werden.

### Keycloak für `GET /products/:productId`

Diese Route verlangt ein signiertes, nicht abgelaufenes RS256-Bearer-Token mit passendem Issuer und Audience. Die Produktliste und die übrigen Routen bleiben öffentlich. Übertrage `KEYCLOAK_ISSUER` und `KEYCLOAK_AUDIENCE` aus `.env.example` in deine lokale `.env`; `KEYCLOAK_ISSUER` muss exakt dem `iss`-Claim des Tokens entsprechen. Optional kann `KEYCLOAK_JWKS_URL` den JWKS-Endpunkt überschreiben. Der API-Server benötigt kein Client-Secret.

Für den Bruno-Client braucht es zusätzlich die Keycloak-Realm-URL, eine Client-ID und das Client-Secret. In Keycloak muss für den Client **Client authentication** und **Service accounts** aktiviert sein; Bruno fordert per Client Credentials automatisch ein Token an. Damit der Server es akzeptiert, muss das Token außerdem den erwarteten Audience-Wert enthalten. Richte in Keycloak einen Audience-Mapper für `web-shop-api` ein und weise ihn dem Client als Default Client Scope zu (oder verwende deinen eigenen Audience-Namen); setze denselben Wert in `KEYCLOAK_AUDIENCE`.

In Bruno die Umgebung **Local** bearbeiten: `keycloakBaseUrl`, `keycloakRealm` und `keycloakClientId` setzen sowie `keycloakClientSecret` als Secret in der Umgebung hinterlegen. Das Secret nicht in die Collection-Dateien oder Git eintragen. Danach den API-Server mit den Keycloak-Variablen starten und **Get Product** senden; Bruno holt das Token automatisch. Bei Docker muss der Keycloak-Issuer/JWKS-Endpunkt vom API-Prozess erreichbar sein und mit dem `iss`-Claim des Tokens übereinstimmen.

### Guter TypeScript-Code:

- Named Exports
- const / let
- Template strings
- Shorthand properties
- Destructuring
- Lint / Format
