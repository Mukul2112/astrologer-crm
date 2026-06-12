import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.consultationNote.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // Users
  const admin = await prisma.user.create({
    data: { email: "admin@astrocrm.com", password: hashedPassword, name: "Rajesh Sharma", role: "ADMIN", avatar: "https://i.pravatar.cc/150?u=admin" },
  });
  const astrologer = await prisma.user.create({
    data: { email: "pandit@astrocrm.com", password: hashedPassword, name: "Pandit Suresh", role: "ASTROLOGER", avatar: "https://i.pravatar.cc/150?u=pandit" },
  });
  const staff = await prisma.user.create({
    data: { email: "staff@astrocrm.com", password: hashedPassword, name: "Priya Patel", role: "STAFF", avatar: "https://i.pravatar.cc/150?u=staff" },
  });

  console.log("✅ Users created");

  // Clients
  const clientData = [
    { name: "Arjun Mehta", phone: "+91 98765 43210", email: "arjun@gmail.com", zodiacSign: "Aries", birthPlace: "Mumbai", gender: "MALE" as const, dob: new Date("1990-04-15"), birthTime: "06:30 AM", consultationPreference: "Online" },
    { name: "Sneha Kapoor", phone: "+91 87654 32109", email: "sneha@gmail.com", zodiacSign: "Leo", birthPlace: "Delhi", gender: "FEMALE" as const, dob: new Date("1995-08-12"), birthTime: "11:15 AM", consultationPreference: "In-Person" },
    { name: "Vikram Singh", phone: "+91 76543 21098", email: "vikram@gmail.com", zodiacSign: "Scorpio", birthPlace: "Jaipur", gender: "MALE" as const, dob: new Date("1988-11-03"), birthTime: "03:45 PM", consultationPreference: "Phone" },
    { name: "Ananya Reddy", phone: "+91 65432 10987", email: "ananya@gmail.com", zodiacSign: "Pisces", birthPlace: "Bangalore", gender: "FEMALE" as const, dob: new Date("1992-03-22"), birthTime: "08:00 AM", consultationPreference: "Online" },
    { name: "Rahul Verma", phone: "+91 54321 09876", email: "rahul@gmail.com", zodiacSign: "Taurus", birthPlace: "Lucknow", gender: "MALE" as const, dob: new Date("1985-05-10"), birthTime: "12:30 PM", consultationPreference: "In-Person" },
    { name: "Deepika Iyer", phone: "+91 43210 98765", email: "deepika@gmail.com", zodiacSign: "Cancer", birthPlace: "Chennai", gender: "FEMALE" as const, dob: new Date("1997-07-01"), birthTime: "09:45 AM", consultationPreference: "Online" },
    { name: "Amit Gupta", phone: "+91 32109 87654", email: "amit@gmail.com", zodiacSign: "Virgo", birthPlace: "Kolkata", gender: "MALE" as const, dob: new Date("1991-09-14"), birthTime: "02:15 PM", consultationPreference: "Phone" },
    { name: "Kavita Nair", phone: "+91 21098 76543", email: "kavita@gmail.com", zodiacSign: "Gemini", birthPlace: "Kochi", gender: "FEMALE" as const, dob: new Date("1993-06-20"), birthTime: "07:00 AM", consultationPreference: "In-Person" },
    { name: "Sanjay Joshi", phone: "+91 10987 65432", email: "sanjay@gmail.com", zodiacSign: "Sagittarius", birthPlace: "Pune", gender: "MALE" as const, dob: new Date("1987-12-05"), birthTime: "04:30 PM", consultationPreference: "Online" },
    { name: "Pooja Deshmukh", phone: "+91 98761 23456", email: "pooja@gmail.com", zodiacSign: "Capricorn", birthPlace: "Nagpur", gender: "FEMALE" as const, dob: new Date("1994-01-15"), birthTime: "10:00 AM", consultationPreference: "Phone" },
    { name: "Karan Malhotra", phone: "+91 87652 34567", email: "karan@gmail.com", zodiacSign: "Aquarius", birthPlace: "Chandigarh", gender: "MALE" as const, dob: new Date("1989-02-08"), birthTime: "05:15 AM", consultationPreference: "In-Person" },
    { name: "Meera Pillai", phone: "+91 76543 45678", email: "meera@gmail.com", zodiacSign: "Libra", birthPlace: "Trivandrum", gender: "FEMALE" as const, dob: new Date("1996-10-23"), birthTime: "01:30 PM", consultationPreference: "Online" },
  ];

  const clients = [];
  for (const data of clientData) {
    const client = await prisma.client.create({
      data: { ...data, createdById: admin.id, avatar: `https://i.pravatar.cc/150?u=${data.email}` },
    });
    clients.push(client);
  }

  console.log("✅ 12 clients created");

  // Leads
  const leadStages = ["NEW_LEAD", "CONTACTED", "INTERESTED", "CONSULTATION_BOOKED", "CONSULTATION_COMPLETED", "LOST_LEAD", "NEW_LEAD", "CONTACTED"] as const;
  const leadSources = ["Website", "Referral", "Social Media", "Phone", "Walk-in", "WhatsApp", "Google", "Instagram"];

  for (let i = 0; i < 8; i++) {
    await prisma.lead.create({
      data: {
        clientId: clients[i].id,
        stage: leadStages[i],
        source: leadSources[i],
        assignedAstrologerId: i % 2 === 0 ? astrologer.id : admin.id,
        lastContactDate: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
        notes: `Lead from ${leadSources[i]}`,
      },
    });
  }

  console.log("✅ 8 leads created");

  // Appointments
  const appointmentTypes = ["Birth Chart Reading", "Tarot", "Career Consultation", "Relationship Compatibility", "Kundli Analysis", "Gemstone Consultation"];
  const appointmentStatuses = ["COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "SCHEDULED", "SCHEDULED", "SCHEDULED", "CONFIRMED", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED", "SCHEDULED", "CONFIRMED"] as const;
  const fees = [1500, 2000, 2500, 1800, 3000, 1200, 2200, 1500, 2800, 1600, 2000, 2500, 1800, 3500, 2000];

  for (let i = 0; i < 15; i++) {
    const daysOffset = i < 7 ? -(i * 5 + 3) : (i - 6) * 3;
    await prisma.appointment.create({
      data: {
        clientId: clients[i % 12].id,
        astrologerId: i % 3 === 0 ? astrologer.id : admin.id,
        dateTime: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000),
        duration: [30, 45, 60, 90][i % 4],
        type: appointmentTypes[i % 6],
        status: appointmentStatuses[i],
        fee: fees[i],
        notes: i % 3 === 0 ? "Client requested detailed analysis" : null,
      },
    });
  }

  console.log("✅ 15 appointments created");

  // Follow-ups
  const followUpDescriptions = [
    "Send Kundli report via email",
    "Call to discuss gemstone recommendations",
    "Follow up on career consultation",
    "Schedule next session for detailed reading",
    "Share remedial measures document",
    "Birthday wish & check-in",
    "Discuss monthly prediction update",
    "Reminder for annual reading",
  ];

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let i = 0; i < 8; i++) {
    const daysFromNow = i < 2 ? 0 : i < 4 ? i : -(i * 3);
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + daysFromNow);

    await prisma.followUp.create({
      data: {
        clientId: clients[i].id,
        description: followUpDescriptions[i],
        dueDate,
        isCompleted: i >= 5,
        createdById: astrologer.id,
      },
    });
  }

  console.log("✅ 8 follow-ups created");

  // Notifications
  const notifs = [
    { title: "New Lead Assigned", message: "Arjun Mehta has been assigned to you", type: "lead" },
    { title: "Appointment Reminder", message: "Session with Sneha Kapoor in 1 hour", type: "appointment" },
    { title: "Follow-Up Due", message: "Send Kundli report to Vikram Singh", type: "followup" },
    { title: "New Client Added", message: "Ananya Reddy joined AstroCRM", type: "system" },
    { title: "Session Completed", message: "Career consultation with Rahul Verma completed", type: "appointment" },
  ];

  for (let i = 0; i < notifs.length; i++) {
    await prisma.notification.create({
      data: {
        userId: astrologer.id,
        ...notifs[i],
        isRead: i > 2,
        createdAt: new Date(Date.now() - i * 3600 * 1000 * (i + 1)),
      },
    });
  }

  console.log("✅ 5 notifications created");

  // Audit logs
  const auditEntries = [
    { action: "CREATE", entity: "Client", entityId: clients[0].id, details: "Created client Arjun Mehta" },
    { action: "CREATE", entity: "Appointment", entityId: "appt-1", details: "Scheduled Birth Chart Reading" },
    { action: "UPDATE", entity: "Lead", entityId: "lead-1", details: "Moved lead to CONTACTED stage" },
    { action: "CREATE", entity: "Client", entityId: clients[1].id, details: "Created client Sneha Kapoor" },
    { action: "UPDATE", entity: "Appointment", entityId: "appt-2", details: "Marked session as COMPLETED" },
    { action: "CREATE", entity: "FollowUp", entityId: "fu-1", details: "Created follow-up for Vikram Singh" },
    { action: "LOGIN", entity: "User", entityId: admin.id, details: "Admin logged in" },
    { action: "CREATE", entity: "Client", entityId: clients[2].id, details: "Created client Vikram Singh" },
    { action: "UPDATE", entity: "Lead", entityId: "lead-2", details: "Moved lead to INTERESTED stage" },
    { action: "CREATE", entity: "Appointment", entityId: "appt-3", details: "Scheduled Tarot Reading" },
  ];

  for (let i = 0; i < auditEntries.length; i++) {
    await prisma.auditLog.create({
      data: {
        userId: i % 2 === 0 ? admin.id : astrologer.id,
        ...auditEntries[i],
        createdAt: new Date(Date.now() - i * 2 * 3600 * 1000),
      },
    });
  }

  console.log("✅ 10 audit logs created");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
