# Platform Overview And Navigation

## Purpose
MovieRa is an operations platform for venue-based bookings, catalog setup, schedules, payments, POS, waivers, guests, CRM, staff operations, and reports. This page explains the confirmed navigation model and how staff should think about the main sections. The sidebar is data-driven from UI records; labels and URLs may be renamed by admins through Menu Manager.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Navigate daily operational tools such as bookings, POS, time clock, customers, and support. |
| Manager | Move between catalog setup, schedules, reports, guests, staff, and configuration. |
| Admin | Manage locations, roles, menus, docs, payment routes, and system-level setup. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Open home dashboard | **Command > Dashboard** | Route `/admin`; component key `admin_dashboard`. |
| View bookings list | **Command > Bookings** | Route `/bookings/all`. |
| View booking calendar | **Command > Calendar** | Route `/bookings`. |
| Manage catalog | **Catalog** | Includes activities, passes, bundles, inventory, promos, and schedules. |
| Manage guests | **Guests** | Includes customers, waiver holders, memberships, gift cards, and voucher packs. |
| Manage POS and connected apps | **Connected Apps** | Includes terminals, POS presets, ticket holders, POS settings, and forms. |
| Manage staff | **Staff** | Includes scheduling, time clock, timesheets, time off, availability, chat, documents, and reports. |
| Manage admin setup | **Admin** | Includes locations, zones and areas, users, roles, docs, wristbands, and menu manager. |
| Manage CRM | **CRM** | Includes overview, contacts, marketing, calendar, automation, and settings. |

## Page Layout
- Main rail: top-level sections such as Command, Catalog, Guests, Connected Apps, Reports, Support Tickets, Staff, Admin, and CRM.
- Section menu: child pages within the selected group.
- Top controls: user menu, global search, and current page heading.
- Content area: the selected page component.

## Tabs
### Tab: Not Applicable
#### Purpose
This is a navigation overview, not a tabbed page.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Route | URL path used by the app router. | Admins can rename routes through Menu Manager. |
| Component key | Code-defined screen renderer. | Should not be edited casually. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Menu item | Opens the linked page. | Access depends on role/UI permissions. |
| Global search | Searches across configured app records. | Exact indexed objects not confirmed. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Visible | Menu item is available to the user. | Use it normally. |
| Hidden | Menu item is not visible or not permitted. | Ask a manager/admin if access is needed. |

## Main Workflows
### Workflow: Find A Page
Use the sidebar and section children to open operational tools.
1. **Choose Section:** Select the top-level section, such as **Catalog** or **Admin**.
2. **Choose Page:** Select the child page, such as **Activities** or **Roles & Permissions**.
3. **Confirm Context:** Check selected location and user permissions before making changes.

### Workflow: Update Navigation
Managers/admins can use Menu Manager for data-driven sidebar records.
1. **Open Menu Manager:** Go to **Admin > Menu Manager**.
2. **Edit Menu Record:** Update display name, route, icon, or visibility.
3. **Save:** The app uses the route plus component key to render pages. Exact behavior not confirmed.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| display_name | Yes | Sidebar label. | Bookings | Stored in UI records. |
| route | Yes for pages | Browser URL. | `/bookings/all` | Some groups use placeholder routes. |
| component_key | Yes for routable pages | Which React page renders. | `booking_list` | Code-defined registry. |
| show_in_sidebar | No | Whether item appears in sidebar. | true | Hidden pages can still have routes. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Open page | Sidebar | Navigates to a tool. | All users with access | Permission-gated. |
| Search | Header | Finds records or pages. | Staff and managers | Exact behavior not confirmed. |
| User menu | Header | Account/session actions. | All users | Exact items not confirmed. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| 404 page | Route does not resolve. | Bad route or missing component key. | Ask admin to review Menu Manager. |
| Access denied | User lacks permission. | Role/UI permission missing. | Ask manager/admin. |

## Rules And Constraints
- UI routes are data-driven, but component keys must match the code registry.
- Role and UI permissions determine what a user can see and do.
- Super-admin behavior may differ from manager/staff behavior.
- Exact behavior not confirmed for every global search result type.

## Common Questions
| Question | Answer |
| --- | --- |
| Why can I not see a page my coworker sees? | Your role or location access may not include that UI. Ask a manager/admin to check permissions. |
| Can admins rename menu items? | The Menu Manager exists for navigation records. Exact behavior not confirmed for every field. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Page missing | Hidden menu item or permission issue | Role permissions and UI record | Grant access or show the item. |
| Page opens wrong screen | Route/component mismatch | Menu Manager component key | Restore correct component key. |

## Edge Cases
- Staff cannot see a page because the UI is hidden or permission is missing.
- A route can exist even if not shown in the sidebar.
- Admin-renamed labels may differ from documentation labels.

## Safe AI Guidance
MovieRa AI can explain confirmed navigation paths and permission concepts. It should not promise a user has access without checking the live system. Permission changes require a manager/admin. Live menu labels require checking MovieRa if the admin has customized routes.

## Source Notes
- Confirmed: top-level sections, route registry, component keys, docs page route.
- Not confirmed: exact global search coverage and every customized tenant menu.
- Needs product review: final role names and customer-specific navigation overrides.

