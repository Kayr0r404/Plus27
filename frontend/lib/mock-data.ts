export type Community = {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
};

export type Vendor = {
  id: string;
  slug: string;
  communitySlug: string;
  name: string;
  category: string;
  area: string;
  description: string;
  about: string;
  cover: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  recommendations: number;
  tags: string[];
  hours: string;
  contact: string;
};

export type Product = {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  unit?: string;
  category: string;
  description: string;
  inStock: boolean;
  imageTone: "mint" | "teal" | "violet" | "navy";
};

export type Review = {
  id: string;
  vendorId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  recommends: boolean;
};

export type ForumThread = {
  id: string;
  communitySlug: string;
  title: string;
  category: string;
  author: string;
  area: string;
  replies: number;
  views: number;
  lastActive: string;
  excerpt: string;
  tags: string[];
};

export type ForumPost = {
  id: string;
  threadId: string;
  author: string;
  role?: string;
  time: string;
  content: string;
};

export type Job = {
  id: string;
  communitySlug: string;
  title: string;
  category: string;
  area: string;
  pay: string;
  type: "Once-off" | "Part-time" | "Short-term";
  postedBy: string;
  postedAt: string;
  description: string;
};

export type Rental = {
  id: string;
  communitySlug: string;
  title: string;
  listingType: "Room" | "House" | "Flat" | "Back room";
  area: string;
  price: string;
  period: string;
  bedrooms?: number;
  bathrooms?: number;
  available: string;
  postedBy: string;
  postedAt: string;
  amenities: string[];
  description: string;
};

export const communities: Community[] = [
  {
    id: "c1",
    slug: "daveyton",
    name: "Daveyton",
    region: "Ekurhuleni, Gauteng",
    description:
      "Connect with residents, local vendors, and community groups in Daveyton. See discussions, products, and services in your area by default.",
  },
  {
    id: "c2",
    slug: "soweto",
    name: "Soweto",
    region: "Johannesburg, Gauteng",
    description:
      "Discover local conversations, marketplaces, and vendor stores in Soweto communities.",
  },
  {
    id: "c3",
    slug: "tembisa",
    name: "Tembisa",
    region: "Ekurhuleni, Gauteng",
    description:
      "Explore Tembisa community discussions, nearby vendors, and products available in the area.",
  },
];

export const defaultCommunitySlug = "daveyton";

