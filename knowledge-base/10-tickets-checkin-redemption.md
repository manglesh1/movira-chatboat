# Tickets, Check-In, And Redemption

## Purpose
Tickets are redeemable entitlements minted from booking line items. Check-in and redemption use tickets to prove who used what, when, where, and by which staff member or terminal. This module is central for front desk, cashier, wristbands, waivers, and utilization reports.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Scan tickets, check in guests, bind holders, print/use wristbands. |
| Cashier | Redeem tickets and POS entitlements at a paired terminal. |
| Manager | Void/regenerate tickets and review redemption issues. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| View booking tickets | **Command > Bookings > Booking Details > Tickets** | Admin ticket tab. |
| Use cashier app | **Cashier App > Login > Operate** | Standalone cashier flow. |
| Manage ticket holders | **Connected Apps > Ticket Holders** | Route `/pos`; likely POS tab. |
| Manage wristbands | **Admin > Wristbands** | Route `/wristbands`. |

## Page Layout
- Booking Tickets tab: one row per ticket/entitlement with status and code.
- Cashier scan view: lookup ticket code, validate, bind holder if needed, redeem.
- Check-in view: bulk check in booking participants/tickets.
- Redemption history: immutable redemption event rows.

## Tabs
### Tab: Tickets
#### Purpose
View entitlements tied to booking items.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| ticketCode | Scannable ticket code. | Generated unique code. |
| productType | What ticket redeems for. | session_pass, add_on, stock_item, party_inclusion, wristband. |
| participantId | Bound holder if applicable. | Null for transferable items. |
| status | Ticket lifecycle state. | See statuses below. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Redeem | Consumes ticket. | Blocks if waiver/status/time invalid. |
| Bind holder | Assigns participant. | Refuses redeemed tickets. |
| Void | Manager voids ticket. | Requires reason/override rules. |

### Tab: Check-In
#### Purpose
Mark participants/tickets as arrived or used.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Participant | Person being checked in. | May require waiver. |
| Waiver state | Whether valid waiver coverage exists. | Missing waiver blocks required activities. |
| Terminal/device | Where check-in happened. | Cashier stamps device name/id. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Check in all | Bulk-redeems/checks eligible tickets. | Writes audit rows. |
| Undo check-in | Reverses check-in. | Exact behavior not confirmed. |

## Main Workflows
### Workflow: Scan And Redeem Ticket
1. **Open Cashier:** Use a paired terminal and logged-in staff account.
2. **Scan Code:** Lookup ticket by QR/code.
3. **Resolve Blocks:** If waiver, expiry, or already-used block appears, follow staff policy.
4. **Redeem:** MovieRa writes TicketRedemption with staff, terminal, time, and zone.

### Workflow: Repair Missing Tickets
1. **Open Booking Tickets:** Go to **Command > Bookings > Booking Details > Tickets**.
2. **Sync/Mint Tickets:** Use manager repair action if available.
3. **Verify Counts:** Compare expected tickets with booking line items.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| ticketId | System | Ticket row ID. | 501 | Internal. |
| ticketCode | System | Scan target. | AS-T-ABC234 | Unique. |
| redemptionMode | System/config | How often it can be used. | single, multi, time_window, daily | Defaults by product type. |
| maxRedemptions | System/config | Redemption limit. | 1 | Multi tickets may be higher. |
| validFrom/validUntil | Conditional | Time window. | Slot start/end | Used for scheduled tickets. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Redeem | Cashier/admin ticket UI | Adds redemption event. | Staff/cashier | Blocked by state machine if invalid. |
| Bind | Cashier ticket lookup | Connects participant to ticket. | Staff/cashier | Idempotent for same participant. |
| Void | Ticket admin | Voids unused/approved ticket. | Manager | Redeemed ticket void rules require override. |
| Regenerate Codes | Booking Tickets tab | Rotates active codes. | Manager | Use for misprinted/lost codes. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| issued | Ticket available. | Booking/payment finalized or ticket minted. | Redeem when guest arrives. |
| redeemed | Fully used. | Successful redemption. | Do not redeem again. |
| partially_redeemed | Multi-use ticket partly consumed. | Multi/daily mode. | Check remaining uses. |
| voided | Ticket cancelled. | Booking reduction/manager void. | Do not honor. |
| refunded | Ticket refunded. | Refund workflow. | Do not honor. |
| expired | Valid window passed. | Late scan. | Manager review if exception requested. |

## Rules And Constraints
- TicketRedemption rows are immutable audit events.
- Ticket redemption blocks for not found, already redeemed, not yet valid, expired, voided, refunded, and missing waiver.
- Ticket sync voids only unredeemed excess tickets during booking reductions.
- Cashier device stamps terminalDeviceId and gateOrZone on redemptions.

## Common Questions
| Question | Answer |
| --- | --- |
| Why can I not redeem this ticket? | Check ticket status, time window, redemption count, and waiver requirements. |
| Can I reprint or regenerate a code? | Managers can regenerate active codes from booking tickets if the action is available. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Already redeemed | Ticket reached max redemptions | Redemption history | Manager review; do not bypass casually. |
| Requires waiver | Covered participant lacks valid waiver | Waiver tab/holders | Send/sign waiver. |
| Not found | Bad scan/code | Ticket code and booking | Search booking and regenerate if needed. |

## Edge Cases
- Transferable items may have no participantId.
- Legacy unmappable line items may skip ticket creation.
- Expiry may be evaluated lazily at redeem endpoint.
- Bulk check-in can redeem all eligible bound tickets.

## Safe AI Guidance
MovieRa AI can explain ticket statuses, blocks, and safe checks. It should not authorize entry, override a redemption block, or claim a waiver exists without checking live data.

## Source Notes
- Confirmed: ticket schema, state machine, endpoints, block reasons, cashier stamping.
- Not confirmed: exact admin ticket tab labels.
- Needs product review: manager override policy for expired/already redeemed tickets.

