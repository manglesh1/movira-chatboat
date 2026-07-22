# Staff Daily Operations Guide

## Purpose
This guide summarizes the daily flow for front desk, cashier, floor, and support staff. It focuses on safe operational checks: login, location, bookings, payments, waivers, tickets, check-in, POS, and customer questions.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Follow daily operating steps and troubleshoot common guest issues. |
| Cashier | Pair/login to POS, sell, redeem, and check in. |
| Manager | Coach staff and verify handoff steps. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Clock in | **Staff > Time Clock** | Route `/staff/time-clock`. |
| View schedule | **Staff > Staff Scheduling** | Route `/staff/scheduling`. |
| View bookings | **Command > Bookings** | Route `/bookings/all`. |
| Check availability | **Command > Calendar** | Route `/bookings`. |
| Search customers | **Guests > Customers** | Route `/customers`. |
| Use POS | **Cashier App > Login > Operate** | Paired device required. |

## Page Layout
- Start-of-day tools: time clock, schedule, team chat.
- Guest service tools: bookings, customers, waivers, tickets.
- Cashier tools: paired POS, catalog/cart, payments, redemption/check-in.
- Escalation tools: support tickets, manager override.

## Tabs
### Tab: Daily Checklist
#### Purpose
Keep staff actions consistent.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Location | Venue being operated. | Must match user and POS device. |
| Shift/time clock | Attendance state. | Exact status list not confirmed. |
| Booking status | Operational booking state. | Check with paymentStatus. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Clock in/out | Records attendance. | Use correct user/PIN. |
| Search booking/customer | Finds guest record. | Verify identity before changes. |
| Send waiver/payment link | Sends customer action link. | Confirm recipient. |

## Main Workflows
### Workflow: Start Shift
1. **Clock In:** Go to **Staff > Time Clock**.
2. **Check Location:** Confirm selected location and assigned schedule.
3. **Open Operational Tools:** Keep bookings, customers, and POS ready as role requires.
4. **Read Team Updates:** Check **Staff > Team Chat** if used by venue.

### Workflow: Guest Arrival
1. **Find Booking:** Search by booking number, name, email, or phone.
2. **Check Status:** Confirm booking status and paymentStatus.
3. **Check Waivers:** Confirm each required participant has valid coverage.
4. **Check In/Redeem:** Use booking check-in or cashier ticket scan.
5. **Resolve Exceptions:** Ask manager for refunds, overrides, over-capacity, or policy exceptions.

### Workflow: Take A Walk-Up Sale
1. **Use POS:** Login on paired cashier device.
2. **Select Items:** Use tiles from assigned POS preset.
3. **Collect Payment:** Use approved tender.
4. **Issue/Redeem Tickets:** Follow ticket status and waiver rules.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| bookingNumber | Helpful | Booking lookup code. | B-2026-0270 | Ask guest for confirmation email. |
| waiverStatus | Required for waiver activities | Active/expired/missing. | active | Check live record. |
| paymentStatus | Required before entry | unpaid/part-paid/paid. | paid | Do not assume from booking status. |
| ticketCode | Required for scan | Redeemable code. | AS-T-ABC234 | Validate before allowing use. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Check in | Booking/POS | Marks participant/ticket used. | Staff/cashier | Requires waiver/payment policy checks. |
| Apply promo | Checkout/POS | Applies code. | Staff | Manager override may be needed if blocked. |
| Refund | Payments | Starts refund. | Manager/admin | Staff should escalate. |
| Manager override | Cashier | Approves blocked action. | Manager | Requires manager PIN. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| unpaid | No captured payment. | Payment not taken | Collect payment or ask manager. |
| part-paid | Balance remains. | Deposit/partial/refund/edit | Collect balance. |
| waiver missing | No valid coverage. | Unsigned/expired waiver | Send/sign waiver. |
| already redeemed | Ticket used. | Previous scan | Do not honor without manager review. |

## Rules And Constraints
- Never override waiver, payment, or capacity rules without manager approval.
- Verify location context before changing bookings or taking POS actions.
- POS sign-out does not unpair terminal.
- Refunds and cancellations are separate.

## Common Questions
| Question | Answer |
| --- | --- |
| Guest says they paid but booking says unpaid. | Check Payments tab and ask manager before manually granting access. |
| Ticket says already redeemed. | Review redemption history and escalate; do not scan again. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Cannot see page | Permission issue | Role/menu access | Ask manager/admin. |
| Cannot login to POS | Location mismatch | Device location and user access | Use correct user/device or ask manager. |
| Customer missing waiver | Link not signed/expired | Waiver tab/holders | Send link and wait for completion. |

## Edge Cases
- Guest may have duplicate customer profiles.
- Payment webhook may lag after online checkout.
- Party bookings may have many inclusion tickets.
- Transferable stock tickets may not have a participant holder.

## Safe AI Guidance
MovieRa AI can guide staff through checks and escalation. It should not authorize entry, refunds, overrides, or legal waiver exceptions from documentation alone.

## Source Notes
- Confirmed: daily routes, payment/ticket/waiver/cashier rules.
- Not confirmed: venue-specific SOPs and exact time clock statuses.
- Needs product review: official staff opening/closing checklist.

