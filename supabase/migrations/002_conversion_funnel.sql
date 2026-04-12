-- Conversion funnel RPCs for /admin/conversion dashboard
-- Excludes UA (admin testing) from all metrics

-- 1. Overall funnel stats (with date range)
CREATE OR REPLACE FUNCTION conversion_funnel_stats(
  p_from timestamptz DEFAULT NULL,
  p_to   timestamptz DEFAULT NULL
)
RETURNS TABLE(
  visitors        bigint,
  signups         bigint,
  project_creators bigint,
  first_dubbers   bigint,
  paid_users      bigint,
  avg_signup_to_dub_hours double precision,
  avg_signup_to_paid_hours double precision
)
LANGUAGE sql STABLE
AS $$
  WITH range_filter AS (
    SELECT
      COALESCE(p_from, '2020-01-01'::timestamptz) AS range_from,
      COALESCE(p_to, NOW() + INTERVAL '1 day')    AS range_to
  ),
  v AS (
    SELECT COUNT(DISTINCT ip_hash) AS cnt
    FROM site_visits, range_filter rf
    WHERE first_seen_at >= rf.range_from AND first_seen_at < rf.range_to
      AND (country IS NULL OR country != 'UA')
  ),
  s AS (
    SELECT COUNT(*) AS cnt
    FROM profiles, range_filter rf
    WHERE created_at >= rf.range_from AND created_at < rf.range_to
      AND (country IS NULL OR country != 'UA')
      AND is_admin = false
  ),
  pc AS (
    SELECT COUNT(DISTINCT pr.user_id) AS cnt
    FROM projects pr
    JOIN profiles p ON p.id = pr.user_id
    CROSS JOIN range_filter rf
    WHERE pr.is_demo = false
      AND pr.created_at >= rf.range_from AND pr.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
  ),
  fd AS (
    SELECT COUNT(DISTINCT pr.user_id) AS cnt
    FROM dubs d
    JOIN projects pr ON pr.id = d.project_id
    JOIN profiles p ON p.id = pr.user_id
    CROSS JOIN range_filter rf
    WHERE d.status = 'done'
      AND d.created_at >= rf.range_from AND d.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
  ),
  pu AS (
    SELECT COUNT(DISTINCT t.user_id) AS cnt
    FROM transactions t
    JOIN profiles p ON p.id = t.user_id
    CROSS JOIN range_filter rf
    WHERE t.type = 'subscription'
      AND t.created_at >= rf.range_from AND t.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
  ),
  timing_dub AS (
    SELECT AVG(EXTRACT(EPOCH FROM (first_dub - p.created_at)) / 3600) AS avg_hours
    FROM profiles p
    JOIN LATERAL (
      SELECT MIN(d.created_at) AS first_dub
      FROM dubs d
      JOIN projects pr ON pr.id = d.project_id
      WHERE pr.user_id = p.id AND d.status = 'done'
    ) fd ON fd.first_dub IS NOT NULL
    CROSS JOIN range_filter rf
    WHERE p.created_at >= rf.range_from AND p.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
  ),
  timing_paid AS (
    SELECT AVG(EXTRACT(EPOCH FROM (first_pay - p.created_at)) / 3600) AS avg_hours
    FROM profiles p
    JOIN LATERAL (
      SELECT MIN(t.created_at) AS first_pay
      FROM transactions t
      WHERE t.user_id = p.id AND t.type = 'subscription'
    ) fp ON fp.first_pay IS NOT NULL
    CROSS JOIN range_filter rf
    WHERE p.created_at >= rf.range_from AND p.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
  )
  SELECT
    v.cnt,
    s.cnt,
    pc.cnt,
    fd.cnt,
    pu.cnt,
    timing_dub.avg_hours,
    timing_paid.avg_hours
  FROM v, s, pc, fd, pu, timing_dub, timing_paid;
$$;

