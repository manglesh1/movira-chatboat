# Waivers, Customers, And CRM

## Purpose
This module covers customer records, waiver signing, waiver holders, custom forms, CRM contacts, and customer history. Waivers prove legal coverage for adults and minors; customers/guests connect bookings, memberships, gift cards, voucher packs, communication history, and visit records.

## Who Uses This
| User Type | What They Do Here |
| --- | --- |
| Staff | Search customers, send waiver links, check waiver status, review forms. |
| Manager | Resolve duplicate customers, review waiver/compliance issues, inspect CRM history. |
| Admin | Configure waivers, forms, and CRM fields/settings. |

## Navigation Paths
| Task | Path | Notes |
| --- | --- | --- |
| List customers | **Guests > Customers** | Route `/customers`. |
| View customer detail | **Guests > Customers > Customer Profile** | Exact URL uses customer ID. |
| Waiver setup | **Admin > Waiver Setup** | Route `/waivers`. |
| Waiver holders | **Guests > Waiver Holders** | Route `/waiver-holders`. |
| Customer forms | **Connected Apps > Forms** | Route `/customer-forms`. |
| CRM contacts | **CRM > Customers** | Route `/crm/contacts`. |

## Page Layout
- Customers list: searchable customer/guest records.
- Customer profile: details, bookings, waivers, memberships, gift cards, vouchers, and activity. Exact tabs not fully confirmed.
- Waiver setup: waiver content, page settings, custom form fields, publish/version controls.
- Waiver holders: flattened list of adults/minors with waiver status.
- CRM contacts: marketing/contact fields, tags, filters, profile drawer.

## Tabs
### Tab: Waivers
#### Purpose
Show signatures, coverage, minors, expiry, and waiver history.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| signedByName | Adult signer. | Stored on signature. |
| holderType | adult or minor. | Waiver holders flatten minors into rows. |
| expiredAt | Coverage end date. | Used to determine active/expired. |
| waiverStatus | active or expired. | Query/read side. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Send waiver link | Creates/reuses pending token and emails or returns link. | Completed signature gets new pending token for re-signing. |
| Publish waiver | Creates new waiver version. | Can expire existing coverage if configured. |
#### Statuses
| Status | Meaning | What Staff Should Do |
| --- | --- | --- |
| pending | Link exists but not signed. | Remind customer or resend/copy link. |
| completed | Waiver submitted. | Check expiry/coverage. |
| active | Coverage valid now. | Allow covered activity if other rules pass. |
| expired | Coverage no longer valid. | Request new signature. |

### Tab: CRM Contacts
#### Purpose
Manage customer contact data, tags, fields, and marketing audience context.
#### Fields And Columns
| Field Or Column | Meaning | Notes |
| --- | --- | --- |
| Email | Contact address. | Used for CRM and transactional messages. |
| Tags | Customer grouping. | Exact tag behavior not fully confirmed. |
| Custom fields | Configured contact fields. | Managed by CRM field tools. |
#### Actions
| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |
| Filter | Narrows contacts. | Advanced filter drawer exists. |
| Manage fields | Edits contact fields. | Admin/manager action. |

## Main Workflows
### Workflow: Send Waiver Link
1. **Open Customer/Booking:** Find the guest from **Guests > Customers** or booking details.
2. **Send Link:** Use waiver action to email or copy the waiver URL.
3. **Customer Signs:** Public waiver form records signature, coverage, minors, and custom responses.
4. **Verify:** Check Waiver Holders or booking Waivers tab before check-in.

### Workflow: Review Customer History
1. **Open Customers:** Go to **Guests > Customers**.
2. **Search Customer:** Use name/email/phone where available.
3. **Open Profile:** Review bookings, waivers, issued products, and activity. Exact tabs not confirmed.

## Field Reference
| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |
| guestId | System | Customer/guest identifier. | 25 | Used across bookings and waivers. |
| waiverVersionId | System | Version signed. | 42 | Snapshot preserved for audit. |
| token | System | One-time waiver URL token. | 64-char hex | Pending links only. |
| minors | No | Dependents covered by adult. | Child name/date of birth | Creates coverage and participants when booking-linked. |

## Buttons And Actions
| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |
| Send Link | Waiver/customer/booking UI | Sends or copies waiver URL. | Staff | Verify correct customer. |
| Publish | Waiver setup | Creates waiver version. | Admin | Legal/product review recommended. |
| Manage Fields | CRM contacts | Configures custom fields. | Admin/manager | Impacts contact records. |

## Statuses And Meanings
| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |
| pending | Waiver not signed yet. | Link sent | Resend/remind. |
| completed | Signature stored. | Customer submitted form | Check validUntil. |
| active | Coverage currently valid. | Not expired | Normal. |
| expired | Coverage invalid now. | Date passed or version expired | Request re-sign. |

## Rules And Constraints
- One adult can cover self plus multiple minors in one waiver submission.
- Completed waiver signatures store version snapshots for audit.
- Waiver links are token-based and pending-only.
- Required waiver coverage can block ticket redemption/check-in.

## Common Questions
| Question | Answer |
| --- | --- |
| Why does the minor appear as a waiver holder? | Waiver holders flatten each covered minor into a row. |
| Can a completed waiver be reused? | Coverage remains valid until expired; re-signing creates a new pending token if needed. |

## Troubleshooting
| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |
| Waiver link says not found | Token completed/invalid/missing | Signature status/token | Send a new link. |
| Check-in blocked | Missing/expired coverage | Waiver tab/holders | Have customer sign. |
| Duplicate customer | Separate guest/contact records | Email/phone/profile history | Manager review; merge behavior not confirmed. |

## Edge Cases
- Minors may not have Guest rows; coverage can point to booking participants.
- Publishing legal changes can expire existing coverage if configured.
- Custom form responses wipe-and-rewrite on submit for that signature.

## Safe AI Guidance
MovieRa AI can explain waiver status and where to check. It should not provide legal advice, claim a waiver is valid without live data, or bypass a required waiver block.

## Source Notes
- Confirmed: waiver token flow, coverage model, holders flattening, CRM contact pages.
- Not confirmed: every customer profile tab and merge behavior.
- Needs product review: official waiver legal copy/process.

