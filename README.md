# Lydia Studio Resources

A gentle, curated library of tools, practices, and supports for when focus is hard, time feels invisible, or you need a softer way through the day.

Built as part of Lydia Studio.

## What this is

- A searchable, filterable directory of resources
- Curated with neurodivergent-friendly design in mind
- Static, fast, and intentionally low-complexity

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Running locally

```bash
npm install
npm run dev
Open http://localhost:3000
```

---

## Data workflow (high-level)

- Resources are collected and reviewed in Google Sheets
- Approved entries are exported as CSV
- A small script converts CSV → TypeScript data
- The site renders from that static data

Detailed documentation lives in `/docs`.

---

## License

MIT