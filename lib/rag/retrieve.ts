import { supabaseAdmin } from '../supabase';
import { openai } from '../openai';
import { SOPMatch } from '../types';

export async function matchSOPs(query: string, matchCount = 2, category?: string): Promise<SOPMatch[]> {
  // Generate embedding for the query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  
  const embedding = embeddingResponse.data[0].embedding;
  
  // Call the Supabase pgvector function
  const { data, error } = await supabaseAdmin.rpc('match_sops', {
    query_embedding: embedding,
    match_count: matchCount,
    filter_category: category || null
  });
  
  if (error) {
    console.error('Error matching SOPs:', error);
    return [];
  }
  
  return data || [];
}
