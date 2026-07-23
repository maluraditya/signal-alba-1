revoke execute on function public.get_dashboard_analytics() from public;
revoke execute on function public.get_dashboard_analytics() from anon;
grant execute on function public.get_dashboard_analytics() to authenticated;
