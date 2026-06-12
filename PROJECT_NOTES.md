# Project Notes: Astrologer CRM

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Frontend:** React, Tailwind CSS
* **Database:** PostgreSQL (hosted on Supabase)
* **ORM:** Prisma
* **Icons:** Lucide React
* **Integrations:** Google Calendar (Dynamic URL generation), Nodemailer (Email alerts)
* **Deployment:** Vercel

## 🏗️ Architecture
* **Full-Stack Application:** The project utilizes Next.js for both the frontend UI and the backend API routes, keeping the codebase unified and easy to deploy.
* **Database Design:** The core architectural decision was separating the **Client** model from the **Lead** model. 
  * *Clients* hold permanent astrological demographic data (Birth Date, Time, Place). 
  * *Leads* represent transactional interest in a specific service. This 1-to-Many relationship allows an astrologer to track multiple sales opportunities from a single client without duplicating complex birth records.
* **Design System:** The UI employs a custom, mobile-responsive "glassmorphism" aesthetic with a unified dark/premium color palette to suit the astrological niche.

## 🧠 Assumptions Made
* **Repeat Business:** It is assumed that astrologers have high client retention and up-sell different services over time (e.g., selling a Gemstone consultation to someone who previously bought a Tarot reading).
* **Single User Focus:** The current iteration assumes the CRM is being used by a single astrologer or a small, unified team. It does not currently implement multi-tenant data siloing.
* **Manual Lead Entry:** While the system tracks leads, it is currently assumed the astrologer manually inputs them or imports them, rather than leads self-registering via a public form.

## 🚀 Future Improvements
* **Authentication & Security:** Implement secure login using NextAuth.js or Supabase Auth to protect client data.
* **Payment Integration:** Integrate Stripe or Razorpay to allow astrologers to collect consultation fees directly when converting a Lead into a Scheduled Appointment.
* **Automated WhatsApp Reminders:** Upgrade the current email notification system to send automated WhatsApp or SMS reminders to clients 24 hours before their scheduled appointment.
* **Public Booking Page:** Create a public-facing scheduling link where clients can submit their birth details directly into the CRM as a new Lead.
