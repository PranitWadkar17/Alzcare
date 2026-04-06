import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, timestamp, userAgent } = await request.json();

    // Here you would integrate with email service (SendGrid, Resend, etc.)
    // For now, just log it
    console.log('Login notification:', {
      to: email,
      timestamp,
      userAgent,
      subject: 'AlzCare Login Alert',
      message: `You logged in on ${new Date(timestamp).toLocaleString()}`,
    });

    // TODO: Implement actual email sending
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'AlzCare <alerts@alzcare.com>',
    //   to: email,
    //   subject: 'AlzCare Login Alert',
    //   html: `...`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}