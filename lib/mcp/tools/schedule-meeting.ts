export async function scheduleMeeting(params: { attendees: string[]; duration_minutes: number; purpose: string }) {
  // Mock schedule
  const slots = [
    new Date(Date.now() + 86400000).toISOString(),     // tomorrow
    new Date(Date.now() + 86400000 + 3600000).toISOString(), // tomorrow + 1 hr
    new Date(Date.now() + 172800000).toISOString(),    // day after tomorrow
  ];
  
  return {
    proposed_slots: slots,
    calendar_link: 'https://calendar.internal.company.com/book/auto-generated-id',
    invite_draft: `Meeting Purpose: ${params.duration_minutes}m to discuss ${params.purpose}\nAttendees: ${params.attendees.join(', ')}`
  };
}