export const vendors: Vendor[] = [
  {
    id: "v1",
    slug: "mama-neo-fresh-produce",
    communitySlug: "daveyton",
    name: "Mama Neo Fresh Produce",
    category: "Groceries & Produce",
    area: "Daveyton Central",
    description: "Seasonal fruit, vegetables, and everyday essentials sourced locally.",
    about:
      "Family-run produce stall serving Daveyton for over 10 years. We focus on fresh stock every morning, fair pricing, and community bulk orders for events and households.",
    cover: "from-primary/30 via-secondary/20 to-violet/30",
    avatar: "MN",
    rating: 4.8,
    reviewCount: 124,
    recommendations: 96,
    tags: ["Fresh daily", "Bulk orders", "Local delivery"],
    hours: "Mon–Sat, 07:00–18:00",
    contact: "WhatsApp orders available",
  },
  {
    id: "v2",
    slug: "sbu-streetwear",
    communitySlug: "daveyton",
    name: "Sbu Streetwear",
    category: "Fashion & Apparel",
    area: "Rampa Section",
    description: "Custom tees, caps, and streetwear drops inspired by local culture.",
    about:
      "Independent clothing brand offering ready-to-wear items and custom prints for schools, teams, and events. New drops announced weekly in the community forum.",
    cover: "from-violet/30 via-primary/20 to-secondary/30",
    avatar: "SS",
    rating: 4.6,
    reviewCount: 78,
    recommendations: 61,
    tags: ["Custom prints", "New drops", "Pickup point"],
    hours: "Tue–Sun, 10:00–19:00",
    contact: "DM for custom orders",
  },
  {
    id: "v3",
    slug: "thandi-home-kitchen",
    communitySlug: "daveyton",
    name: "Thandi Home Kitchen",
    category: "Food & Catering",
    area: "Etwatwa West",
    description: "Home-cooked meals, lunch combos, and catering for local gatherings.",
    about:
      "Affordable daily meals and pre-order platters for meetings, funerals, and celebrations. Menu changes daily based on available ingredients and community requests.",
    cover: "from-secondary/30 via-primary/20 to-surface-muted",
    avatar: "TK",
    rating: 4.9,
    reviewCount: 203,
    recommendations: 171,
    tags: ["Pre-orders", "Catering", "Daily specials"],
    hours: "Mon–Fri, 09:00–17:00",
    contact: "Call/WhatsApp for menu",
  },
  {
    id: "v4",
    slug: "lerato-tech-fixes",
    communitySlug: "daveyton",
    name: "Lerato Tech Fixes",
    category: "Services & Repairs",
    area: "Daveyton Mall Area",
    description: "Phone repairs, accessories, and basic device setup support.",
    about:
      "Quick-turnaround repairs for common phone issues, screen protectors, chargers, and help setting up apps and accounts for residents and small businesses.",
    cover: "from-primary/20 via-surface-muted to-violet/20",
    avatar: "LT",
    rating: 4.5,
    reviewCount: 52,
    recommendations: 39,
    tags: ["Same-day fixes", "Accessories", "Device setup"],
    hours: "Mon–Sat, 08:30–18:30",
    contact: "Walk-ins welcome",
  },
  {
    id: "v5",
    slug: "orlando-fresh-market",
    communitySlug: "soweto",
    name: "Orlando Fresh Market",
    category: "Groceries & Produce",
    area: "Orlando East",
    description: "Fresh produce, pantry staples, and local household essentials.",
    about:
      "Community-focused market serving Orlando East with daily produce, affordable combos, and pre-packed family essentials.",
    cover: "from-primary/30 via-secondary/20 to-violet/30",
    avatar: "OF",
    rating: 4.7,
    reviewCount: 88,
    recommendations: 70,
    tags: ["Fresh produce", "Family packs", "Local"],
    hours: "Mon–Sat, 07:00–18:00",
    contact: "In-store & WhatsApp",
  },
  {
    id: "v6",
    slug: "vilakazi-bites",
    communitySlug: "soweto",
    name: "Vilakazi Bites",
    category: "Food & Catering",
    area: "Vilakazi Street",
    description: "Street food favorites, kota specials, and event catering.",
    about:
      "Popular local food spot offering quick meals and catering for gatherings in and around Soweto.",
    cover: "from-secondary/30 via-primary/20 to-surface-muted",
    avatar: "VB",
    rating: 4.8,
    reviewCount: 156,
    recommendations: 132,
    tags: ["Street food", "Catering", "Takeaway"],
    hours: "Mon–Sun, 09:00–20:00",
    contact: "Call for orders",
  },
  {
    id: "v7",
    slug: "tembisa-style-hub",
    communitySlug: "tembisa",
    name: "Tembisa Style Hub",
    category: "Fashion & Apparel",
    area: "Tembisa Central",
    description: "Affordable fashion, uniforms, and custom local prints.",
    about:
      "Local clothing store providing everyday wear, school essentials, and custom printed items for community groups.",
    cover: "from-violet/30 via-primary/20 to-secondary/30",
    avatar: "TS",
    rating: 4.6,
    reviewCount: 64,
    recommendations: 49,
    tags: ["Uniforms", "Custom prints", "Affordable"],
    hours: "Mon–Sat, 09:00–18:00",
    contact: "Walk-ins & orders",
  },
];

