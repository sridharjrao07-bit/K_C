import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq lazily to avoid build errors if the environment variable isn't set yet during build time
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('The GROQ_API_KEY environment variable is missing.');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

const SYSTEM_PROMPT = `You are "Kaarigar AI", a friendly and knowledgeable assistant for the Kaarigar Connect platform — a marketplace that empowers traditional Indian artisans (kaarigars).

Your role is to help artisans with:
- **Selling tips**: How to write product descriptions, photograph crafts, set competitive prices
- **Marketplace guidance**: How to list products, manage orders, handle shipping
- **Craft verification**: How the verification process works on Kaarigar Connect
- **Pricing help**: Strategies for pricing handmade goods fairly
- **Platform usage**: Navigating the dashboard, managing their profile, using messages
- **Business growth**: Marketing tips, building a brand, understanding customers

Guidelines:
- Be warm, encouraging, and respectful of traditional craftsmanship
- Keep answers concise and actionable (2-4 short paragraphs max)
- If asked about something unrelated to artisan work or the platform, politely redirect
- Use simple language — many artisans may not be fluent in English
- When relevant, mention specific Kaarigar Connect features (dashboard, shop page, verification badge, QR codes)
- You can respond in Hindi if the user writes in Hindi`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const client = getGroqClient();
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10), // Keep last 10 messages for context window
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    });

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Groq API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to get response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
