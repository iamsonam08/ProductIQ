import { RAGContextItem, StructuredProductData } from '../types';
import { ReferenceProduct } from '../data/referenceCatalog';

export function retrieveRAGContext(
  inputText: string,
  catalog: ReferenceProduct[],
  topK: number = 3,
  minSimilarityThreshold: number = 35
): RAGContextItem[] {
  if (!inputText || inputText.trim().length === 0) {
    return [];
  }

  const normalizedInput = inputText.toLowerCase();
  
  // Extract key terms (words > 1 char, ignoring common stop words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'with', 'in', 'on', 'at', 'to', 'from', 'of', 'is', 'it', 'this', 'that', 'what', 'show', 'tell', 'me']);
  const inputTokens = normalizedInput
    .replace(/[^a-z0-9\s/"-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !stopWords.has(t));

  const scoredResults = catalog.map(item => {
    let matchCount = 0;
    const matchedTerms: string[] = [];

    // Check keyword list
    item.descriptionKeywords.forEach(kw => {
      if (normalizedInput.includes(kw.toLowerCase())) {
        matchCount += 2.5;
        matchedTerms.push(kw);
      }
    });

    // Check individual attribute token overlaps
    const attrTokens = [
      ...item.name.toLowerCase().split(/\s+/),
      ...item.category.toLowerCase().split(/\s+/),
      ...item.material.toLowerCase().split(/\s+/),
      ...item.size.toLowerCase().split(/\s+/),
      ...item.pressure.toLowerCase().split(/\s+/),
      ...item.spec.toLowerCase().split(/\s+/)
    ];

    inputTokens.forEach(token => {
      if (attrTokens.includes(token)) {
        matchCount += 1.0;
        if (!matchedTerms.includes(token)) {
          matchedTerms.push(token);
        }
      }
    });

    // If no specific domain terms matched at all, similarity is 0
    if (matchCount === 0 || matchedTerms.length === 0) {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        material: item.material,
        size: item.size,
        pressure: item.pressure,
        spec: item.spec,
        similarityScore: 0,
        matchReason: 'No matching domain signals'
      };
    }

    // Calculate normalized 0-100 score
    const totalPossible = Math.max(item.descriptionKeywords.length * 2.5, 10);
    let similarityScore = Math.min(100, Math.round((matchCount / totalPossible) * 100));

    // Boost score if category matches directly
    const catLower = item.category.toLowerCase();
    if (normalizedInput.includes(catLower) || (catLower.includes('valve') && normalizedInput.includes('valve'))) {
      similarityScore = Math.min(100, similarityScore + 15);
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      material: item.material,
      size: item.size,
      pressure: item.pressure,
      spec: item.spec,
      similarityScore,
      matchReason: `Matched domain signals: ${matchedTerms.slice(0, 4).join(', ')}`
    };
  });

  // Filter out any item below the minimum similarity threshold
  const passingResults = scoredResults.filter(item => item.similarityScore >= minSimilarityThreshold);

  // Sort descending by similarity score
  passingResults.sort((a, b) => b.similarityScore - a.similarityScore);

  // Return top K passing items or empty array
  return passingResults.slice(0, topK);
}
