import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { openai } from '../../../lib/openai';
import { sopDocuments } from '../../../lib/rag/sop-data';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = [];

    // Clear existing SOPs
    await supabaseAdmin.from('sop_documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Process each SOP
    for (const sop of sopDocuments) {
      // Create embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${sop.title}\n\n${sop.content}`,
      });
      
      const embedding = embeddingResponse.data[0].embedding;

      // Insert into DB
      const { data, error } = await supabaseAdmin.from('sop_documents').insert({
        title: sop.title,
        content: sop.content,
        category: sop.category,
        embedding: embedding
      }).select();

      if (error) {
        console.error('Error inserting SOP:', error);
        results.push({ title: sop.title, status: 'error', error: error.message });
      } else {
        results.push({ title: sop.title, status: 'success' });
      }
    }

    return NextResponse.json({ message: 'Seeding complete', results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
