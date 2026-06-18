export async function getTickets(params: { status?: string; priority?: string; limit?: number }) {
  const limit = params.limit || 5;
  const statuses = params.status ? [params.status] : ['open', 'closed', 'pending'];
  const priorities = params.priority ? [params.priority] : ['high', 'medium', 'low'];
  
  const mockTickets = [];
  
  for (let i = 0; i < limit; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    let issue = '';
    if (priority === 'high') issue = 'System outage preventing login';
    else if (priority === 'medium') issue = 'Hardware replacement request for laptop';
    else issue = 'Access request for new software tool';
    
    mockTickets.push({
      id: `TKT-${1000 + Math.floor(Math.random() * 9000)}`,
      status,
      priority,
      issue,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      customer: `user_${Math.floor(Math.random() * 100)}@company.com`
    });
  }
  
  return mockTickets;
}
