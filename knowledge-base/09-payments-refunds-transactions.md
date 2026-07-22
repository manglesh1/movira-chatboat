# Payments, Refunds, And Transactions

## Purpose
Payments records money movement for bookings, POS sales, gift cards, voucher packs, memberships, and payment links. MovieRa uses PaymentService for provider routing, local tenders, transactions, webhooks, finalizers, and refunds. Staff should treat payment actions as high-risk and verify the live system before promising payment or refund outcomes.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Take payments, check balances, send payment links. |
| Manager | Approve refunds, review failed payments, reconcile exceptions. |
| Admin | Configure provider credentials and location payment routes. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| View booking payments | **Command > Bookings > Booking Details > Payments** | Booking payment tab. |
| Manage POS card/cash behavior | **Connected Apps > POS Settings** | Route `/pos`. |
| Configure payment routes | Superadmin/payment config | Admin surface exists in backend; exact app path not confirmed. |
| View tip reports/distribution | **Reports > Tip Reports** / **Reports > Tip Distribution** | Payment-adjacent reporting. |

## Page Layout
- Payments tab: booking balance, transactions, payment actions, refund actions.
- Payment config: providers, encrypted credentials, location routes, channels, tenders.
- Payment records: transactions, events, allocations, refunds, and webhooks.

## Tabs
### Tab: Transactions
#### Purpose
Shows captured or attempted money events.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Provider | Stripe, Nuvei, local, Razorpay legacy. | Depends on route. |
| Tender type | Card, cash, gift card, complimentary. | Local tenders bypass external provider. |
| Amount | Captured amount. | Positive transactions; refunds separate. |
| Status | Transaction lifecycle. | Exact UI list not confirmed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Take payment | Starts/records payment. | Use correct tender. |
| Send link | Creates hosted payment link. | Channel `payment_link`. |

### Tab: Refunds
#### Purpose
Records refund requests and completed refunds.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Refund amount | Amount returned. | Stored in refunds table, not negative transaction. |
| Reason | Staff/manager reason. | Required behavior not fully confirmed. |
| Provider refund ID | External provider reference. | If provider-backed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Refund | Calls PaymentService refund. | Manager/admin review recommended. |

## Main Workflows
### Workflow: Take Payment
1. **Open Payment Context:** Use booking Payments tab or POS checkout.
2. **Choose Tender:** Card/online, cash, gift card, or complimentary.
3. **Submit Payment:** PaymentService records or creates provider payment.
4. **Finalize:** On capture/webhook, finalizer updates booking balance/paymentStatus and artifacts.

### Workflow: Process Refund
1. **Open Transaction:** Confirm original payment, source, amount, and customer.
2. **Enter Refund Amount/Reason:** Use permitted refund action.
3. **Submit:** PaymentService calls provider or local refund path and writes refund row.
4. **Verify Balance:** Confirm booking/payment status after finalizer runs.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| channel | Yes | Payment use case. | online_booking, payment_link, kiosk, pos, recurring | POS terminal channels still have staged functionality. |
| sourceType/sourceId | Yes | What payment is for. | booking/270 | Drives finalizer. |
| idempotencyKey | Yes | Prevents duplicate payment writes. | booking-270-pay-1 | Unique in transactions. |
| paymentStatus | System | Booking money state. | paid | Recomputed from transactions minus refunds. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Record Cash | Payment/POS | Records local cash payment. | Staff | Requires cash handling controls. |
| Redeem Gift Card | Payment/POS | Debits gift card and records payment. | Staff | Check balance. |
| Complimentary | Payment/POS | Records manager override/manual tender. | Manager | Requires reason/audit. |
| Refund | Payments | Returns funds. | Manager/admin | High-risk action. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| captured | Money captured. | Successful provider/local payment | Verify finalizer updated source. |
| failed | Payment did not complete. | Decline/provider error | Retry or alternate tender. |
| refunded | Money returned. | Refund processed | Confirm booking balance. |
| webhook_received | Provider event arrived. | Async provider callback | Wait/check finalizer if needed. |

## Rules And Constraints
- Refunds are separate rows, not negative payment transactions.
- Per-location credentials can override org-wide credentials.
- `online_booking` can fall back to legacy `online`; other channels require explicit routes.
- Legacy Razorpay traffic still uses older endpoints.
- Payment provider secrets are encrypted; staff should never ask for or expose secrets.

## Common Questions
| Question | Answer |
| --- | --- |
| Why is payment shown twice? | Check idempotency key, transactions, and provider event IDs before acting. |
| Can I refund a cancelled booking? | Cancellation and refund are separate. Use the refund flow only after manager review. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Hosted payment link fails | Missing route/credential | Location payment settings | Configure route or use alternate tender. |
| Paid at provider but unpaid in MovieRa | Webhook/finalizer delay/failure | Payment events and booking finalizer | Reconcile and retry finalizer if supported. |
| Refund failed | Provider declined/ref mismatch | Provider status and original transaction | Escalate to manager/admin. |

## Edge Cases
- Browser return success is not the source of truth; webhooks finalize payment.
- Partial payments can leave booking part-paid.
- Editing booking total after payment can create a new balance.
- Duplicate webhooks are deduplicated by provider event ID.

## Safe AI Guidance
MovieRa AI can explain payment concepts and checks. It should not declare payment/refund completion without live transaction data, expose credentials, or advise bypassing provider controls.

## Source Notes
- Confirmed: PaymentService methods, channels, providers, refunds table behavior, finalizers, idempotency.
- Not confirmed: every payment UI label.
- Needs product review: staff refund thresholds and approval policy.

