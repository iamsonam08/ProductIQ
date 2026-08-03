import { StructuredProductData } from '../types';

export interface ReferenceProduct extends StructuredProductData {
  id: string;
  descriptionKeywords: string[];
}

export const INITIAL_REFERENCE_CATALOG: ReferenceProduct[] = [
  {
    id: 'ref-1',
    name: '304 Stainless Steel Flanged Ball Valve 2-Inch',
    category: 'Ball Valves',
    material: '304 Stainless Steel',
    size: '2"',
    pressure: 'Class 150',
    spec: 'ANSI B16.34',
    descriptionKeywords: ['ball valve', 'flanged', '304 ss', 'stainless', 'class 150', '2 inch', 'ansi b16.34']
  },
  {
    id: 'ref-2',
    name: '316 Stainless Steel High Pressure Ball Valve 1/2-Inch',
    category: 'Ball Valves',
    material: '316 Stainless Steel',
    size: '1/2"',
    pressure: '1000 WOG',
    spec: 'NACE MR0175',
    descriptionKeywords: ['ball valve', '316 ss', '1/2 inch', '1000 wog', 'nace', 'npt threaded']
  },
  {
    id: 'ref-3',
    name: 'Cast Steel Gate Valve Flanged 4-Inch Class 300',
    category: 'Gate Valves',
    material: 'Carbon Steel (A216 WCB)',
    size: '4"',
    pressure: 'Class 300',
    spec: 'API 600',
    descriptionKeywords: ['gate valve', 'wcb', 'carbon steel', 'class 300', 'api 600', '4 inch', 'rising stem']
  },
  {
    id: 'ref-4',
    name: 'Bronze Swing Check Valve Threaded 1-1/2 Inch',
    category: 'Check Valves',
    material: 'Bronze',
    size: '1-1/2"',
    pressure: '200 PSI WOG',
    spec: 'MSS SP-80',
    descriptionKeywords: ['check valve', 'swing check', 'bronze', '1.5 inch', 'threaded', 'mss sp-80']
  },
  {
    id: 'ref-5',
    name: 'Forged Steel Globe Valve Socket Weld 1-Inch',
    category: 'Globe Valves',
    material: 'Forged Alloy Steel (A105)',
    size: '1"',
    pressure: 'Class 800',
    spec: 'API 602',
    descriptionKeywords: ['globe valve', 'forged steel', 'a105', 'class 800', 'socket weld', 'api 602']
  },
  {
    id: 'ref-6',
    name: 'ANSI B16.5 Weld Neck Flange 3-Inch Class 150',
    category: 'Flanges',
    material: 'Carbon Steel (A105)',
    size: '3"',
    pressure: 'Class 150',
    spec: 'ASME B16.5',
    descriptionKeywords: ['flange', 'weld neck', 'asme b16.5', 'a105', '3 inch', 'class 150', 'raised face']
  },
  {
    id: 'ref-7',
    name: '316 SS Y-Strainer Threaded 2-Inch 800 WOG',
    category: 'Strainers',
    material: '316 Stainless Steel',
    size: '2"',
    pressure: '800 WOG',
    spec: 'ASME B16.34',
    descriptionKeywords: ['y strainer', 'mesh filter', '316 ss', '2 inch', '800 wog', 'threaded']
  },
  {
    id: 'ref-8',
    name: 'PVC Double Union Ball Valve 1-Inch',
    category: 'Ball Valves',
    material: 'PVC',
    size: '1"',
    pressure: '150 PSI',
    spec: 'ASTM D1784',
    descriptionKeywords: ['pvc valve', 'double union', 'pvc', '150 psi', '1 inch', 'astm d1784']
  },
  {
    id: 'ref-8b',
    name: 'PVC Lug Style Butterfly Valve 3-Inch',
    category: 'Butterfly Valves',
    material: 'PVC',
    size: '3"',
    pressure: '150 PSI',
    spec: 'API 609 / ASTM D1784',
    descriptionKeywords: ['pvc butterfly valve', 'butterfly valve', 'pvc', '3 inch', '150 psi', 'api 609']
  },
  {
    id: 'ref-9',
    name: 'Stainless Steel Centrifugal Pump 3x2-6 ANSI',
    category: 'Pumps',
    material: '316 Stainless Steel',
    size: '3" x 2"',
    pressure: '175 PSI',
    spec: 'ANSI B73.1',
    descriptionKeywords: ['centrifugal pump', 'ansi pump', '316 ss', '3x2', '175 psi', 'ansi b73.1']
  },
  {
    id: 'ref-10',
    name: 'Pneumatic Rotary Actuator Double Acting 100 Nm',
    category: 'Actuators',
    material: 'Anodized Aluminum',
    size: 'ISO 5211 F07/F10',
    pressure: '80 PSI Air',
    spec: 'ISO 5211',
    descriptionKeywords: ['actuator', 'pneumatic', 'rotary', 'iso 5211', 'double acting', 'aluminum']
  }
];
