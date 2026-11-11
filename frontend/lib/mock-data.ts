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

export type MeetPost = {
  id: string;
  communitySlug: string;
  author: string;
  area: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
};

export type CommunityEvent = {
  id: string;
  communitySlug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  area: string;
  host: string;
  category: string;
  description: string;
  attendees: number;
};

export type CommunityGroup = {
  id: string;
  communitySlug: string;
  name: string;
  category: string;
  description: string;
  members: number;
  posts: number;
  lastActive: string;
  area: string;
  tags: string[];
  coverTone: "mint" | "teal" | "violet" | "navy";
};

export type GroupPost = {
  id: string;
  groupId: string;
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
      "Independent clothing brand offering ready-to-wear items and custom prints for schools, teams, and events. New drops announced weekly in the community groups.",
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

export const meetPosts: MeetPost[] = [
  {
    id: "m1",
    communitySlug: "daveyton",
    author: "Nomsa D.",
    area: "Daveyton Central",
    time: "20 min ago",
    content:
      "Morning neighbors! Anyone up for a casual walk at Daveyton Park later this afternoon? Would be great to meet a few new people from the area.",
    tags: ["casual", "outdoors"],
    likes: 12,
    comments: 5,
  },
  {
    id: "m2",
    communitySlug: "daveyton",
    author: "Sipho K.",
    area: "Rampa Section",
    time: "1 hour ago",
    content:
      "I’m new to the area and looking to connect with local creatives and small business owners. Feel free to say hi or send an invite!",
    tags: ["connect", "small-business"],
    likes: 18,
    comments: 7,
  },
  {
    id: "m3",
    communitySlug: "daveyton",
    author: "Lerato M.",
    area: "Etwatwa West",
    time: "Today, 08:15",
    content:
      "Anyone interested in starting a weekend jogging group around Etwatwa? Beginners welcome. Drop a comment and I’ll send invites.",
    tags: ["fitness", "meetup"],
    likes: 9,
    comments: 4,
  },
  {
    id: "m4",
    communitySlug: "soweto",
    author: "Mandla S.",
    area: "Orlando West",
    time: "35 min ago",
    content:
      "Looking to connect with other parents around Orlando West for after-school activities and play dates. Let’s link up!",
    tags: ["parents", "connect"],
    likes: 14,
    comments: 6,
  },
  {
    id: "m5",
    communitySlug: "soweto",
    author: "Keletso R.",
    area: "Orlando East",
    time: "2 hours ago",
    content:
      "Coffee meetup this Saturday morning near Vilakazi Street? Casual vibes, everyone welcome. Send me an invite if you’re keen.",
    tags: ["meetup", "weekend"],
    likes: 21,
    comments: 11,
  },
  {
    id: "m6",
    communitySlug: "tembisa",
    author: "Sindi L.",
    area: "Tembisa Central",
    time: "Today, 09:40",
    content:
      "Hi Tembisa! I’m looking to meet other local vendors so we can support each other and share tips. Happy to connect.",
    tags: ["vendors", "networking"],
    likes: 7,
    comments: 3,
  },
];

export const communityEvents: CommunityEvent[] = [
  {
    id: "e1",
    communitySlug: "daveyton",
    title: "Weekend Community Clean-up",
    date: "Sat, 18 Apr 2026",
    time: "08:00 - 12:00",
    location: "Daveyton Park, Main Gate",
    area: "Daveyton Central",
    host: "Daveyton Community Forum",
    category: "Community",
    description:
      "Join neighbors to help clean and refresh the park. Gloves and refuse bags will be provided. All ages welcome.",
    attendees: 34,
  },
  {
    id: "e2",
    communitySlug: "daveyton",
    title: "Local Business Pop-up Market",
    date: "Sun, 26 Apr 2026",
    time: "10:00 - 15:00",
    location: "Daveyton Mall Open Area",
    area: "Daveyton Mall Area",
    host: "Plus27 Local Vendors",
    category: "Market",
    description:
      "Discover local food, fashion, crafts, and services from vendors in your area. Family-friendly with music and stalls.",
    attendees: 58,
  },
  {
    id: "e3",
    communitySlug: "daveyton",
    title: "Youth Skills & Career Day",
    date: "Fri, 8 May 2026",
    time: "09:00 - 14:00",
    location: "Etwatwa Community Hall",
    area: "Etwatwa West",
    host: "Youth Connect Daveyton",
    category: "Youth",
    description:
      "Workshops, career guidance, and local opportunities for young people. Meet mentors and learn about skills programs nearby.",
    attendees: 46,
  },
  {
    id: "e4",
    communitySlug: "soweto",
    title: "Soweto Youth Soccer Tournament",
    date: "Sat, 2 May 2026",
    time: "09:00 - 17:00",
    location: "Orlando Stadium Grounds",
    area: "Orlando West",
    host: "Soweto Sports Collective",
    category: "Sports",
    description:
      "A local youth soccer tournament with community teams, food vendors, and volunteer opportunities.",
    attendees: 120,
  },
  {
    id: "e5",
    communitySlug: "soweto",
    title: "Sunday Morning Coffee Meetup",
    date: "Sun, 19 Apr 2026",
    time: "09:30 - 11:30",
    location: "Vilakazi Street Café Corner",
    area: "Orlando East",
    host: "Soweto Connect",
    category: "Meetup",
    description:
      "A relaxed meetup for neighbors to connect, chat, and share local recommendations over coffee.",
    attendees: 22,
  },
  {
    id: "e6",
    communitySlug: "tembisa",
    title: "Tembisa Community Market Day",
    date: "Sat, 25 Apr 2026",
    time: "08:30 - 14:00",
    location: "Tembisa Central Plaza",
    area: "Tembisa Central",
    host: "Tembisa Vendor Network",
    category: "Market",
    description:
      "Support local businesses at the monthly community market. Vendors, food stalls, and family activities.",
    attendees: 41,
  },
];

export const communityGroups: CommunityGroup[] = [
  {
    id: "g1",
    communitySlug: "daveyton",
    name: "Daveyton Community Forum",
    category: "General",
    description:
      "A group for local updates, questions, recommendations, and everyday conversations in Daveyton.",
    members: 842,
    posts: 156,
    lastActive: "35 min ago",
    area: "Daveyton",
    tags: ["community", "updates", "local"],
    coverTone: "mint",
  },
  {
    id: "g2",
    communitySlug: "daveyton",
    name: "Daveyton Vendors & Buyers",
    category: "Marketplace",
    description:
      "Connect with local vendors, share products and services, and find trusted recommendations from neighbors.",
    members: 516,
    posts: 98,
    lastActive: "1 hour ago",
    area: "Daveyton",
    tags: ["vendors", "marketplace", "recommendations"],
    coverTone: "teal",
  },
  {
    id: "g3",
    communitySlug: "daveyton",
    name: "Etwatwa Parents Network",
    category: "Family",
    description:
      "A support group for parents and guardians to share school info, activities, and local family resources.",
    members: 274,
    posts: 63,
    lastActive: "Today",
    area: "Etwatwa West",
    tags: ["parents", "schools", "family"],
    coverTone: "violet",
  },
  {
    id: "g4",
    communitySlug: "soweto",
    name: "Orlando Connect",
    category: "General",
    description:
      "Neighborhood group for Orlando residents to discuss local news, events, and community matters.",
    members: 690,
    posts: 121,
    lastActive: "50 min ago",
    area: "Orlando",
    tags: ["community", "events", "local"],
    coverTone: "navy",
  },
  {
    id: "g5",
    communitySlug: "soweto",
    name: "Soweto Small Business Circle",
    category: "Business",
    description:
      "A forum for entrepreneurs and local businesses to network, collaborate, and share opportunities.",
    members: 338,
    posts: 74,
    lastActive: "3 hours ago",
    area: "Soweto",
    tags: ["business", "networking", "vendors"],
    coverTone: "teal",
  },
  {
    id: "g6",
    communitySlug: "tembisa",
    name: "Tembisa Local Forum",
    category: "General",
    description:
      "Community group for Tembisa residents to share information, ask questions, and stay connected.",
    members: 421,
    posts: 88,
    lastActive: "Today",
    area: "Tembisa",
    tags: ["community", "local", "support"],
    coverTone: "mint",
  },
];

export const groupPosts: GroupPost[] = [
  {
    id: "gp1",
    groupId: "g1",
    author: "Nomsa D.",
    role: "Organizer",
    time: "Today, 08:10",
    content:
      "Hi everyone! We’re planning a clean-up this Saturday at Daveyton Park. We need about 20 volunteers. If you can join, please comment with your name and preferred time slot (08:00–10:00 or 10:00–12:00).",
  },
  {
    id: "gp2",
    groupId: "g1",
    author: "Sipho K.",
    time: "Today, 08:42",
    content: "Count me in for 08:00–10:00. I can also bring extra refuse bags.",
  },
  {
    id: "gp3",
    groupId: "g1",
    author: "Lerato M.",
    time: "Today, 09:15",
    content:
      "I’ll join 10:00–12:00. Can we also include the walkway near the taxi rank?",
  },
  {
    id: "gp4",
    groupId: "g2",
    author: "Peter M.",
    time: "2 hours ago",
    content:
      "Looking for recommendations for affordable school uniform suppliers in Daveyton. Any trusted vendors people can suggest?",
  },
  {
    id: "gp5",
    groupId: "g4",
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

export function getGroupById(id: string) {
  return communityGroups.find((g) => g.id === id);
}

export function getPostsByGroup(groupId: string) {
  return groupPosts.filter((p) => p.groupId === groupId);
}

export function getVendorsByCommunity(communitySlug: string) {
  return vendors.filter((v) => v.communitySlug === communitySlug);
}

export function getGroupsByCommunity(communitySlug: string) {
  return communityGroups.filter((g) => g.communitySlug === communitySlug);
}

export function getMeetPostsByCommunity(communitySlug: string) {
  return meetPosts.filter((p) => p.communitySlug === communitySlug);
}

export function getEventsByCommunity(communitySlug: string) {
  return communityEvents.filter((e) => e.communitySlug === communitySlug);
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
  const localGroups = getGroupsByCommunity(communitySlug);
  const localEvents = getEventsByCommunity(communitySlug);
  const localJobs = getJobsByCommunity(communitySlug);
  const localRentals = getRentalsByCommunity(communitySlug);
  return [
    { label: "Local vendors", value: String(localVendors.length) },
    { label: "Community groups", value: String(localGroups.length) },
    { label: "Events", value: String(localEvents.length) },
    { label: "Odd jobs", value: String(localJobs.length) },
    { label: "Rentals", value: String(localRentals.length) },
  ];
}