export async function draftEmail(params: { to: string; subject: string; context: string; tone: string }) {
  // Mock drafted email
  let body = '';
  
  if (params.tone === 'professional') {
    body = `Dear ${params.to},\n\nI hope this email finds you well.\n\n${params.context}\n\nBest regards,\n[Your Name]`;
  } else if (params.tone === 'urgent') {
    body = `URGENT: ${params.to},\n\nPlease review the following immediately:\n\n${params.context}\n\nThanks,\n[Your Name]`;
  } else {
    body = `Hi ${params.to},\n\n${params.context}\n\nThanks,\n[Your Name]`;
  }
  
  return {
    subject: params.subject,
    body,
    suggested_send_time: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
  };
}
