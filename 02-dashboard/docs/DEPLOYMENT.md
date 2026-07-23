# Deployment guide

## Supabase

1. Create a Supabase project in the target region.
2. Apply `supabase/migrations/202607240001_initial_schema.sql`.
3. Apply `supabase/migrations/202607240002_rls.sql`.
4. In Authentication settings, enable email/password.
5. Set the production site URL and add the callback URL:
   `https://your-domain.example/auth/callback`.
6. Run the two-account procedure in `docs/SECURITY_TEST.md`.
7. Do not run `seed.sql` in a public production project.

## Application environment

Set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The anonymous key is safe to expose in the browser only because RLS is enabled
and verified. Never expose a service-role key.

## Release checks

1. Run `npm run lint`.
2. Run `npm test`.
3. Verify sign-up, sign-in, sign-out, and callback behavior.
4. Verify create, read, update, and delete for each entity.
5. Run the two-account RLS test.
6. Run Lighthouse against the production URL.
7. Confirm environment variables and auth redirect URLs for the final domain.

## Operational recommendations

- Enable Supabase point-in-time recovery for production.
- Add database backups and query monitoring before onboarding customers.
- Send product errors to an observability service with user data redaction.
- Rotate credentials and review RLS policies as part of each schema change.
