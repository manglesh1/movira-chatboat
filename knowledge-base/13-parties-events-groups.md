# Parties, Events, And Groups

## Purpose
Parties and group products combine scheduled activities, rooms/areas, per-guest inclusions, stock/add-ons, tickets, waivers, staff assignment, and payment rules. MovieRa supports party bundle behavior where one booking can mint many tickets for session access, food, wristbands, and included items.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Book parties, check party guests in, redeem inclusions. |
| Manager | Configure party bundles, capacity, staff hosts, and exception handling. |
| Admin | Maintain areas/resources and product setup for parties. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Manage party bundles | **Catalog > Party Bundles** | Route likely `/party-bundles`; exact current menu label not fully confirmed. |
| Create party bundle | **Catalog > Activities > Create Party Bundle** | Component `party_bundle_create`. |
| Book party | **Command > Calendar** or **Command > Bookings** | Uses booking flow. |
| View party booking tickets | **Command > Bookings > Booking Details > Tickets** | Shows inclusion tickets. |

## Page Layout
- Party product setup: base session, room/area, inclusions, per-guest quantities, pricing, waiver and capacity settings.
- Booking flow: party date/time, guest count, customer details, add-ons, payment.
- Booking details: participants, host/staff, tickets, waivers, payments, history.

## Tabs
### Tab: Party Configuration
#### Purpose
Define bundle contents and rules.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Base activity/session | Main party experience. | Requires schedule/capacity. |
| Area/room | Allocated party space. | Capacity/resource rules apply. |
| Inclusions | Items included per guest or per party. | Mint tickets after booking/payment. |
| Guest count | Party quantity driver. | Affects capacity and inclusion count. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save bundle | Persists party product. | Test booking before selling. |
| Add inclusion | Adds stock/add-on/wristband/session entitlement. | Must map to activityId for ticket minting. |

## Main Workflows
### Workflow: Book A Party
1. **Select Party Product:** Use booking flow or public checkout.
2. **Choose Date/Time:** System checks schedule and area capacity.
3. **Enter Guest Count:** Quantity drives capacity and inclusions.
4. **Collect Payment:** Booking may be unpaid, part-paid, or paid.
5. **Prepare Tickets/Waivers:** Confirm included tickets and waiver coverage before arrival.

### Workflow: Check In Party Guests
1. **Open Booking:** Go to **Command > Bookings > Booking Details**.
2. **Review Participants:** Confirm guest list and waiver state.
3. **Redeem/Check In:** Use POS/check-in tools; each inclusion can have its own ticket.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| itemsIncluded | Yes for bundle | Included entitlements. | 14 jump tickets + pizzas | Drives ticket fan-out. |
| quantityPerPax | Conditional | Inclusion count per guest. | 1 | Used for party ticket count. |
| area/resource | Conditional | Party room/court. | Room A | Capacity checked. |
| assigned host | No | Staff member assigned to party. | Host user ID | Booking staff assignment exists. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Add inclusion | Party builder | Adds included entitlement. | Manager | Missing activityId can skip ticket minting. |
| Assign staff | Booking Staff tab | Assigns host/staff. | Manager | Exact UI not confirmed. |
| Redeem inclusion | Cashier | Consumes included ticket. | Staff | Audit stamped. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Capacity full | Party slot/room unavailable. | Existing booking | Offer alternate time. |
| Waiver missing | Guest lacks coverage. | Unsigned waiver | Send/sign waiver. |
| Inclusion redeemed | Included ticket used. | POS scan | Do not issue duplicate. |

## Rules And Constraints
- Party inclusion tickets are minted per inclusion and quantity rules.
- Per-ticket unit price, discount, and tax allocations are snapshotted.
- Waiver-required activities can block check-in.
- Area capacity and resource overlap must pass booking validation.

## Common Questions
| Question | Answer |
| --- | --- |
| Why are there many tickets for one party? | Each guest and inclusion can create separate redeemable tickets for audit and fulfillment. |
| Can a redeemed party inclusion be removed by reducing guest count? | Redeemed tickets are not voided by quantity reduction; manager review is needed. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Party time unavailable | Room/area full or no schedule | Schedule, area capacity | Pick another slot or adjust valid capacity. |
| Included item not redeemable | Ticket not minted or missing activityId | Tickets tab | Repair catalog/inclusion and sync if possible. |

## Edge Cases
- Party bundles can include non-time-bound stock items.
- Reducing quantity voids only unredeemed excess tickets.
- Exact behavior not confirmed for event/group-specific contracts or deposits.

## Safe AI Guidance
MovieRa AI can explain party booking and ticket fan-out. It should not promise room availability, approve over-capacity parties, or alter refund/deposit policy without manager review.

## Source Notes
- Confirmed: party inclusion ticket fan-out, capacity/waiver dependencies, staff assignment model.
- Not confirmed: every party builder field and event contract behavior.
- Needs product review: group/event deposit and cancellation policy.

