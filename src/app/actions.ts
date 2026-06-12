"use server";

import { revalidatePath } from "next/cache";
import { clients, appointments, Appointment, Client } from "@/lib/data";

export async function addClient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name) return;

  const newClient: Client = {
    id: "c" + (clients.length + 1),
    name,
    email,
    dob: "1990-01-01", // Placeholder
    tob: "12:00", // Placeholder
    pob: "Unknown", // Placeholder
    zodiac: "Aries", // Placeholder
    status: "New",
    phone: "",
    avatar: "https://i.pravatar.cc/150?u=" + Math.random(),
  };

  clients.push(newClient);
  
  revalidatePath("/");
  revalidatePath("/clients");
}

export async function scheduleSession(formData: FormData) {
  const clientName = formData.get("client") as string;
  const datetime = formData.get("datetime") as string;

  if (!clientName || !datetime) return;

  // Find client ID by name, or use c1 as fallback
  const client = clients.find(c => c.name === clientName);
  const clientId = client ? client.id : "c1";

  const newAppointment: Appointment = {
    id: "a" + (appointments.length + 1),
    clientId,
    date: new Date(datetime).toISOString(),
    type: "Birth Chart Reading", // Placeholder default
    status: "Upcoming",
    amount: 1500,
  };

  appointments.push(newAppointment);

  revalidatePath("/");
  revalidatePath("/appointments");
}

export async function rescheduleSession(formData: FormData) {
  const appointmentId = formData.get("appointmentId") as string;
  const datetime = formData.get("datetime") as string;

  if (!appointmentId || !datetime) return;

  const appointment = appointments.find(a => a.id === appointmentId);
  if (appointment) {
    appointment.date = new Date(datetime).toISOString();
  }

  revalidatePath("/");
  revalidatePath("/appointments");
}
