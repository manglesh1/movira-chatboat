# Discounts, Promotions, And Coupons

## Purpose
Discounts and promo codes reduce booking prices according to configured discount type, value, eligibility, channel, and usage limits. The current system supports percentage, fixed amount, and buy-get discount shapes. Staff should verify discounts before promising a price.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Manager | Create, edit, expire, and review promo codes. |
| Staff | Apply or troubleshoot promo codes during booking/POS. |
| Admin | Review configuration gaps and channel behavior. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| List discounts | **Catalog > Discounts** | Route `/promos`. |
| Create discount | **Catalog > Discounts > Create Discount** | Route `/promos/create`. |
| Apply code online | **Booking Portal > Checkout > Promo Code** | Customer-facing. |
| Apply code in booking/POS | Booking or cashier checkout | Exact control not confirmed. |

## Page Layout
- Discount list: search/list existing codes.
- Discount form: type, code, value, max value, eligible activities, usage restrictions, channel/application settings.
- Checkout application: code validation and calculated reduction.

## Tabs
### Tab: Discount Details
#### Purpose
Define code identity and type.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Code | Customer/staff-entered promo. | Location-scoped. |
| Type | Percentage, fixed amount, buy-get. | Enum values 1/2/3. |
| Value | Percent or currency amount. | Meaning depends on type. |
| Max value | Ceiling for reduction. | Mostly for percentage discounts. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save | Creates/updates discount. | Test code after saving. |
| Delete | Removes discount. | Exact behavior not confirmed. |

### Tab: Usage Restrictions
#### Purpose
Control validity and limits.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| restrictBookingTo | Last valid booking date. | Expired codes reject validation. |
| usageLimits | Max uses/per-day/per-guest. | Backend checks maxUses in validation. |
| application | Allowed channels. | Wiring should be verified. |
| eligible activities | Items discount can apply to. | Backend final eligibility recheck is a known gap. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Apply code | Validates code. | Cart eligibility may be frontend-computed. |

## Main Workflows
### Workflow: Create Promo Code
1. **Open Discounts:** Go to **Catalog > Discounts**.
2. **Create:** Enter code, type, value, eligibility, dates, and limits.
3. **Save/Test:** Validate the code in the intended channel before sharing.

### Workflow: Apply Promo Code
1. **Enter Code:** Customer/staff enters code at checkout.
2. **Validate:** Backend checks active status, expiry, and usage limits.
3. **Calculate Discount:** Frontend calculates proposed amount; backend caps to subtotal.
4. **Save Booking:** Booking snapshots code, value, max, and applied amount.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| discount_by_type | Yes | Discount shape. | 1 percentage | 1/2/3. |
| code | Yes | Promo string. | SUMMER20 | Case behavior should be tested. |
| usageCount | System | Times used. | 10 | Not decremented on cancellation today. |
| discounts | Conditional | Eligible activity JSON. | activityId/variationId | Frontend-driven eligibility. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Create Discount | Discounts | Adds code. | Manager | Avoid duplicate/confusing codes. |
| Apply | Checkout | Applies validated code. | Staff/guest | One code per booking. |
| Manager override | POS | Allows specific blocked promo cases. | Manager | Expired/over-limit overrides are wired in cashier. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Active | Code can validate. | status=1 | Use if eligible. |
| Inactive | Code rejected. | status not active | Do not apply. |
| Expired | Booking date limit passed. | restrictBookingTo past | Manager override only if policy allows. |
| Usage limit reached | Max uses reached. | usageCount >= maxUses | Do not apply without approval. |

## Rules And Constraints
- One discount code per booking.
- Backend caps discount amount to subtotal.
- Backend does not fully revalidate per-activity eligibility at final booking time in current reference.
- Usage count is not automatically decremented when a booking is cancelled.

## Common Questions
| Question | Answer |
| --- | --- |
| Why did a code validate but discount looks wrong? | Cart eligibility and max cap affect final amount. |
| Can we stack two codes? | No, current booking stores a single discountCode. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Code not found/rejected | Wrong code, inactive, expired, usage limit | Promo setup | Correct setup or choose another code. |
| Discount too high | Frontend sent bad amount | Booking pricing summary | Backend caps to subtotal; review known eligibility gap. |

## Edge Cases
- Race between validation and booking save can affect usage limits.
- Employee promo enforcement is not fully confirmed server-side.
- Cancelled bookings do not restore usage count automatically.

## Safe AI Guidance
MovieRa AI can explain discount types and troubleshooting. It should not promise eligibility or override expired/limited codes without live checks and manager approval.

## Source Notes
- Confirmed: discount types, fields, validate flow, stored booking fields, known gaps.
- Not confirmed: exact UI labels and channel filtering completeness.
- Needs product review: discount override policy.

