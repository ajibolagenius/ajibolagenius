// Notify course waitlist when a course is marked open for enrolment.
// Invoke from admin after setting course.open_for_enrolment = true.
// Requires: RESEND_API_KEY, optional FROM_EMAIL (e.g. "Portfolio <noreply@yourdomain.com>").
/// <reference path="./deno.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

interface Body {
  course_slug: string;
  course_name: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') || 'Portfolio <onboarding@resend.dev>';

  try {
    if (!resendKey) {
      return jsonResponse({ ok: false, error: 'RESEND_API_KEY not set', sent: 0 }, 500);
    }

    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid JSON body', sent: 0 }, 400);
    }

    const { course_slug, course_name } = body;
    if (!course_slug || !course_name) {
      return jsonResponse({ ok: false, error: 'course_slug and course_name required', sent: 0 }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ ok: false, error: 'Supabase env not configured', sent: 0 }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: rows, error: fetchError } = await supabase
      .from('course_waitlist')
      .select('email')
      .or(`course_slug.eq.${course_slug},course_slug.is.null`);

    if (fetchError) {
      const err = fetchError as { message?: string };
      return jsonResponse({ ok: false, error: err?.message ?? 'Fetch failed', sent: 0 }, 500);
    }

    const list = (rows ?? []) as { email?: string }[];
    const emails = [...new Set(list.map((r) => r.email).filter(Boolean))];
    if (emails.length === 0) {
      return jsonResponse({ ok: true, sent: 0, message: 'No waitlist entries for this course' }, 200);
    }

    const subject = `${course_name} is now open for enrolment`;
    const html = `
    <p>You signed up to be notified when <strong>${course_name}</strong> opens.</p>
    <p>It's now open for enrolment. Head to the Teach page to enrol via WhatsApp or get in touch.</p>
    <p>— Your portfolio</p>
  `.trim();

    let sent = 0;
    for (const to of emails) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({ from: fromEmail, to: [to], subject, html }),
      });
      if (res.ok) sent += 1;
    }

    return jsonResponse({ ok: true, sent, total: emails.length }, 200);
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Internal error', sent: 0 },
      500
    );
  }
});
