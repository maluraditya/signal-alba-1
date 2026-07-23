# Two-account RLS verification

Run these tests against a disposable local or staging Supabase project after
applying both migrations and `seed.sql`.

## Accounts

- Account A: `alex@pipelineos.demo`
- Account B: `sam@pipelineos.demo`
- Seed password: `PipelineOS-demo-2026!`

## Verification procedure

1. Sign in as Account A and create one company, contact, deal, activity, and tag.
2. Record only the generated UUIDs. Do not share the Account A session token.
3. Sign out and sign in as Account B.
4. List every table. Account A's rows must not appear.
5. Request each Account A UUID directly. Every select must return no row.
6. Attempt to update and delete each Account A UUID. No row may change.
7. Attempt to create an Account B contact linked to Account A's company UUID.
   The ownership trigger must reject it.
8. Repeat the relationship test for deal/company, activity/deal, and
   deal-tag/tag.
9. Call `get_dashboard_analytics()`. Its values must reflect only Account B.
10. Sign back in as Account A and confirm every original row still exists.

## Expected result

Account B can create and manage its own records but cannot observe, mutate,
delete, aggregate, or reference any Account A record.

This repository includes the deterministic test procedure but cannot claim a
live pass until it is run against the target Supabase project.
