# AI Operations Copilot

An enterprise-grade AI Operations Copilot demonstrating an autonomous multi-agent workflow orchestration system, RAG-based knowledge retrieval, and MCP (Model Context Protocol) tool execution.

## Features

- **Autonomous Agent Workflow**: A Planner agent breaks down user tasks into sub-tasks, Executor agents perform them using appropriate tools and SOPs, and a Synthesizer agent compiles the final output.
- **RAG Knowledge Base**: Uses Supabase pgvector to retrieve relevant Standard Operating Procedures (SOPs) based on task embeddings.
- **Model Context Protocol (MCP)**: Implements the MCP architecture to expose standard operational tools (e.g., querying tickets, scheduling meetings, drafting emails) to the agents.
- **Live Execution Trace**: Streams the agent's thought process, tool calls, and results in real-time to the frontend via Server-Sent Events (SSE).
- **History Panel**: View past executions and their outputs.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Server-Sent Events)
- **AI**: OpenAI API (gpt-4o, text-embedding-3-small)
- **Database**: Supabase PostgreSQL with `pgvector`
- **Styling**: Tailwind CSS with Typography plugin

## Setup Instructions

### 1. Database Setup
1. Create a new project in [Supabase](https://supabase.com/).
2. Run the SQL schema found in `supabase/schema.sql` in your Supabase SQL editor to create the necessary tables and the `match_sops` vector search function.

### 2. Environment Variables
Create a `.env.local` file in the root of the project with the following:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SEED_SECRET=super_secret_string_for_seeding
```

### 3. Installation
Install the dependencies:

```bash
npm install
```

### 4. Seed the Knowledge Base
To seed the 15 SOPs into your Supabase vector database, start the dev server and hit the seed endpoint:

```bash
npm run dev
# In another terminal or browser:
curl "http://localhost:3000/api/seed?secret=super_secret_string_for_seeding"
```

### 5. Run the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Demo Flow

1. Click on one of the **Example Chips** on the main dashboard (e.g., "Triage all open support tickets by priority and assign teams").
2. Press **Enter** or the **Send** button.
3. Watch the **Live Execution Trace** panel on the right. You will see:
   - The Planner generating sub-tasks.
   - The RAG system fetching relevant SOPs.
   - The Executors running mocked tool calls and providing reasoning.
   - The Synthesizer drafting the final executive summary.
4. The final summary will appear beautifully formatted in the center panel.
5. All runs are saved to Supabase and can be reviewed in the **History Panel** on the left.

## Architecture

\`\`\`
User Request ──► Planner Agent (gpt-4o) ──► Execution Plan (Sub-tasks)
                                                    │
                                                    ▼
SOP Vector DB ◄── RAG Retrieval ◄── Executor Agent (gpt-4o) ──► MCP Tool Call
                                                    │
                                                    ▼
UI (SSE Stream) ◄── Synthesizer Agent ◄── Tool Results & Reasoning
\`\`\`
