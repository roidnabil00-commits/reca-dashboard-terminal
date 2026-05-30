# Reca Intelligence Terminal

Private Market Intelligence Platform — RECA

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Auth & Database**: Supabase (`@supabase/ssr`)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI**: Google Gemini API
- **PWA**: next-pwa

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

### 3. Supabase Database Setup
Run `supabase-schema.sql` in your **Supabase SQL Editor**:
1. Go to your Supabase project → SQL Editor
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run**

This creates all tables + RLS policies.

### 4. Create your first admin user
Use the Supabase Dashboard → Authentication → Add User (manually), then update their profile row in `public.profiles` with `role = 'admin'`.

Or use the Supabase service role API directly.

### 5. Run development server
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
npm start
```

---

## PWA Icons
Place your icons in `public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

Use any icon generator (e.g. [realfavicongenerator.net](https://realfavicongenerator.net)) with your logo.

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Secure login |
| `/dashboard` | All authenticated | Main terminal feed + AI chat |
| `/research` | All authenticated | General research library |
| `/private-report` | `client_premium`, `admin` | Confidential client reports |
| `/courses` | All authenticated | Video & book learning modules |
| `/admin` | `admin` only | Backoffice management panel |

---

## Admin Panel Features
- **Users**: Create `premium_member` / `client_premium` / `admin` accounts
- **Feed Injection**: Publish news, industry data, RECA letters with optional charts
- **Research**: Add Google Drive PDF/PPT to the research library
- **Private Reports**: Assign confidential reports to specific clients
- **Courses**: Add YouTube video modules or book/resource links

---

## RECA AI Analyst
Powered by **Gemini 1.5 Flash** with a strict system instruction:
> "You are the official RECA AI Analyst Assistant. Provide sharp, elite management consultant-style, data-driven answers about Indonesian markets..."

Accessible via the floating chat button on the Dashboard.

---

## Google Drive Integration
Paste any standard Google Drive sharing link — the platform automatically extracts the File ID and converts it to a `drive.google.com/file/d/FILE_ID/preview` embed URL.

**Important**: Set Google Drive files to **"Anyone with the link can view"** for iframes to work.

---

## Supabase RLS Summary
- `dashboard_feeds`, `general_researches`, `course_modules`: readable by all authenticated users
- `private_reports`: each client can **only** read rows where `client_id = auth.uid()`
- `profiles`: users read own; admins read all
- All write/insert/delete operations go through **service role** (admin API routes only)
