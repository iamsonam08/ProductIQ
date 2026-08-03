import { persistentVectorStore } from '../vector-store/persistentVectorStore';
import { IngestionResult, VectorRecord } from '../types';

export interface RawDocumentInput {
  text: string;
  fileName?: string;
  fileType?: 'pdf' | 'csv' | 'excel' | 'text' | 'website';
}

/**
 * Parses raw document text or file content and ingests extracted products into the persistent vector store.
 */
export async function ingestDocument(input: RawDocumentInput): Promise<IngestionResult> {
  const sourceDoc = input.fileName || `Document_${Date.now()}`;
  const rawText = input.text || '';

  // 1. Parse text into individual product candidates
  const extractedProducts = parseTextToProducts(rawText, sourceDoc);

  // 2. Add / Update in vector store (skips duplicates and caches embeddings)
  const result = persistentVectorStore.addOrUpdateRecords(extractedProducts, sourceDoc);

  return {
    added: result.added,
    skippedDuplicates: result.skippedDuplicates,
    updated: result.updated,
    totalRecordsInStore: result.records.length,
    records: result.records
  };
}

/**
 * Ingests pre-parsed structured product list directly.
 */
export function ingestStructuredList(
  products: Array<{
    name: string;
    category?: string;
    material?: string;
    size?: string;
    pressure?: string;
    spec?: string;
  }>,
  sourceName: string = 'Manual Import'
): IngestionResult {
  const result = persistentVectorStore.addOrUpdateRecords(products, sourceName);
  return {
    added: result.added,
    skippedDuplicates: result.skippedDuplicates,
    updated: result.updated,
    totalRecordsInStore: result.records.length,
    records: result.records
  };
}

/**
 * Helper to split multi-line or CSV/PDF text into structured product candidates
 */
function parseTextToProducts(
  rawText: string,
  sourceDoc: string
): Array<Partial<VectorRecord> & { name: string }> {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 5);
  const products: Array<Partial<VectorRecord> & { name: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // CSV line check (comma separated)
    if (line.includes(',') && !line.toLowerCase().startsWith('name,') && !line.toLowerCase().startsWith('title,')) {
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        const name = parts[0];
        const category = parts[1] || deriveCategory(name);
        const material = parts[2] || deriveMaterial(name);
        const size = parts[3] || deriveSize(name);
        const pressure = parts[4] || derivePressure(name);
        const spec = parts[5] || deriveSpec(name);

        products.push({
          name,
          category,
          material,
          size,
          pressure,
          spec,
          sourceDocument: sourceDoc,
          ocrText: line,
          descriptionKeywords: extractKeywords(line)
        });
        continue;
      }
    }

    // Standard text line parsing
    const category = deriveCategory(line);
    const material = deriveMaterial(line);
    const size = deriveSize(line);
    const pressure = derivePressure(line);
    const spec = deriveSpec(line);

    products.push({
      name: line,
      category,
      material,
      size,
      pressure,
      spec,
      sourceDocument: sourceDoc,
      ocrText: `Parsed line: ${line}`,
      descriptionKeywords: extractKeywords(line)
    });
  }

  // If no lines matched, wrap entire text as single product
  if (products.length === 0 && rawText.trim().length > 0) {
    const name = rawText.trim().substring(0, 80);
    products.push({
      name,
      category: deriveCategory(rawText),
      material: deriveMaterial(rawText),
      size: deriveSize(rawText),
      pressure: derivePressure(rawText),
      spec: deriveSpec(rawText),
      sourceDocument: sourceDoc,
      ocrText: rawText,
      descriptionKeywords: extractKeywords(rawText)
    });
  }

  return products;
}

function deriveCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('ball valve') || t.includes('ball')) return 'Ball Valves';
  if (t.includes('gate valve') || t.includes('gate')) return 'Gate Valves';
  if (t.includes('check valve') || t.includes('check')) return 'Check Valves';
  if (t.includes('globe valve') || t.includes('globe')) return 'Globe Valves';
  if (t.includes('flange') || t.includes('weld neck')) return 'Flanges';
  if (t.includes('strainer') || t.includes('filter')) return 'Strainers';
  if (t.includes('pump')) return 'Pumps';
  if (t.includes('actuator')) return 'Actuators';
  return 'Industrial Valves & Fittings';
}

function deriveMaterial(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('316') || t.includes('316ss') || t.includes('316 stainless')) return '316 Stainless Steel';
  if (t.includes('304') || t.includes('304ss') || t.includes('304 stainless')) return '304 Stainless Steel';
  if (t.includes('carbon') || t.includes('wcb') || t.includes('a105')) return 'Carbon Steel (A216 WCB/A105)';
  if (t.includes('bronze')) return 'Bronze';
  if (t.includes('pvc') || t.includes('cpvc')) return 'PVC / Synthetic Plastic';
  if (t.includes('aluminum')) return 'Anodized Aluminum';
  return 'Standard Grade Steel';
}

function deriveSize(text: string): string {
  const m = text.match(/(\d+\/?\d*|\d+\.\d+)\s*(-|\s)?(inch|"|in)/i);
  if (m) return `${m[1]}"`;
  return '2"';
}

function derivePressure(text: string): string {
  const m = text.match(/(class\s*\d+|150|300|600|800|1000|1500|2000|3000|\d+\s*psi|\d+\s*wog)/i);
  if (m) {
    if (m[0].toLowerCase().includes('class')) return m[0].toUpperCase();
    if (m[0].toLowerCase().includes('psi') || m[0].toLowerCase().includes('wog')) return m[0].toUpperCase();
    return `Class ${m[0]}`;
  }
  return 'Class 150';
}

function deriveSpec(text: string): string {
  const m = text.match(/(ansi\s*[b\d.]+|api\s*\d+|asme\s*[b\d.]+|nace\s*[a-z0-9]+|iso\s*\d+|mss\s*sp-\d+)/i);
  if (m) return m[0].toUpperCase();
  return 'ANSI / ASME B16.34';
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}
