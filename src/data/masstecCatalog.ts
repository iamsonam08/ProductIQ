import { StructuredProductData } from '../types';

export interface MassTecProduct extends StructuredProductData {
  id: string;
  name: string;
  category: string;
  material: string;
  size: string;
  pressure: string;
  spec: string;
  endConnection: string;
  valveType: string;
  description: string;
  sourcePage: string;
  descriptionKeywords: string[];
  ocrText: string;
  sourceDocument: string;
}

export const MASSTEC_CATALOG_NAME = 'MassTec Stainless Steel Industrial Valve Catalogue';

export const MASSTEC_CATALOG_PRODUCTS: MassTecProduct[] = [
  {
    id: 'masstec-01',
    name: 'MassTec 2-Piece Stainless Steel Direct-Mount Ball Valve 2" Class 150',
    category: 'Ball Valves',
    material: '316 Stainless Steel (CF8M / ASTM A351)',
    size: '2"',
    pressure: 'Class 150 (285 PSI WOG)',
    spec: 'ANSI B16.34 / ISO 5211 / API 598',
    endConnection: 'Flanged RF (Raised Face)',
    valveType: '2-Piece Direct-Mount Full Port Ball Valve',
    description: 'Heavy duty 316SS 2-piece full port ball valve featuring an ISO 5211 direct actuator mounting pad, anti-static device, blowout-proof stem, and reinforced PTFE seats for chemical processing.',
    sourcePage: 'Page 4',
    descriptionKeywords: ['masstec', 'ball valve', '2-piece', '316 ss', 'cf8m', 'class 150', 'flanged', 'iso 5211', 'direct mount', '2 inch', 'ansi b16.34'],
    ocrText: 'MassTec Industrial Catalogue Page 4: Model MT-200F 2-Piece Stainless Steel Direct Mount Flanged Ball Valve 2" Class 150 CF8M Body ISO 5211 Pad.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-02',
    name: 'MassTec 3-Piece High-Purity Sanitary Tri-Clamp Ball Valve 1.5"',
    category: 'Sanitary Valves',
    material: '316L Stainless Steel (ASTM A276/A479)',
    size: '1.5"',
    pressure: '1000 WOG / 150 PSI Steam',
    spec: '3A Sanitary Standards / FDA 21 CFR 177.1550 / ASME BPE',
    endConnection: 'Tri-Clamp Sanitary Ferrule',
    valveType: '3-Piece Cavity-Filled Sanitary Ball Valve',
    description: 'Ultra-pure 316L stainless steel 3-piece ball valve with internal mirror polish (Ra < 0.4μm / 15 μin), fully encapsulated cavity-fill PTFE seats preventing fluid stagnation in pharmaceutical & dairy lines.',
    sourcePage: 'Page 7',
    descriptionKeywords: ['masstec', 'sanitary valve', '316l ss', 'tri-clamp', 'cavity fill', '3a sanitary', 'fda', 'asme bpe', '1.5 inch', 'pharmaceutical'],
    ocrText: 'MassTec Industrial Catalogue Page 7: Model MT-300S 3-Piece 316L Sanitary Ball Valve 1.5 Inch Tri-Clamp End Mirror Polish Ra 0.4um FDA Cavity Fill Seats.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-03',
    name: 'MassTec High-Performance Double Offset Butterfly Valve 4" Class 150',
    category: 'Butterfly Valves',
    material: '316 Stainless Steel (CF8M / ASTM A351)',
    size: '4"',
    pressure: 'Class 150 (285 PSI WOG)',
    spec: 'API 609 / ASME B16.34 / API 607 Fire Safe',
    endConnection: 'Lugged Wafer Body',
    valveType: 'High-Performance Double Offset Butterfly Valve',
    description: 'Double offset high performance butterfly valve with RTFE seat ring, live-loaded stem packing, ISO 5211 mounting flange, bi-directional dead-end service capability.',
    sourcePage: 'Page 11',
    descriptionKeywords: ['masstec', 'butterfly valve', 'double offset', 'high performance', '4 inch', 'lugged', 'class 150', 'rtfe', 'api 609', 'fire safe'],
    ocrText: 'MassTec Industrial Catalogue Page 11: Model MT-BF400 High Performance Double Offset Butterfly Valve 4 Inch Lugged Class 150 316SS Disc & Body RTFE Seat Ring.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-04',
    name: 'MassTec Stainless Steel Y-Pattern Globe Valve 3" Class 300',
    category: 'Globe Valves',
    material: '316 Stainless Steel (CF8M)',
    size: '3"',
    pressure: 'Class 300 (720 PSI WOG)',
    spec: 'ASME B16.34 / API 623 / BS 1873',
    endConnection: 'Flanged Raised Face (ANSI B16.5)',
    valveType: 'Y-Pattern Throttling Globe Valve',
    description: 'Streamlined Y-pattern globe valve engineered for low pressure drop and precise throttling, Stellite-faced hard seat disc and stem for high-temperature steam service up to 450°C.',
    sourcePage: 'Page 16',
    descriptionKeywords: ['masstec', 'globe valve', 'y-pattern', 'throttling', '3 inch', 'class 300', '316 ss', 'stellite', 'asme b16.34', 'flanged'],
    ocrText: 'MassTec Industrial Catalogue Page 16: Model MT-GL300Y Y-Pattern Stainless Steel Globe Valve 3 Inch Class 300 Flanged RF Stellite Hardened Seat Disc.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-05',
    name: 'MassTec Dual-Plate Split Disc Check Valve 6" Class 150',
    category: 'Check Valves',
    material: '316 Stainless Steel Body & Disc (A351 CF8M)',
    size: '6"',
    pressure: 'Class 150 (275 PSI WOG)',
    spec: 'API 594 / API 598 / ASME B16.34',
    endConnection: 'Wafer Short Pattern',
    valveType: 'Dual Plate Spring-Assisted Check Valve',
    description: 'Compact lightweight split-disc check valve with Inconel 750 spring for non-slam fast closure, preventing water hammer and backflow in chemical pipelines.',
    sourcePage: 'Page 19',
    descriptionKeywords: ['masstec', 'check valve', 'dual plate', 'split disc', 'wafer', '6 inch', 'class 150', 'inconel spring', 'api 594', 'non-slam'],
    ocrText: 'MassTec Industrial Catalogue Page 19: Model MT-CK600D Dual Plate Wafer Check Valve 6 Inch Class 150 316SS Body Split Disc Inconel Spring API 594.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-06',
    name: 'MassTec Forged 316SS High-Pressure Needle Valve 1/2" 6000 PSI',
    category: 'Needle Valves',
    material: 'Forged 316 Stainless Steel (ASTM A479 / A182 F316)',
    size: '1/2"',
    pressure: '6000 PSI WOG (413 bar)',
    spec: 'ASME B31.3 / NACE MR0175 / MSS SP-105',
    endConnection: 'Female NPT Threaded (ANSI B1.20.1)',
    valveType: 'Hard-Seat Barstock Instrument Needle Valve',
    description: 'Precision forged 316SS barstock instrument needle valve with non-rotating hardened stem tip, PTFE/Grafoil stem packing, and heavy duty T-bar handle for hydraulic sampling.',
    sourcePage: 'Page 22',
    descriptionKeywords: ['masstec', 'needle valve', '6000 psi', 'forged 316ss', '1/2 inch', 'npt female', 'nace mr0175', 'instrumentation', 'barstock'],
    ocrText: 'MassTec Industrial Catalogue Page 22: Model MT-NV12-6K Forged 316SS Needle Valve 1/2" NPT Female 6000 PSI Non-rotating hardened stem tip NACE MR0175.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-07',
    name: 'MassTec Stainless Steel Knife Gate Valve 8" PN10',
    category: 'Gate Valves',
    material: '316 Stainless Steel Body & Beveled Gate (CF8M)',
    size: '8"',
    pressure: 'PN10 (150 PSI WOG)',
    spec: 'MSS SP-81 / TAPPI TIS 405-8 / ASME B16.5',
    endConnection: 'Lugged Wafer Flanged',
    valveType: 'Bi-Directional Knife Gate Valve',
    description: 'Heavy duty stainless steel knife gate valve with precision ground chamfered blade edge to cut through thick slurries, pulp, wastewater, and solid viscous media.',
    sourcePage: 'Page 25',
    descriptionKeywords: ['masstec', 'knife gate valve', 'gate valve', '8 inch', 'pn10', '316 ss', 'lugged wafer', 'slurry', 'pulp', 'mss sp-81'],
    ocrText: 'MassTec Industrial Catalogue Page 25: Model MT-KG800 Stainless Steel Knife Gate Valve 8 Inch PN10 Lugged Wafer 316SS Chamfered Blade MSS SP-81.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-08',
    name: 'MassTec Weir-Type Bio-Pharma Sanitary Diaphragm Valve 2" Tri-Clamp',
    category: 'Sanitary Valves',
    material: 'Forged 316L Stainless Steel (1.4435 / AISI 316L)',
    size: '2"',
    pressure: '150 PSI (10 bar) / CIP & SIP 150°C',
    spec: '3A Sanitary / ASME BPE / EHEDG / FDA 21 CFR 177.2600',
    endConnection: 'Tri-Clamp Sanitary Ferrule',
    valveType: 'Weir-Type Aseptic Sanitary Diaphragm Valve',
    description: 'Self-draining weir-type forged 316L sanitary diaphragm valve with TFM/EPDM composite dual-layer diaphragm, visual position indicator, fully sterilizable for bioprocess lines.',
    sourcePage: 'Page 29',
    descriptionKeywords: ['masstec', 'diaphragm valve', 'sanitary valve', '316l ss', 'tri-clamp', 'weir type', 'asme bpe', '3a sanitary', '2 inch', 'ehedg', 'cip sip'],
    ocrText: 'MassTec Industrial Catalogue Page 29: Model MT-DV200 Aseptic Sanitary Diaphragm Valve 2 Inch Tri-Clamp Forged 316L Body TFM/EPDM Diaphragm ASME BPE.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-09',
    name: 'MassTec 360-Degree Tubular Sanitary Sight Glass 2"',
    category: 'Sight Glasses',
    material: '316 Stainless Steel End Caps & Borosilicate Glass',
    size: '2"',
    pressure: '150 PSI (10 bar)',
    spec: '3A Sanitary / DIN 11851 / FDA Approved Seals',
    endConnection: 'Tri-Clamp Sanitary Ends',
    valveType: 'Full-Vision In-line Tubular Sight Glass',
    description: 'Full 360-degree inline vision sight flow indicator fabricated from heavy wall borosilicate glass and 316SS protective acrylic guard for real-time liquid clarity monitoring.',
    sourcePage: 'Page 33',
    descriptionKeywords: ['masstec', 'sight glass', 'sanitary', '360 degree', 'borosilicate glass', '316 ss', '2 inch', 'tri-clamp', '3a sanitary', 'flow indicator'],
    ocrText: 'MassTec Industrial Catalogue Page 33: Model MT-SG200 In-line Tubular Sanitary Sight Glass 2 Inch Tri-Clamp Borosilicate Glass 316SS Body 150 PSI.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-10',
    name: 'MassTec 316SS Simplex Basket Strainer Flanged 4" Class 150',
    category: 'Strainers',
    material: '316 Stainless Steel Cast Body (CF8M)',
    size: '4"',
    pressure: 'Class 150 (275 PSI WOG)',
    spec: 'ASME B16.34 / ASME B16.5 / MSS SP-71',
    endConnection: 'Flanged Raised Face (ANSI B16.5)',
    valveType: 'Simplex Basket Strainer with Quick-Release Cover',
    description: 'Heavy duty 316SS simplex basket strainer featuring quick-open swing-bolt cover, removable 40-mesh stainless steel basket element, blow-down drain port for process filtration.',
    sourcePage: 'Page 38',
    descriptionKeywords: ['masstec', 'strainer', 'basket strainer', '316 ss', 'cf8m', '4 inch', 'class 150', 'flanged', 'quick open', 'asme b16.34'],
    ocrText: 'MassTec Industrial Catalogue Page 38: Model MT-ST400 Simplex Basket Strainer 4 Inch Flanged Class 150 316SS Body 40 Mesh Basket Blowdown Port.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-11',
    name: 'MassTec 1-Piece Reduced Port Stainless Ball Valve 1" 1000 WOG',
    category: 'Ball Valves',
    material: '316 Stainless Steel (CF8M)',
    size: '1"',
    pressure: '1000 WOG (1000 PSI)',
    spec: 'ANSI B16.34 / NPT ANSI B1.20.1',
    endConnection: 'Female NPT Threaded',
    valveType: '1-Piece Monoblock Reduced Port Ball Valve',
    description: 'Compact 1-piece stainless steel monoblock body ball valve with latch-lock safety handle, blowout-proof stem, and PTFE seat ring for tight shutoff in compact piping manifolds.',
    sourcePage: 'Page 2',
    descriptionKeywords: ['masstec', 'ball valve', '1-piece', 'reduced port', '316 ss', '1 inch', '1000 wog', 'npt female', 'latch lock'],
    ocrText: 'MassTec Industrial Catalogue Page 2: Model MT-100N 1-Piece Compact Ball Valve 1 Inch NPT 1000 WOG CF8M Body Latch Lock Handle.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-12',
    name: 'MassTec Stainless Steel Cryogenic Globe Valve 2" Class 300',
    category: 'Globe Valves',
    material: '316 Stainless Steel (ASTM A351 CF8M)',
    size: '2"',
    pressure: 'Class 300 (720 PSI WOG)',
    spec: 'ASME B16.34 / BS 6364 Cryogenic / API 623',
    endConnection: 'Flanged Raised Face',
    valveType: 'Extended Bonnet Cryogenic Globe Valve',
    description: 'Extended stem bonnet stainless steel globe valve specially engineered for liquid nitrogen, LNG, and cryogenic media service down to -196°C (-320°F).',
    sourcePage: 'Page 18',
    descriptionKeywords: ['masstec', 'globe valve', 'cryogenic', 'extended bonnet', '316 ss', '2 inch', 'class 300', 'lng', 'liquid nitrogen', 'bs 6364'],
    ocrText: 'MassTec Industrial Catalogue Page 18: Model MT-CR200 Cryogenic Globe Valve 2 Inch Class 300 Flanged RF Extended Stem Bonnet rated to -196C BS 6364.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-13',
    name: 'MassTec Trunnion Mounted 316SS Ball Valve 6" Class 300',
    category: 'Ball Valves',
    material: 'Forged 316 Stainless Steel (ASTM A182 F316)',
    size: '6"',
    pressure: 'Class 300 (720 PSI WOG)',
    spec: 'API 6D / ASME B16.34 / API 607 Fire Safe / NACE MR0175',
    endConnection: 'Flanged Raised Face (ASME B16.5)',
    valveType: 'Trunnion Mounted Double Block & Bleed Ball Valve',
    description: 'Forged 316SS trunnion mounted ball valve with spring-energized Devlon seats, double block and bleed (DBB) drain valve, sealant injection fittings, fire-safe graphite packing.',
    sourcePage: 'Page 9',
    descriptionKeywords: ['masstec', 'trunnion ball valve', 'ball valve', 'trunnion', '6 inch', 'class 300', 'api 6d', 'dbb', 'forged 316ss', 'nace mr0175'],
    ocrText: 'MassTec Industrial Catalogue Page 9: Model MT-TR600 Trunnion Mounted Ball Valve 6 Inch Class 300 Forged A182 F316 Body API 6D Double Block & Bleed.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-14',
    name: 'MassTec Stainless Steel Safety Relief Valve 1" x 2" 300 PSI',
    category: 'Safety Valves',
    material: '316 Stainless Steel Trim & Body (CF8M)',
    size: '1" Inlet x 2" Outlet',
    pressure: 'Set Pressure 300 PSI (Class 300 x Class 150)',
    spec: 'ASME Section VIII / API 526 / API 520',
    endConnection: 'Flanged Class 300 Inlet x Class 150 Outlet',
    valveType: 'Direct Spring-Loaded Pressure Relief Valve',
    description: 'ASME UV stamped direct spring pressure relief valve with stainless steel bonnet, soft Viton seat seal, and open test lever for overpressure protection on pressure vessels.',
    sourcePage: 'Page 31',
    descriptionKeywords: ['masstec', 'safety valve', 'relief valve', '316 ss', '1x2 inch', 'set pressure 300 psi', 'asme section viii', 'api 526', 'overpressure'],
    ocrText: 'MassTec Industrial Catalogue Page 31: Model MT-SR102 Safety Relief Valve 1x2 Inch Flanged Class 300x150 Set Pressure 300 PSI ASME Sec VIII UV Stamp.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-15',
    name: 'MassTec 3-Piece Heavy-Duty Socket-Weld Ball Valve 2" 2000 WOG',
    category: 'Ball Valves',
    material: '316 Stainless Steel (CF8M)',
    size: '2"',
    pressure: '2000 WOG (2000 PSI)',
    spec: 'ANSI B16.34 / ASME B16.11 Socket Weld',
    endConnection: 'Socket Weld Ends (ASME B16.11)',
    valveType: '3-Piece Swing-Out Heavy-Duty Ball Valve',
    description: '3-piece heavy duty swing-out body ball valve for quick online seal replacement without removing pipe ends, encapsulated Delrin seats rated for high pressure hydraulic oils.',
    sourcePage: 'Page 6',
    descriptionKeywords: ['masstec', 'ball valve', '3-piece', 'socket weld', '2000 wog', '316 ss', '2 inch', 'delrin seats', 'swing out', 'asme b16.11'],
    ocrText: 'MassTec Industrial Catalogue Page 6: Model MT-300SW 3-Piece Heavy Duty Ball Valve 2 Inch Socket Weld 2000 WOG CF8M Delrin Seats Swing Out Body.',
    sourceDocument: MASSTEC_CATALOG_NAME
  },
  {
    id: 'masstec-16',
    name: 'MassTec Stainless Steel Threaded Y-Strainer 2" 800 WOG',
    category: 'Strainers',
    material: '316 Stainless Steel (CF8M)',
    size: '2"',
    pressure: '800 WOG (800 PSI)',
    spec: 'ASME B16.34 / ANSI B1.20.1 NPT',
    endConnection: 'Female NPT Threaded',
    valveType: 'Y-Pattern Pipeline Strainer',
    description: 'Compact 316SS Y-strainer with 100-mesh cylindrical stainless screen filter element, PTFE bonnet gasket, and threaded blow-off plug for line maintenance.',
    sourcePage: 'Page 36',
    descriptionKeywords: ['masstec', 'y strainer', 'strainer', '2 inch', '800 wog', '316 ss', 'npt female', '100 mesh', 'pipeline filter'],
    ocrText: 'MassTec Industrial Catalogue Page 36: Model MT-YS200 Stainless Steel Y-Strainer 2 Inch NPT 800 WOG CF8M 100 Mesh Screen Threaded Blowoff Plug.',
    sourceDocument: MASSTEC_CATALOG_NAME
  }
];
