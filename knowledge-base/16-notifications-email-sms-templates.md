# Notifications, Email, SMS, And Templates

## Purpose
Notifications cover transactional messages, CRM marketing, templates, event bindings, waiver links, payment links, confirmations, tickets, and reminders. Email delivery is owned by the CRM service for many flows, while the admin/backend publishes events and sends some operational messages.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Trigger or resend customer communications such as waivers/payment links. |
| Manager | Review templates, marketing campaigns, and notification failures. |
| Admin | Configure CRM settings, provider domains, templates, and event bindings. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| CRM overview | **CRM > Overview** | Route `/crm`. |
| CRM marketing | **CRM > Marketing** | Route `/crm/marketing`. |
| Marketing calendar | **CRM > Marketing Calendar** | Route `/crm/marketing-calendar`. |
| CRM automation | **CRM > Automation** | Route `/crm/automation`. |
| CRM settings | **CRM > Settings** | Route `/crm/settings`. |
| Notification events | **CRM > Notification Events** | Component key `crm_notifications`; exact menu route not confirmed. |

## Page Layout
- CRM overview: operational summary. Exact cards not confirmed.
- Marketing/templates: template builder, campaigns, trigger links, calendar.
- Settings: email channel/provider/domain configuration.
- Notification bindings: maps application events to templates. Exact UI not fully confirmed.

## Tabs
### Tab: Email Settings
#### Purpose
Configure sending domains/providers and channel status.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Provider | Email provider. | SES/provider services exist. |
| Domain | Sending domain. | Verification status likely shown. Exact behavior not confirmed. |
| Reply/forward settings | Inbound handling. | CRM email settings module exists. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save settings | Updates email configuration. | Admin only. |
| Verify/test | Tests provider/domain if available. | Exact action not confirmed. |

### Tab: Templates
#### Purpose
Create and maintain reusable email content.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Template name | Internal label. | Used by campaigns/events. |
| Subject/body | Email content. | Builder components exist. |
| Revision | Saved version. | Marketing template revisions exist. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Create template | Adds template. | Review before sending. |
| Send/test | Sends test if available. | Exact behavior not confirmed. |

## Main Workflows
### Workflow: Send Operational Link
1. **Open Booking/Customer:** Find the relevant customer or booking.
2. **Trigger Message:** Use Send Waiver Link, Send Payment Link, or confirmation resend if available.
3. **Check Status:** Review booking/payment/waiver state; delivery tracking may be in CRM. Exact behavior not confirmed.

### Workflow: Configure Notification Template
1. **Open CRM Settings/Templates:** Go to **CRM > Settings** or **CRM > Marketing**.
2. **Create/Edit Template:** Update subject/body and allowed variables.
3. **Bind Event:** Use notification bindings if available.
4. **Test:** Send test or trigger safe test event before enabling broadly.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| templateId | System | Template identifier. | 12 | CRM-owned in many flows. |
| event key | Conditional | App event that triggers template. | booking_confirmation | Exact list in CRM docs. |
| recipient | Yes | Destination contact. | customer email | Must be valid and consent-compliant. |
| idempotency key | Conditional | Prevent duplicate sends. | booking-270-confirmation | Used by crmNotify conventions. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Send waiver link | Booking/customer | Sends/copies waiver URL. | Staff | Legal-sensitive. |
| Send payment link | Booking payments | Creates hosted payment link and message. | Staff/manager | Payment state async. |
| Save template | CRM/template UI | Persists template. | Manager/admin | Review variables. |
| Send campaign | CRM marketing | Sends marketing email. | Manager/admin | Consent/suppression rules apply. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| queued | Message waiting to send. | Worker/backlog | Monitor. |
| sent | Provider accepted send. | Normal | No action. |
| failed | Send failed. | Provider/domain/template issue | Review CRM failures. |
| suppressed | Recipient should not receive. | Unsubscribe/bounce/suppression | Do not bypass. |

## Rules And Constraints
- Transactional and marketing messages may have different consent rules.
- CRM owns much of the email pipeline.
- Failed email does not necessarily mean booking/payment/waiver action failed.
- Do not expose provider secrets or send to suppressed contacts.

## Common Questions
| Question | Answer |
| --- | --- |
| Customer did not get waiver email. What now? | Check waiver link status and email delivery/failure; copy link if policy allows. |
| Can I edit a confirmation template? | Use CRM/template settings if permitted and test before broad use. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Email not delivered | Domain/provider/recipient issue | CRM message status, provider config | Fix configuration or resend. |
| Wrong template sent | Event binding mismatch | Notification bindings | Correct binding and test. |
| SMS not available | SMS behavior not confirmed | CRM/settings | Product review required. |

## Edge Cases
- Message may be queued even if customer action has completed.
- Re-sending a completed waiver creates/reuses behavior based on signature status.
- Marketing suppressions should not be bypassed.

## Safe AI Guidance
MovieRa AI can explain notification concepts and safe checks. It should not write legal/marketing claims, bypass unsubscribe/suppression, or claim delivery without live CRM status.

## Source Notes
- Confirmed: CRM routes, template modules, crmNotify docs, email settings modules.
- Not confirmed: SMS implementation and every event binding.
- Needs product review: approved customer communication policies.

