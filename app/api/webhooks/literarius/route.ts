import { NextResponse } from 'next/server';
import { LiterariusWebhookService } from '@/lib/services/literarius-webhook';
import { verifyWebhookSignature } from '@/lib/utils/webhook';
import { LiterariusWebhookSchema } from '@/lib/schemas/literarius';

const webhookService = new LiterariusWebhookService({
  literarius: {
    baseUrl: process.env.LITERARIUS_API_URL || '',
    company: process.env.LITERARIUS_COMPANY || '',
    token: process.env.LITERARIUS_TOKEN || '',
  },
  correios: {
    baseUrl: process.env.CORREIOS_PREPOSTAGEM_URL || '',
    username: process.env.CORREIOS_USERNAME || '',
    password: process.env.CORREIOS_PASSWORD || '',
  },
});

export async function POST(request: Request) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    
    // Get the signature from headers
    const signature = request.headers.get('x-literarius-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(
      rawBody,
      signature,
      process.env.LITERARIUS_WEBHOOK_SECRET || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse and validate the body
    const parsedBody = JSON.parse(rawBody);
    const validationResult = LiterariusWebhookSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { 
          error: 'Invalid webhook data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const body = validationResult.data;
    
    // Handle different event types
    switch (body.event) {
      case 'nota_fiscal.created':
        await webhookService.handleNotaFiscalCreated(body.data.id);
        break;
      default:
        console.log(`Unhandled event type: ${body.event}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 