# Settings And Configuration

## Purpose
Settings and Configuration covers global and location-scoped controls that affect booking behavior, POS, payments, waivers, CRM, staff, menus, branding, taxes, wristbands, store hours, and customer-facing checkout. These settings can change system behavior immediately and should be handled by managers/admins.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Admin | Configure system, location, menus, payments, CRM, and access. |
| Manager | Maintain operational settings for a location. |
| Staff | Usually read settings or request changes. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Location settings | **Admin > Locations** | Route `/locations`. |
| Menu settings | **Admin > Menu Manager** | Route `/admin/menus`. |
| Role settings | **Admin > Roles & Permissions** | Route `/list/roles-permissions`. |
| Store hours | **Catalog > Store Hours** | Route `/store-hours`. |
| POS settings | **Connected Apps > POS Settings** | Route `/pos`. |
| CRM settings | **CRM > Settings** | Route `/crm/settings`. |
| Waiver setup | **Admin > Waiver Setup** | Route `/waivers`. |

## Page Layout
- Settings are distributed by domain rather than one monolithic page.
- Location settings: identity, branding, tax, wristband/payment-related setup.
- POS settings: location-wide POS flags and defaults.
- CRM settings: communication provider/domain/channel setup.
- Menu Manager: sidebar records and page routes.

## Tabs
### Tab: Location Settings
#### Purpose
Control location-specific behavior.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Branding | Logo/colors/public display. | Customer-facing impact. |
| Tax | Tax calculation behavior. | Finance review needed. |
| Store hours | Operating windows. | Affects slot generation. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save | Persists settings. | Test affected flows. |

### Tab: Menu Manager
#### Purpose
Control sidebar labels, routes, icons, and visibility.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| display_name | Sidebar label. | Can be customized. |
| route | URL path. | Must align with route registry. |
| component_key | Rendered page. | Code-defined. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Save menu item | Updates navigation. | Bad route/component can break page. |

## Main Workflows
### Workflow: Change Operational Setting
1. **Identify Domain:** Determine whether setting belongs to Location, POS, CRM, Waiver, Store Hours, Roles, or Menu Manager.
2. **Open Correct Page:** Use exact navigation path.
3. **Change Setting:** Save only after reviewing downstream effects.
4. **Test:** Verify booking, POS, checkout, or CRM behavior as appropriate.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| locationId | Often | Scope for setting. | 5 | Prevents cross-location mistakes. |
| channel | Payment | Payment context route. | online_booking | Must have explicit route except narrow fallback. |
| show_in_sidebar | Menu | Visibility toggle. | true | Does not necessarily remove route. |
| status | Varies | Active/inactive flag. | 1 | Meaning depends on table/module. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Save | Settings forms | Persists configuration. | Manager/admin | Review impact. |
| Test connection | Payment/CRM settings | Verifies provider. | Admin | Exact availability varies. |
| Publish | Waiver/portal | Makes version/config live. | Admin/manager | High-impact. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Active/enabled | Setting or route is usable. | Normal setup | Monitor. |
| Disabled/inactive | Setting not used. | Intentional off state | Confirm before relying on it. |
| Failed | Test/generation/provider failed. | Bad config or external issue | Fix and retest. |

## Rules And Constraints
- Settings can be location-scoped; always confirm selected location.
- Payment and CRM credentials are sensitive and should not be exposed.
- Store hours affect schedule generation.
- Menu Manager changes can affect navigation immediately.

## Common Questions
| Question | Answer |
| --- | --- |
| Where do I change checkout branding? | Start with **Admin > Locations** and booking portal settings; exact field names not confirmed. |
| Where do I change what cashiers see? | Use **Connected Apps > POS Presets** and assign templates to devices. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Setting did not affect flow | Wrong location or cached/front-end state | Selected location and assigned device/portal | Switch context/refetch/test. |
| Page broke after menu edit | Bad route/component key | Menu Manager | Restore known route/component key. |

## Edge Cases
- Some settings auto-create defaults on first read, such as POS settings.
- Legacy payment routes can still serve traffic.
- Tenant-customized labels may not match docs exactly.

## Safe AI Guidance
MovieRa AI can explain where settings live and what to check. It should not change sensitive settings, expose credentials, or provide tax/legal decisions. Live configuration must be checked in MovieRa.

## Source Notes
- Confirmed: distributed settings routes and major configuration domains.
- Not confirmed: every setting field.
- Needs product review: configuration ownership matrix.

