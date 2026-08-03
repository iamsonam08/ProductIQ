import { persistentVectorStore } from '../vector-store/persistentVectorStore';
import { RAGSearchResult, RAGDashboardStats } from '../types';

export interface RetrievalResponse {
  query: string;
  results: RAGSearchResult[];
  topConfidence: 'high' | 'low' | 'none';
  hasMatch: boolean;
  latencyMs: number;
}

/**
 * Executes persistent RAG retrieval for a user query.
 */
export function searchRAGStore(query: string, topK: number = 3): RetrievalResponse {
  if (!query || query.trim().length === 0) {
    return {
      query: '',
      results: [],
      topConfidence: 'none',
      hasMatch: false,
      latencyMs: 0
    };
  }

  const { results, latencyMs } = persistentVectorStore.search(query, topK);

  if (!results || results.length === 0) {
    return {
      query,
      results: [],
      topConfidence: 'none',
      hasMatch: false,
      latencyMs
    };
  }

  const topSim = results[0].similarityScore;
  let topConfidence: 'high' | 'low' | 'none' = 'none';

  if (topSim >= 70) {
    topConfidence = 'high';
  } else if (topSim >= 40) {
    topConfidence = 'low';
  } else {
    topConfidence = 'none';
  }

  return {
    query,
    results,
    topConfidence,
    hasMatch: results.length > 0 && topSim >= 40,
    latencyMs
  };
}

/**
 * Returns current vector store dashboard statistics.
 */
export function getRAGStoreStats(): RAGDashboardStats {
  return persistentVectorStore.getStats();
}
