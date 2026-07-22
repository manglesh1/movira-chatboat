# Dashboard Home

## Purpose
The Dashboard is the command home for quick operational awareness. It is intended to summarize booking, revenue, guest, and operational signals for the selected location. Exact card set and metric definitions are not fully confirmed.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Start from the home page and jump to daily work. |
| Manager | Review high-level operating status before opening bookings, reports, or staff tools. |
| Admin | Confirm the app is working and navigate to setup modules. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Open dashboard | **Command > Dashboard** | Route `/admin`. |
| Return home | **Home/Dashboard menu item** | Exact label may vary by Menu Manager settings. |

## Page Layout
- Header area: page title and breadcrumb.
- Summary area: likely shows key operational metrics. Exact behavior not confirmed.
- Navigation/shortcut area: links to common operational pages. Exact behavior not confirmed.

## Tabs
### Tab: Not Confirmed
#### Purpose
Exact tabs not confirmed.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Metric | Operational number shown on dashboard. | Exact definitions not confirmed. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Open related page | Navigates to detailed module. | Exact shortcuts not confirmed. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Loading | Dashboard data is being fetched. | Wait or refresh if stuck. |

## Main Workflows
### Workflow: Start A Daily Shift From Dashboard
1. **Open Dashboard:** Go to **Command > Dashboard**.
2. **Review Alerts:** Check visible cards or warnings. Exact behavior not confirmed.
3. **Jump To Work:** Open **Command > Bookings**, **Connected Apps > Terminals**, or **Staff > Time Clock** as needed.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| Location context | Yes | Which venue/location the dashboard reflects. | St. Catharines | Source depends on selected location cookie/session. |
| Date range | Not confirmed | Reporting period. | Today | Exact control not confirmed. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Navigate | Dashboard/Sidebar | Opens a module. | All users | Permission-gated. |
| Refresh | Browser/app | Reloads current data. | All users | Use when data appears stale. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Empty | No data for period/location. | New location or no activity. | Check date/location filters. |
| Error | Data could not load. | API/session/location issue. | Refresh or ask admin. |

## Rules And Constraints
- Dashboard numbers should not be treated as final accounting reports unless metric definitions are confirmed.
- Location context matters; staff with multiple locations must verify the selected location.
- Exact behavior not confirmed for dashboard widgets.

## Common Questions
| Question | Answer |
| --- | --- |
| Why are dashboard numbers different from reports? | The dashboard may use summary endpoints or different timing. Use Reports for confirmed financial review. |
| Can staff change dashboard metrics? | Exact behavior not confirmed. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| No dashboard data | Wrong location or no transactions | Selected location and date | Switch context or review reports. |
| Access denied | Role lacks dashboard UI | Role permissions | Ask admin to update access. |

## Edge Cases
- Data can appear blank for a newly created location.
- Staff may see fewer cards than managers.
- Exact behavior not confirmed for cross-location summaries.

## Safe AI Guidance
MovieRa AI can explain what the Dashboard is for and where to go next. It should not quote live revenue, attendance, or booking numbers from documentation. Live numbers require checking MovieRa.

## Source Notes
- Confirmed: route `/admin`, component key `admin_dashboard`.
- Not confirmed: exact widgets, filters, and formulas.
- Needs product review: dashboard metric glossary.

