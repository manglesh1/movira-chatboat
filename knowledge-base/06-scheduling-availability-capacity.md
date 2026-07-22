# Scheduling, Availability, And Capacity

## Purpose
Scheduling turns catalog variations and location hours into pre-generated bookable slots. Availability is based on generated `SessionSlots`, capacity remaining, resource/area rules, holidays, special hours, and existing bookings. This module is critical for answering why a date, time, or activity is not bookable.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Manager | Build schedules, store hours, and capacity windows. |
| Admin | Configure operating hours, areas, and resource rules. |
| Staff | Check booking availability and offer alternate slots. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Manage activity schedules | **Catalog > Activity Schedule** | Route `/session-planner`. |
| Manage store hours | **Catalog > Store Hours** | Route `/store-hours`. |
| View booking calendar | **Command > Calendar** | Route `/bookings`. |
| Manage zones and areas | **Admin > Zones & Areas** | Route `/zones-areas`. |

## Page Layout
- Schedule list/calendar: configured schedules and generated slot status.
- Schedule form: activity, variations, resources, date range, days/custom dates, exceptions, start interval, operating window options.
- Store hours: weekly hours and special closures/overrides.
- Availability screens: selected activity/date/time and available capacity.

## Tabs
### Tab: Schedule Setup
#### Purpose
Define when an activity is bookable.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Activity | Catalog item being scheduled. | Must have variations/resources. |
| Date from/to | Schedule window. | Auto-extend can roll forward. |
| Days/custom dates | Recurrence rules. | Selected days or exact dates. |
| Exception dates | Dates skipped. | Holidays/closures. |
| Session start every | Interval between starts. | Example: every 30 minutes. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Create schedule | Saves schedule and starts slot generation. | Generation runs in background. |
| Update schedule | Deletes/regenerates affected slots. | Active bookings can block destructive changes. |
| Delete schedule | Removes schedule and slots if safe. | Rejects if active bookings reference slots. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| pending | Slot generation has not completed. | Wait or check again. |
| in_progress | Slots are generating. | Avoid assuming all dates are ready. |
| completed | Slots generated. | Normal. |
| failed | Slot generation failed. | Ask manager/admin to investigate. |

## Main Workflows
### Workflow: Create Slots For An Activity
1. **Open Schedule:** Go to **Catalog > Activity Schedule**.
2. **Choose Activity And Variations:** Select the activity, included variations, and included resources.
3. **Set Dates And Hours:** Add date range, days/custom dates, exceptions, and interval.
4. **Save:** MovieRa generates slots in the background and updates generation status.

### Workflow: Troubleshoot Missing Availability
1. **Confirm Store Hours:** Check **Catalog > Store Hours** for open hours and special closures.
2. **Check Schedule:** Confirm schedule date, selected days/custom dates, and exception dates.
3. **Check Capacity:** Confirm area/resource capacity and existing bookings.
4. **Check Generation Status:** Look for pending, in_progress, completed, or failed.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| schedulePeriod | Yes | Date rule mode. | selected_days | Custom dates only book exact dates. |
| includedVariationIds | Yes | Variations to generate. | [1,2] | Empty can produce no slots. |
| includedResourceIds | Conditional | Areas/resources included. | Main Court | Used for capacity. |
| autoExtended | No | Rolls schedule forward. | true | Cron extends by booking window. |
| maxBookingAllowWindows | Conditional | How far ahead to keep slots. | 90 days | Used with auto-extend. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Save Schedule | Schedule form | Saves and triggers generation. | Manager/admin | Review status after save. |
| Delete Schedule | Schedule list | Deletes if no active bookings block it. | Admin/manager | Irreversible impact. |
| Search Availability | Booking screens | Shows open slots. | Staff/manager | Uses generated slots. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| location_closed | Location is closed that day. | Store hours/special hours | Change hours only if correct. |
| exception_date | Schedule excludes date. | Holiday/closure | Remove exception if incorrect. |
| not_selected_day | Day is not in schedule recurrence. | Wrong day selected | Update schedule. |
| no_variations | No matching variations. | Setup incomplete | Add variations. |
| capacity full | Existing bookings consumed capacity. | Sold out slot | Offer alternate time. |

## Rules And Constraints
- Runtime availability reads generated slots, not ad hoc schedule calculations.
- Booking creation/edit locks slots and decrements available capacity in a transaction.
- Schedule updates can delete/regenerate slots and may be blocked by active bookings.
- Location special hours override normal operating windows.

## Common Questions
| Question | Answer |
| --- | --- |
| Why does a future date not show? | The schedule may not extend that far, auto-extension may not have run, or generation may be pending/failed. |
| Can staff overbook a full slot? | Standard booking flow rejects insufficient capacity. Manager override behavior not confirmed. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Slots missing for one date | Exception/special closure | Schedule exceptions and store hours | Correct setup and regenerate. |
| Slots missing for all dates | No variations/resources | Activity and schedule setup | Add required configuration. |
| Oversell concern | Concurrent booking race | Booking audit and capacity locks | Booking flow uses row locks; investigate manual edits. |

## Edge Cases
- Duration longer than operating window skips slot generation.
- Auto-extend generates forward one day at a time.
- Active bookings can prevent schedule deletion or update.
- Resource buffer minutes affect overlap calculations.

## Safe AI Guidance
MovieRa AI can explain confirmed slot-generation rules and troubleshooting checks. It should not promise capacity exists without checking the live slot. Capacity overrides and schedule changes require manager/admin approval.

## Source Notes
- Confirmed: slot generation modes, schedule statuses, skip reasons, capacity locks.
- Not confirmed: every visible schedule form label.
- Needs product review: manager override policy for sold-out slots.

