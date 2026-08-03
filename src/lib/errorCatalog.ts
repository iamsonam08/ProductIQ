import { AlertType } from '../components/common/EnterpriseAlert';

export interface CatalogErrorDetails {
  code: string;
  type: AlertType;
  title: string;
  message: string;
  solution: string[];
  nextActionLabel?: string;
}

export const ERROR_CATALOG: Record<string, CatalogErrorDetails> = {
  EMPTY_INPUT: {
    code: 'ERR_EMPTY_INPUT',
    type: 'validation',
    title: 'Empty Document Input',
    message: 'No text content or file payload was provided for processing.',
    solution: [
      'Upload a PDF, image, CSV, or text file',
      'Paste raw product technical specification text in the input box',
      'Select a sample preset scenario to test the pipeline'
    ],
    nextActionLabel: 'Select Preset'
  },

  RANDOM_TEXT: {
    code: 'ERR_RANDOM_TEXT',
    title: 'No Industrial Product Signals Detected',
    type: 'warning',
    message: 'The provided document text does not contain recognizable industrial engineering attributes (e.g., valve types, materials, pressure ratings, ASME specs).',
    solution: [
      'Ensure the input contains technical product specifications',
      'Example: "316 Stainless Steel Ball Valve 2 Inch Class 150 ANSI B16.34"',
      'Upload a technical datasheet or product catalog snippet'
    ],
    nextActionLabel: 'Load Valid Sample'
  },

  INVALID_PDF: {
    code: 'ERR_INVALID_PDF',
    title: 'Corrupted or Unreadable PDF Document',
    type: 'error',
    message: 'The uploaded PDF file could not be parsed. It may be corrupted, encrypted, or contain unsupported binary encodings.',
    solution: [
      'Ensure the PDF file is not password protected',
      'Re-export or save the document as a standard PDF 1.4+ file',
      'Try uploading an alternative image scan or raw text'
    ],
    nextActionLabel: 'Upload New File'
  },

  CORRUPTED_OCR: {
    code: 'ERR_CORRUPTED_OCR',
    title: 'Low-Quality Document OCR Scan',
    type: 'warning',
    message: 'OCR extraction completed, but the text was faint, distorted, or heavily pixelated.',
    solution: [
      'Upload a higher resolution document scan (300+ DPI recommended)',
      'Manually correct garbled extracted text in the raw text editor',
      'Re-scan document under clearer lighting'
    ],
    nextActionLabel: 'Edit Raw Text'
  },

  UNSUPPORTED_FILE: {
    code: 'ERR_UNSUPPORTED_FILE',
    title: 'Unsupported File Format',
    type: 'validation',
    message: 'The uploaded file format is not supported by the product intelligence pipeline.',
    solution: [
      'Supported document formats: PDF (.pdf), Images (.png, .jpg, .jpeg), Text (.txt)',
      'Supported batch data formats: Tabular CSV (.csv) or TSV (.tsv)',
      'Convert executable, archive, or office files into PDF or CSV'
    ],
    nextActionLabel: 'Select Supported File'
  },

  NETWORK_ERROR: {
    code: 'ERR_NETWORK_ERROR',
    title: 'Network Connection Interrupted',
    type: 'error',
    message: 'Unable to communicate with the ProductIQ server endpoint. Your connection may be offline or unstable.',
    solution: [
      'Check your local network or internet connection',
      'Ensure server process is active on port 3000',
      'Click Retry to re-send the API request'
    ],
    nextActionLabel: 'Retry Request'
  },

  GEMINI_API_FAILURE: {
    code: 'ERR_GEMINI_FAILURE',
    title: 'Gemini AI Intelligence Service Error',
    type: 'error',
    message: 'The Gemini 3.6 Flash model encountered a temporary API failure, rate limit, or timeout.',
    solution: [
      'Wait a few seconds for rate limits to reset',
      'Verify process.env.GEMINI_API_KEY configuration in server environment',
      'Click Retry to execute the extraction pass again'
    ],
    nextActionLabel: 'Retry Pipeline'
  },

  VECTOR_DB_UNAVAILABLE: {
    code: 'ERR_VECTOR_DB_OFFLINE',
    title: 'RAG Vector Store Service Unavailable',
    type: 'error',
    message: 'The persistent RAG vector store could not be reached or disk index structure was unreadable.',
    solution: [
      'Verify persistence file permissions or Firestore database status',
      'Use the RAG Store dashboard to test vector store connection',
      'Re-index products or re-connect the vector database'
    ],
    nextActionLabel: 'Check RAG Store'
  },

  NO_MATCHING_PRODUCTS: {
    code: 'ERR_NO_MATCHING_PRODUCTS',
    title: 'No Relevant Products Found',
    type: 'info',
    message: 'No catalog records matched your query above the required similarity threshold.',
    solution: [
      'Try broadening search terms or reducing spec constraints',
      'Verify spelling of technical terms (e.g. "316 SS", "Class 300")',
      'Index new products into the RAG Store database'
    ],
    nextActionLabel: 'Go to RAG Store'
  },

  LOW_CONFIDENCE: {
    code: 'ERR_LOW_CONFIDENCE',
    title: 'Low Confidence Field Extraction — Human Review Required',
    type: 'warning',
    message: 'One or more extracted fields fell below the 50% confidence threshold during dual-pass AI validation.',
    solution: [
      'Inspect highlighted amber fields below',
      'Use the Human-in-the-Loop editor to verify or correct values',
      'Click "Verify & Approve Record" once confirmed'
    ],
    nextActionLabel: 'Review Fields'
  }
};

export function parseErrorToCatalog(err: any): CatalogErrorDetails {
  const message = (err?.message || String(err || '')).toLowerCase();

  if (message.includes('fetch') || message.includes('network') || message.includes('failed to fetch') || message.includes('http 5')) {
    return ERROR_CATALOG.NETWORK_ERROR;
  }
  if (message.includes('gemini') || message.includes('quota') || message.includes('rate limit') || message.includes('api key')) {
    return ERROR_CATALOG.GEMINI_API_FAILURE;
  }
  if (message.includes('vector') || message.includes('rag') || message.includes('store')) {
    return ERROR_CATALOG.VECTOR_DB_UNAVAILABLE;
  }
  if (message.includes('pdf') || message.includes('corrupt')) {
    return ERROR_CATALOG.INVALID_PDF;
  }
  if (message.includes('file') || message.includes('extension') || message.includes('type')) {
    return ERROR_CATALOG.UNSUPPORTED_FILE;
  }

  return {
    code: 'ERR_PIPELINE_GENERIC',
    type: 'error',
    title: 'Pipeline Processing Exception',
    message: 'An unexpected processing issue occurred while executing the product intelligence pipeline.',
    solution: [
      'Check input document text and file format',
      'Click Retry to re-run the pipeline pass',
      'If the issue persists, review server logs in Admin Settings'
    ],
    nextActionLabel: 'Retry Pipeline'
  };
}
