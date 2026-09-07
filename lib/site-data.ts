export const COMPANY = {
  name: 'Live Furniture',
  tagline: 'Furnishing Your Lives',
  phone: '+91 70251 00050',
  phoneHref: '+917025100050',
  phones: [
    { label: 'Mobile / Inquiries', number: '+91 70251 00050', href: 'tel:+917025100050' },
    { label: 'Mobile / Support', number: '+91 81291 95438', href: 'tel:+918129195438' },
    { label: 'Landline / Office', number: '0491 2957799', href: 'tel:04912957799' },
  ],
  whatsapp: '918137841836',
  whatsappFormatted: '+91 8137 841 836',
  email: 'livefurniturepkd@gmail.com',
  address: 'New Industrial Development Area, Kanjikode, Palakkad, Kerala',
  workingHours: 'Mon – Sat, 8:00 AM – 7:00 PM',
  mapQuery: 'LIVE Furniture, Kanjikode, Palakkad, Kerala, India',
  mapUrl: 'https://maps.app.goo.gl/aejFzbR6E5DPVVpH9',
}

export type SocialLink = {
  id: 'instagram' | 'threads' | 'youtube' | 'facebook' | 'linkedin' | 'gmail'
  name: string
  href: string
  handle: string
  description: string
  color: string
  hoverBg: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/furniture.live?igsi=MWg4dWtnZDg5ejFtYQ==',
    handle: '@furniture.live',
    description: 'Factory reels, new collections & finished furniture showcases',
    color: '#E4405F',
    hoverBg: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white',
  },
  {
    id: 'threads',
    name: 'Threads',
    href: 'https://www.threads.com/@furniture.live',
    handle: '@furniture.live',
    description: 'Woodworking insights, behind-the-scenes & live updates',
    color: '#000000',
    hoverBg: 'hover:bg-foreground hover:border-foreground hover:text-background',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    href: 'https://www.youtube.com/@livefurniturekanjikode',
    handle: '@livefurniturekanjikode',
    description: 'Factory walkthroughs, CNC automation & joinery masterclasses',
    color: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    href: 'https://m.facebook.com/search_results/?q=live+furniture',
    handle: 'Live Furniture',
    description: 'Community reviews, product announcements & company milestones',
    color: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rajarajan-krishnamoorthy-live-furniture-142376269/',
    handle: 'Rajarajan Krishnamoorthy',
    description: 'B2B partnerships, institutional procurement & executive network',
    color: '#0A66C2',
    hoverBg: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    href: 'mailto:livefurniturepkd@gmail.com',
    handle: 'livefurniturepkd@gmail.com',
    description: 'Direct procurement quotes, dealership inquiries & bulk orders',
    color: '#EA4335',
    hoverBg: 'hover:bg-[#EA4335] hover:border-[#EA4335] hover:text-white',
  },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const HERO_SLIDES = [
  {
    image: '/live/hero_solid_wood.png',
    kicker: 'Solid Wood Craftsmanship',
    title: 'Furniture built to last a lifetime',
    description:
      'Heavy-duty, load-bearing solid wood pieces engineered with precision joinery and master crafting.',
  },
  {
    image: '/live/hero_living_room.png',
    kicker: 'Precision Engineered Panels',
    title: 'Where automation meets artistry',
    description:
      'Seamless LCD wall units, ergonomic seating and modern living systems for premium spaces.',
  },
  {
    image: '/live/hero_dining_room.png',
    kicker: 'Dining Room Excellence',
    title: 'Crafted solid teak dining ensembles',
    description:
      'Reinforced joinery, scratch-resistant finishes, and seating built for generation-spanning durability.',
  },
  {
    image: '/live/hero_wall_unit.png',
    kicker: 'Architectural Wall Systems',
    title: 'Concealed wiring & floating shelves',
    description:
      'Modern entertainment centers designed for luxury residential and hospitality projects.',
  },
  {
    image: '/live/hero_cnc_facility.png',
    kicker: 'Industrial Scale B2B Partner',
    title: 'State-of-the-art CNC machining lines',
    description:
      'Uncompromised bulk supply reliability engineered for premium showrooms, corporate networks, and institutional procurement.',
  },
  {
    image: '/factoryImages/img4.png',
    kicker: 'Bunkers & Storage Cots',
    title: 'Maximized space with total structural strength',
    description:
      'Heavy-duty solid wood bunker beds and storage cots built to exceed BIS standards.',
  },
  {
    image: '/cat-accent.png',
    kicker: 'Home Accents & Pooja Mandir',
    title: 'Sacred craftsmanship and elegant dividers',
    description:
      'Intricately carved prayer units, space partitions, and utility storage pieces.',
  },
  {
    image: '/factoryImages/img2.png',
    kicker: 'Raw Wood Frames & Sub-Assemblies',
    title: 'Precision-cut raw timber for workshops & dealers',
    description:
      'Seasoned solid wood frames produced to strict tolerances for B2B assembly.',
  },
]

