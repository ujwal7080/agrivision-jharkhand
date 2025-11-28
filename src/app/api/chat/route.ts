import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // System prompt for agricultural assistant
    const systemPrompt = `You are an AI assistant for AgriVision, a farming assistance app for farmers in Jharkhand, India. 

Your role:
- Help farmers with agricultural questions about crops, soil, weather, and farming practices
- Provide information about government schemes like PM-KISAN, Fasal Bima Yojana, and KCC loans
- Assist with queries about Jharkhand-specific farming conditions
- Answer questions about the app's features: Soil Scanner, Crop Analysis, Market Prices, Shop, Services
- Be helpful, friendly, and use simple language
- Support conversations in English, Hindi, and Nagpuri

Keep responses concise and practical for farmers. If asked about specific schemes, mention that they can check the Services section of the app for detailed information and application links.`;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 800,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle specific OpenAI errors
    if (error?.message?.includes('API key')) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured. Please contact support.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}