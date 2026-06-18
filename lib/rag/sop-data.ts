export const sopDocuments = [
  {
    title: 'SOP-001: Ticket Triage and Priority Classification Rules',
    category: 'ticket_management',
    content: `All incoming support tickets must be triaged within 15 minutes of receipt. 
1. Critical Priority (P1): Complete system outages, security breaches, or issues affecting >50 users. 
2. High Priority (P2): Significant performance degradation, executive access issues, or issues affecting 10-50 users. 
3. Medium Priority (P3): Individual software issues, hardware replacement requests, or non-critical access requests. 
4. Low Priority (P4): General inquiries, feature requests, or long-term project support. 
Assign tickets using the automated classification tool. If the tool fails, assign manually to the L1 support queue.`
  },
  {
    title: 'SOP-002: SLA Response Time Requirements by Tier',
    category: 'ticket_management',
    content: `Service Level Agreement (SLA) response and resolution times:
- P1 (Critical): 15-minute initial response, 2-hour resolution target. 24/7 coverage.
- P2 (High): 1-hour initial response, 8-hour resolution target. Business hours only.
- P3 (Medium): 4-hour initial response, 48-hour resolution target.
- P4 (Low): 24-hour initial response, 5-day resolution target.
Failure to meet initial response SLA requires an automatic notification to the Shift Manager. Resolution SLA breaches require a formal incident report.`
  },
  {
    title: 'SOP-003: Escalation Procedures for Critical Incidents',
    category: 'ticket_management',
    content: `When a P1 Critical Incident is identified:
1. Create a dedicated incident bridge (Zoom/Teams).
2. Notify the On-Call Engineering Lead and IT Director via PagerDuty.
3. Update the internal status page with an "Investigating" notice.
4. L2 support must join the bridge within 10 minutes. 
5. Send hourly updates to executive stakeholders until the incident is resolved.
6. Post-incident, a Root Cause Analysis (RCA) must be completed within 48 hours.`
  },
  {
    title: 'SOP-004: Hardware Inventory Reorder Thresholds and Process',
    category: 'inventory',
    content: `Inventory levels must be checked weekly. 
Reorder points:
- Laptops (MacBook/ThinkPad): Reorder when stock falls below 5 units. Lead time is 1-2 weeks.
- Monitors (27"): Reorder when stock falls below 10 units.
- Peripherals (Mice/Keyboards/Headsets): Reorder when stock falls below 20 units.
To reorder, draft an email to the approved supplier (CDW or Apple Business) referencing the standard company PO number. Send to the IT Procurement Manager for approval.`
  },
  {
    title: 'SOP-005: Software License Management and Allocation',
    category: 'inventory',
    content: `Software licenses are managed via the central IT portal.
- Standard tools (Office 365, Slack, Zoom) are automatically provisioned upon onboarding.
- Specialized tools (Adobe CC, AutoCAD, JetBrains) require manager approval.
- Before purchasing new licenses, check the pool of inactive licenses. Accounts inactive for >60 days should be reclaimed.
- Annual audits are conducted every Q4. All department heads must verify their team's required software.`
  },
  {
    title: 'SOP-006: New Employee IT Onboarding Checklist',
    category: 'hr',
    content: `IT Onboarding must be completed 2 business days before the employee's start date:
1. Create Active Directory/Google Workspace account.
2. Provision standard hardware (Laptop, Monitor, Peripherals).
3. Image laptop with standard OS build and security software (CrowdStrike, VPN).
4. Assign standard software licenses based on role.
5. Send welcome email to personal address with first-day login instructions and temporary password.
6. Schedule a 15-minute IT orientation on Day 1.`
  },
  {
    title: 'SOP-007: VPN Access Request and Approval Workflow',
    category: 'compliance',
    content: `Remote access via VPN is restricted and must be explicitly requested.
1. User submits a request via the IT portal outlining the business justification.
2. Request is routed to the user's direct manager for approval.
3. Upon manager approval, IT Security verifies the user's device meets security posture requirements (MDM enrolled, Antivirus active).
4. VPN profile is pushed to the device via MDM.
5. Access is granted for a maximum of 1 year, requiring annual renewal.`
  },
  {
    title: 'SOP-008: Data Breach Response Protocol',
    category: 'compliance',
    content: `In the event of a suspected data breach:
1. Immediately isolate the affected systems (disconnect from network, do NOT power down).
2. Contact the CISO and Legal Department.
3. Form the Incident Response Team (IRT).
4. Assess the scope of the breach and types of data exposed (PII, PHI, IP).
5. If PII/PHI is involved, Legal will dictate the timeline for regulatory notification (e.g., 72 hours for GDPR).
6. Preserve all logs for forensic analysis.`
  },
  {
    title: 'SOP-009: Monthly Operational Reporting Standards',
    category: 'reporting',
    content: `The Monthly IT Operations Report is due on the 5th business day of the following month.
The report must include:
- Executive Summary of major incidents and achievements.
- Ticket volume metrics (Opened, Closed, Backlog).
- SLA compliance rates (Initial Response and Resolution).
- System uptime percentages.
- Upcoming maintenance windows or project milestones.
The report should be generated using the standard template and emailed to the executive team.`
  },
  {
    title: 'SOP-010: Vendor Communication Guidelines and Templates',
    category: 'communications',
    content: `When communicating with vendors regarding outages or SLAs:
- Maintain a professional and objective tone.
- Always include the internal Ticket ID and the Vendor's Case ID.
- Clearly state the business impact and current urgency.
- Standard Follow-up Template: "Hello [Vendor Contact], We are checking the status of Case [ID]. This issue is currently impacting [Number] users and preventing [Business Function]. Please provide an update or ETA for resolution."`
  },
  {
    title: 'SOP-011: Meeting Scheduling Best Practices',
    category: 'communications',
    content: `To ensure efficient meetings:
- Always include an agenda in the calendar invite.
- Default meeting duration should be 25 or 50 minutes to allow transition time.
- Check attendees' calendars for availability before proposing times. Use the scheduling tool to find optimal slots.
- Clearly identify mandatory vs. optional attendees.
- If proposing new times to an external party, always offer at least 3 distinct options.`
  },
  {
    title: 'SOP-012: Email Communication Tone Guidelines',
    category: 'communications',
    content: `All IT communications must adhere to company standards:
- Professional: Clear, concise, polite. Use for standard requests and external communications.
- Urgent/Critical: Direct, highlighting the action required. Use for security alerts or P1 incidents.
- Friendly: Empathetic and helpful. Use for general user support and onboarding.
Avoid technical jargon when speaking to non-technical users. Always include a signature with contact information.`
  },
  {
    title: 'SOP-013: Support Ticket Assignment Matrix by Category',
    category: 'ticket_management',
    content: `Ticket Routing Matrix:
- Hardware Issues -> IT Support (Deskside)
- Network/Wi-Fi -> Network Engineering
- Software Access/Login -> IT Support (Helpdesk)
- HR Systems (Workday) -> HRIS Team
- Financial Systems (NetSuite) -> Finance IT
- Custom Application Bugs -> Engineering (Triage Queue)
Use the automated classification tool to pre-sort based on description keywords.`
  },
  {
    title: 'SOP-014: Performance Review Scheduling Procedures',
    category: 'hr',
    content: `Annual performance reviews occur in November.
- HR will notify managers of their required review list.
- Managers must schedule a 1-hour 1:1 meeting with each direct report.
- The meeting purpose should be clearly stated as "Annual Performance Review - [Employee Name]".
- Meetings should be scheduled at least 2 weeks in advance to allow for self-evaluation completion.
- Automated scheduling tools can be used to batch-schedule these meetings.`
  },
  {
    title: 'SOP-015: Compliance Audit Documentation Requirements',
    category: 'compliance',
    content: `For SOC2 and ISO27001 audits, the following documentation must be readily available:
- Onboarding and Offboarding records (demonstrating access was granted/revoked promptly).
- List of active users and their permission levels in critical systems.
- Evidence of annual security awareness training completion.
- Incident response logs and completed RCAs.
- Change management approvals for all production deployments.
Ensure all records are stored in the secure compliance repository.`
  }
];