export const products: Product[] = [
  { id: "p1", vendorId: "v1", name: "Mixed Veg Combo", price: 60, unit: "pack", category: "Combos", description: "Tomatoes, onions, peppers, spinach, and potatoes.", inStock: true, imageTone: "mint" },
  { id: "p2", vendorId: "v1", name: "Seasonal Fruit Bag", price: 45, unit: "bag", category: "Fruit", description: "Assorted in-season fruit selection.", inStock: true, imageTone: "teal" },
  { id: "p3", vendorId: "v1", name: "Maize Meal 5kg", price: 75, category: "Pantry", description: "Staple pantry item, available daily.", inStock: true, imageTone: "navy" },
  { id: "p4", vendorId: "v2", name: "Local Graphic Tee", price: 180, category: "T-shirts", description: "Cotton tee with local-inspired print.", inStock: true, imageTone: "violet" },
  { id: "p5", vendorId: "v2", name: "Custom Name Cap", price: 120, category: "Caps", description: "Personalized cap, made to order.", inStock: true, imageTone: "mint" },
  { id: "p6", vendorId: "v2", name: "Team Hoodie Print", price: 350, category: "Hoodies", description: "Bulk/team custom hoodie printing.", inStock: false, imageTone: "teal" },
  { id: "p7", vendorId: "v3", name: "Weekday Lunch Plate", price: 55, category: "Meals", description: "Daily meal with starch, protein, and sides.", inStock: true, imageTone: "teal" },
  { id: "p8", vendorId: "v3", name: "Family Platter (4)", price: 220, category: "Platters", description: "Pre-order platter for four people.", inStock: true, imageTone: "mint" },
  { id: "p9", vendorId: "v3", name: "Event Catering Quote", price: 0, unit: "from", category: "Catering", description: "Custom quote for community events.", inStock: true, imageTone: "violet" },
  { id: "p10", vendorId: "v4", name: "Screen Protector Fit", price: 80, category: "Accessories", description: "Fitting service for most phone models.", inStock: true, imageTone: "navy" },
  { id: "p11", vendorId: "v4", name: "Charging Cable", price: 100, category: "Accessories", description: "USB-C / Micro USB options.", inStock: true, imageTone: "mint" },
  { id: "p12", vendorId: "v4", name: "Phone Diagnosis", price: 50, category: "Repairs", description: "Assessment and repair quote.", inStock: true, imageTone: "teal" },
  { id: "p13", vendorId: "v5", name: "Weekly Veg & Fruit Pack", price: 85, unit: "pack", category: "Combos", description: "Mixed seasonal produce for the week.", inStock: true, imageTone: "mint" },
  { id: "p14", vendorId: "v5", name: "Household Essentials Bundle", price: 120, category: "Pantry", description: "Basic pantry and household staples.", inStock: true, imageTone: "navy" },
  { id: "p15", vendorId: "v6", name: "Kota Special", price: 40, category: "Meals", description: "Signature kota with local favorites.", inStock: true, imageTone: "teal" },
  { id: "p16", vendorId: "v6", name: "Party Platter", price: 260, category: "Catering", description: "Pre-order platter for events and gatherings.", inStock: true, imageTone: "violet" },
  { id: "p17", vendorId: "v7", name: "School Shirt Bundle", price: 150, category: "Uniforms", description: "Affordable school shirt options.", inStock: true, imageTone: "mint" },
  { id: "p18", vendorId: "v7", name: "Custom Print Tee", price: 170, category: "T-shirts", description: "Custom printed t-shirts for groups.", inStock: true, imageTone: "violet" },
];