export const HIGHLIGHTS = [
  {
    title: 'CNC Manufacturing',
    description: 'State-of-the-art CNC machining lines for flawless, repeatable precision at scale.',
    icon: 'Cpu',
  },
  {
    title: 'Premium Solid Wood',
    description: 'Carefully sourced timber and high-density panels built for real-world durability.',
    icon: 'TreePine',
  },
  {
    title: 'Precision Engineering',
    description: 'Computerized layout modeling ensures structural integrity in every joint.',
    icon: 'Ruler',
  },
  {
    title: 'Advanced Machinery',
    description: 'Heavy surface thickness cutters and industrial-grade hardware integration.',
    icon: 'Cog',
  },
  {
    title: 'Quality Finishing',
    description: 'Positive-pressure, clean-air finishing bays for a dust-free, flawless coat.',
    icon: 'Sparkles',
  },
  {
    title: 'Bulk Manufacturing',
    description: 'Reliable bulk supply with uncompromised design consistency for B2B partners.',
    icon: 'Boxes',
  },
]

export const STORY_OVERVIEW = {
  tagline: 'Engineering Precision. Scaling Boundaries. Crafting Trust.',
  description:
    'At Live Furniture, our journey is driven by a simple promise: to bridge industrial woodworking precision with uncompromising quality. What began as a local manufacturing venture in 2014 has evolved into a multi-state industrial enterprise, empowering B2B dealers, architects, and commercial partners across South and Central India.',
  edge:
    "From raw timber seasoning to final dispatch, Live Furniture continues to define reliability, precision joinery, and long-term business partnerships. We don't just supply furniture—we engineer the backbone of modern living spaces.",
}

export const STORY_MILESTONES = [
  {
    period: '2014 – 2020',
    title: 'The Foundation in Malappuram',
    emoji: '🪵',
    location: 'Chappanangadi, Malappuram District, Kerala',
    description:
      'Our story began in 2014 in Chappanangadi, Malappuram District, Kerala. Operating from a leased facility, we laid our foundation by delivering engineered wooden furniture to the Kerala market and adjacent border districts of Tamil Nadu. Through continuous process optimization, expanded product lines, and an unyielding commitment to build quality, we grew our market presence steadily over six years.',
  },
  {
    period: '2020',
    title: 'Industrial Expansion at Kanjikode, Palakkad',
    emoji: '🏭',
    location: 'New Industrial Development Area, Kanjikode, Palakkad',
    description:
      'Recognizing the need for higher production capacity and advanced technology, March 2020 marked a major milestone. We transitioned from leased premises to our own state-of-the-art manufacturing facility in the New Industrial Development Area, Kanjikode, Palakkad.',
    highlights: [
      {
        title: 'In-House Wood Seasoning Plant',
        detail: 'Controlling core timber moisture levels (8%–10%) for superior stability.',
      },
      {
        title: 'Positive-Pressure Paint Booths',
        detail: 'Delivering dust-free, high-gloss NC sealer and PU finishes.',
      },
      {
        title: 'Advanced CNC & Precision Joinery',
        detail: 'Ensuring tight manufacturing tolerances (±0.2 mm) across all panel products.',
      },
    ],
    reach:
      'This upgrade propelled our distribution network across all of Tamil Nadu, Andhra Pradesh, Puducherry, and major commercial hubs in Karnataka.',
  },
  {
    period: '2025',
    title: 'Government Recognition & ZED Quality Benchmark',
    emoji: '🏅',
    location: 'State & National Level Certifications',
    description:
      'Our commitment to industrial standards gained national and state-level recognition in 2025:',
    achievements: [
      {
        title: 'Kerala State "Missing 1000" Selection',
        detail:
          'Recognizing our rapid growth and operational excellence, the Government of Kerala selected Live Furniture under its prestigious Missing 1000 Scheme to support our further expansion.',
      },
      {
        title: 'MSME ZED Quality Certification',
        detail:
          'Demonstrating zero-defect manufacturing and sustainable practices, we successfully achieved ZED Bronze Certification and have completed all core milestones awaiting official ZED Silver Certification.',
      },
    ],
  },
  {
    period: '2026 & Beyond',
    title: 'The Siddipet Megaproject',
    emoji: '🚀',
    location: 'Plots 73 & 74, Siddipet MSME Park, Telangana',
    description:
      'To seamlessly serve our rapidly growing dealer network across Karnataka, Telangana, Andhra Pradesh, and Maharashtra, we are expanding our industrial footprint beyond Kerala.',
    detail:
      'Construction is underway for our second mega-manufacturing plant spread across Plots 73 & 74 at the Siddipet MSME Park, Telangana. Engineered for high-volume automated production, this facility is slated to begin commercial dispatches by March 2027.',
    status: 'Slated for commercial dispatches by March 2027',
  },
]

export const WHY_CHOOSE = [
  {
    title: 'Manufacturing Quality',
    description: 'Zero-defect principles embedded into every millimeter of our workflow.',
  },
  {
    title: 'Advanced Technology',
    description: 'CNC lines, computerized layout modeling and dust-free coating methodologies.',
  },
  {
    title: 'Skilled Craftsmanship',
    description: 'Award-winning competitive craftsmanship and advanced joinery expertise.',
  },
  {
    title: 'Durable Products',
    description: 'Heavy-duty pieces that excel in load-bearing capacity and environmental stability.',
  },
  {
    title: 'Reliable B2B Manufacturing',
    description: 'Bulk supply reliability and optimal cost efficiencies for institutional clients.',
  },
  {
    title: 'BIS Compliance',
    description: 'Strict adherence to Bureau of Indian Standards protocols across our operations.',
  },
]

