# Gerald Villaceran — Portfolio

Personal portfolio and case-study site for a software engineer. Built with the Next.js App Router, it serves a marketing front end plus a small live-chat product: visitors can open a chat widget, send text, voice notes and images, and an AI assistant answers from a curated knowledge base while the owner gets an email alert.

Live: https://portfolio-five-ruddy-49.vercel.app

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with a theme defined in `src/app/globals.css` |
| Animation | Framer Motion |
| Data & realtime | Supabase (Postgres, Realtime, Storage, RLS) |
| AI replies | GitHub Models (`gpt-4o-mini`) via the Azure inference endpoint |
| Mail | Nodemailer |
| Notifications | Sonner |
| Hosting | Vercel |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build   # production build, also runs the TypeScript check
npm start       # serve the production build
```

### Environment

Copy the variables below into `.env.local`. The site renders without them, but the contact form, live chat and AI replies will not work.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key for chat and contact routes |
| `GITHUB_TOKEN` | GitHub Models token for AI auto-reply; without it the widget falls back to a canned offline message |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Outbound mail for contact and chat alerts |
| `ADMIN_EMAIL` | Where contact-form and new-chat alerts are sent |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used by metadata, `sitemap.xml` and `robots.txt` |

## Layout

```
src/
  app/
    page.tsx                 home page, composes the sections
    layout.tsx               fonts, metadata, JSON-LD, global widgets
    globals.css              design tokens, utilities, reduced-motion rules
    projects/[slug]/         case studies (statically generated per project)
    admin/chat/              chat inbox for the site owner
    api/
      contact/               contact form handler
      chat/start|message/    live-chat session and message handlers
      lib/                   db and mail helpers
  components/
    sections/                one file per home-page section
    ui/                      navigation, chat widget, gallery, decorative shapes
    hooks/useScrollSpy.ts    drives the active nav link
  data/portfolioData.ts      single source of truth for all site content
  types/                     shared interfaces
```

### Editing content

Almost everything visible — metrics, services, projects, the build log, experience, expertise, bio and contact details — lives in [`src/data/portfolioData.ts`](src/data/portfolioData.ts). Project durations are computed from `startedAt` by `monthsSince`, so the "N months and counting" figures stay current without edits.

Adding a project means appending an entry to `projects`, adding a `projectScreenshots` key that matches its `title`, and dropping the media under `public/project/<Name>/`. The route, the sitemap entry and the metadata follow automatically.

## Notes

- **Video format.** Browsers cannot play Matroska, so project videos must be H.264 MP4. To convert: `ffmpeg -i in.mkv -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart out.mp4`.
- **`SourceGuard`** blocks the context menu and the view-source, save-page and devtools shortcuts. It is a deterrent against casual copying, not a security control — never put a secret in client code and rely on it.
- **Reduced motion.** Every decorative animation is wrapped in `motion-safe:` or disabled by the `prefers-reduced-motion` block in `globals.css`.
- **ESLint.** `npx eslint` currently fails to load the flat config under ESLint 9 (`Converting circular structure to JSON` from `@eslint/eslintrc`). `npm run build` still type-checks, so this is a lint-only gap.
