export interface StructuredProductData {
  name: string;
  category: string;
  material: string;
  size: string;
  pressure: string;
  spec: string;
  endConnection?: string;
  valveType?: string;
  description?: string;
  sourcePage?: string | number;
}

export interface FieldValidation {
  score: number; // 0-100
  reason: string; // Traceable reason based on source document
  needsReview: boolean; // true if score < 50
  sourceExcerpt?: string;
}

export interface RecordValidationResult {
  fields: Record<keyof StructuredProductData, FieldValidation>;
  overallConfidence: number;
  flaggedCount: number;
}

export interface KnowledgeGraphAnomaly {
  field: keyof StructuredProductData | 'general';
  message: string;
  severity: 'high' | 'medium' | 'low';
  ruleId?: string;
}

export interface KnowledgeGraphCheck {
  status: 'valid' | 'anomaly_flagged' | 'warning';
  rulesChecked: string[];
  anomalies: KnowledgeGraphAnomaly[];
}

export interface RAGContextItem {
  id: string;
  name: string;
  category: string;
  material: string;
  size: string;
  pressure: string;
  spec: string;
  similarityScore: number; // 0-100
  matchReason: string;
}

export interface ProductIntelligenceResult {
  id: string;
  rawInputText: string;
  documentType: 'text' | 'image' | 'pdf';
  fileName?: string;
  extractedRawText: string;
  retrievedRAGContext: RAGContextItem[];
  structuredData: StructuredProductData;
  validation: RecordValidationResult;
  knowledgeGraph: KnowledgeGraphCheck;
  timestamp: string;
  status: 'auto_approved' | 'needs_review' | 'human_verified';
}

export interface KnowledgeGraphRule {
  id: string;
  category: string;
  allowedMaterials: string[];
  typicalSpecs: string[];
  pressureClasses: string[];
  notes: string;
}

export interface BatchProgress {
  total: number;
  processed: number;
  currentName?: string;
  autoApproved: number;
  needsReview: number;
  graphAnomalies: number;
}

export interface ReferencedProductCitation {
  id: string;
  name: string;
  category?: string;
  material?: string;
  pressure?: string;
  sourceType?: 'rag_store' | 'processed_batch' | 'processed_single';
  reason?: string;
}

export type CatalogChatResponseType = 'normal' | 'out_of_scope' | 'no_matches' | 'ambiguous' | 'system_error';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  responseType?: CatalogChatResponseType;
  reasoning?: string;
  confidenceScore?: number;
  referencedProducts?: ReferencedProductCitation[];
  suggestedFollowUps?: string[];
  canAnswer?: boolean;
}

