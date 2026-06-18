export async function getSlaStatus(params: { team?: string; date_range?: string }) {
  // Mock SLA status
  return {
    compliant: 145,
    breached: 12,
    at_risk: 24,
    details: [
      { ticket_id: 'TKT-1045', status: 'breached', time_over_sla: '2h 15m' },
      { ticket_id: 'TKT-2993', status: 'at_risk', time_remaining: '45m' },
      { ticket_id: 'TKT-8441', status: 'at_risk', time_remaining: '1h 10m' }
    ]
  };
}
