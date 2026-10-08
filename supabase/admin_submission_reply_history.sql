create or replace function public.admin_submission_reply_history(p_submission_id uuid)
returns table (
  id bigint,
  message text,
  created_at timestamptz,
  telegram_request_id bigint,
  delivery_status text,
  telegram_http_status integer
)
language sql
security definer
set search_path = ''
as $$
  select
    d.id,
    d.message,
    d.created_at,
    d.telegram_request_id,
    case
      when r.id is null then 'pending'
      when r.timed_out or r.error_msg is not null then 'failed'
      when r.status_code between 200 and 299
        and coalesce((r.content::jsonb ->> 'ok')::boolean, false) then 'delivered'
      else 'failed'
    end as delivery_status,
    r.status_code as telegram_http_status
  from public.day_submission_replies d
  left join net._http_response r on r.id = d.telegram_request_id
  where d.submission_id = p_submission_id
    and exists (
      select 1
      from public.admin_users a
      where a.user_id = (select auth.uid())
    )
  order by d.created_at desc;
$$;

revoke all on function public.admin_submission_reply_history(uuid) from public;
grant execute on function public.admin_submission_reply_history(uuid) to authenticated;
