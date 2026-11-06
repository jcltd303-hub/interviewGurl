export interface DocumentChunk {
  id: string;
  source: 'resume' | 'job_description';
  category: 'skills' | 'experience' | 'education' | 'requirement' | 'culture' | 'general';
  content: string;
  keywords: string[];
}

export interface RAGIndex {
  chunks: DocumentChunk[];
  indexedAt: number;
  role: string;
  company: string;
  totalTokensApprox: number;
}

/**
 * Splits resume and job description text into semantic paragraphs and extracts keywords for fast in-memory retrieval.
 */
export function chunkDocument(text: string, source: 'resume' | 'job_description'): DocumentChunk[] {
  if (!text || !text.trim()) return [];

  const rawBlocks = text
    .split(/\n\s*\n|(?<=\.)\s*\n(?=[A-Z0-9•\-\*])/)
    .map((b) => b.trim())
    .filter((b) => b.length > 25);

  return rawBlocks.map((block, index) => {
    const lower = block.toLowerCase();
    let category: DocumentChunk['category'] = 'general';

    if (source === 'resume') {
      if (lower.includes('skill') || lower.includes('proficient') || lower.includes('stack') || lower.includes('technologies')) {
        category = 'skills';
      } else if (lower.includes('experience') || lower.includes('engineer') || lower.includes('led') || lower.includes('developed') || lower.includes('built') || lower.includes('managed')) {
        category = 'experience';
      } else if (lower.includes('degree') || lower.includes('university') || lower.includes('bachelor') || lower.includes('master') || lower.includes('education')) {
        category = 'education';
      }
    } else {
      if (lower.includes('require') || lower.includes('must have') || lower.includes('qualif') || lower.includes('responsibilit')) {
        category = 'requirement';
      } else if (lower.includes('culture') || lower.includes('mission') || lower.includes('values') || lower.includes('team')) {
        category = 'culture';
      }
    }

    // Extract significant keywords (length >= 3, skipping stopwords)
    const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'have', 'from', 'they', 'will', 'been', 'would', 'about', 'there', 'their']);
    const words = lower
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    const uniqueKeywords = Array.from(new Set(words));

    return {
      id: `${source}-${index + 1}`,
      source,
      category,
      content: block,
      keywords: uniqueKeywords,
    };
  });
}

/**
 * Fast BM25-inspired lexical scoring to retrieve top relevant chunks in < 2ms,
 * ensuring sub-second response times for live interview assistance.
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 3
): { chunk: DocumentChunk; score: number }[] {
  if (!query || !query.trim() || chunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (queryTerms.length === 0) return [];

  const scored = chunks.map((chunk) => {
    let matchScore = 0;
    const chunkLower = chunk.content.toLowerCase();

    for (const term of queryTerms) {
      if (chunk.keywords.includes(term)) {
        matchScore += 3;
      } else if (chunkLower.includes(term)) {
        matchScore += 1.5;
      }
    }

    // Boost experience chunks when query sounds like a behavioral/past project question
    if (
      chunk.category === 'experience' &&
      (queryTerms.includes('time') || queryTerms.includes('project') || queryTerms.includes('led') || queryTerms.includes('experience') || queryTerms.includes('conflict'))
    ) {
      matchScore *= 1.4;
    }

    return { chunk, score: matchScore };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
