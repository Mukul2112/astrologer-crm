# Astrologer CRM - Project Notes

## Overview
Astrologer CRM is a specialized dashboard designed for professional astrologers to manage their clients, appointments, and consultation notes seamlessly.

## Tech Stack
*   **Frontend Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS with custom global CSS (Glassmorphism, deep dark aesthetics)
*   **Icons**: `lucide-react`
*   **Date Formatting**: `date-fns`
*   **Data Storage**: In-memory mock data (used `src/lib/data.ts`) to ensure rapid development, a flawless demo experience, and an easy setup for evaluators without needing external database credentials.

## Architecture
The application follows a standard Next.js App Router architecture:
*   `src/app/page.tsx`: The main Dashboard view containing analytics and a quick summary.
*   `src/app/layout.tsx`: Root layout that includes a persistent global `Sidebar` navigation.
*   `src/app/clients/page.tsx`: A table view of all clients with quick search capabilities.
*   `src/app/clients/[id]/page.tsx`: A dynamic route detailing a specific client's profile, birth details, and past consultation notes.
*   `src/app/appointments/page.tsx`: A schedule view for upcoming astrological readings.
*   `src/components/`: Contains reusable UI elements like the Sidebar.
*   `src/lib/data.ts`: Acts as the central mock database and provides data fetching helpers.

## Assumptions
*   **Single User Context**: The CRM is built assuming a single Astrologer (Pandit Ji) is logged in. Authentication is bypassed for the MVP.
*   **Mock Data Strategy**: Since the focus is on a high-quality UI/UX and immediate runnability for the assignment submission, a mock database is sufficient. No backend API routes were strictly necessary.
*   **Modern Browser**: Relies on modern CSS features like `backdrop-filter` for the glassmorphism effects.

## Future Improvements
1.  **Database Integration**: Migrate the mock data to a PostgreSQL database (e.g., Supabase or Neon) with Prisma ORM.
2.  **Authentication**: Add NextAuth (Auth.js) to allow multiple astrologers to create accounts and securely manage their independent client lists.
3.  **Astrology API Integration**: Integrate a third-party astrology API (e.g., Vedic Rishi) to automatically pull current planetary transits or generate charts based on the client's DOB/TOB/POB.
4.  **Payment Gateway**: Add Razorpay or Stripe to allow clients to prepay for their consultations.
5.  **Calendar Sync**: Integrate Google Calendar to automatically block off times for new appointments.
