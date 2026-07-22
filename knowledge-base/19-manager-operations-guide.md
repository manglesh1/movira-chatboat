# Manager Operations Guide

## Purpose
This guide gives managers a cross-module operating reference for setup, daily supervision, exceptions, and end-of-day review. Managers bridge staff actions with admin configuration across bookings, capacity, payments, POS, waivers, reports, discounts, and staffing.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Manager | Supervise daily operation, resolve exceptions, review reports, configure routine setup. |
| Admin | Support managers with sensitive settings and permissions. |
| Staff | Escalate manager-only actions. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Review bookings | **Command > Bookings** | Route `/bookings/all`. |
| Configure schedules | **Catalog > Activity Schedule** | Route `/session-planner`. |
| Configure POS | **Connected Apps > Terminals/POS Presets/POS Settings** | Route group `/pos`. |
| Review reports | **Reports** | Route `/reports`. |
| Manage staff | **Staff** | Staff section routes. |
| Manage roles/users | **Admin > Users/Roles & Permissions** | Admin routes. |

## Page Layout
- Operational monitoring: dashboard, bookings, calendar, support.
- Configuration: catalog, schedules, store hours, POS, discounts.
- People: staff scheduling, timesheets, time off, roles.
- Financial review: payment tabs, tip reports, reports.

## Tabs
### Tab: Exception Queue
#### Purpose
Guide common manager decisions.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Exception | Issue needing approval. | Refund, waiver, sold out, redeemed ticket. |
| Source | Module where issue appears. | Booking/POS/payment/report. |
| Risk | Operational, financial, legal, or access risk. | Use policy. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Approve override | Lets blocked POS action continue. | Uses manager PIN audit. |
| Process refund | Returns money. | Confirm transaction and policy. |
| Adjust schedule/capacity | Changes availability. | Check active bookings first. |

## Main Workflows
### Workflow: Prepare A Day
1. **Review Dashboard/Bookings:** Check expected volume and exceptions.
2. **Confirm Staffing:** Open **Staff > Staff Scheduling**.
3. **Check POS Devices:** Confirm terminals are paired/active and presets are correct.
4. **Check Schedules/Capacity:** Confirm no failed slot generation for key activities.

### Workflow: Resolve A Refund Request
1. **Open Booking Payments:** Review original transactions and booking state.
2. **Check Policy:** Confirm cancellation/refund eligibility.
3. **Process Refund:** Use refund action if authorized.
4. **Verify:** Confirm balance/payment status and audit trail.

### Workflow: Fix Staff Access
1. **Identify User/Location:** Confirm staff account and needed location.
2. **Review Role:** Open **Admin > Roles & Permissions**.
3. **Update Access:** Change role/UI/location access if approved.
4. **Test:** Have staff refresh/login.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| managerOverrideAuditId | Conditional | Audit ID for override. | 99 | Required by some POS actions. |
| refund reason | Yes for refunds | Why money is returned. | Customer cancellation | Exact validation not confirmed. |
| slotGenerationStatus | Important | Schedule readiness. | failed | Check before peak day. |
| role/location access | Important | User permissions. | Manager + Downtown | Controls visibility/login. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Manager override | POS | Approves blocked cashier action. | Manager | Audited. |
| Refund | Booking payments | Returns money. | Manager/admin | High-risk. |
| Regenerate pairing code | POS devices | Pairs/re-pairs terminal. | Manager/admin | Code expires. |
| Publish waiver/portal | Setup pages | Makes version/config live. | Manager/admin | Review carefully. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| failed generation | Slots failed to generate. | Bad schedule/resource/hours | Fix before selling. |
| part-paid | Balance remains. | Deposit/refund/edit | Collect or resolve. |
| access denied | Staff lacks permission/location | Role setup | Update if approved. |
| code expired | Pairing code expired | Delay after generation | Generate new code. |

## Rules And Constraints
- Manager approvals should leave an audit trail.
- Do not change capacity or schedules without checking active bookings.
- Refunds must be reconciled against original transactions.
- Legal waiver and tax/payment settings require admin/product review where applicable.

## Common Questions
| Question | Answer |
| --- | --- |
| Can I override an expired promo? | POS supports manager override for certain promo blocks; follow venue policy and enter reason. |
| Can I delete a schedule with bookings? | Active bookings can block deletion; move/cancel bookings first according to policy. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Busy day slots missing | Generation failed or closed hours | Schedule status/store hours | Fix and regenerate. |
| Cashier cannot sell item | Product missing from preset | POS template and device | Add tile/refetch cashier. |
| Report mismatch | Filter/formula differences | Date/location/tender/refunds | Align definitions. |

## Edge Cases
- Super-admin may bypass some checks managers cannot.
- Payment webhook delays can mimic unpaid bookings.
- Redeemed tickets cannot be casually voided by booking reductions.

## Safe AI Guidance
MovieRa AI can help managers identify checks and risks. It should not replace policy decisions, approve refunds, alter legal/tax settings, or instruct bypasses.

## Source Notes
- Confirmed: manager override, payment/refund separation, capacity/schedule checks, role/location access.
- Not confirmed: venue-specific manager policies.
- Needs product review: official exception authority matrix.

