import { matchSOPs } from '../../rag/retrieve';

export async function searchKnowledgeBase(params: { query: string; category?: string }) {
  const matches = await matchSOPs(params.query, 3, params.category);
  
  return matches.map(match => ({
    title: match.title,
    excerpt: match.content.substring(0, 200) + '...',
    relevance_score: match.similarity
  }));
}
