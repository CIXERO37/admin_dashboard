// app/api/payment/create-invoice/route.js

import { Invoice } from '@/lib/xendit';
import { NextRequest, NextResponse } from 'next/server';

// === Production-only CORS (untuk deploy, uncomment ini & comment blok bawah) ===
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "https://gameforsmart.com",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type",
// };

// === Local testing: dynamic CORS ===
const allowedOrigins = [
  "https://gameforsmart.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5173",
];

function getCorsHeaders(origin?: string | null) {
  const resolvedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

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
        successRedirectUrl: `${process.env.NEXT_PUBLIC_LANDING_URL}/payment/success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_LANDING_URL}/payment/failed`,
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