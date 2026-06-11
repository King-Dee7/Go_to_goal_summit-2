import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Force dynamic execution for every request to avoid Next.js caching it
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron auth header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validate request based on environment
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret) {
        console.error('CRON_SECRET environment variable is not set in production.');
        return new NextResponse('Internal Server Error: Missing CRON_SECRET', { status: 500 });
      }
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.warn('Unauthorized attempt to trigger cron keep-alive.');
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      // In development, if CRON_SECRET is set, validate it, otherwise allow bypass with a warning
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.warn('Unauthorized local attempt to trigger cron keep-alive.');
        return new NextResponse('Unauthorized', { status: 401 });
      }
      console.log('Running keep-alive ping in development/test mode.');
    }

    // 2. Initialize the admin Supabase client (which bypasses RLS)
    const supabase = getSupabaseAdmin();

    // 3. Perform a simple database query to generate activity (a read request)
    // We select a single ID from the `invite_codes` table.
    const { data, error } = await supabase
      .from('invite_codes')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database query error in keep-alive cron:', error);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Keep-alive ping database query completed successfully.');
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Keep-alive ping executed successfully.',
        records_found: data?.length || 0,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    console.error('Unexpected error in keep-alive cron handler:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
