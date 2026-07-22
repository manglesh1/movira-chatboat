# Admin Setup, Organization, And Locations

## Purpose
This module covers location setup, venue configuration, zones/areas, wristbands, and admin setup pages. Locations scope bookings, catalog, schedules, POS devices, payment routing, and guest operations. Incorrect location setup can cause missing slots, wrong payment routing, or staff access issues.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Admin | Create and manage locations, branding, taxes, wristbands, zones, and menu setup. |
| Manager | Maintain location-specific operating settings. |
| Staff | Usually read-only or no access. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Manage locations | **Admin > Locations** | Route `/locations`. |
| Create location | **Admin > Locations > Create Location** | Route `/locations/create` if enabled. |
| Manage zones and areas | **Admin > Zones & Areas** | Route `/zones-areas`. |
| Manage wristbands | **Admin > Wristbands** | Route `/wristbands`. |
| Manage menus | **Admin > Menu Manager** | Route `/admin/menus`. |

## Page Layout
- Locations list: existing location records and actions.
- Location form: identity, contact, branding, tax, schedule/payment-related settings. Exact fields vary by component.
- Zones & Areas: operational spaces used for capacity and resource allocation.
- Wristbands: location-level wristband behavior and product-specific overrides.

## Tabs
### Tab: Location Details
#### Purpose
Maintain venue identity and operational defaults.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Location name | Venue display name. | Required for operational use. |
| Default location | Primary location flag. | Confirm before changing. |
| Branding | Logo/colors/public-facing display. | Exact fields not confirmed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save | Persists location settings. | May affect customer-facing pages. |
| Delete | Removes or disables location. | Exact behavior not confirmed; use manager/admin review. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Active | Location can be used. | Normal operation. |
| Inactive | Location may be hidden or unavailable. | Ask admin before booking. |

### Tab: Zones And Areas
#### Purpose
Define physical capacity areas used by schedules and bookings.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Area name | Operational space. | Example: Main Court, Party Room. |
| Capacity | People/items allowed. | Used by slot generation and booking rules. |
| Activity rules | Which activities can use the area. | Exact rule matrix varies. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Add area | Creates a capacity resource. | Configure before schedules depend on it. |
| Edit area | Changes area metadata/rules. | Existing schedules may need review. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Available | Area can be allocated. | Normal. |
| Full | Capacity is used for a slot. | Offer another time or area. |

## Main Workflows
### Workflow: Create A Location
1. **Open Locations:** Go to **Admin > Locations**.
2. **Create Location:** Use the create action and enter required details.
3. **Configure Dependencies:** Add store hours, taxes, payment routes, zones/areas, POS devices, and booking portal options before going live.

### Workflow: Configure An Area
1. **Open Areas:** Go to **Admin > Zones & Areas**.
2. **Add Area:** Enter name, capacity, and activity/resource rules.
3. **Use In Scheduling:** Include the area/resource in schedules and activity variations.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| locationId | System | Unique location identifier. | 5 | Used across bookings, POS, payments. |
| name | Yes | Location display name. | Downtown Park | Exact validation not confirmed. |
| tax settings | Conditional | Sales tax configuration. | add to price / include in price | Confirm with finance/admin. |
| capacity | Conditional | How many people/items an area supports. | 20 | Used during availability checks. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Create | Locations/areas pages | Adds a new record. | Admin/manager | Configure dependencies after creation. |
| Save | Edit forms | Persists changes. | Admin/manager | Review customer-facing impact. |
| Delete/disable | Lists | Removes or disables records. | Admin only | Exact behavior not confirmed. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Active | Record can be used. | Normal setup. | Continue. |
| Inactive | Record should not be used. | Closed venue or disabled area. | Review before booking. |
| Capacity full | Area/slot has no capacity. | Bookings consumed capacity. | Choose another time or adjust capacity only if valid. |

## Rules And Constraints
- Locations scope users, POS devices, schedules, payments, and bookings.
- Area capacity is checked when creating and editing bookings.
- Payment provider credentials and routes can be location-specific.
- Staff must have location access to operate a paired cashier device.

## Common Questions
| Question | Answer |
| --- | --- |
| Why can staff not log into a terminal? | The device location and user location access may not match. |
| Why do slots not appear after creating an area? | Schedules must include valid variations/resources and generated slots. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Staff cannot access location | Missing AdminLocation assignment | User location access | Assign location or use correct user. |
| Payment fails at location | Missing payment route/credential | Payment settings | Configure provider route. |
| Area overbooks | Incorrect capacity/rules | Area capacity and schedule slots | Correct rules and regenerate schedules if needed. |

## Edge Cases
- Per-location credentials override org-wide payment credentials.
- Menu labels may vary if Menu Manager changed them.
- Active bookings can block destructive schedule or area changes.

## Safe AI Guidance
MovieRa AI can explain setup dependencies and navigation. It should not change location, tax, capacity, or payment settings by instruction alone. Live configuration and legal/tax decisions require an admin or manager.

## Source Notes
- Confirmed: routes for Locations, Zones & Areas, Wristbands, Menu Manager; location scoping in payments/POS.
- Not confirmed: every visible location form field.
- Needs product review: final location deletion/disable policy.

