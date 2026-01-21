
# ByondWork – AI Final Upgrade Playbook
## Human-in-the-Loop Control, Stop Signals, Post-Pilot Iteration & Hiring System

This document is the **final control layer**.
It ensures AI-assisted development stays:
- Safe
- Predictable
- Founder-controlled
- Scalable to a real team

---

## SECTION 1: AI Code Review → Human Decision Framework

AI can review code.
Only humans approve decisions.

### Mandatory Human Approval Checklist (Run Every Time)

Before merging ANY AI-generated code, confirm:

- [ ] I understand **what the code does**
- [ ] I understand **why this approach was chosen**
- [ ] I can explain this code to another developer
- [ ] I can remove this code later if needed
- [ ] This does NOT expand scope

### Human Decision Prompt (Paste into Copilot)

```
Summarize this code in plain English.

Explain:
1. What problem it solves
2. Why this approach was chosen
3. Trade-offs involved
4. How to safely remove or change it later
```

If you cannot understand the response → **DO NOT MERGE**.

---

## SECTION 2: HARD STOP Red Flags (STOP CODING IMMEDIATELY)

If ANY of the following happen, pause development:

### Technical Red Flags
- Copilot introduces a new framework without request
- Security rules become complex or unreadable
- Same logic duplicated 3+ times
- Firestore reads increase unexpectedly

### Product Red Flags
- Feature not in MVP docs appears
- “Just in case” logic added
- Analytics before users exist

### AI Behavior Red Flags
- Copilot says “this is best practice” without explanation
- Copilot avoids answering “why” questions
- Copilot contradicts earlier decisions

👉 When a red flag appears:
- Stop
- Re-anchor to docs
- Roll back if needed

---

## SECTION 3: Post-Pilot Iteration Prompt Set

Use ONLY after 2–4 weeks of real usage.

### Feedback Processing Prompt

```
We have real user feedback.

Separate feedback into:
- Bugs
- UX friction
- Feature requests
- Non-actionable noise

Do NOT propose new features unless directly requested by users.
```

---

### MVP Iteration Prompt

```
Given this feedback, propose:
- Small iterative improvements
- No architectural changes
- No new dependencies

Explain why each change is safe.
```

---

## SECTION 4: Scaling AI Usage (When Team Grows)

### How to Onboard a New Developer Using AI

1. Give them:
   - Architecture docs
   - Prompt playbook
   - This file
2. Rule:
   - They must use Copilot Chat, not freeform coding
3. Every PR must include:
   - AI prompt used
   - AI response summary
   - Human decision notes

---

## SECTION 5: Hiring with This System (VERY IMPORTANT)

### How to Evaluate a Developer

Ask them to:
- Build a small feature
- Using Copilot
- Using your prompt system

Evaluate:
- Prompt quality
- Decision making
- Scope discipline
- Security awareness

Reject candidates who:
- Overdelegate thinking to AI
- Cannot explain AI output
- Skip documentation

---

## SECTION 6: Long-Term Founder Advantage

Because you have:
- Clear docs
- Prompt discipline
- AI governance

You gain:
- Faster iteration
- Lower burn
- Higher code quality
- Easier onboarding
- Strong investor confidence

---

## FINAL RULE (Non-Negotiable)

AI is a **tool**, not a decision-maker.

If AI ever:
- Decides product scope
- Weakens security
- Adds complexity

Then:
- Roll back
- Reset prompts
- Re-anchor to docs

---

## Outcome

With this final layer:
- AI works FOR you
- You remain in control
- The company stays buildable

This completes the AI-assisted execution system for ByondWork.
