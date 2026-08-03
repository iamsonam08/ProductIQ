import { KnowledgeGraphRule } from '../types';

export const INITIAL_KNOWLEDGE_GRAPH_RULES: KnowledgeGraphRule[] = [
  {
    id: 'kg-rule-1',
    category: 'Ball Valves',
    allowedMaterials: ['304 Stainless Steel', '316 Stainless Steel', '316L Stainless Steel', 'CF8M Stainless Steel', 'Brass', 'Bronze', 'Cast Iron', 'Carbon Steel', 'PVC', 'Forged Steel', 'Alloy 20'],
    typicalSpecs: ['ANSI B16.34', 'API 607', 'API 598', 'NACE MR0175', 'ISO 5211', '3A Sanitary', 'ASTM D1784'],
    pressureClasses: ['150 PSI', '200 PSI', '800 WOG', '1000 WOG', '2000 WOG', '3000 PSI', 'Class 150', 'Class 300', 'Class 600', 'PN16', 'PN40'],
    notes: 'Ball valves are versatile quarter-turn valves available in metallic alloys and PVC.'
  },
  {
    id: 'kg-rule-2',
    category: 'Gate Valves',
    allowedMaterials: ['Carbon Steel (A216 WCB)', '316 Stainless Steel', '316 Stainless Steel Body & Beveled Gate (CF8M)', 'Cast Iron', 'Forged Alloy Steel (A105)', 'Bronze', 'Ductile Iron'],
    typicalSpecs: ['API 600', 'API 602', 'API 6D', 'ASME B16.34', 'BS 5150', 'MSS SP-81'],
    pressureClasses: ['Class 150', 'Class 300', 'Class 600', 'Class 900', 'Class 1500', '200 PSI WOG', 'PN10', 'PN16'],
    notes: 'Gate valves and knife gate valves are bi-directional shutoff valves primarily rated under ASME Class or PN standards.'
  },
  {
    id: 'kg-rule-3',
    category: 'Check Valves',
    allowedMaterials: ['316 Stainless Steel', '304 Stainless Steel', '316 Stainless Steel Body & Disc (A351 CF8M)', 'Bronze', 'Carbon Steel', 'Cast Iron', 'PVC', 'Duplex SS'],
    typicalSpecs: ['API 594', 'API 598', 'API 6D', 'MSS SP-80', 'ASME B16.34'],
    pressureClasses: ['Class 150', 'Class 300', 'Class 800', '200 PSI WOG', '1000 WOG', '150 PSI'],
    notes: 'Check valves prevent backflow; material choices must align with system line pressure.'
  },
  {
    id: 'kg-rule-4',
    category: 'Flanges',
    allowedMaterials: ['Carbon Steel (A105)', '316 Stainless Steel', '304 Stainless Steel', 'Alloy Steel (A182 F11/F22)', 'Duplex SS'],
    typicalSpecs: ['ASME B16.5', 'ASME B16.47', 'DIN EN 1092-1', 'JIS B2220'],
    pressureClasses: ['Class 150', 'Class 300', 'Class 600', 'Class 900', 'Class 1500', 'PN10', 'PN16', 'PN25', 'PN40'],
    notes: 'Piping flanges must adhere to ASME B16.5 or DIN pressure ratings.'
  },
  {
    id: 'kg-rule-5',
    category: 'Sanitary Valves',
    allowedMaterials: ['316L Stainless Steel', 'Forged 316L Stainless Steel', '316 Stainless Steel'],
    typicalSpecs: ['3A Sanitary Standards', 'FDA 21 CFR 177.1550', 'ASME BPE', 'EHEDG', 'DIN 11851'],
    pressureClasses: ['150 PSI', '1000 WOG', '10 bar'],
    notes: 'Sanitary bioprocess valves require polished 316L Ra < 0.4μm finish and FDA approved cavity-filled or elastomeric seals.'
  },
  {
    id: 'kg-rule-6',
    category: 'Needle Valves',
    allowedMaterials: ['Forged 316 Stainless Steel', '316 Stainless Steel', '304 Stainless Steel', 'Monel 400', 'Inconel 625'],
    typicalSpecs: ['ASME B31.3', 'NACE MR0175', 'MSS SP-105', 'ANSI B1.20.1'],
    pressureClasses: ['3000 PSI', '6000 PSI WOG', '10000 PSI'],
    notes: 'Precision barstock needle valves are designed for high-pressure hydraulic and gas instrument sampling.'
  },
  {
    id: 'kg-rule-7',
    category: 'Butterfly Valves',
    allowedMaterials: ['316 Stainless Steel', '304 Stainless Steel', 'Ductile Iron', 'Carbon Steel', 'PVC'],
    typicalSpecs: ['API 609', 'ASME B16.34', 'API 607 Fire Safe'],
    pressureClasses: ['Class 150', 'Class 300', '150 PSI', 'PN10', 'PN16'],
    notes: 'Double offset high performance butterfly valves support bi-directional tight shutoff in wafer or lugged bodies.'
  }
];

export const MATERIAL_PRESSURE_LIMITS: Record<string, { maxPressureClass: number; maxPsi: number; text: string }> = {
  'PVC': { maxPressureClass: 150, maxPsi: 230, text: 'PVC thermoplast is restricted to max ~230 PSI / 150 PSI ambient.' },
  'Brass': { maxPressureClass: 300, maxPsi: 1000, text: 'Brass is typically limited to <= 600 WOG or Class 300.' },
  'Bronze': { maxPressureClass: 300, maxPsi: 1000, text: 'Bronze is typically limited to <= 800 WOG or Class 300.' },
  'Cast Iron': { maxPressureClass: 250, maxPsi: 500, text: 'Cast Iron is restricted to Class 125/250 due to mechanical brittleness.' }
};
