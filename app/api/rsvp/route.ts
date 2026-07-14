import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
  }

  if (!['in-person', 'virtual', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status parameter.' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('applications')
      .update({ rsvp_status: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating RSVP status:', error);
      return NextResponse.json({ error: 'Failed to update RSVP status.' }, { status: 500 });
    }

    // Redirect to success page
    const redirectUrl = new URL('/rsvp-success', request.url);
    redirectUrl.searchParams.set('status', status);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Unexpected error in RSVP API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