-- 2. Funnel breakdown by country (top 20 by visitors, excludes UA)
CREATE OR REPLACE FUNCTION conversion_funnel_by_country(
  p_from timestamptz DEFAULT NULL,
  p_to   timestamptz DEFAULT NULL
)
RETURNS TABLE(
  country          text,
  visitors         bigint,
  signups          bigint,
  project_creators bigint,
  first_dubbers    bigint,
  paid_users       bigint
)
LANGUAGE sql STABLE
AS $$
  WITH range_filter AS (
    SELECT
      COALESCE(p_from, '2020-01-01'::timestamptz) AS range_from,
      COALESCE(p_to, NOW() + INTERVAL '1 day')    AS range_to
  ),
  top_countries AS (
    SELECT sv.country AS c, COUNT(DISTINCT sv.ip_hash) AS vis
    FROM site_visits sv, range_filter rf
    WHERE sv.country IS NOT NULL
      AND sv.country != 'UA'
      AND sv.first_seen_at >= rf.range_from AND sv.first_seen_at < rf.range_to
    GROUP BY sv.country
    ORDER BY vis DESC
    LIMIT 20
  ),
  signups_by AS (
    SELECT p.country AS c, COUNT(*) AS cnt
    FROM profiles p, range_filter rf
    WHERE p.country IS NOT NULL AND p.country != 'UA'
      AND p.is_admin = false
      AND p.created_at >= rf.range_from AND p.created_at < rf.range_to
    GROUP BY p.country
  ),
  projects_by AS (
    SELECT p2.country AS c, COUNT(DISTINCT pr.user_id) AS cnt
    FROM projects pr
    JOIN profiles p2 ON p2.id = pr.user_id
    CROSS JOIN range_filter rf
    WHERE pr.is_demo = false
      AND pr.created_at >= rf.range_from AND pr.created_at < rf.range_to
      AND p2.country IS NOT NULL AND p2.country != 'UA'
      AND p2.is_admin = false
    GROUP BY p2.country
  ),
  dubs_by AS (
    SELECT p2.country AS c, COUNT(DISTINCT pr.user_id) AS cnt
    FROM dubs d
    JOIN projects pr ON pr.id = d.project_id
    JOIN profiles p2 ON p2.id = pr.user_id
    CROSS JOIN range_filter rf
    WHERE d.status = 'done'
      AND d.created_at >= rf.range_from AND d.created_at < rf.range_to
      AND p2.country IS NOT NULL AND p2.country != 'UA'
      AND p2.is_admin = false
    GROUP BY p2.country
  ),
  paid_by AS (
    SELECT p2.country AS c, COUNT(DISTINCT t.user_id) AS cnt
    FROM transactions t
    JOIN profiles p2 ON p2.id = t.user_id
    CROSS JOIN range_filter rf
    WHERE t.type = 'subscription'
      AND t.created_at >= rf.range_from AND t.created_at < rf.range_to
      AND p2.country IS NOT NULL AND p2.country != 'UA'
      AND p2.is_admin = false
    GROUP BY p2.country
  )
  SELECT
    tc.c,
    tc.vis,
    COALESCE(sb.cnt, 0),
    COALESCE(pb.cnt, 0),
    COALESCE(db.cnt, 0),
    COALESCE(pab.cnt, 0)
  FROM top_countries tc
  LEFT JOIN signups_by sb ON sb.c = tc.c
  LEFT JOIN projects_by pb ON pb.c = tc.c
  LEFT JOIN dubs_by db ON db.c = tc.c
  LEFT JOIN paid_by pab ON pab.c = tc.c
  ORDER BY tc.vis DESC;
$$;

-- 3. Daily cohort conversion (for trend chart, excludes UA/admin)
CREATE OR REPLACE FUNCTION conversion_cohort_daily(
  p_from timestamptz DEFAULT NULL,
  p_to   timestamptz DEFAULT NULL
)
RETURNS TABLE(
  day           date,
  signups       bigint,
  first_dubbers bigint,
  paid_users    bigint
)
LANGUAGE sql STABLE
AS $$
  WITH range_filter AS (
    SELECT
      COALESCE(p_from, NOW() - INTERVAL '30 days') AS range_from,
      COALESCE(p_to, NOW() + INTERVAL '1 day')     AS range_to
  ),
  daily_signups AS (
    SELECT DATE(p.created_at) AS d, COUNT(*) AS cnt
    FROM profiles p, range_filter rf
    WHERE p.created_at >= rf.range_from AND p.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
    GROUP BY DATE(p.created_at)
  ),
  daily_dubbers AS (
    SELECT DATE(d.created_at) AS d, COUNT(DISTINCT pr.user_id) AS cnt
    FROM dubs d
    JOIN projects pr ON pr.id = d.project_id
    JOIN profiles p ON p.id = pr.user_id
    CROSS JOIN range_filter rf
    WHERE d.status = 'done'
      AND d.created_at >= rf.range_from AND d.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
    GROUP BY DATE(d.created_at)
  ),
  daily_paid AS (
    SELECT DATE(t.created_at) AS d, COUNT(DISTINCT t.user_id) AS cnt
    FROM transactions t
    JOIN profiles p ON p.id = t.user_id
    CROSS JOIN range_filter rf
    WHERE t.type = 'subscription'
      AND t.created_at >= rf.range_from AND t.created_at < rf.range_to
      AND (p.country IS NULL OR p.country != 'UA')
      AND p.is_admin = false
    GROUP BY DATE(t.created_at)
  ),
  all_days AS (
    SELECT DISTINCT d FROM (
      SELECT d FROM daily_signups
      UNION SELECT d FROM daily_dubbers
      UNION SELECT d FROM daily_paid
    ) x
  )
  SELECT
    ad.d,
    COALESCE(ds.cnt, 0),
    COALESCE(dd.cnt, 0),
    COALESCE(dp.cnt, 0)
  FROM all_days ad
  LEFT JOIN daily_signups ds ON ds.d = ad.d
  LEFT JOIN daily_dubbers dd ON dd.d = ad.d
  LEFT JOIN daily_paid dp ON dp.d = ad.d
  ORDER BY ad.d;
$$;
