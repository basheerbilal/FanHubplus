export interface FandomEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  venue: string;
  image: string;
  category: string;
  type: string;
  status: "upcoming" | "live" | "ended";
  price?: string;
  time?: string;
}

export const events: FandomEvent[] = [
  {
    id: "event-1",
    title: "Anime Expo Worldwide 2026",
    description: "The premier global anime convention featuring exclusive Jujutsu Kaisen & Demon Slayer world premiere screenings, creator panels, and massive exhibition halls.",
    date: "2026-10-15",
    location: "Los Angeles, CA",
    city: "Los Angeles",
    venue: "Convention Center",
    image: "https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=800",
    category: "Anime",
    type: "Convention",
    status: "upcoming",
    price: "$65.00",
    time: "10:00 AM PST"
  },
  {
    id: "event-2",
    title: "CyberPulse eSports World Championship 2026",
    description: "Top international pro gaming teams battle for the $3,000,000 championship trophy in a high-octane neon cyber arena with live orchestra.",
    date: "2026-11-08",
    location: "Tokyo, Japan",
    city: "Tokyo",
    venue: "Tokyo Big Sight Arena",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    category: "Gaming",
    type: "Tournament",
    status: "upcoming",
    price: "$85.00",
    time: "02:00 PM JST"
  },
  {
    id: "event-3",
    title: "K-Pop World Tour: Luminous Resonance",
    description: "Global sensation Luminous embarks on their grand arena world tour with spectacular holographic stages, lightsticks sync, and special VIP fan meetups.",
    date: "2026-11-22",
    location: "Seoul, South Korea",
    city: "Seoul",
    venue: "Olympic Gymnastics Arena",
    image: "https://images.unsplash.com/photo-1514525253361-b83f859b21c0?auto=format&fit=crop&q=80&w=800",
    category: "K-Pop",
    type: "Concert",
    status: "upcoming",
    price: "$120.00",
    time: "07:00 PM KST"
  },
  {
    id: "event-4",
    title: "Comic-Con International 2026",
    description: "The pinnacle of pop culture gatherings featuring blockbuster cinematic reveals, celebrity panels, exclusive collectibles, and artist alley showcases.",
    date: "2026-12-05",
    location: "San Diego, CA",
    city: "San Diego",
    venue: "San Diego Convention Center",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=800",
    category: "Comics",
    type: "Convention",
    status: "upcoming",
    price: "$95.00",
    time: "09:00 AM PST"
  },
  {
    id: "event-5",
    title: "Jump Festa Anime Winter Showcase",
    description: "Shueisha's flagship festival unveiling the next era of Shonen Jump anime adaptations, live voice actor stages, and manga creator spotlights.",
    date: "2026-12-19",
    location: "Tokyo, Japan",
    city: "Tokyo",
    venue: "Makuhari Messe",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
    category: "Anime",
    type: "Premiere",
    status: "upcoming",
    price: "$50.00",
    time: "10:00 AM JST"
  },
  {
    id: "event-6",
    title: "World Cosplay Summit & Grand Gala",
    description: "Master cosplayers from over 40 nations compete in awe-inspiring craftsmanship and live theatrical performance rounds.",
    date: "2027-01-14",
    location: "New York, NY",
    city: "New York",
    venue: "Javits Center Grand Ballroom",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800",
    category: "Anime",
    type: "Exhibition",
    status: "upcoming",
    price: "$45.00",
    time: "11:00 AM EST"
  },
  {
    id: "event-7",
    title: "Pakistan Anime & Gaming Con 2026",
    description: "South Asia's largest fandom celebration bringing together anime lovers, Tekken esports finalists, voice artists, and cosplay contests.",
    date: "2026-11-28",
    location: "Lahore, Pakistan",
    city: "Lahore",
    venue: "Expo Centre Lahore",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    category: "Gaming",
    type: "Convention",
    status: "upcoming",
    price: "PKR 1,500",
    time: "12:00 PM PKT"
  },
  {
    id: "event-8",
    title: "Cinematic Sci-Fi Film Festival 2027",
    description: "Exclusive 70mm IMAX midnight premieres of upcoming dystopian sci-fi and anime fantasy films with Q&A director panels.",
    date: "2027-02-10",
    location: "London, UK",
    city: "London",
    venue: "BFI IMAX Southbank",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    category: "Movies",
    type: "Premiere",
    status: "upcoming",
    price: "£35.00",
    time: "08:00 PM GMT"
  }
];
