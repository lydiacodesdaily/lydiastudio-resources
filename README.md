# Lydia Studio Resources

A curated directory of tools, methods, communities, content, and physical supports for focus, time awareness, and learning.

## Features

- **Searchable & Filterable**: Find resources by title, description, or domain
- **Multi-dimensional Filtering**: Filter by category, support needs, price, setup effort, and sensory load
- **ADHD-Friendly UI**: Calm, minimal design with clear visual hierarchy
- **Favicon Thumbnails**: Automatic favicon fetching with category icon fallbacks
- **No Database Required**: All data lives in a local TypeScript file generated from CSV
- **Static & Fast**: Built with Next.js App Router for optimal performance

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lydiastudio-resources
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Managing Resources

### Workflow Overview

1. **Collect submissions** via Google Forms or Google Sheets
2. **Review and approve** resources in your Google Sheet
3. **Export approved resources** from the "Approved" tab as CSV
4. **Save the CSV** to `data/approved.csv` in this project
5. **Generate TypeScript data** by running `npm run build:data`
6. **Refresh the site** to see updated resources

### Step-by-Step: Updating Resources

1. **Export from Google Sheets**:
   - Open your Google Sheet with approved resources
   - Go to File → Download → Comma Separated Values (.csv)
   - Make sure you're exporting the "Approved" tab

2. **Save the CSV**:
   ```bash
   # Save the downloaded file as:
   data/approved.csv
   ```

3. **Generate the data file**:
   ```bash
   npm run build:data
   ```

   This script will:
   - Read `data/approved.csv`
   - Filter only approved rows
   - Transform the data into typed TypeScript objects
   - Generate `data/resources.ts`

4. **Verify the output**:
   - Check `data/resources.ts` was created
   - The site will automatically use the new data on refresh

### CSV Format Requirements

Your CSV must have these column headers (exact strings):

- `Timestamp`
- `Resource name`
- `Link to the resource`
- `What type is this?`
- `What does this help with?`
- `Why is this helpful?`
- `Have you personally used this?`
- `Who is this especially good for?`
- `Any caveats?`
- `Setup effort (optional)`
- `Sensory Load (Optional)`
- `Price type (Optional)`
- `Your name or handle (Optional)`
- `Your email (Optional)`
- `I'm submitting something that feels genuinely supportive or useful (not spam).`
- `Approved`
- `Featured`
- `Internal Notes`
- `Source`

**Important**: Only rows where the `Approved` column is `TRUE` or `Yes` will be included.

## Data Model

Each resource has the following structure:

```typescript
{
  id: string;              // Auto-generated slug from title
  title: string;           // Resource name
  url: string;             // Full URL to the resource
  description: string;     // Short description (first sentence of why_it_helps)
  why_it_helps: string;    // Full explanation of benefits
  category: "tool" | "method" | "community" | "content" | "physical";
  support_needs: string[]; // Array of support need keys
  sensory_load: "low" | "medium" | "high";
  setup_effort: "low" | "medium" | "high";
  price_type: "free" | "freemium" | "paid";
  featured: boolean;       // Highlighted resources
  affiliate_url: string | null;
  is_affiliate: boolean;
  domain: string;          // Extracted from URL for favicon
}
```

## Project Structure

```
lydiastudio-resources/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main directory page
├── components/
│   └── ResourceCard.tsx     # Individual resource card
├── data/
│   ├── .gitkeep
│   ├── approved.csv         # Input CSV (not committed)
│   └── resources.ts         # Generated TypeScript data (committed)
├── scripts/
│   └── approved-csv-to-resources-ts.mjs  # CSV → TS conversion
├── types/
│   └── resource.ts          # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run build:data` - Generate data/resources.ts from data/approved.csv

## Deployment

This is a standard Next.js app and can be deployed to:

- **Vercel** (recommended): Connect your repo and deploy
- **Netlify**: Build command: `npm run build`, Publish directory: `.next`
- **Any static host**: Export with `next export` if using static rendering

Remember to run `npm run build:data` before deploying if you've updated your CSV locally.

## Future Enhancements

Potential features for future iterations:

- Automatic Google Sheets API integration
- User comments and ratings
- Affiliate link tracking
- Resource suggestions via AI
- Community voting
- Tags and advanced filtering
- Export to personal lists

## License

MIT

## Contributing

This is a personal project, but if you'd like to suggest improvements, feel free to open an issue.