export const reviews: Review[] = [
  { id: "r1", vendorId: "v1", author: "Lerato M.", rating: 5, date: "2 days ago", comment: "Always fresh and the combo packs save me time. Highly recommend.", recommends: true },
  { id: "r2", vendorId: "v1", author: "Sipho K.", rating: 4, date: "1 week ago", comment: "Good prices and friendly service. Delivery was on time.", recommends: true },
  { id: "r3", vendorId: "v2", author: "Nandi P.", rating: 5, date: "3 days ago", comment: "The custom caps for our team came out perfect.", recommends: true },
  { id: "r4", vendorId: "v3", author: "Ayanda S.", rating: 5, date: "Yesterday", comment: "Best lunch plates in the area. Portions are generous.", recommends: true },
  { id: "r5", vendorId: "v4", author: "Kabelo T.", rating: 4, date: "4 days ago", comment: "Fixed my charging port same day. Fair price.", recommends: true },
  { id: "r6", vendorId: "v5", author: "Busi N.", rating: 5, date: "3 days ago", comment: "Fresh produce and very convenient bundles.", recommends: true },
  { id: "r7", vendorId: "v6", author: "Jabu M.", rating: 5, date: "1 day ago", comment: "Great food and fast service. Will recommend.", recommends: true },
  { id: "r8", vendorId: "v7", author: "Sindi L.", rating: 4, date: "1 week ago", comment: "Good prices on uniforms and helpful staff.", recommends: true },
];

export const forumThreads: ForumThread[] = [
  {
    id: "t1",
    communitySlug: "daveyton",
    title: "Weekend community clean-up at Daveyton Park",
    category: "Community",
    author: "Nomsa D.",
    area: "Daveyton Central",
    replies: 24,
    views: 312,
    lastActive: "35 min ago",
    excerpt: "Looking for volunteers for Saturday morning. Gloves and bags provided, meet at the main gate at 08:00.",
    tags: ["volunteer", "events"],
  },
  {
    id: "t2",
    communitySlug: "daveyton",
    title: "Recommendations for affordable school uniform suppliers?",
    category: "Marketplace",
    author: "Peter M.",
    area: "Rampa Section",
    replies: 18,
    views: 540,
    lastActive: "2 hours ago",
    excerpt: "Need uniforms for two kids before next term. Any local vendors with good prices and quality?",
    tags: ["schools", "vendors"],
  },
  {
    id: "t3",
    communitySlug: "daveyton",
    title: "Load shedding schedule & backup charging spots",
    category: "Local Info",
    author: "Community Mod",
    area: "Daveyton",
    replies: 41,
    views: 1204,
    lastActive: "1 hour ago",
    excerpt: "Share updated schedules and places where residents can safely charge devices during outages.",
    tags: ["utilities", "tips"],
  },
  {
    id: "t4",
    communitySlug: "soweto",
    title: "Youth soccer tournament volunteers needed",
    category: "Community",
    author: "Mandla S.",
    area: "Orlando West",
    replies: 15,
    views: 276,
    lastActive: "50 min ago",
    excerpt: "We need referees, coordinators, and vendors for next month’s local youth tournament.",
    tags: ["sports", "events"],
  },
  {
    id: "t5",
    communitySlug: "soweto",
    title: "Best places to source fresh produce in Orlando?",
    category: "Marketplace",
    author: "Keletso R.",
    area: "Orlando East",
    replies: 22,
    views: 410,
    lastActive: "3 hours ago",
    excerpt: "Looking for recommendations for affordable and fresh produce vendors nearby.",
    tags: ["vendors", "groceries"],
  },
  {
    id: "t6",
    communitySlug: "tembisa",
    title: "Community market day: vendor applications",
    category: "Vendors",
    author: "Tembisa Forum",
    area: "Tembisa Central",
    replies: 9,
    views: 198,
    lastActive: "Today",
    excerpt: "Local vendors can apply for stalls at the upcoming community market day. Share your products and availability.",
    tags: ["market day", "small business"],
  },
];

