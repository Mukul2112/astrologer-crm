export interface Client {
  id: string;
  name: string;
  dob: string;
  tob: string; // Time of birth
  pob: string; // Place of birth
  zodiac: string;
  status: "Active" | "Inactive" | "New";
  email: string;
  phone: string;
  avatar: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string; // ISO string
  type: "Birth Chart Reading" | "Tarot" | "Career Consultation" | "Relationship Compatibility";
  status: "Upcoming" | "Completed" | "Cancelled";
  amount: number;
}

export interface Note {
  id: string;
  clientId: string;
  date: string;
  content: string;
}

export let clients: Client[] = [
  {
    id: "c1",
    name: "Aarav Sharma",
    dob: "1992-05-14",
    tob: "14:30",
    pob: "New Delhi, India",
    zodiac: "Taurus",
    status: "Active",
    email: "aarav.s@example.com",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: "c2",
    name: "Meera Patel",
    dob: "1988-11-22",
    tob: "08:15",
    pob: "Mumbai, India",
    zodiac: "Scorpio",
    status: "New",
    email: "meera.p@example.com",
    phone: "+91 98765 43211",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: "c3",
    name: "Rohan Gupta",
    dob: "1995-02-05",
    tob: "23:45",
    pob: "Bangalore, India",
    zodiac: "Aquarius",
    status: "Active",
    email: "rohan.g@example.com",
    phone: "+91 98765 43212",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  },
  {
    id: "c4",
    name: "Kavya Singh",
    dob: "1990-08-18",
    tob: "06:10",
    pob: "Jaipur, India",
    zodiac: "Leo",
    status: "Inactive",
    email: "kavya.s@example.com",
    phone: "+91 98765 43213",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
  }
];

export let appointments: Appointment[] = [
  {
    id: "a1",
    clientId: "c2",
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    type: "Birth Chart Reading",
    status: "Upcoming",
    amount: 1500
  },
  {
    id: "a2",
    clientId: "c1",
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    type: "Career Consultation",
    status: "Upcoming",
    amount: 2000
  },
  {
    id: "a3",
    clientId: "c3",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    type: "Relationship Compatibility",
    status: "Completed",
    amount: 2500
  }
];

export const notes: Note[] = [
  {
    id: "n1",
    clientId: "c1",
    date: "2023-10-15T10:00:00Z",
    content: "Aarav is entering a major Jupiter return. Advised caution with career changes until next March. Gemstone recommended: Yellow Sapphire."
  },
  {
    id: "n2",
    clientId: "c3",
    date: "2023-12-05T14:00:00Z",
    content: "Rohan asked about marriage prospects. 7th house shows slight delay due to Saturn transit. Recommended regular meditation and chanting."
  }
];

// Helper functions for mock data
export const getClient = (id: string) => clients.find(c => c.id === id);
export const getClientAppointments = (id: string) => appointments.filter(a => a.clientId === id);
export const getClientNotes = (id: string) => notes.filter(n => n.clientId === id);
