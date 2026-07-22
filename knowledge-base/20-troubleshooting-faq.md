# Troubleshooting And FAQ

## Purpose
This file collects common MovieRa operational issues and safe first checks across bookings, payments, tickets, waivers, schedules, POS, discounts, customers, reports, and permissions. It is designed for retrieval when staff ask short questions like “why can’t I redeem this ticket?” or “why are no slots showing?”

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Quickly diagnose common customer-facing problems. |
| Manager | Resolve exceptions and decide when to escalate. |
| Admin | Identify likely configuration issues. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Find booking | **Command > Bookings** | Route `/bookings/all`. |
| Check schedules | **Catalog > Activity Schedule** | Route `/session-planner`. |
| Check payments | **Command > Bookings > Booking Details > Payments** | Payment tab. |
| Check waivers | **Guests > Waiver Holders** or booking Waivers tab | Waiver state. |
| Check POS | **Connected Apps > Terminals** | Route `/pos`. |
| Check permissions | **Admin > Roles & Permissions** | Route `/list/roles-permissions`. |

## Page Layout
This is a reference FAQ, not a UI page.

## Tabs
### Tab: Common Issues
#### Purpose
Map symptoms to checks.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Issue | Staff-facing symptom. | Searchable phrasing. |
| Likely cause | First explanation. | Not always final. |
| Fix | Safe action. | Escalate where needed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Check live system | Opens relevant MovieRa module. | Documentation alone is not live truth. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Needs manager | Staff should not resolve alone. | Escalate. |

## Main Workflows
### Workflow: Triage Any Problem
1. **Identify Module:** Booking, payment, waiver, ticket, schedule, POS, discount, customer, report, or permissions.
2. **Check Live Record:** Open the relevant page and confirm current status.
3. **Check Dependencies:** Location, role, schedule, payment route, waiver coverage, or POS device.
4. **Escalate:** Refunds, overrides, legal waivers, and capacity changes need manager/admin review.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| status | Varies | Lifecycle state. | confirmed, cancelled, issued | Always module-specific. |
| location | Often | Venue context. | Downtown | Many issues are location-specific. |
| ID/code | Helpful | Lookup key. | bookingNumber, ticketCode | Ask customer for confirmation/code. |
| timestamp | Helpful | When event happened. | payment time | Useful for webhook/report mismatch. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Refresh/retry | Browser/app | Reloads latest data. | All users | Use before escalating stale data. |
| Resend link | Waiver/payment | Sends action link. | Staff | Confirm recipient. |
| Sync tickets | Booking Tickets | Repairs ticket mismatch. | Manager | Use carefully. |
| Override/refund | POS/payments | Resolves exception. | Manager/admin | Audited/high-risk. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Access denied | Role/location missing. | Permission setup | Ask admin/manager. |
| Failed payment | Provider/card issue. | Decline/config/webhook | Retry or check provider. |
| Missing waiver | No valid coverage. | Unsigned/expired | Send waiver link. |
| Sold out | Capacity full. | Existing bookings | Offer alternate slot. |

## Rules And Constraints
- Never assume payment, waiver, or capacity from customer screenshots alone.
- Live MovieRa status beats documentation.
- Refunds are not automatic on cancellation.
- Tickets already redeemed need manager review.
- Permissions must not be bypassed.

## Common Questions
| Question | Answer |
| --- | --- |
| Why are no slots showing? | Check store hours, schedule date rules, exceptions, variations/resources, generation status, and capacity. |
| Why can’t a cashier log in? | The user may not have access to the terminal’s paired location. |
| Why is booking confirmed but unpaid? | Booking status and paymentStatus are separate. Collect payment or verify transaction. |
| Why is a waiver not accepted? | The link may be pending/completed/expired, or coverage may not match the participant. |
| Why did a promo fail? | Code may be inactive, expired, over usage limit, wrong location/channel, or ineligible. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Customer paid, booking unpaid | Webhook/finalizer delay | Payment tab/provider events | Wait/reconcile/escalate. |
| Ticket already redeemed | Prior scan | Redemption history | Manager review. |
| No cashier menu item | Missing POS tile/template | Device template/preset | Add tile/refetch. |
| Report mismatch | Different filters/definitions | Date/location/tender/refund/tax | Align filters. |
| Customer duplicate | Multiple records | Email/phone/history | Manager review; merge behavior not confirmed. |

## Edge Cases
- Webhooks can arrive after browser success.
- Legacy provider routes may still serve some payments.
- Active bookings can block schedule deletion.
- Tenant-customized menus can change labels.

## Safe AI Guidance
MovieRa AI can offer diagnostic checklists and escalation advice. It should not claim final live status, approve exceptions, or provide legal/financial decisions.

## Source Notes
- Confirmed: cross-module failure modes from booking/payment/ticket/waiver/schedule/POS docs.
- Not confirmed: every venue policy.
- Needs product review: escalation scripts and support macros.

