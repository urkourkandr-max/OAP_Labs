import fs from "fs";
import path from "path";
import db from "./db";

export async function initDatabase() {
  const schemaPath = path.join(
    __dirname,
    "schema.sql"
  );

  const schema = fs.readFileSync(
    schemaPath,
    "utf-8"
  );

  db.exec(schema);

  console.log("DB schema initialized");

  db.run(
    `
    INSERT OR IGNORE INTO schema_migrations(name)
    VALUES ('initial_schema')
    `
  );
}