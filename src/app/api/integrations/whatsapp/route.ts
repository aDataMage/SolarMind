import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    return NextResponse.json({ status: "WhatsApp webhook received" });
}
