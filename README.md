# Luma Dental Care

A modern dental practice management web application built with Next.js, Prisma, and SQLite.

## Features

- **Patient Portal** — Register, book appointments, view treatment history
- **Doctor Dashboard** — Manage appointments, view patient records, update treatment notes
- **Admin Dashboard** — Full system management: users, staff, services, locations, testimonials, team members, site settings, and database browser
- **Public Website** — Home, About, Services, Booking, and Contact pages with dynamic content managed by the admin
- **Email Notifications** — Appointment confirmation emails sent automatically on booking

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js (Credentials provider)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seed-settings.ts
npx tsx prisma/seed-all.ts
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Accounts

| Role    | Email                     | Password    |
|---------|---------------------------|-------------|
| Admin   | admin@lumadental.com      | password123 |
| Doctor  | sarah@lumadental.com      | password123 |
| Doctor  | michael@lumadental.com    | password123 |
| Doctor  | emily@lumadental.com      | password123 |

## Project Structure

```
src/
  app/
    admin/          # Admin dashboard pages
    doctor/         # Doctor dashboard pages
    patient/        # Patient dashboard pages
    api/            # API routes
    login/          # Login page
    register/       # Patient registration
    booking/        # Appointment booking
    about/          # About page
    services/       # Services page
    contact/        # Contact page
  components/
    dashboard/      # Shared dashboard components (Sidebar, TopBar)
    public/         # Shared public site components (Header, Footer)
  lib/
    auth.ts         # NextAuth configuration
    prisma.ts       # Prisma client singleton
    email.ts        # Email notification service
prisma/
  schema.prisma     # Database schema
  seed.ts           # Core data seeder
  seed-settings.ts  # Site settings seeder
  seed-all.ts       # Testimonials, team, page images seeder
```

## License

Private — Luma Dental Care
