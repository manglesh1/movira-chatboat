# Bookings Management

## Purpose
Bookings Management is where staff and managers view, create, edit, cancel, check payment state, inspect tickets, manage waivers, and review order history. A booking has separate business and payment states, so staff must check both before making decisions.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Search bookings, check guests in, send waivers/payment links, answer customer questions. |
| Manager | Edit, cancel, refund-review, assign staff, and resolve exceptions. |
| Admin | Troubleshoot booking lifecycle and configuration issues. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| View bookings list | **Command > Bookings** | Route `/bookings/all`. |
| View booking calendar/availability | **Command > Calendar** | Route `/bookings`. |
| Open booking details | **Command > Bookings > Booking Details** | Exact URL uses booking ID. |
| Open booking payments | **Command > Bookings > Booking Details > Payments** | Tab confirmed by component. |
| Open booking tickets | **Command > Bookings > Booking Details > Tickets** | Tab confirmed by component. |
| Open booking waivers | **Command > Bookings > Booking Details > Waivers** | Tab confirmed by component. |

## Page Layout
- Bookings list/calendar: search and select bookings.
- Booking header: booking number, guest, status, payment summary, date/time summary.
- Details tabs: customer details, payments, tickets, waivers, staff, history, and booking items. Exact tab labels can vary.

## Tabs
### Tab: Customer Details
#### Purpose
Shows guest/contact and participant information.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Guest | Primary customer. | May match existing customer by email/phone. |
| Participants | People attached to booking. | Used for check-in and waiver coverage. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Edit details | Updates customer/participant info. | Exact behavior not confirmed. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Waiver missing | Participant lacks valid waiver. | Send waiver link before check-in. |

### Tab: Payments
#### Purpose
Shows payment transactions, balance, refunds, and payment actions.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| paymentStatus | Money state: `unpaid`, `part-paid`, `paid`. | Independent from booking status. |
| Balance | Amount still due. | Recomputed from transactions/refunds. |
| Transaction | Money event. | Provider/local tender depends on route. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Take payment | Records or starts payment. | Tender/provider-dependent. |
| Refund | Starts refund flow. | Requires manager/admin review. |

### Tab: Tickets
#### Purpose
Shows redeemable entitlements minted from booking line items.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| ticketCode | Scannable ticket code. | Prefix like `AS-T-`. |
| status | Ticket lifecycle state. | issued, redeemed, voided, refunded, expired, etc. |
| redemptionCount | Times used. | Compared to max redemptions. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Mint/sync tickets | Repairs missing tickets. | Ticket sync errors do not roll back booking creation. |
| Regenerate codes | Rotates active ticket codes. | Manager action for misprints. |

### Tab: History
#### Purpose
Audit trail of booking changes.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Event type | What changed. | Examples: item_added, payment_verified, participant_checked_in. |
| Actor | Who caused change. | Exact actor display not confirmed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| View history | Reads audit entries. | Do not edit audit trail. |

## Main Workflows
### Workflow: Create Booking
1. **Search Availability:** Go to **Command > Calendar** and choose activity/date/time.
2. **Enter Guest/Participants:** Add customer and participant details.
3. **Confirm Pricing:** Review subtotal, discount, tax, total, and balance.
4. **Save:** MovieRa locks slots, checks capacity, creates booking/items/participants, and commits.

### Workflow: Cancel Booking
1. **Open Booking:** Go to **Command > Bookings > Booking Details**.
2. **Cancel:** Use cancel action if permitted.
3. **Review Money:** Cancellation does not automatically refund; process refunds separately.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| status | System | Business state. | pending, confirmed, part-paid, cancelled | Separate from paymentStatus. |
| paymentStatus | System | Money state. | unpaid, part-paid, paid | Driven by transactions. |
| bookingNumber | System | Human-readable booking identifier. | B-2026-0270 | Use for customer lookup. |
| totalAmount/balance | System | Amount due/remaining. | 120.00 / 40.00 | Recomputed as payments arrive. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Edit booking | Booking details | Adds/removes/changes line items. | Manager/staff with access | Capacity and payment totals recalc. |
| Cancel booking | Booking details | Cancels and releases capacity. | Manager/staff with access | Does not auto-refund. |
| Send payment link | Payments | Sends hosted payment link. | Staff/manager | Payment provider-dependent. |
| Send waiver link | Waivers | Sends customer waiver URL. | Staff/manager | Token is pending until submitted. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| pending | Booking created but not fully finalized. | Payment pending | Check payment. |
| confirmed | Booking is operationally active. | Booking creation success | Prepare for visit. |
| cancelled | Booking cancelled. | Staff/manager cancellation | Do not check in; review refunds. |
| unpaid | No captured payment. | Payment not taken | Collect payment. |
| part-paid | Some balance remains. | Deposit/partial payment/refund/edit | Collect remaining balance. |
| paid | Fully paid. | Captured payments cover total | Normal. |

## Rules And Constraints
- Capacity is locked and decremented during create/edit.
- Editing a cancelled booking is rejected.
- Cancellation releases capacity but preserves audit trail.
- Payment status is driven by PaymentTransaction sums and refunds.
- All mutations should write order history.

## Common Questions
| Question | Answer |
| --- | --- |
| Why is booking confirmed but unpaid? | Business status and payment status are separate; payment may be pending or due later. |
| Does cancelling refund automatically? | No. Refunds are separate payment actions. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Cannot edit booking | Cancelled status or capacity conflict | Booking status and slots | Use active booking or alternate time. |
| Balance looks wrong | Payment/refund/edit changed totals | Payment tab and history | Recompute/review transactions. |
| Tickets missing | Ticket sync failed after save | Tickets tab | Use sync/mint action if available. |

## Edge Cases
- Editing a paid booking to a higher total can change paymentStatus to part-paid.
- Simultaneous last-slot bookings serialize; one may fail capacity check.
- Redeemed tickets are not voided when a booking quantity is reduced.

## Safe AI Guidance
MovieRa AI can explain booking status meanings and workflows. It should not cancel, refund, or confirm live booking details from docs alone. Live booking state requires checking MovieRa.

## Source Notes
- Confirmed: booking lifecycle, statuses, audit events, tabs/components.
- Not confirmed: every booking-detail UI label.
- Needs product review: cancellation policy copy for staff.

