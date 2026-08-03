import { StructuredProductData } from '../types';

export interface VectorRecord extends StructuredProductData {
  id: string;
  descriptionKeywords: string[];
  ocrText?: string;
  sourceDocument?: string;
  embedding: number[];
  createdAt: string;
  updatedAt: string;
  hash: string;
}

export interface RAGSearchResult extends StructuredProductData {
  id: string;
  descriptionKeywords: string[];
  ocrText?: string;
  sourceDocument?: string;
  similarityScore: number; // 0 - 100%
  matchConfidence: 'high' | 'low'; // >=70% is high, 40-69% is low
  matchReason: string;
}

export interface RAGDashboardStats {
  productsIndexed: number;
  embeddingsStored: number;
  documentsProcessed: number;
  lastIndexedTime: string;
  lastUpdated: string;
  vectorStoreStatus: string;
  averageRetrievalTimeMs: number;
  knowledgeGraphNodes: number;
  storageSizeBytes: number;
  isDemoDataset: boolean;
  uniqueCategoriesCount: number;
  uniqueMaterialsCount: number;
  uniqueSpecsCount: number;
}

export interface IngestionResult {
  added: number;
  skippedDuplicates: number;
  updated: number;
  totalRecordsInStore: number;
  records: VectorRecord[];
}
