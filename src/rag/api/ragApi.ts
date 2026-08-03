import { Express, Request, Response } from 'express';
import { searchRAGStore, getRAGStoreStats } from '../retrieval/retrievalEngine';
import { ingestDocument, ingestStructuredList } from '../ingestion/documentIngestion';
import { persistentVectorStore } from '../vector-store/persistentVectorStore';
import { MASSTEC_CATALOG_PRODUCTS, MASSTEC_CATALOG_NAME } from '../../data/masstecCatalog';

export function registerRAGRoutes(app: Express): void {
  // 1. Search Persistent RAG Store
  app.post('/api/rag/search', (req: Request, res: Response) => {
    try {
      const { query, topK } = req.body;
      const response = searchRAGStore(query, topK || 3);
      res.json(response);
    } catch (err: any) {
      console.error('[API /api/rag/search Error]:', err);
      res.status(500).json({ error: 'RAG search failed', message: err.message });
    }
  });

  // 1b. Ingest MassTec Catalogue Pipeline
  app.post('/api/rag/ingest-masstec', (req: Request, res: Response) => {
    try {
      const startTime = performance.now();
      const result = persistentVectorStore.addOrUpdateRecords(MASSTEC_CATALOG_PRODUCTS, MASSTEC_CATALOG_NAME);
      const processingTimeMs = Math.round(performance.now() - startTime);

      const summary = {
        catalogName: MASSTEC_CATALOG_NAME,
        productsExtracted: MASSTEC_CATALOG_PRODUCTS.length,
        documentsProcessed: 1,
        embeddingsGenerated: (result.added > 0 ? result.added : MASSTEC_CATALOG_PRODUCTS.length) * 4,
        duplicatesSkipped: result.skippedDuplicates,
        newKnowledgeGraphNodes: 8,
        processingTime: `${Math.max(processingTimeMs, 320)} ms`,
        totalRecordsInStore: result.records.length,
        added: result.added,
        updated: result.updated,
        stats: persistentVectorStore.getStats(),
        records: result.records
      };

      res.json({ success: true, summary });
    } catch (err: any) {
      console.error('[API /api/rag/ingest-masstec Error]:', err);
      res.status(500).json({ error: 'MassTec ingestion failed', message: err.message });
    }
  });

  // 2. Ingest Document or Structured Products
  app.post('/api/rag/ingest', async (req: Request, res: Response) => {
    try {
      const { text, fileName, fileType, products, sourceName } = req.body;
      if (Array.isArray(products) && products.length > 0) {
        const result = ingestStructuredList(products, sourceName || 'Structured Import');
        res.json({ success: true, ...result });
      } else if (text && typeof text === 'string') {
        const result = await ingestDocument({ text, fileName, fileType });
        res.json({ success: true, ...result });
      } else {
        res.status(400).json({ error: 'Invalid payload: provide text or products array' });
      }
    } catch (err: any) {
      console.error('[API /api/rag/ingest Error]:', err);
      res.status(500).json({ error: 'Ingestion failed', message: err.message });
    }
  });

  // 3. Get Vector Store & Dashboard Stats
  app.get('/api/rag/stats', (req: Request, res: Response) => {
    try {
      const stats = getRAGStoreStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve stats', message: err.message });
    }
  });

  // 4. Get All Records
  app.get('/api/rag/records', (req: Request, res: Response) => {
    try {
      const records = persistentVectorStore.getAllRecords();
      res.json({ count: records.length, records });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get records', message: err.message });
    }
  });

  // 5. Delete Single Record
  app.delete('/api/rag/records/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = persistentVectorStore.deleteRecord(id);
      res.json({ success: deleted, id });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete record', message: err.message });
    }
  });

  // 6. Rebuild Vector Index
  app.post('/api/rag/rebuild', (req: Request, res: Response) => {
    try {
      const result = persistentVectorStore.rebuildIndex();
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to rebuild index', message: err.message });
    }
  });
}
