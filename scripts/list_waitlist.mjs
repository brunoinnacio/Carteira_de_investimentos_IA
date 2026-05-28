import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltam vars no .env.local");
  process.exit(1);
}

const r = await fetch(
  `${url}/rest/v1/waitlist?select=email,source,created_at&order=created_at.desc&limit=50`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } }
);
if (!r.ok) {
  console.error("Erro:", r.status, await r.text());
  process.exit(1);
}
const rows = await r.json();
console.log(`Total mostrado: ${rows.length}`);
for (const row of rows) {
  console.log(`- ${row.created_at}  ${row.email}  (${row.source ?? "-"})`);
}
