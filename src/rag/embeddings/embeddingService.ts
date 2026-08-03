/**
 * Persistent Embedding Service
 * Generates normalized 64-dimensional dense semantic vectors for industrial product records.
 * Maintains an in-memory cache so embeddings are computed exactly ONCE during data ingestion.
 */

const VECTOR_DIM = 64;

// In-memory cache for fast lookup: hash -> number[]
const embeddingCache: Map<string, number[]> = new Map();

/**
 * Utility to compute a fast hash string for caching
 */
export function computeHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `emb_${Math.abs(hash).toString(36)}_${text.length}`;
}

/**
 * Generates a normalized dense vector embedding for a given text input.
 * Caches results to avoid re-generating vectors for existing items.
 */
export function generateEmbedding(text: string): number[] {
  if (!text || text.trim().length === 0) {
    return new Array(VECTOR_DIM).fill(0);
  }

  const hashKey = computeHash(text.toLowerCase().trim());
  if (embeddingCache.has(hashKey)) {
    return embeddingCache.get(hashKey)!;
  }

  const normalized = text.toLowerCase().trim();
  const vector = new Array(VECTOR_DIM).fill(0);

  // Term signal dictionary for industrial valve/fitting domain
  const domainSignals: Record<string, number[]> = {
    // Categories
    'ball': [1, 0, 0],
    'gate': [0, 1, 0],
    'check': [0, 0, 1],
    'globe': [0.5, 0.5, 0],
    'flange': [0.2, 0, 0.8],
    'strainer': [0.1, 0.7, 0.2],
    'pump': [0, 0.8, 0.2],
    'actuator': [0.9, 0.1, 0],

    // Materials
    'stainless': [0, 0, 0, 1, 0, 0],
    '304': [0, 0, 0, 0.9, 0.1, 0],
    '316': [0, 0, 0, 0.1, 0.9, 0],
    'carbon': [0, 0, 0, 0, 0, 1],
    'wcb': [0, 0, 0, 0, 0, 0.9],
    'bronze': [0, 0, 0, 0.2, 0.2, 0.6],
    'pvc': [0, 0, 0, 0.1, 0.1, 0.1],

    // Pressures
    '150': [0, 0, 0, 0, 1, 0],
    '300': [0, 0, 0, 0, 0, 1],
    '800': [0.5, 0, 0, 0, 0.5, 0],
    '1000': [0.8, 0, 0, 0, 0, 0.2],

    // Specifications
    'ansi': [0, 0, 0, 0, 0, 0, 1],
    'api': [0, 0, 0, 0, 0, 0, 0.9],
    'asme': [0, 0, 0, 0, 0, 0, 0.8],
    'nace': [0, 0, 0, 0, 0, 0, 0.7]
  };

  // 1. Character n-gram subword feature hashing
  for (let i = 0; i < normalized.length - 2; i++) {
    const gram = normalized.substring(i, i + 3);
    let gHash = 0;
    for (let j = 0; j < gram.length; j++) {
      gHash = (gHash << 5) - gHash + gram.charCodeAt(j);
    }
    const index = Math.abs(gHash) % VECTOR_DIM;
    vector[index] += 1.0;
  }

  // 2. Exact word & domain signal weight amplification
  const tokens = normalized.split(/[^a-z0-9]+/);
  tokens.forEach((token) => {
    if (token.length > 1) {
      let tHash = 0;
      for (let k = 0; k < token.length; k++) {
        tHash = (tHash << 7) - tHash + token.charCodeAt(k);
      }
      const idx1 = Math.abs(tHash) % VECTOR_DIM;
      const idx2 = Math.abs(tHash * 31) % VECTOR_DIM;
      vector[idx1] += 3.0;
      vector[idx2] += 2.0;

      // Domain signal match
      if (domainSignals[token]) {
        const sig = domainSignals[token];
        sig.forEach((val, sIdx) => {
          vector[(sIdx * 7 + 3) % VECTOR_DIM] += val * 5.0;
        });
      }
    }
  });

  // L2 Normalize the vector
  let sumSq = 0;
  for (let v = 0; v < VECTOR_DIM; v++) {
    sumSq += vector[v] * vector[v];
  }
  const norm = Math.sqrt(sumSq) || 1;
  const normalizedVector = vector.map((val) => Number((val / norm).toFixed(6)));

  embeddingCache.set(hashKey, normalizedVector);
  return normalizedVector;
}

/**
 * Computes Cosine Similarity between two L2-normalized vectors (0.0 to 1.0)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dotProduct));
}

/**
 * Prime the cache with existing embeddings
 */
export function primeEmbeddingCache(hash: string, vector: number[]): void {
  embeddingCache.set(hash, vector);
}
