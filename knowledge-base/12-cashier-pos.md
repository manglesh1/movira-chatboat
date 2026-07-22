# Cashier And POS

## Purpose
The Cashier/POS module supports physical counter operations: paired devices, staff login, POS presets, product tiles, payment tenders, ticket scanning, check-in, manager overrides, and device audit stamping. The cashier app is separate from the admin bundle and talks to the same backend.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Cashier | Log into paired terminal, sell items, scan tickets, check in guests. |
| Manager | Pair devices, configure presets/settings, approve overrides. |
| Admin | Configure POS devices, payment routes, and location access. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| Manage terminals/POS | **Connected Apps > Terminals** | Route `/pos`. |
| Manage POS presets | **Connected Apps > POS Presets** | Routes `/pos/templates` and `/pos/presets/:id` where enabled. |
| Manage POS settings | **Connected Apps > POS Settings** | Route `/pos`. |
| Use cashier app | **Cashier App > Pair Terminal > Login > Operate** | Standalone app flow. |

## Page Layout
- POS admin page: devices, templates/presets, ticket holders, settings. Exact tab layout not fully confirmed.
- Preset builder: sections and activity tiles.
- Cashier app: pair terminal, login, catalog/cart, redeem/check-in tools.

## Tabs
### Tab: Devices
#### Purpose
Manage physical terminals.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Device name | Register/lane label. | Used as gateOrZone. |
| Location | Paired venue. | Login is location-gated. |
| Template | POS menu assigned. | Can be null. |
| Pairing code | Single-use 6-digit code. | 24-hour default expiry. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Generate pairing code | Creates fresh code. | Manager reads code to cashier. |
| Unpair | Clears terminal binding. | Tablet returns to PairTerminal. |

### Tab: POS Presets
#### Purpose
Build cashier product menus.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Template | Menu blueprint. | Assigned to devices. |
| Section | Tab/category on terminal. | Ordered. |
| Tile | Activity/product button. | Has display order/color. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Add section | Creates menu section. | Sections order visually. |
| Add activity tile | Adds catalog item to section. | Does not edit underlying catalog item. |

## Main Workflows
### Workflow: Pair A Cashier Terminal
1. **Generate Code:** Manager opens **Connected Apps > Terminals** and generates a pairing code.
2. **Enter Code:** Cashier opens cashier app and types the code.
3. **Store Device Snapshot:** App stores device/location/template details locally.
4. **Login:** Staff login is allowed only if user has access to paired location.

### Workflow: Redeem At POS
1. **Login To Terminal:** Cashier signs in on paired device.
2. **Scan Ticket:** Cashier scans code.
3. **Resolve Blocks:** Check waiver, status, time window, and manager override if applicable.
4. **Redeem:** MovieRa writes redemption with terminal and staff audit fields.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| posDeviceId | System | Physical terminal ID. | 42 | Stamped on audits. |
| pairingCode | Conditional | Pairing PIN/code. | 123456 | Single-use, expires. |
| tillFloat | No | Starting cash value. | 150.00 | Inherited at device creation if unset. |
| posTemplateId | No | Assigned menu preset. | 12 | Cashier catalog loaded live by template. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Pair | Cashier app | Binds tablet to device. | Cashier with manager code | No auth before pairing. |
| Switch terminal | Cashier login | Clears/changes terminal. | Manager/cashier | Exact guard not confirmed. |
| Manager override | Cashier modal | Manager approves blocked action with PIN. | Manager | Same-user overrides refused. |
| Heartbeat | Background | Updates last seen. | System | Every 60 seconds. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Paired | Device snapshot exists. | Successful code exchange | Staff can log in. |
| Unpaired | Tablet has no binding. | New/unpaired device | Pair with code. |
| Code expired | Pairing code expired. | 24 hours passed | Generate new code. |
| Device disabled | Device inactive. | Admin disabled it | Ask manager/admin. |

## Rules And Constraints
- Pairing code is unauthenticated but single-use.
- User must have access to the terminal's paired location.
- Sign-out does not clear terminal pairing.
- POS template changes appear after cashier refetch; no re-pairing needed.
- POS config deletes are hard deletes per current reference.

## Common Questions
| Question | Answer |
| --- | --- |
| Why can staff not log into Lane 1? | The paired location may not be assigned to that staff user. |
| Why did the cashier menu not update? | Check the device template assignment and refresh/refetch the cashier app. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Invalid code | Already used/wrong code | Device pairing code | Generate a new code. |
| Access denied after login | Location mismatch | User location access | Assign correct location. |
| Missing tile | Product not in template | POS preset sections | Add tile and refetch. |

## Edge Cases
- Devices can be assigned a template or left unassigned.
- Device till float freezes at creation; later template default changes do not resync.
- Planned shift reconciliation is not built.

## Safe AI Guidance
MovieRa AI can explain POS setup and troubleshooting. It should not reveal PINs, approve overrides, or instruct staff to bypass location access.

## Source Notes
- Confirmed: pairing/login/heartbeat flow, POS template/device model, manager override.
- Not confirmed: exact POS admin tab labels.
- Needs product review: final cash drawer/shift policy.