export const forumPosts: ForumPost[] = [
  {
    id: "p1",
    threadId: "t1",
    author: "Nomsa D.",
    role: "Organizer",
    time: "Today, 08:10",
    content:
      "Hi everyone! We’re planning a clean-up this Saturday at Daveyton Park. We need about 20 volunteers. If you can join, please comment with your name and preferred time slot (08:00–10:00 or 10:00–12:00).",
  },
  {
    id: "p2",
    threadId: "t1",
    author: "Sipho K.",
    time: "Today, 08:42",
    content: "Count me in for 08:00–10:00. I can also bring extra refuse bags.",
  },
  {
    id: "p3",
    threadId: "t1",
    author: "Lerato M.",
    time: "Today, 09:15",
    content:
      "I’ll join 10:00–12:00. Can we also include the walkway near the taxi rank?",
  },
  {
    id: "p4",
    threadId: "t4",
    author: "Mandla S.",
    role: "Organizer",
    time: "Today, 07:55",
    content:
      "We’re finalizing the schedule for the youth soccer tournament. Vendors and volunteers from Orlando and nearby areas are welcome to join.",
  },
];

export function getCommunityBySlug(slug?: string | null) {
  if (!slug) return communities.find((c) => c.slug === defaultCommunitySlug) ?? communities[0];
  return communities.find((c) => c.slug === slug) ?? communities.find((c) => c.slug === defaultCommunitySlug) ?? communities[0];
}

export function getVendorBySlug(slug: string) {
  return vendors.find((v) => v.slug === slug);
}

export function getProductsByVendor(vendorId: string) {
  return products.filter((p) => p.vendorId === vendorId);
}

export function getReviewsByVendor(vendorId: string) {
  return reviews.filter((r) => r.vendorId === vendorId);
}

export function getThreadById(id: string) {
  return forumThreads.find((t) => t.id === id);
}

export function getPostsByThread(threadId: string) {
  return forumPosts.filter((p) => p.threadId === threadId);
}

export function getVendorsByCommunity(communitySlug: string) {
  return vendors.filter((v) => v.communitySlug === communitySlug);
}

export function getThreadsByCommunity(communitySlug: string) {
  return forumThreads.filter((t) => t.communitySlug === communitySlug);
}

export function getProductsByCommunity(communitySlug: string) {
  const ids = new Set(getVendorsByCommunity(communitySlug).map((v) => v.id));
  return products.filter((p) => ids.has(p.vendorId));
}

export const jobs: Job[] = [
  {
    id: "j1",
    communitySlug: "daveyton",
    title: "Garden clean-up and grass cutting",
    category: "Gardening",
    area: "Daveyton Central",
    pay: "R350",
    type: "Once-off",
    postedBy: "Mpho K.",
    postedAt: "2 hours ago",
    description: "Need help cleaning a yard and cutting grass this Saturday morning. Tools can be provided.",
  },
  {
    id: "j2",
    communitySlug: "daveyton",
    title: "Shop assistant for weekend rush",
    category: "Retail",
    area: "Rampa Section",
    pay: "R180/day",
    type: "Short-term",
    postedBy: "Mama Neo Fresh Produce",
    postedAt: "Today",
    description: "Looking for a reliable assistant for Saturday and Sunday to help with packing and customer service.",
  },
  {
    id: "j3",
    communitySlug: "daveyton",
    title: "After-school homework helper",
    category: "Tutoring",
    area: "Etwatwa West",
    pay: "R120/session",
    type: "Part-time",
    postedBy: "Naledi S.",
    postedAt: "1 day ago",
    description: "Need someone to help a Grade 6 learner with maths and English twice a week.",
  },
  {
    id: "j4",
    communitySlug: "soweto",
    title: "Event setup and packing crew",
    category: "Events",
    area: "Orlando West",
    pay: "R250",
    type: "Once-off",
    postedBy: "Community Events Team",
    postedAt: "3 hours ago",
    description: "Assist with setting up tables/chairs and packing down after a local youth event.",
  },
  {
    id: "j5",
    communitySlug: "soweto",
    title: "Delivery helper (local orders)",
    category: "Delivery",
    area: "Orlando East",
    pay: "R80/delivery run",
    type: "Part-time",
    postedBy: "Orlando Fresh Market",
    postedAt: "Yesterday",
    description: "Help with local deliveries around Orlando on busy afternoons. Must know the area well.",
  },
  {
    id: "j6",
    communitySlug: "tembisa",
    title: "House painting touch-up",
    category: "Maintenance",
    area: "Tembisa Central",
    pay: "R500",
    type: "Once-off",
    postedBy: "Sibusiso M.",
    postedAt: "Today",
    description: "Small painting touch-up job for interior walls. Paint and brushes provided.",
  },
];

