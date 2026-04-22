// app/api/payment/webhook/route.js

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

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

    if (status === 'PAID') {
      // Ekstrak pesertaId dari external_id
      const pesertaId = external_id.split('-')[1];

      // Update status peserta di database jadi LUNAS
      // await db.peserta.update({ id: pesertaId, status: 'LUNAS' })

      console.log(`Peserta ${pesertaId} sudah bayar ✅`);
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}