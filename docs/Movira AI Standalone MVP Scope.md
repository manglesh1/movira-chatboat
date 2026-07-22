# Movira AI Standalone MVP Scope

## 1. Who will use Movira AI?

Movira AI V1 is for Movira staff and managers who need quick help understanding operations, setup, bookings, waivers, payments, parties, reports, and internal processes.

Primary users:

- Front desk staff
- Venue managers
- Operations managers
- Support or admin team members
- Internal demo reviewers

V1 assumes the user is already allowed to see the uploaded demo knowledge base. It does not connect to real Movira accounts, roles, venues, customers, bookings, payments, or waivers.

## 2. What should Movira AI help with?

Movira AI should answer questions using only the approved standalone knowledge base and sample demo data.

It should help with:

- Explaining how Movira works
- Answering setup and admin questions
- Explaining booking flows
- Explaining waiver flows
- Explaining payment and refund concepts
- Explaining party package operations
- Explaining dashboard and report meanings
- Helping staff find the right internal guide or policy
- Summarizing demo report data when sample data is provided

The assistant should behave like a careful internal help assistant, not like an autonomous agent.

## 3. What documents will we give it?

The V1 knowledge base should include approved Movira documents only.

Initial document types:

- Movira product overview
- Staff FAQ
- Booking setup guide
- Booking operations guide
- Waiver process guide
- Payment process guide
- Party package process guide
- Dashboard and reports guide
- Support policy notes
- Demo report data notes

Supported file formats for V1:

- Markdown files
- Text files
- JSON or CSV demo data later

PDF support can be added later if needed.

## 4. What questions should it answer first?

V1 should prioritize common staff and manager questions.

Example questions:

- What is Movira AI allowed to answer?
- How does the booking process work?
- How does a waiver get completed?
- What should staff check before a party starts?
- How should staff explain payment status?
- What does the booking dashboard show?
- What does the revenue summary mean in the demo?
- What happened in the last 2 days using sample demo data?
- Which guide explains party setup?
- What should I do if the knowledge base does not contain the answer?

Every answer should include sources when it uses the knowledge base.

## 5. What should it NOT do in V1?

Movira AI V1 must not:

- Connect to the real Movira backend
- Query the real Movira database
- Read or expose real customer data
- Create, edit, cancel, or refund bookings
- Send emails, SMS messages, reminders, or notifications
- Complete waivers or payments
- Pretend that an action was completed
- Invent numbers, policies, links, or operational steps
- Give legal, HR, medical, or safety advice
- Override staff judgment or official policy
- Answer from outside knowledge when the knowledge base does not support the answer

If the answer is missing from the uploaded knowledge base, it should say that it does not know and suggest which document should be added.

## 6. What should the demo look like?

The standalone demo should look like a simple staff assistant.

Demo experience:

- Staff opens a chat screen
- Staff starts a new conversation
- Staff asks an operations or help question
- Backend searches the vector knowledge base
- Assistant answers using only matched knowledge
- Assistant shows source document names
- Staff can see conversation history in the same browser session
- Staff can give basic feedback on an answer

The UI should include:

- Left conversation list
- Main chat area
- Message input
- Source links under answers
- New conversation button
- Basic feedback buttons

## 7. What is success for the first version?

The first version is successful when:

- A staff user can ask questions in the standalone chat UI
- The backend uses vector search before calling the LLM
- Answers are grounded in the uploaded Movira knowledge base
- Answers show source documents
- The assistant refuses unsupported or unsafe requests
- No real Movira backend, database, customer data, or actions are used
- The app can run locally with an LLM API key
- The scope is clear enough to move into Step 2 project setup and Step 3 knowledge-base expansion