export const FEATURED_CATEGORIES = [
  { name: 'Solid Wood Cots', image: '/live/hero_solid_wood.png', href: '/products?category=Bedroom' },
  { name: 'Sofa Seating', image: '/live/hero_living_room.png', href: '/products?category=Living+Room' },
  { name: 'Dining Sets', image: '/live/hero_dining_room.png', href: '/products?category=Dining+Room' },
  { name: 'LCD Wall Units', image: '/live/hero_wall_unit.png', href: '/products?category=Living+Room' },
]

import type { Product } from '@/services/products'
export type { Product }


export const GALLERY_CATEGORIES = [
  'All',
  'Manufacturing Facility',
  'Factory Images',
  'Machinery',
  'Furniture Collections',
  'Project Installations',
]

export type GalleryItem = {
  image: string
  name: string
  category: string
  material: string
  dimensions: string
  description: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ==========================================
  // 1. Manufacturing Facility (Includes img0, img1, img2, img6, img7, img9)
  // ==========================================
  {
    image: '/factoryImages/img0.webp',
    name: 'Live Furniture Industrial Complex & Main Plant',
    category: 'Factory Images',
    material: 'Industrial Infrastructure & Corporate Facility',
    dimensions: 'MSME Park, Telangana / Kanjikode, Palakkad',
    description: 'Main industrial manufacturing plant entrance and multi-acre production facility engineered for precision automated woodworking and multi-state B2B dispatches.',
  },
  {
    image: '/factoryImages/img1.webp',
    name: 'In-House Wood Chemical Treatment & Resin Plant',
    category: 'Manufacturing Facility',
    material: 'Stainless Steel Chemical Tanks & Automated Piping',
    dimensions: 'Automated Chemical Bay Unit 1',
    description: 'In-house automated chemical treatment reactors and resin preparation tanks ensuring complete anti-termite, anti-borer protection and fiber stabilization.',
  },
  {
    image: '/factoryImages/img2.webp',
    name: 'Industrial Timber Kiln Seasoning Chambers',
    category: 'Manufacturing Facility',
    material: 'Kiln-Dried Solid Timber & Computerized Kilns',
    dimensions: 'Moisture Control Line (8%–10%)',
    description: 'Industrial wood seasoning kilns maintaining strict core moisture equilibrium to eliminate warping, shrinking, and seasonal timber movement.',
  },
  {
    image: '/factoryImages/img6.webp',
    name: 'Enclosed Positive-Pressure Paint & Curing Booth',
    category: 'Manufacturing Facility',
    material: 'Positive-Pressure Air Filtration Unit',
    dimensions: 'Clean-Air Coating Station',
    description: 'Enclosed industrial spray booth ensuring micro-filtered, dust-free surface sealing, high-gloss PU finishes, and zero particle contamination on panels.',
  },
  {
    image: '/factoryImages/img7.webp',
    name: 'Climate-Controlled Lacquer Curing & Drying Chamber',
    category: 'Manufacturing Facility',
    material: 'Multi-Tier Mobile Drying Racks',
    dimensions: 'Temperature-Regulated Curing Zone',
    description: 'Dedicated temperature-regulated drying room with multi-tier mobile rack systems for uniform sealer and lacquer hardening.',
  },
  {
    image: '/factoryImages/img9.webp',
    name: 'Heavy Palletization & Container Dispatch Logistics',
    category: 'Manufacturing Facility',
    material: 'Industrial Stretch Wrap & Container Fleet',
    dimensions: 'Heavy Logistics Dock & Loading Bay',
    description: 'Automated stretch palletization and dedicated multi-axle container fleet loading ensuring zero-transit-damage delivery across South and Central India.',
  },
  {
    image: '/live/hero_cnc_facility.png',
    name: 'Automated Multi-Axis CNC Machining Line',
    category: 'Manufacturing Facility',
    material: 'CNC Automated Assembly Line',
    dimensions: 'Precision Machining Floor',
    description: 'High-capacity production hall equipped with multi-axis CNC machines and computerized layout modeling for repeatable bulk accuracy.',
  },
  {
    image: '/manufacturing.png',
    name: 'Primary Timber Sizing & Preparation Floor',
    category: 'Manufacturing Facility',
    material: 'Heavy Thickness Cutters & Rip Saws',
    dimensions: 'Raw Timber Milling Floor',
    description: 'Heavy-duty timber dimensioning and surface thicknessing floor preparing raw hardwood logs into calibrated furniture stock.',
  },

  // ==========================================
  // 2. Factory Images (Includes img3, img4, img5, img8)
  // ==========================================
  {
    image: '/factoryImages/img3.webp',
    name: 'Precision Sliding Table Panel Sizing & Cutting',
    category: 'Factory Images',
    material: 'Industrial Sliding Saws & Extraction Ducts',
    dimensions: 'Precision Sizing Station',
    description: 'Trained technicians operating sliding table saws with central dust extraction for sub-millimeter timber and panel cutting accuracy.',
  },
  {
    image: '/factoryImages/img4.webp',
    name: 'Solid Wood Cabinetry & Modular Box Assembly',
    category: 'Factory Images',
    material: 'Seasoned Solid Hardwood & Pneumatic Fastening',
    dimensions: 'Assembly Station Bay 2',
    description: 'Skilled craftsmen assembling heavy-duty solid wood storage boxes and modular cabinetry with reinforced mechanical joinery.',
  },
  {
    image: '/factoryImages/img5.webp',
    name: 'Positive-Pressure PU Sealer Spray Bay',
    category: 'Factory Images',
    material: 'Dust-Free Polyurethane / NC Lacquer',
    dimensions: 'Enclosed Clean-Air Bay',
    description: 'Specialist craftsman applying precision PU sealant coats in a micro-filtered clean-air environment for an ultra-smooth finish.',
  },
  {
    image: '/factoryImages/img8.webp',
    name: 'Multi-Point Quality Assurance & Surface Inspection',
    category: 'Factory Images',
    material: 'Solid Wood Sideboards & Dressers',
    dimensions: 'Quality Assurance Station',
    description: 'Meticulous white-glove quality assurance checking joint strength, smooth edges, grain alignment, and finish uniformity prior to packing.',
  },

  // ==========================================
  // 3. Machinery
  // ==========================================
  {
    image: '/factoryImages/img3.webp',
    name: 'Heavy-Duty Industrial Sliding Table Panel Saw',
    category: 'Machinery',
    material: 'Tungsten Carbide Tipped Sizing Blades',
    dimensions: 'Machinery Station 3',
    description: 'Industrial sliding panel saws engineered for chip-free, ultra-clean rip and cross cuts across solid wood and dense composite panels.',
  },
  {
    image: '/live/hero_cnc_facility.png',
    name: 'Multi-Axis Automated CNC Panel Router',
    category: 'Machinery',
    material: 'Computerized Cutting Head',
    dimensions: 'Precision Line 1',
    description: 'High-speed automated CNC routing for intricate cabinet panels, groove cuts, and wire channel conduits.',
  },
  {
    image: '/factoryImages/img2.webp',
    name: 'Kiln-Seasoned Bulk Timber Conditioning Chambers',
    category: 'Machinery',
    material: 'Automated Heat & Humidity Regulators',
    dimensions: 'Kiln Line 2',
    description: 'Computerized timber conditioning chambers ensuring tight moisture tolerances across thousands of cubic feet of timber.',
  },

  // ==========================================
  // 4. Furniture Collections (Finished Products & Sets)
  // ==========================================
  // --- Wardrobes & Almirahs ---
  {
    image: '/FinishedProducts/Almirah1.png',
    name: 'Fluted Quad-Door Contemporary Wardrobe with Dressing Mirror',
    category: 'Furniture Collections',
    material: 'Moisture-Resistant Calibrated Plywood & Matte Slate Laminate',
    dimensions: '72" W x 24" D x 84" H',
    description:
      'Modern 4-door wardrobe featuring vertical fluted paneling, full-length center dressing mirror with valet hanging rod, sleek gold handles, and optimized multi-compartment interior storage.',
  },
  {
    image: '/FinishedProducts/Almirah2.png',
    name: 'Dual-Tone Teak & Walnut Wardrobe with Built-In Vanity Niche',
    category: 'Furniture Collections',
    material: 'BWR Grade Plywood with Natural Teak Veneer & PU Polish',
    dimensions: '78" W x 24" D x 84" H',
    description:
      'Architectural wardrobe ensemble with contrasting dark walnut and golden teak finishes, illuminated vanity dressing niche, soft-close organizer drawers, and full-height loft cabinets.',
  },
  {
    image: '/FinishedProducts/Amirah3.png',
    name: 'Heritage Carved Solid Teak Wardrobe & Armoire',
    category: 'Furniture Collections',
    material: '100% Solid Plantation Teak Wood & Antique Brass Hardware',
    dimensions: '48" W x 22" D x 78" H',
    description:
      'Traditional solid teak almirah with hand-carved floral crown arch, fluted corner pilasters, twin panel doors, deep lower storage drawers, and traditional brass key locks.',
  },

  // --- Beds & Bedroom Furniture ---
  {
    image: '/FinishedProducts/Bed1.png',
    name: 'Modern Channel-Tufted Velvet King Platform Bed',
    category: 'Furniture Collections',
    material: 'Kiln-Dried Hardwood Frame, High-Density Foam & Premium Cream Velvet',
    dimensions: '76" W x 86" L x 54" H (King Size)',
    description:
      'Contemporary low-profile king bed featuring vertical channel-tufted upholstered headboard, padded surround rails, and solid wood foundation engineered for zero squeak.',
  },
  {
    image: '/FinishedProducts/Bed2.png',
    name: 'Multifunctional Graphite Bed with Headboard Niches & Storage Drawers',
    category: 'Furniture Collections',
    material: 'High-Density Engineered Wood & Textured Graphite Melamine',
    dimensions: '74" W x 88" L x 50" H (Queen/King Size)',
    description:
      'Contemporary storage bed equipped with an integrated headboard display shelf, decorative lattice inserts, ambient reading ledges, and dual underbed pull-out organizer drawers.',
  },
  {
    image: '/FinishedProducts/Bed3.png',
    name: 'Luxury Architectural Bed Suite with Fluted Acoustic Wall & Floating Nightstands',
    category: 'Furniture Collections',
    material: 'Solid Timber Sub-Frame, Fluted Acoustic Panels & Woven Fabric',
    dimensions: '108" W x 86" L x 60" H (Extended Suite)',
    description:
      'Master bedroom showcase bed featuring full-width vertical fluted charcoal wall cladding, diamond-quilted upholstered backrest, dual floating nightstands, and concealed base LED illumination.',
  },
  {
    image: '/FinishedProducts/Bed4.png',
    name: 'Teak Wood Arched Storage Bed with Hydraulic Lift Mechanism',
    category: 'Furniture Collections',
    material: 'Solid Teak Frame, BWR Plywood Box & German Hydraulic Pistons',
    dimensions: '76" W x 86" L x 52" H (King Size)',
    description:
      'Ergonomic teak bed frame with arched padded headboard cushion, overhead display cubbies, and smooth heavy-duty gas-lift hydraulic storage underneath.',
  },
  {
    image: '/FinishedProducts/Bed5.png',
    name: 'Classic Handcrafted Solid Teak Sleigh Bed with Turned Finials',
    category: 'Furniture Collections',
    material: '100% Solid Seasoned Teak Wood with High-Gloss Lacquer',
    dimensions: '76" W x 90" L x 58" H (King Size)',
    description:
      'Time-honored royal sleigh bed featuring intricately carved crown molding, decorative turned corner posts with acorn finials, and reinforced solid timber platform support.',
  },

  // --- Chests, Drawers & Study Desks ---
  {
    image: '/FinishedProducts/Drawer1.png',
    name: 'Scandinavian 6-Drawer Matte White Tallboy Dresser',
    category: 'Furniture Collections',
    material: 'High-Density HDF with Matte White PU Lacquer & Brushed Nickel Knobs',
    dimensions: '32" W x 18" D x 48" H',
    description:
      'Minimalist vertical chest of drawers featuring 6 smooth soft-closing drawers on telescopic ball-bearing slides, clean flush edges, and satin nickel circular pulls.',
  },
  {
    image: '/FinishedProducts/Drawer2.png',
    name: 'Walnut Sideboard Credenza with Laser-Cut Lattice Accent Doors',
    category: 'Furniture Collections',
    material: 'Solid American Walnut, Engineered Core & Brushed Chrome Handles',
    dimensions: '54" W x 18" D x 36" H',
    description:
      'Contemporary low credenza sideboard featuring 3 central organizer drawers flanked by two side storage cabinets with organic laser-cut geometric jali ventilation doors.',
  },
  {
    image: '/FinishedProducts/Drawer3.png',
    name: 'Heritage 5-Drawer Solid Natural Cherry Wood Chest',
    category: 'Furniture Collections',
    material: 'Solid American Cherry Hardwood with Satin Clear Polyurethane',
    dimensions: '36" W x 20" D x 52" H',
    description:
      'Classic American craftsman-style tall dresser showcasing continuous grain wood matching, dovetail drawer joinery, dual metal knob pulls per drawer, and sturdy block feet.',
  },
  {
    image: '/FinishedProducts/Drawer4.png',
    name: 'Executive Double-Pedestal Teak Study & Workstation Desk',
    category: 'Furniture Collections',
    material: 'Calibrated Plywood with Natural Teak Veneer & Central Locking Hardware',
    dimensions: '60" W x 30" D x 30" H',
    description:
      'Ergonomic office workstation featuring rounded bullnose desktop edging, 4 individual key-lockable utility drawers, storage cabinet, and central kneehole CPU/footrest shelf.',
  },

  // --- Display Shelves & Crockery Cabinets ---
  {
    image: '/FinishedProducts/Shelf1.png',
    name: 'Cathedral 3-Door Solid Wood Crockery & Curio Showcase',
    category: 'Furniture Collections',
    material: 'Solid Mahogany Wood, 6mm Toughened Glass & Brass Accents',
    dimensions: '66" W x 18" D x 84" H',
    description:
      'Grand traditional curio cabinet with gothic arched glazed mullion doors, 4 tiers of heavy-load glass display shelves, 3 base cutlery drawers, and rich crown molding.',
  },
  {
    image: '/FinishedProducts/Shelf2.png',
    name: 'Nordic Dining Hutch & Crockery Unit with Counter Niche',
    category: 'Furniture Collections',
    material: 'Solid Teak Wood, BWR Plywood Core & Matte Black Hardware',
    dimensions: '48" W x 20" D x 78" H',
    description:
      'Modern kitchen/dining hutch with glass display upper cabinets, intermediate appliance/serving buffet counter, 3 central flatware drawers, and spacious base cabinetry.',
  },
  {
    image: '/FinishedProducts/Shelf3.png',
    name: 'Contemporary Espresso Buffet Bar & Glassware Showcase',
    category: 'Furniture Collections',
    material: 'Engineered Hardwood with Dark Espresso Finish & Frosted Fluted Glass',
    dimensions: '72" W x 18" D x 54" H',
    description:
      'Modern dining room bar cabinet with twin framed display glass doors, central open decanter display shelving, lower bar storage, and brushed metal bar handles.',
  },

  // --- TV Wall Units & Entertainment Centers ---
  {
    image: '/FinishedProducts/TvWallUnit1.png',
    name: 'Classic Ivory Entertainment Console with Wainscoting Backboard',
    category: 'Furniture Collections',
    material: 'Solid Hardwood Frame & Moisture-Resistant HDF with Ivory PU Enamel',
    dimensions: 'Console: 60" W x 18" D x 30" H | Panel: 108" W x 96" H',
    description:
      'Refined cottage-style media console with arched media component bay, cable management ports, side cabinets, center drawer, framed against geometric wainscoting accent paneling.',
  },
  {
    image: '/FinishedProducts/TvWallUnit2.png',
    name: 'Minimalist Espresso & Gloss White Lowline TV Unit',
    category: 'Furniture Collections',
    material: 'High-Density Particle Board with Dark Espresso & High-Gloss White Acrylic',
    dimensions: '70" W x 16" D x 20" H',
    description:
      'Sleek two-tone low-profile media credenza featuring an upper open soundbar/console deck and dual deep lockable storage drawers with chrome pulls.',
  },
  {
    image: '/FinishedProducts/TvWallUnit3.png',
    name: 'Architectural Fluted TV Wall Paneling with Illuminated Floating Shelves',
    category: 'Furniture Collections',
    material: 'Natural Teak Veneer, Acoustic Charcoal Slats & Tempered Tinted Glass',
    dimensions: '84" W x 18" D x 78" H',
    description:
      'Modern entertainment wall panel system with vertical fluted charcoal acoustic slats, floating display ledges with integrated warm spotlights, and a 4-bay lower credenza.',
  },
  {
    image: '/FinishedProducts/TvWalUnit4.png',
    name: 'Grand Full-Wall Entertainment Center with Illuminated Curio Glass Towers',
    category: 'Furniture Collections',
    material: 'Engineered Board in Charcoal & Warm Ochre with Profile Warm LED Strips',
    dimensions: '120" W x 18" D x 84" H',
    description:
      'Luxury wall-to-wall entertainment suite flanked by illuminated glass display vitrines, fluted timber TV backboard, perimeter indirect LED glow, and modular base storage cabinets.',
  },
  {
    image: '/FinishedProducts/TvWallUnit5.png',
    name: 'Double-Sided Room Divider Bookcase & TV Media Wall Unit',
    category: 'Furniture Collections',
    material: 'Solid Core Plywood with Dark Walnut Veneer & Terracotta Accents',
    dimensions: '90" W x 18" D x 96" H',
    description:
      'Floor-to-ceiling multifunctional open-concept partition wall unit featuring central recessed TV mount surround, multi-tier cubby display shelves, and lower dual accent pull-out drawers.',
  },

  // --- Dining Sets ---
  {
    image: '/FinishedProducts/diningset1.png',
    name: 'Italian Marble-Top 4-Seater Teak Dining Suite with Leaf-Cut Chairs',
    category: 'Furniture Collections',
    material: 'Solid Teak Wood Frame, Composite Carrara Marble & Leatherette Upholstery',
    dimensions: 'Table: 60" L x 36" W x 30" H | Chairs: 18" W x 20" D x 38" H',
    description:
      'Contemporary dining ensemble pairing a stain-resistant white Italian marble tabletop with 4 solid teak chairs featuring sculpted leaf backrest cutouts and padded leatherette seats.',
  },
  {
    image: '/FinishedProducts/diningset2.png',
    name: 'Space-Saving 6-Seater Compact Nesting Teak Dining Set',
    category: 'Furniture Collections',
    material: 'Solid Teak Wood & 10mm Black Beveled Tempered Glass',
    dimensions: 'Table: 58" L x 36" W x 30" H | Chairs: 16" W x 16" D x 28" H',
    description:
      'Intelligently engineered space-saving dining table with sleek black tempered glass top and 6 slatted cube chairs that tuck completely flush beneath the table perimeter when not in use.',
  },
  {
    image: '/FinishedProducts/diningset3.png',
    name: 'Farmhouse X-Trestle Solid Wood 6-Seater Dining Set',
    category: 'Furniture Collections',
    material: 'Solid Seasoned Sheesham / Hardwood with Woven Grey Linen Fabric',
    dimensions: 'Table: 72" L x 38" W x 30" H | Chairs: 19" W x 21" D x 37" H',
    description:
      'Rustic modern dining table with heavy-duty X-trestle timber base, planked top, and 6 matching dining chairs with ergonomic fan-motif cutouts and padded fabric seats.',
  },
  {
    image: '/FinishedProducts/diningset4.png',
    name: 'Modern Circular Smoked-Glass 4-Seater Dining Set with Barrel Chairs',
    category: 'Furniture Collections',
    material: 'Dark Wenge Finished Hardwood, Smoked Tempered Glass & Cream Cushions',
    dimensions: 'Table: 44" Dia x 30" H | Barrel Chairs: 21" W x 21" D x 29" H',
    description:
      'Contemporary 4-seater round dining table with smoked tempered glass top, cross-strut hardwood base, and 4 curved vertical-spindle barrel chairs with flush-tuck contours.',
  },
  {
    image: '/FinishedProducts/diningset5.png',
    name: 'Artisan Lattice-Back 6-Seater Solid Teak Dining Set',
    category: 'Furniture Collections',
    material: '100% Solid Plantation Teak Wood with Natural Oil Sealer',
    dimensions: 'Table: 72" L x 36" W x 30" H | Chairs: 18" W x 19" D x 39" H',
    description:
      'Handcrafted 6-seater dining suite with sturdy timber trestle table and solid teak chairs featuring woven checkerboard lattice backrests and slatted contoured comfort seats.',
  },

  // --- Dressing Mirrors & Vanity Units ---
  {
    image: '/FinishedProducts/mirror1.png',
    name: 'Tall Radial Corner Dressing Vanity with Illuminated Mirror & Open Shelves',
    category: 'Furniture Collections',
    material: 'Teak Wood Veneer, Hardwood Sub-Frame & Warm LED Canopy Spot',
    dimensions: '32" W x 18" D x 78" H',
    description:
      'Space-efficient corner dressing vanity featuring a full-length beveled mirror, illuminated canopy spotlight, lockable cosmetic drawer, storage cabinet, and 5-tier curved display shelves.',
  },
  {
    image: '/FinishedProducts/mirror2.png',
    name: 'Traditional Arched Vanity Dresser with Backlit Floral Jali Cabinet',
    category: 'Furniture Collections',
    material: 'Seasoned Hardwood in Dark Mahogany Finish & Backlit Laser-Cut Acrylic',
    dimensions: '38" W x 18" D x 74" H',
    description:
      'Elegant dressing table featuring classic arched mirror crown, turned finial pillars, twin organizer drawers, kneehole vanity seating space, and a storage cabinet with glowing illuminated tree motif jali.',
  },

  // --- Pooja Mandirs & Prayer Cabinets ---
  {
    image: '/FinishedProducts/pooja1.png',
    name: 'Traditional Solid Teak Pooja Mandir with Om-Swastik Motif & Brass Bells',
    category: 'Furniture Collections',
    material: '100% Solid Seasoned Teak Wood & Cast Solid Brass Temple Bells',
    dimensions: '42" W x 22" D x 78" H',
    description:
      'Sacred home prayer cabinet with stepped Shikhara dome and kalash finial, laser-cut Om & Swastik solar medallion doors, integrated diya cutouts, and hanging authentic brass temple bells.',
  },
  {
    image: '/FinishedProducts/pooja2.png',
    name: 'Luxury Walnut & Honey Teak Pooja Mandir with Backlit Peacock Feather',
    category: 'Furniture Collections',
    material: 'High-Density HDHMR, Teak Veneer, Concealed Warm LED & Solid Brass',
    dimensions: '40" W x 22" D x 80" H',
    description:
      'Grand double-door prayer mandir featuring stepped temple dome, illuminated laser-cut peacock feather backboard, lotus jali bi-fold doors, stepped deity pedestals, and lower storage cabinet with drawers.',
  },
  {
    image: '/FinishedProducts/pooja3.png',
    name: 'Royal Pearl White & Gold Gopuram Pooja Mandir with Ganesha Motif',
    category: 'Furniture Collections',
    material: 'High-Grade HDF with Pearl White PU Lacquer, Teak Insets & Brass Handles',
    dimensions: '44" W x 24" D x 88" H',
    description:
      'Architectural white and gold temple mandir with multi-tiered gopuram top, brass kalash finials, laser-cut Lord Ganesha central halo medallion flanked by geometric jali panels, and 2 deep bottom pooja samagri drawers.',
  },

  // --- Sofa Sets & Living Seating ---
  {
    image: '/FinishedProducts/sofaset1.png',
    name: 'Outdoor & Indoor Solid Teak Garden Bench with Diamond Lattice Back',
    category: 'Furniture Collections',
    material: '100% Plantation Grade-A Teak Wood with Weather-Resistant Sealer',
    dimensions: '60" W x 24" D x 36" H',
    description:
      'Handcrafted 3-seater solid teak bench featuring decorative diamond lattice backrest, slatted ergonomic seat, and wide comfort armrests ideal for indoor foyers or covered verandahs.',
  },
  {
    image: '/FinishedProducts/sofaset2.png',
    name: 'Ultra-Plush Ergonomic 3+1+1 Recliner-Style Micro-Velvet Living Room Suite',
    category: 'Furniture Collections',
    material: 'Treated Hardwood Frame, 32-Density High Resilience Foam & Sand Velvet',
    dimensions: '3-Seater: 82" W x 38" D x 38" H | 1-Seater: 40" W x 38" D x 38" H',
    description:
      'Luxury contemporary 5-seater living room sofa set with pillow-top padded roll armrests, multi-tier ergonomic lumbar backrests, and stain-resistant sand-beige micro-velvet upholstery.',
  },
  {
    image: '/FinishedProducts/sofaset3.png',
    name: 'Colonial Heritage 3+1+1 Solid Wood Sofa Set with Wagon Wheel Arms',
    category: 'Furniture Collections',
    material: 'Seasoned Solid Teak Wood & Textured Fluted Chenille Velvet',
    dimensions: '3-Seater: 76" W x 34" D x 37" H | 1-Seater: 34" W x 34" D x 37" H',
    description:
      'Traditional solid wood living room suite featuring handcrafted wagon-wheel armrest carvings, turned baluster bun feet, and vertical channeled cushion backrests in warm taupe.',
  },
  {
    image: '/FinishedProducts/sofaset4.png',
    name: 'Royal Hand-Carved Teak 3+1+1 Living Room Sofa Suite with Floral Crest',
    category: 'Furniture Collections',
    material: 'Solid Carved Teak Wood Frame, High-Resilience Foam & Cream Fabric',
    dimensions: '3-Seater: 78" W x 34" D x 39" H | 1-Seater: 36" W x 34" D x 39" H',
    description:
      'Magnificent royal living room sofa ensemble with hand-carved floral crown cresting, turned side spindle wheel arm supports, turned legs, and diamond-tufted pearl white upholstery.',
  },
  {
    image: '/live/hero_living_room.png',
    name: 'Ergonomic Executive Sofa Suite',
    category: 'Furniture Collections',
    material: 'Hardwood Frame + HR Foam',
    dimensions: '84" L x 36" D x 34" H',
    description: 'Executive three-seater sofa suite with high-resilience foam cushioning and stain-resistant upholstery.',
  },
  {
    image: '/live/hero_dining_room.png',
    name: 'Crafted 6-Seater Solid Teak Dining Set',
    category: 'Furniture Collections',
    material: 'Solid Teak Wood',
    dimensions: 'Table: 72" x 40" x 30"',
    description: 'Six-seater solid teak dining table paired with ergonomically contoured dining chairs in a protective polyurethane coat.',
  },
  {
    image: '/cat-living.png',
    name: 'Contemporary Living Room Center Ensemble',
    category: 'Furniture Collections',
    material: 'Solid Walnut / Teak & Tempered Glass',
    dimensions: 'Living Suite Modular Specs',
    description: 'Integrated coffee tables, corner display units, and modular accent pieces crafted with natural oil finishes.',
  },
  {
    image: '/cat-dining.png',
    name: 'Artisan Teak Dining Cabinet & Crockery Unit',
    category: 'Furniture Collections',
    material: 'Solid Teak Wood & Tempered Glass',
    dimensions: '48" W x 18" D x 78" H',
    description: 'Refined glassware and crockery storage unit featuring soft-close hinges and tempered glass display doors.',
  },

  // ==========================================
  // 5. Project Installations
  // ==========================================
  {
    image: '/gallery-1.png',
    name: 'Luxury Resort Villa Suite Installation',
    category: 'Project Installations',
    material: 'Solid Teak Bedroom & Living Furniture',
    dimensions: 'Commercial Suite Fitout',
    description: 'Custom solid teak bed frames, bedside units, and wardrobes fitted for a premier luxury resort network.',
  },
  {
    image: '/gallery-2.png',
    name: 'Corporate Executive Lounge Seating Project',
    category: 'Project Installations',
    material: 'Solid Hardwood Framing + Premium Fabric',
    dimensions: 'Corporate Headquarters Fitout',
    description: 'High-durability ergonomic seating and living tables installed in corporate headquarters executive lounges.',
  },
  {
    image: '/gallery-3.png',
    name: 'Multi-Room Institutional Housing Project',
    category: 'Project Installations',
    material: 'Heavy Load Solid Hardwood Bunkers & Cots',
    dimensions: 'Bulk Housing Fitout',
    description: 'Heavy-duty solid wood bunker beds delivered in bulk for institutional housing with long-term asset longevity.',
  },
]

export const TESTIMONIALS = [
 
]

export const MISSION_POINTS = [
  {
    title: 'Precision Engineering',
    description:
      'To manufacture premium-grade furniture by seamlessly combining advanced automated technology with masterful woodworking techniques.',
  },
  {
    title: 'B2B Empowerment',
    description:
      'To provide multi-brand dealers, interior architects and corporate buyers with uncompromised design consistency, bulk supply reliability and optimal cost efficiencies.',
  },
  {
    title: 'Asset Longevity',
    description:
      'To design and build heavy-duty products that excel in real-world load-bearing capacity, environmental stability and long-term durability.',
  },
  {
    title: 'Sustainable Growth',
    description:
      'To cultivate a safe, efficient and growth-oriented ecosystem for our skilled craftsmen and partners while strictly conforming to zero-defect principles.',
  },
]

export function whatsappUrl(message: string) {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`
}