export const rentals: Rental[] = [
  {
    id: "re1",
    communitySlug: "daveyton",
    title: "Back room to rent near taxi rank",
    listingType: "Back room",
    area: "Daveyton Central",
    price: "R1,800",
    period: "per month",
    bedrooms: 1,
    bathrooms: 1,
    available: "Available now",
    postedBy: "Private landlord",
    postedAt: "Today",
    amenities: ["Electricity prepaid", "Water included", "Secure yard"],
    description: "Neat back room suitable for a single person or couple. Close to transport and shops.",
  },
  {
    id: "re2",
    communitySlug: "daveyton",
    title: "2-bedroom house for rent",
    listingType: "House",
    area: "Rampa Section",
    price: "R4,500",
    period: "per month",
    bedrooms: 2,
    bathrooms: 1,
    available: "From next month",
    postedBy: "Family home",
    postedAt: "1 day ago",
    amenities: ["Yard space", "Parking", "Pet friendly"],
    description: "Spacious 2-bedroom house with kitchen, lounge, and secure parking. Ideal for a small family.",
  },
  {
    id: "re3",
    communitySlug: "soweto",
    title: "Room to rent in shared house",
    listingType: "Room",
    area: "Orlando East",
    price: "R2,200",
    period: "per month",
    bedrooms: 1,
    bathrooms: 1,
    available: "Available 1st of next month",
    postedBy: "Homeowner",
    postedAt: "2 days ago",
    amenities: ["Wi-Fi ready", "Shared kitchen", "Close to transport"],
    description: "Furnished room in a shared house. Deposit required. Suitable for a working professional or student.",
  },
  {
    id: "re4",
    communitySlug: "soweto",
    title: "2-bedroom flat to let",
    listingType: "Flat",
    area: "Diepkloof",
    price: "R5,200",
    period: "per month",
    bedrooms: 2,
    bathrooms: 1,
    available: "Available now",
    postedBy: "Property agent",
    postedAt: "3 days ago",
    amenities: ["Security gate", "Parking bay", "Prepaid electricity"],
    description: "Well-maintained flat with open-plan living area. Convenient access to shops and public transport.",
  },
  {
    id: "re5",
    communitySlug: "tembisa",
    title: "Affordable room rental",
    listingType: "Room",
    area: "Tembisa Central",
    price: "R1,500",
    period: "per month",
    bedrooms: 1,
    bathrooms: 1,
    available: "Available this weekend",
    postedBy: "Private landlord",
    postedAt: "Today",
    amenities: ["Water included", "Near taxi route"],
    description: "Budget-friendly room in a secure property, ideal for a single tenant.",
  },
];

export function getJobsByCommunity(communitySlug: string) {
  return jobs.filter((j) => j.communitySlug === communitySlug);
}

export function getRentalsByCommunity(communitySlug: string) {
  return rentals.filter((r) => r.communitySlug === communitySlug);
}

export function getCommunityStats(communitySlug: string) {
  const localVendors = getVendorsByCommunity(communitySlug);
  const localProducts = getProductsByCommunity(communitySlug);
  const localThreads = getThreadsByCommunity(communitySlug);
  const localJobs = getJobsByCommunity(communitySlug);
  const localRentals = getRentalsByCommunity(communitySlug);
  return [
    { label: "Local vendors", value: String(localVendors.length) },
    { label: "Open discussions", value: String(localThreads.length) },
    { label: "Odd jobs", value: String(localJobs.length) },
    { label: "Rentals", value: String(localRentals.length) },
  ];
}