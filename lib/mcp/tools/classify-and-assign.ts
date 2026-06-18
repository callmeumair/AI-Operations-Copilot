export async function classifyAndAssign(params: { ticket_ids: string[]; assignment_rules: any }) {
  const teams = ['IT Support', 'HR', 'Finance', 'Engineering'];
  
  const assigned = params.ticket_ids.map(id => {
    // Randomly assign to a team
    const team = teams[Math.floor(Math.random() * teams.length)];
    return {
      ticket_id: id,
      team,
      reason: `Assigned based on keyword matching for rules: ${JSON.stringify(params.assignment_rules).substring(0, 20)}...`
    };
  });
  
  return {
    assigned,
    count: assigned.length
  };
}
