# Booking Portal And Online Checkout

## Purpose
The booking portal is the customer-facing checkout flow for browsing products, selecting sessions, entering guest details, signing/receiving waiver links, applying discounts, and paying online. Online checkout creates bookings, payment sessions, tickets, and post-payment artifacts when payment completes.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Guest | Books activities, pays online, receives confirmation/tickets/waiver links. |
| Manager | Configures booking portals and monitors checkout behavior. |
| Staff | Helps customers resolve failed checkout, missing waivers, or booking changes. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Manage booking portals | **Admin > Online Checkouts** or **Catalog > Online Checkouts** | Route `/booking-portals`; label may vary. |
| Edit booking portal | **Booking Portals > Booking Portal Details** | Route includes portal edit page; exact path not confirmed. |
| Customer checkout home | Public booking portal | Route controlled by portal app. Exact URL depends on deployment. |
| Checkout payment | Public booking portal > Checkout | Customer-facing flow. |

## Page Layout
- Portal list: configured checkout portals.
- Portal builder: customer-facing options, product selection, branding, fields, and publish behavior. Exact fields not fully confirmed.
- Public checkout: product selection, date/time selection, guest information, add-ons, discount code, payment, success/cancel pages.

## Tabs
### Tab: Portal Setup
#### Purpose
Choose what customers can buy online and how checkout appears.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Portal name | Internal/public portal label. | Exact behavior not confirmed. |
| Activities/products | Items shown online. | Must be active and schedulable if time-bound. |
| Branding | Customer-facing appearance. | Often tied to location branding. |
| Guest fields | Customer information collected. | Exact field list not confirmed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save | Saves portal configuration. | Does not guarantee slots exist. |
| Publish | Makes portal available. | Exact publish behavior not confirmed. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Draft | Configuration not live. | Review before sharing. |
| Published | Available to customers. | Monitor bookings/payments. |

## Main Workflows
### Workflow: Customer Online Booking
1. **Select Product:** Customer chooses a bookable activity/product.
2. **Select Date And Time:** Checkout reads generated availability slots.
3. **Enter Guest Details:** Customer provides required customer/participant information.
4. **Apply Discount:** If a code is entered, portal validates it and calculates a discount.
5. **Pay Online:** PaymentService creates a hosted session for Stripe/Nuvei or legacy flow depending on configuration.
6. **Complete Booking:** Webhook/finalizer updates payment status, sends artifacts, and tickets become available.

### Workflow: Configure Online Checkout
1. **Open Portals:** Go to **Admin > Online Checkouts**.
2. **Create/Edit Portal:** Select products, fields, and appearance.
3. **Confirm Dependencies:** Verify schedules, payment routes, taxes, waivers, and discounts.
4. **Publish/Test:** Place a test booking before sharing publicly.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| customer details | Yes | Buyer/guest identity. | Name, email, phone | Exact fields not confirmed. |
| activity/variation | Yes | What is being booked. | 90-minute jump | Must map to available slots. |
| slotId | Conditional | Selected time/resource slot. | 12345 | Required for scheduled activities. |
| discountCode | No | Promo code. | SUMMER20 | One code per booking. |
| payment session | Yes for paid online | Hosted payment checkout. | Stripe Checkout | Provider depends on location route. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Add to cart/continue | Public portal | Moves customer through checkout. | Guest | Exact label not confirmed. |
| Apply code | Public portal | Validates discount code. | Guest/staff assisting | Backend gaps exist for final eligibility recheck. |
| Pay | Public portal | Opens/uses hosted payment flow. | Guest | Payment may complete asynchronously. |
| Cancel booking | Public cancel page | Starts cancellation flow. | Guest/staff | Exact rules not confirmed. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| pending | Booking/payment not fully finalized. | Payment in progress or webhook pending | Check payment status. |
| confirmed | Booking exists operationally. | Successful booking creation. | Normal. |
| paid | Payment captured. | Webhook/finalizer completed | Send/check artifacts if missing. |
| failed payment | Payment provider did not capture. | Decline, abandoned checkout, provider error | Retry payment or send payment link. |

## Rules And Constraints
- Online booking relies on generated slots and available capacity.
- Payment status is updated by webhooks/finalizers, not only by the browser returning to success page.
- One discount code is stored per booking.
- Waiver requirements can block check-in/redemption until coverage exists.

## Common Questions
| Question | Answer |
| --- | --- |
| Customer paid but booking still shows unpaid. What now? | Check provider transaction/webhook status and Payment Transactions before taking manual action. |
| Why does checkout say no availability? | The selected product may have no slots, be outside schedule, closed, or full. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Payment fails | Provider route/credential/card issue | Payment settings and provider response | Retry or use another tender/payment link. |
| Confirmation missing | Webhook/finalizer/email issue | Booking payment status and CRM notifications | Resend if supported; escalate if not. |
| Discount not applying | Expired/usage/location/channel issue | Promo setup and code | Correct promo or remove code. |

## Edge Cases
- Browser success page does not guarantee webhook completion.
- Capacity can sell out between viewing and submitting checkout.
- Failed payment may leave pending booking/session data.
- Customer cancellation/refund rules require manager review.

## Safe AI Guidance
MovieRa AI can explain online checkout flow and what to check. It should not claim a customer paid, refund money, or promise availability without live system verification.

## Source Notes
- Confirmed: booking portal routes/components, PaymentService online channels, public checkout pages, discount and capacity dependencies.
- Not confirmed: every portal builder field and customer-facing label.
- Needs product review: official customer cancellation rules.

