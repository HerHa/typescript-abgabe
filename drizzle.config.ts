// oxlint-disable-next-line import/no-unassigned-import
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
// @ts-expect-error Datei nicht im Verzeichnis src
import process from 'node:process';

const { DATABASE_URL } = process.env;
if (DATABASE_URL === undefined) {
    throw new Error('DATABASE_URL ist nicht gesetzt in .env');
}

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        url: DATABASE_URL,
    },
    schemaFilter: ['public'],
    out: './drizzle',

    // fuer Drizzle Studio
    schema: 'src/db/schema.mts',
});
