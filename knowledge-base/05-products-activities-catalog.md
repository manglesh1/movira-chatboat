# Products, Activities, And Catalog

## Purpose
The Catalog module defines what customers and staff can sell or book: activities, jump/session passes, party bundles, voucher packs, memberships, gift cards, add-ons, stock/inventory items, wristbands, and discounts. Catalog records feed schedules, booking portal checkout, cashier POS presets, tickets, and reporting. A product should not be treated as operationally ready until pricing, variations, capacity resources, schedule availability, taxes, waiver requirements, and channel visibility are confirmed.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Manager | Create and maintain sellable activities and products. |
| Admin | Configure catalog structure, taxes, wristbands, and advanced product behavior. |
| Staff | Select catalog items during bookings or POS sales. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| List activities | **Catalog > Activities** | Route `/activities`. |
| Create activity | **Catalog > Activities > Create Activity** | Route `/activities/create`. |
| Create jump pass | **Catalog > Activities > Create Jump Pass** | Route `/activities/create/jump-pass`. |
| Manage voucher packs | **Catalog > Voucher Packs** | Route `/voucher-packs`. |
| Create voucher pack | **Catalog > Voucher Packs > Create Voucher Pack** | Route `/voucher-packs/create`. |
| Manage memberships | **Catalog > Memberships** | Route `/memberships`. |
| Manage gift cards | **Catalog > Gift Cards** | Route `/gift-cards`. |
| Manage inventory | **Catalog > Inventory** | Route `/inventory`. |
| Create inventory item | **Catalog > Inventory > Create Inventory Item** | Route `/inventory/create`. |
| Manage extras/add-ons | **Catalog > Extras** | Exact menu label not fully confirmed. |

## Page Layout
- Catalog list pages: searchable lists of configured products or activities.
- Create/edit forms: product identity, pricing, activity type, variations, resource/capacity rules, waiver needs, and channel behavior.
- Product-specific builders: session pass, party bundle, voucher pack, membership, gift card, and inventory forms.
- Related setup: schedules and POS presets reference catalog items after creation.

## Tabs
### Tab: Activity Details
#### Purpose
Define the sellable item and its basic behavior.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Name | Product/activity display name. | Customer-facing if exposed online. |
| Type | Product category. | Session pass, add-on, stock item, party inclusion, wristband, membership, gift card, voucher pack. |
| Status | Whether item can be used. | Exact status list not confirmed. |
| Waiver required | Whether a signed waiver is needed. | Used by tickets/check-in. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Create | Adds product. | Configure schedule/POS/checkout separately as needed. |
| Save | Updates product. | Existing bookings keep snapshotted pricing fields where applicable. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Active | Product can be selected. | Use normally. |
| Inactive | Product should not be sold. | Ask manager before using. |

### Tab: Variations And Pricing
#### Purpose
Define tiers, durations, capacity resource usage, and price points.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Variation | Sellable tier or option. | Example: 60 min, 90 min. |
| Price | Amount charged. | Taxes may be add-to-price or included. |
| Duration | Session length. | Used by slot generation. |
| Resource rules | Area/capacity allocation. | Used in schedules and booking validation. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Add variation | Creates tier. | Required for scheduled activities. |
| Configure resources | Sets capacity rules. | Missing rules can prevent slots. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Bookable | Has enough configuration to schedule/sell. | Confirm schedules exist. |
| Incomplete | Missing required configuration. | Manager/admin should finish setup. |

## Main Workflows
### Workflow: Create A Bookable Activity
1. **Open Catalog:** Go to **Catalog > Activities**.
2. **Create Activity:** Enter name, type, pricing, waiver requirement, and variations.
3. **Configure Capacity:** Assign relevant zones/areas/resources.
4. **Create Schedule:** Go to **Catalog > Activity Schedule** and generate slots.
5. **Expose To Sales Channels:** Add to booking portal and/or POS preset as needed.

### Workflow: Create A Voucher Pack
1. **Open Voucher Packs:** Go to **Catalog > Voucher Packs**.
2. **Create Pack:** Define included entitlements such as jump passes or stock items.
3. **Save:** Voucher-pack tickets/entitlements are minted after purchase/payment according to payment finalizers. Exact UI behavior not confirmed.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| activityId | System | Unique catalog item ID. | 101 | Used by bookings, tickets, POS. |
| variationId | Conditional | Specific tier/option. | 90-minute pass | Required for many scheduled items. |
| productType | Conditional | Ticket/product category. | `session_pass` | Drives ticket redemption defaults. |
| itemsIncluded | Conditional | Bundle/voucher inclusions. | 5 passes + 2 pizzas | Used by party/voucher products. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Create Activity | Activities | Starts general activity form. | Manager/admin | Needs schedule before online booking. |
| Create Jump Pass | Activities | Creates session pass. | Manager/admin | Route confirmed. |
| Add To POS Preset | POS preset builder | Makes item visible on cashier device. | Manager/admin | Exact button label not confirmed. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Active | Item can be used. | Published/enabled product. | Normal. |
| Inactive | Item hidden/disabled. | Seasonal or incomplete setup. | Do not sell unless manager confirms. |
| Unscheduled | Item has no generated slots. | Schedule missing or failed. | Create/regenerate schedule. |

## Rules And Constraints
- Schedules depend on variations and resource rules.
- Tickets are minted from booking line items and preserve unit price, discount allocation, and tax allocation.
- Party bundles and voucher packs can fan out one purchased item into many redeemable tickets.
- Existing bookings should not be edited only because catalog prices changed.

## Common Questions
| Question | Answer |
| --- | --- |
| Why is an activity not showing online? | It may be inactive, missing schedule slots, not included in the booking portal, or unavailable for the selected date/location. |
| Why is a cashier tile missing? | The item may not be assigned to the POS template used by that device. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| No slots | Missing schedule or failed generation | Schedule status and resource rules | Fix setup and regenerate. |
| Wrong price | Variation/discount/tax mismatch | Activity variation and booking snapshot | Correct catalog for future sales; review existing booking separately. |
| Ticket not minted | Missing activityId or post-save ticket sync failed | Booking Tickets tab | Use manager repair action if available. |

## Edge Cases
- Legacy line items without activityId may be skipped by ticket minting.
- Reducing a booking voids unredeemed excess tickets but does not touch redeemed tickets.
- Product labels and grouping can differ between admin catalog, booking portal, and POS.

## Safe AI Guidance
MovieRa AI can explain catalog dependencies and known product types. It should not invent product fields, guarantee availability, or change pricing. Live product state, tax setup, and sale-channel visibility require checking MovieRa.

## Source Notes
- Confirmed: catalog routes, ticket product types, voucher/party inclusion behavior, POS preset relationship.
- Not confirmed: every catalog form field and final status list.
- Needs product review: canonical product type glossary.

