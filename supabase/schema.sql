-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- SOP Knowledge Base (RAG source)
CREATE TABLE sop_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,  
  department TEXT,
  tags TEXT[],
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflow runs
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_input TEXT NOT NULL,
  status TEXT DEFAULT 'running' 
    CHECK (status IN ('running','completed','failed')),
  execution_plan JSONB,
  final_output TEXT,
  total_duration_ms INTEGER,
  sub_task_count INTEGER
);

-- Individual sub-task executions
CREATE TABLE task_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES workflow_runs(id),
  task_name TEXT NOT NULL,
  task_description TEXT,
  tool_used TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','running','completed','failed')),
  input_params JSONB,
  output_result JSONB,
  sop_context JSONB,
  confidence_score FLOAT,
  reasoning TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- MCP tool call log
CREATE TABLE mcp_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID,
  tool_name TEXT NOT NULL,
  params JSONB,
  result JSONB,
  execution_time_ms INTEGER,
  called_at TIMESTAMPTZ DEFAULT now()
);

-- Vector search function
CREATE OR REPLACE FUNCTION match_sops(
  query_embedding vector(1536),
  match_count INT DEFAULT 2,
  filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID, title TEXT, content TEXT, 
  category TEXT, similarity FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT id, title, content, category,
    1 - (embedding <=> query_embedding) AS similarity
  FROM sop_documents
  WHERE filter_category IS NULL 
     OR category = filter_category
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
