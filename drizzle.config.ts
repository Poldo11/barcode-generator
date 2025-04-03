import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./lib/schemas/mailing.ts",

  driver: "pglite",
  dbCredentials: {
    url: process.env.DB_URL || "postgresql://postgres:postgres@localhost:5432/mailing_db",
  },

  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});