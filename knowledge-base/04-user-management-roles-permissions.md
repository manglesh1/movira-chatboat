# User Management, Roles, And Permissions

## Purpose
This module controls who can sign in, which locations they can access, and which UI pages/actions they can use. It includes users, roles, role permissions, location access, and POS-specific PIN behavior. Permission mistakes can hide pages, block terminal login, or expose manager-only actions.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Admin | Create users, assign roles, configure UI/action permissions. |
| Manager | Review staff access and location assignment if permitted. |
| Staff | Usually manage only their own login/PIN indirectly. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| List users | **Admin > Users** | Route `/list/users`. |
| Create user | **Admin > Users > Create User** | Route `/create/user`. |
| List roles and permissions | **Admin > Roles & Permissions** | Route `/list/roles-permissions`. |
| Create role | **Admin > Roles & Permissions > Create Role** | Route `/create/roles-permissions`. |

## Page Layout
- Users list: staff/admin accounts, filters, and row actions. Exact columns not confirmed.
- User form: identity, login credentials, role, location access, POS settings. Exact fields not confirmed.
- Roles list: role definitions and permissions.
- Role editor: UI/page and action permission configuration.

## Tabs
### Tab: Users
#### Purpose
Create and maintain staff accounts.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Name | Staff display name. | Used in audits and UI. |
| Email | Login identifier. | Required for login. |
| Role | Permission grouping. | Controls access. |
| Locations | Venues user can access. | Required for location-scoped work. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Create User | Opens user form. | Admin/manager only. |
| Edit | Updates account settings. | Avoid changing role without approval. |
| Delete/disable | Removes access. | Exact behavior not confirmed. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Active | User can sign in. | Normal. |
| Disabled | User should not be able to sign in. | Ask admin if incorrect. |

### Tab: Roles & Permissions
#### Purpose
Control access to pages and actions.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Role name | Permission group. | Example: Manager, Staff. |
| UI permission | Page/menu access. | Backed by `uis` records. |
| Action permission | Operation-level access. | Exact actions vary by module. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Create Role | Adds a new role. | Test access after saving. |
| Save Permissions | Updates role matrix. | Can immediately affect users. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| Allowed | User can access feature/action. | Use normally. |
| Denied | User cannot access feature/action. | Ask manager/admin if needed. |

## Main Workflows
### Workflow: Add A Staff User
1. **Open Users:** Go to **Admin > Users**.
2. **Create User:** Enter identity and login fields.
3. **Assign Role And Locations:** Select the correct role and venue access.
4. **Save:** Ask the user to sign in and verify page access.

### Workflow: Fix Missing Page Access
1. **Confirm User:** Identify the affected staff account.
2. **Review Role:** Go to **Admin > Roles & Permissions**.
3. **Review UI Permissions:** Ensure the role includes the requested page.
4. **Review Location Access:** Confirm the user belongs to the relevant location.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| email | Yes | Login identifier. | staff@example.com | Must be unique. Exact validation not confirmed. |
| role | Yes | Permission set. | Manager | Drives UI/action access. |
| location access | Conditional | Locations user can operate. | Downtown | Required for POS location gate. |
| POS PIN | Conditional | PIN used for clock-in and manager override. | 1234 | Stored hashed; exact UI field not confirmed. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Create User | Users page | Adds account. | Admin/manager | Requires role/location review. |
| Create Role | Roles page | Adds permission group. | Admin | Test with a user. |
| Save | Forms | Persists changes. | Admin/manager | Access changes can be immediate. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| Access denied | Role lacks permission. | Missing UI/action permission | Update role or use approved account. |
| Location denied | User not assigned to terminal location. | POS login gate | Add location access or use correct terminal. |

## Rules And Constraints
- Super-admin may bypass some location checks.
- Cashier login validates both credentials and paired terminal location access.
- Manager overrides require a manager-tier PIN and reject non-manager PINs.
- Same-user manager override is refused by POS manager override flow.

## Common Questions
| Question | Answer |
| --- | --- |
| Why can I log in but not see Bookings? | Your role likely lacks the Bookings UI permission. |
| Why does POS say I do not have access to this location? | The terminal is paired to a location your user is not assigned to. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Missing menu page | UI permission absent | Role matrix | Grant page access. |
| Manager PIN rejected | PIN invalid or user not manager-tier | User role/PIN | Use correct manager PIN. |
| Login blocked at terminal | User lacks location | User locations and device location | Assign matching location. |

## Edge Cases
- Role labels can be customized, so staff should verify permissions, not just the role name.
- A hidden menu item may still have a route.
- POS pairing determines terminal location before staff login.

## Safe AI Guidance
MovieRa AI can explain access concepts and troubleshooting steps. It should not reveal passwords, PINs, or advise bypassing permissions. Permission changes require admin/manager action and live system review.

## Source Notes
- Confirmed: user/role routes, UI/component key permission structure, POS location gate, manager override rules.
- Not confirmed: exact user form fields and full action permission matrix.
- Needs product review: official role taxonomy.

