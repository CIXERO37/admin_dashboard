// app/api/payment/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    // Verifikasi token webhook dari Xendit
    const headersList = await headers();
    const webhookToken = headersList.get('x-callback-token');

    if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, external_id } = body;

    console.log(`[Xendit Webhook] Received callback: status=${status}, external_id=${external_id}`);

    if (status === 'PAID') {
      // Format external_id: "gameforsmart-{pesertaId}-{timestamp}"
      // pesertaId sendiri berformat "p_xxxxxxxx..."  jadi kita ambil bagian antara "gameforsmart-" dan "-{timestamp}"
      const parts = external_id.split('-');
      // parts[0] = "gameforsmart", parts[1...n-1] = pesertaId segments, parts[n] = timestamp
      // Karena pesertaId mengandung underscore bukan hyphen, format sebenarnya:
      // "gameforsmart" - "p_abc123xyz" - "1713800000000"
      // Jadi parts = ["gameforsmart", "p_abc123xyz", "1713800000000"]  
      // Namun jika pesertaId mengandung hyphen, kita ambil semua kecuali elemen pertama dan terakhir
      const pesertaId = parts.slice(1, -1).join('-');

      const supabase = getSupabaseAdminClient();

      // Update is_paid menjadi true di tabel competition_participants
      const { error: updateError } = await supabase
        .from('competition_participants')
        .update({ is_paid: true })
        .eq('id', pesertaId);

      if (updateError) {
        console.error(`[Xendit Webhook] Gagal update is_paid untuk peserta ${pesertaId}:`, updateError);
        return NextResponse.json(
          { error: 'Failed to update payment status' },
          { status: 500 }
        );
      }

      console.log(`[Xendit Webhook] Peserta ${pesertaId} sudah bayar ✅ - is_paid diupdate ke true`);
    } else if (status === 'EXPIRED') {
      // Opsional: log jika invoice expired
      console.log(`[Xendit Webhook] Invoice expired: ${external_id}`);
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('[Xendit Webhook] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}