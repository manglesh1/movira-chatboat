# Reports, Analytics, And Revenue

## Purpose
Reports help managers review revenue, tips, operations, staff activity, and business performance. Confirmed report pages include Tip Reports, Tip Distribution, Staff Reports, and section-level Reports. Revenue numbers should be treated carefully because payment, refund, discount, tax, tip, and source filters affect meaning.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Manager | Review performance, tips, staff reports, and operational summaries. |
| Admin | Validate report configuration and data integrity. |
| Staff | View limited personal/staff reports if permitted. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Open reports section | **Reports** | Route `/reports`. |
| Tip reports | **Reports > Tip Reports** | Route `/reports/tip-reports`. |
| Tip distribution | **Reports > Tip Distribution** | Route `/reports/tip-distribution`. |
| Staff reports | **Staff > Staff Reports** | Route `/staff/reports`. |
| Dashboard summary | **Command > Dashboard** | Route `/admin`; high-level only. |

## Page Layout
- Report selector/section page: available report links.
- Filters: date range, location, staff, product, tender, or channel depending on report. Exact filters vary.
- Results: charts/tables/cards and export actions where available. Exact behavior not confirmed.

## Tabs
### Tab: Tip Reports
#### Purpose
Review collected tips and allocation context.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Tip amount | Tip collected. | Payment transactions include tip columns. |
| Staff/host | Allocation target. | Can route to booking host, logged-in staff, or pool. |
| Date/time | Transaction timing. | Use for reconciliation. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Filter | Narrows report. | Exact filters not confirmed. |
| Export | Downloads data if available. | Exact behavior not confirmed. |

### Tab: Tip Distribution
#### Purpose
Create/review distribution of pooled or allocated tips.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Distribution | Tip payout batch. | Backed by tip distribution services. |
| Share | Staff share amount. | Rules in tip handling docs. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Finalize distribution | Locks/calculates payout. | Manager action; exact UI not confirmed. |

## Main Workflows
### Workflow: Review Revenue
1. **Choose Report:** Open **Reports** or Dashboard.
2. **Set Filters:** Select date/location/channel/tender if available.
3. **Compare Definitions:** Confirm whether discounts, taxes, tips, refunds, and unpaid bookings are included.
4. **Export/Share:** Use report export only after verifying filter context.

### Workflow: Review Tips
1. **Open Tip Reports:** Go to **Reports > Tip Reports**.
2. **Filter Period:** Select relevant date and staff/location.
3. **Open Distribution:** Go to **Reports > Tip Distribution** for payout workflow.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| date range | Yes | Report period. | Today | Required for reliable interpretation. |
| location | Usually | Venue filter. | Downtown | Cross-location behavior not confirmed. |
| net/gross revenue | Report-defined | Revenue metric. | Gross sales | Exact formulas need review. |
| refunds | Conditional | Returned money. | 20.00 | Separate rows in payment model. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Filter | Report pages | Changes query. | Manager/staff | Always cite filters. |
| Export | Report pages | Downloads report data. | Manager/admin | Exact availability not confirmed. |
| Finalize | Tip distribution | Completes distribution. | Manager | Review carefully. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Draft | Report/distribution not final. | In-progress review | Continue review. |
| Finalized | Distribution/report action locked. | Manager completed process | Use for payout/audit. |
| Partial | Data missing or filtered. | Access/filter limit | Clarify limitations. |

## Rules And Constraints
- Reports are only meaningful with location/date/filter context.
- Payment transactions and refunds are separate data objects.
- Tips may route differently based on settings and source.
- Dashboard metrics should not replace accounting reports unless definitions match.

## Common Questions
| Question | Answer |
| --- | --- |
| Why does revenue not match cash drawer? | Check tender, refunds, tips, taxes, unpaid bookings, and time cutoff. |
| Why are tips assigned to a pool? | Tip routing settings can send tips to host, logged-in staff, or general pool. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Numbers differ between reports | Different filters/formulas | Date, location, tender, status | Align filters and definitions. |
| Missing transaction | Payment failed/not finalized | Payment tab/events | Reconcile payment first. |

## Edge Cases
- Refund timing can fall in a different reporting period than the sale.
- Partial payments can make booking totals differ from captured revenue.
- Tips and taxes may need separate reporting treatment.

## Safe AI Guidance
MovieRa AI can explain report filters and caution about definitions. It should not give live revenue/tip totals from docs or treat a dashboard card as accounting proof.

## Source Notes
- Confirmed: reports routes, tip models/services, payment/refund separation.
- Not confirmed: exact report formulas and export availability.
- Needs product review: revenue metric glossary.

