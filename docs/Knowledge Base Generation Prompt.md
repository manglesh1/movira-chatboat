# Knowledge Base Generation Prompt

Use this prompt to generate detailed MovieRa knowledge-base files for RAG.

```text
You are helping create the complete knowledge base for MovieRa AI, a RAG-based assistant inside the MovieRa web app.

Goal:
Create detailed, accurate, staff-facing and manager-facing Markdown documentation that covers every page, tab, screen, button, field, workflow, status, setting, permission concept, and operational rule inside MovieRa.

The knowledge base will be used for retrieval augmented generation, so the documentation must be written in a way that is easy to search, chunk, retrieve, and cite.

Important:
- Do not write marketing copy.
- Do not write vague summaries.
- Do not skip small UI details.
- Do not invent functionality.
- If something is unknown, write: "Exact behavior not confirmed."
- If an exact navigation path is known, always include it.
- If a page has tabs, document every tab separately.
- If a page has forms, document every field separately.
- If a page has buttons, document every button and what it does.
- If a workflow has statuses, document every status and what it means.
- If a workflow has edge cases, document those edge cases.
- If the same feature behaves differently for admin, manager, or staff, mention it clearly, but do not make assumptions.

Output format:
Create multiple Markdown files. Each file should focus on one MovieRa module.

Required files:

01-platform-overview-navigation.md
02-dashboard-home.md
03-admin-setup-organization-locations.md
04-user-management-roles-permissions.md
05-products-activities-catalog.md
06-scheduling-availability-capacity.md
07-booking-portal-online-checkout.md
08-bookings-management.md
09-payments-refunds-transactions.md
10-tickets-checkin-redemption.md
11-waivers-customers-crm.md
12-cashier-pos.md
13-parties-events-groups.md
14-discounts-promotions-coupons.md
15-reports-analytics-revenue.md
16-notifications-email-sms-templates.md
17-settings-configuration.md
18-staff-daily-operations-guide.md
19-manager-operations-guide.md
20-troubleshooting-faq.md
21-movira-ai-guardrails-and-refusals.md

Each Markdown file must use this structure:

# Page Or Module Name

## Purpose
Explain what this page/module is used for in 2-4 sentences.

## Who Uses This
List the user types who commonly use this module.

Use this table:

| User Type | What They Do Here |
| --- | --- |

## Navigation Paths
List every confirmed path to reach this page or feature.

Use this table:

| Task | Path | Notes |
| --- | --- | --- |

Path format must be exact:
**Main Menu > Section > Page > Tab**

Examples:
- **Catalog > Activities**
- **Bookings > Booking Details > Payments**
- **Customers > Customer Profile > Waivers**

## Page Layout
Describe the major areas of the page from top to bottom.

For each visible area, include:
- Area name
- What it shows
- What actions are available
- Important filters, tabs, or controls

## Tabs
If the page has tabs, create one section per tab.

Use this format:

### Tab: Tab Name

#### Purpose

#### Fields And Columns

| Field Or Column | Meaning | Notes |
| --- | --- | --- |

#### Actions

| Button Or Action | What It Does | Important Notes |
| --- | --- | --- |

#### Statuses

| Status | Meaning | What Staff Should Do |
| --- | --- | --- |

## Main Workflows
Document workflows step by step.

Use this format:

### Workflow: Workflow Name

One short summary sentence.

1. **Step Name:** Explain exactly what the user does.
2. **Step Name:** Explain the next action.
3. **Step Name:** Explain what happens after saving/submitting.

Include exact navigation paths wherever possible.

## Field Reference
Document every form field.

Use this table:

| Field | Required? | What It Means | Example | Notes |
| --- | --- | --- | --- | --- |

## Buttons And Actions
Document every button, icon, menu item, and action.

Use this table:

| Action | Where It Appears | What It Does | Who Should Use It | Notes |
| --- | --- | --- | --- | --- |

## Statuses And Meanings
Document every status visible in this module.

Use this table:

| Status | Meaning | Common Cause | Recommended Action |
| --- | --- | --- | --- |

## Rules And Constraints
List important business rules.

Examples:
- What must be configured before this feature works.
- What cannot be changed after publishing.
- What happens when capacity is full.
- What happens when payment fails.
- What staff should not do.

## Common Questions
Create detailed FAQs.

Use this table:

| Question | Answer |
| --- | --- |

Write questions in the way real staff or managers would ask them.

## Troubleshooting
List common problems and fixes.

Use this table:

| Issue | Likely Cause | What To Check | Recommended Fix |
| --- | --- | --- | --- |

## Edge Cases
Document unusual but important cases.

Examples:
- Partial payment
- Failed payment
- No waiver found
- Booking moved to another time
- Customer has duplicate profile
- Ticket already redeemed
- Activity unavailable
- Staff cannot see a page
- Refund requested
- Capacity is full
- Discount code not applying

## Safe AI Guidance
Explain how MovieRa AI should answer questions about this module.

Include:
- What the AI can explain
- What the AI should not claim
- What requires a manager/admin
- What requires checking the live MovieRa system
- What information is not available from documentation alone

## Source Notes
At the end, list any assumptions, unknowns, or areas needing confirmation.

Use:
- Confirmed:
- Not confirmed:
- Needs product review:

Writing rules for RAG quality:
- Use clear headings every 200-500 words.
- Keep paragraphs short.
- Prefer tables for fields, statuses, tabs, and buttons.
- Prefer numbered lists for workflows.
- Repeat exact feature names and page names naturally.
- Include common synonyms that users may type.
  Example: booking, reservation, order, guest visit.
- Include exact labels as they appear in the UI.
- Do not combine unrelated modules in one file.
- Do not write one huge document.
- Do not include secrets, API keys, private customer data, real payment data, or live account records.
- Do not include code unless the page is technical/admin-facing and code is actually visible to users.

For every MovieRa page, collect and document:
- Page name
- URL path if available
- Navigation path
- Tabs
- Filters
- Search fields
- Tables and columns
- Forms and fields
- Buttons
- Menus
- Modals
- Empty states
- Success states
- Error states
- Permissions or visibility notes if confirmed
- Statuses
- Workflows
- Troubleshooting
- FAQs

Tone:
Write in simple operational language for staff and managers. The assistant should be able to reuse the wording directly when answering.

Final output:
Return the complete Markdown content for each file separately, with the file name shown before each document.
```
