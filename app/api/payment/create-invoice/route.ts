// app/api/payment/create-invoice/route.js

import { Invoice } from '@/lib/xendit';
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, ngrok-skip-browser-warning",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { pesertaId, nama, email, amount } = await req.json();

    const invoice = await Invoice.createInvoice({
      data: {
        externalId: `gameforsmart-${pesertaId}-${Date.now()}`,
        amount: amount,
        payerEmail: email,
        description: `Pendaftaran GameForSmart - ${nama}`,
        currency: 'IDR',
        customer: {
          givenNames: nama,
          email: email,
        },
        customerNotificationPreference: {
          invoiceCreated: ['email'],
          invoicePaid: ['email'],
        },
        successRedirectUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/payment/success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/payment/failed`,
      }
    });

    return NextResponse.json({
      invoiceUrl: invoice.invoiceUrl,
      invoiceId: invoice.id,
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500, headers: corsHeaders }
    );
  }
}